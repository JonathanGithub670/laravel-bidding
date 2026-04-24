<?php

namespace App\Jobs;

use App\Models\Auction;
use App\Models\AuctionDeposit;
use App\Models\Invoice;
use App\Models\Bid;
use App\Models\Reimbursement;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\AuctionWonNotification;
use App\Notifications\InvoiceExpiredNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckPaymentDeadline implements ShouldQueue
{
    use Queueable;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Get all expired invoices
        $expiredInvoices = Invoice::expired()->with(['auction', 'winner'])->get();

        foreach ($expiredInvoices as $invoice) {
            $this->processExpiredInvoice($invoice);
        }
    }

    /**
     * Process an expired invoice
     */
    protected function processExpiredInvoice(Invoice $invoice): void
    {
        DB::transaction(function () use ($invoice) {
            // Mark invoice as expired
            $invoice->markAsExpired();

            $auction = $invoice->auction;

            $originalWinnerId = $invoice->winner_id;

            // Notify original winner about expiry
            if ($invoice->winner) {
                $invoice->winner->notify(new InvoiceExpiredNotification($auction, $invoice, true));
            }

            // Refund original winner's deposit
            $this->refundDeposit($auction, $originalWinnerId);

            // Option 1: Assign to runner-up
            $runnerUpBid = $this->getRunnerUp($auction, $originalWinnerId);

            if ($runnerUpBid) {
                // Update auction winner to runner-up
                $auction->update(['winner_id' => $runnerUpBid->user_id]);

                // Mark runner-up bid as winning
                $runnerUpBid->update(['is_winning' => true]);

                // Create new invoice for runner-up
                $newInvoice = Invoice::create([
                    'auction_id' => $auction->id,
                    'winner_id' => $runnerUpBid->user_id,
                    'amount' => $runnerUpBid->amount,
                    'admin_fee' => (int) ($runnerUpBid->amount * 0.05),
                    'status' => 'pending',
                    'payment_due_at' => now()->addHour(),
                    'notes' => 'Transferred from expired invoice: ' . $invoice->invoice_number,
                ]);

                // Notify runner-up that they won
                $runnerUpUser = $runnerUpBid->user;
                if ($runnerUpUser) {
                    $runnerUpUser->notify(new AuctionWonNotification($auction, $newInvoice));
                }

                Log::info("Payment expired for invoice {$invoice->invoice_number}. Transferred to runner-up: {$runnerUpBid->anonymized_name}");
            } else {
                // No runner-up available - auction can be relisted
                $auction->update([
                    'winner_id' => null,
                    'status' => 'cancelled',
                ]);

                Log::info("Payment expired for invoice {$invoice->invoice_number}. No runner-up available. Auction cancelled.");
            }
        });
    }

    /**
     * Refund the deposit for a user who failed to pay.
     */
    protected function refundDeposit(Auction $auction, int $userId): void
    {
        $deposit = AuctionDeposit::where('auction_id', $auction->id)
            ->where('user_id', $userId)
            ->where('amount', '>', 0)
            ->first();

        if (!$deposit) {
            return;
        }

        $user = User::lockForUpdate()->find($userId);
        if (!$user) {
            return;
        }

        $user->increment('balance', $deposit->amount);

        Transaction::record(
            $user->id,
            Transaction::TYPE_REIMBURSEMENT,
            $deposit->amount,
            'Pengembalian deposit: gagal bayar lelang ' . ($auction->title ?? '#' . $auction->id),
            $auction
        );

        $deposit->update(['amount' => 0]);

        Log::info('Deposit refunded for expired invoice', [
            'auction_id' => $auction->id,
            'user_id' => $userId,
            'amount' => $deposit->amount,
        ]);
    }

    /**
     * Get the runner-up bidder (second highest bid)
     */
    protected function getRunnerUp(Auction $auction, int $excludeUserId): ?Bid
    {
        return $auction->bids()
            ->where('user_id', '!=', $excludeUserId)
            ->orderByDesc('amount')
            ->first();
    }
}
