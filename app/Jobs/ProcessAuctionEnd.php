<?php

namespace App\Jobs;

use App\Events\AuctionEnded;
use App\Models\Auction;
use App\Models\AuctionActivity;
use App\Models\AuctionDeposit;
use App\Models\AuctionParticipant;
use App\Models\AuctionSettlement;
use App\Models\Invoice;
use App\Models\Reimbursement;
use App\Models\Transaction;
use App\Notifications\AuctionLostNotification;
use App\Notifications\AuctionSoldNotification;
use App\Notifications\AuctionWonNotification;
use App\Services\AuctionSettlementService;
use App\Services\ReimbursementService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessAuctionEnd implements ShouldQueue
{
    use Queueable;

    public Auction $auction;

    /**
     * Create a new job instance.
     */
    public function __construct(Auction $auction)
    {
        $this->auction = $auction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Phase 1: All database operations in a single transaction
        $result = DB::transaction(function () {
            // Lock and reload auction
            $auction = Auction::lockForUpdate()->find($this->auction->id);

            // Skip if auction no longer exists or already processed
            // Note: use getAttributes() not ->attributes to bypass Eloquent __get() magic
            if (!$auction || $auction->getAttributes()['status'] !== 'live') {
                return null;
            }

            $winningBid = $auction->bids()->highest()->first();
            $invoice = null;

            if ($winningBid) {
                // Update auction with winner
                $auction->update([
                    'status' => 'ended',
                    'winner_id' => $winningBid->user_id,
                ]);

                // Ensure bid is marked as winning
                $winningBid->update(['is_winning' => true]);

                // Create invoice with 1 hour payment deadline
                $invoice = Invoice::create([
                    'auction_id' => $auction->id,
                    'winner_id' => $winningBid->user_id,
                    'amount' => $winningBid->amount,
                    'admin_fee' => 0,
                    'registration_fee' => $auction->registration_fee ?? 0,
                    'app_fee' => AuctionSettlement::APP_FEE,
                    'status' => 'pending',
                    'payment_due_at' => now()->addHour(),
                ]);

                // Create system activity
                AuctionActivity::createSystemActivity(
                    $auction,
                    "🎉 Lelang berakhir! Pemenang: {$winningBid->anonymized_name} dengan bid {$winningBid->formatted_amount}",
                    ['invoice_id' => $invoice->id]
                );
            } else {
                // No bids - auction ended without winner
                $auction->update(['status' => 'ended']);

                AuctionActivity::createSystemActivity(
                    $auction,
                    "⚠️ Lelang berakhir tanpa pemenang."
                );
            }

            // Generate reimbursements for non-winning participants
            $reimbursementService = app(ReimbursementService::class);
            $reimbursementService->generateForAuction($auction);

            // Auto-approve all newly created reimbursements (instant refund to user balance)
            $this->autoApproveReimbursements($auction);

            // Create auction settlement for admin approval (fund disbursement to seller)
            $settlementService = app(AuctionSettlementService::class);
            $settlementService->createForAuction($auction);

            return [
                'auction' => $auction,
                'winningBid' => $winningBid,
                'invoice' => $invoice,
            ];
        });

        // Skip if auction was already processed
        if ($result === null) {
            return;
        }

        $auction = $result['auction'];
        $winningBid = $result['winningBid'];
        $invoice = $result['invoice'];

        // Phase 2: Side effects OUTSIDE transaction (notifications, broadcasts)
        // These can fail without rolling back the critical database operations
        try {
            broadcast(new AuctionEnded($auction));
        } catch (\Throwable $e) {
            Log::warning('Failed to broadcast AuctionEnded', [
                'auction_id' => $auction->id,
                'error' => $e->getMessage(),
            ]);
        }

        try {
            if ($winningBid) {
                // Notify winner
                $winner = $winningBid->user;
                if ($winner) {
                    $winner->notify(new AuctionWonNotification($auction, $invoice));
                }

                // Notify seller
                $seller = $auction->seller;
                if ($seller) {
                    $sellerAmount = AuctionSettlement::calculateSellerAmount($winningBid->amount);
                    $seller->notify(new AuctionSoldNotification($auction, $winningBid->amount, $sellerAmount));
                }
            }

            // Notify losing participants about their reimbursement
            $this->notifyLosingParticipants($auction);
        } catch (\Throwable $e) {
            Log::warning('Failed to send auction end notifications', [
                'auction_id' => $auction->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Auto-approve all eligible reimbursements for this auction.
     * Credits balance back to user immediately.
     */
    protected function autoApproveReimbursements(Auction $auction): void
    {
        $reimbursements = Reimbursement::where('auction_id', $auction->id)
            ->whereIn('status', [Reimbursement::STATUS_PENDING, Reimbursement::STATUS_ELIGIBLE])
            ->with('user', 'participant')
            ->get();

        foreach ($reimbursements as $reimbursement) {
            if (!$reimbursement->user) {
                continue;
            }

            // Credit balance back to user
            $reimbursement->user->increment('balance', $reimbursement->amount);

            // Record transaction
            Transaction::record(
                $reimbursement->user_id,
                Transaction::TYPE_REIMBURSEMENT,
                $reimbursement->amount,
                'Pengembalian dana otomatis: ' . ($auction->title ?? 'Lelang #' . $auction->id),
                $reimbursement
            );

            // Mark reimbursement as completed
            $reimbursement->update([
                'status' => Reimbursement::STATUS_COMPLETED,
                'processed_by' => null, // auto-approved, no admin
                'approved_at' => now(),
                'completed_at' => now(),
            ]);

            // Update participant status AFTER reimbursement is completed
            if ($reimbursement->participant) {
                $reimbursement->participant->update([
                    'status' => 'refunded',
                    'refunded_at' => now(),
                ]);
            }

            Log::info('Reimbursement auto-approved', [
                'reimbursement_id' => $reimbursement->id,
                'user_id' => $reimbursement->user_id,
                'amount' => $reimbursement->amount,
                'auction_id' => $auction->id,
            ]);
        }
    }

    /**
     * Notify all losing participants about their reimbursement.
     * Uses reimbursement records instead of participant status to avoid timing issues.
     */
    protected function notifyLosingParticipants(Auction $auction): void
    {
        // Query reimbursements directly - they always exist after auto-approval
        $reimbursements = Reimbursement::where('auction_id', $auction->id)
            ->where('amount', '>', 0)
            ->with('user')
            ->get();

        foreach ($reimbursements as $reimbursement) {
            if (!$reimbursement->user) {
                continue;
            }

            try {
                $reimbursement->user->notify(new AuctionLostNotification($auction, $reimbursement->amount));
            } catch (\Throwable $e) {
                Log::warning('Failed to notify losing participant', [
                    'user_id' => $reimbursement->user_id,
                    'auction_id' => $auction->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Calculate admin fee (0% = free)
     */
    protected function calculateAdminFee(int $amount): int
    {
        return 0;
    }
}
