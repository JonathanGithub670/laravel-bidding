<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\AuctionParticipant;
use App\Models\Reimbursement;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReimbursementService
{
    /**
     * Generate reimbursement records for all non-winning participants
     * who paid a registration fee or have bid deposits held.
     * Called when auction ends.
     */
    public function generateForAuction(Auction $auction): int
    {
        // Only process ended auctions (use getAttributes() to bypass realtime_status accessor)
        if ($auction->getAttributes()['status'] !== 'ended') {
            return 0;
        }

        // Get participants who paid a fee and are not the winner
        $participants = AuctionParticipant::where('auction_id', $auction->id)
            ->where('status', 'active')
            ->where('user_id', '!=', $auction->winner_id ?? 0)
            ->get();

        if ($participants->isEmpty()) {
            return 0;
        }

        $eligibleAt = Reimbursement::INSTANT_MODE
            ? now()
            : ($auction->ends_at ?? now())->copy()->addDays(Reimbursement::MIN_DAYS);

        $status = Reimbursement::INSTANT_MODE
            ? Reimbursement::STATUS_ELIGIBLE
            : Reimbursement::STATUS_PENDING;

        $count = 0;

        foreach ($participants as $participant) {
            // Skip if reimbursement already exists for this participant
            $exists = Reimbursement::where('auction_participant_id', $participant->id)->exists();
            if ($exists) {
                continue;
            }

            // Get the bid deposit amount for this user
            $deposit = \App\Models\AuctionDeposit::where('auction_id', $auction->id)
                ->where('user_id', $participant->user_id)
                ->first();

            $depositAmount = $deposit ? $deposit->amount : 0;

            // Reimbursement = bid deposit only (registration fee is cost of participation)
            $totalAmount = $depositAmount;

            if ($totalAmount <= 0) {
                continue;
            }

            Reimbursement::create([
                'auction_id' => $auction->id,
                'user_id' => $participant->user_id,
                'auction_participant_id' => $participant->id,
                'amount' => $totalAmount,
                'status' => $status,
                'eligible_at' => $eligibleAt,
            ]);

            // Reset the deposit to 0 since it's now tracked in the reimbursement
            if ($deposit && $depositAmount > 0) {
                $deposit->update(['amount' => 0]);
            }

            $count++;
        }

        if ($count > 0) {
            Log::info('Reimbursements generated for auction', [
                'auction_id' => $auction->id,
                'count' => $count,
            ]);
        }

        return $count;
    }

    /**
     * Mark pending reimbursements as eligible (past 3-day waiting period).
     * Should be called periodically via scheduled command.
     */
    public function markEligible(): int
    {
        /** @var int $count */
        $count = Reimbursement::shouldBeEligible()->update([
            'status' => Reimbursement::STATUS_ELIGIBLE,
        ]);

        if ($count > 0) {
            Log::info('Reimbursements marked eligible', ['count' => $count]);
        }

        return $count;
    }

    /**
     * Approve a reimbursement and return funds to user balance.
     *
     * @throws Exception
     */
    public function approve(Reimbursement $reimbursement, User $admin): Reimbursement
    {
        if (! $reimbursement->canBeApproved()) {
            throw new Exception('Reimbursement ini belum eligible atau sudah diproses.');
        }

        return DB::transaction(function () use ($reimbursement, $admin) {
            // Return funds to user balance
            $reimbursement->user->increment('balance', $reimbursement->amount);

            // Record reimbursement transaction
            \App\Models\Transaction::record(
                $reimbursement->user_id,
                \App\Models\Transaction::TYPE_REIMBURSEMENT,
                $reimbursement->amount,
                'Pengembalian dana lelang: '.($reimbursement->auction->title ?? 'Lelang #'.$reimbursement->auction_id),
                $reimbursement
            );

            // Update participant status to refunded
            $reimbursement->participant->update([
                'status' => 'refunded',
                'refunded_at' => now(),
            ]);

            // Update reimbursement status
            $reimbursement->update([
                'status' => Reimbursement::STATUS_COMPLETED,
                'processed_by' => $admin->id,
                'approved_at' => now(),
                'completed_at' => now(),
            ]);

            Log::info('Reimbursement approved', [
                'reimbursement_id' => $reimbursement->id,
                'user_id' => $reimbursement->user_id,
                'amount' => $reimbursement->amount,
                'admin_id' => $admin->id,
            ]);

            return $reimbursement->fresh();
        });
    }

    /**
     * Reject a reimbursement request.
     *
     * @throws Exception
     */
    public function reject(Reimbursement $reimbursement, User $admin, string $reason): Reimbursement
    {
        if (! $reimbursement->canBeRejected()) {
            throw new Exception('Reimbursement ini tidak dapat ditolak.');
        }

        $reimbursement->update([
            'status' => Reimbursement::STATUS_REJECTED,
            'processed_by' => $admin->id,
            'admin_notes' => $reason,
            'completed_at' => now(),
        ]);

        Log::info('Reimbursement rejected', [
            'reimbursement_id' => $reimbursement->id,
            'admin_id' => $admin->id,
            'reason' => $reason,
        ]);

        return $reimbursement->fresh();
    }
}
