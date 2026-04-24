<?php

namespace App\Services;

use App\Models\Auction;
use App\Models\AuctionSettlement;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuctionSettlementService
{
    /**
     * Create a settlement record when auction ends with a winner.
     */
    public function createForAuction(Auction $auction): ?AuctionSettlement
    {
        // Only process ended auctions with a winner
        if ($auction->status !== 'ended' || !$auction->winner_id) {
            return null;
        }

        // Check if settlement already exists
        if (AuctionSettlement::where('auction_id', $auction->id)->exists()) {
            return null;
        }

        /** @var \App\Models\Bid|null $winningBid */
        $winningBid = $auction->bids()->where('is_winning', true)->first();
        if (!$winningBid) {
            return null;
        }

        $amount = $winningBid->amount;
        $adminFee = AuctionSettlement::calculateAdminFee($amount);
        $appFee = AuctionSettlement::calculateAppFee();
        $sellerAmount = AuctionSettlement::calculateSellerAmount($amount);

        $settlement = AuctionSettlement::create([
            'auction_id' => $auction->id,
            'seller_id' => $auction->seller_id,
            'winner_id' => $auction->winner_id,
            'amount' => $amount,
            'admin_fee' => $adminFee,
            'app_fee' => $appFee,
            'seller_amount' => $sellerAmount,
            'status' => AuctionSettlement::STATUS_PENDING,
            'fund_status' => AuctionSettlement::FUND_HELD,
            'delivery_status' => AuctionSettlement::DELIVERY_PENDING,
        ]);

        Log::info('Auction settlement created', [
            'settlement_id' => $settlement->id,
            'auction_id' => $auction->id,
            'amount' => $amount,
            'seller_amount' => $sellerAmount,
        ]);

        return $settlement;
    }

    /**
     * Approve fund disbursement and set schedule.
     *
     * @throws Exception
     */
    public function approveFunds(
        AuctionSettlement $settlement,
        User $admin,
        string $disbursementDate,
        string $estimatedDeliveryDate,
        ?string $notes = null
    ): AuctionSettlement {
        if (!$settlement->canBeApproved()) {
            throw new Exception('Settlement ini tidak dapat disetujui.');
        }

        $settlement->update([
            'status' => AuctionSettlement::STATUS_APPROVED,
            'fund_status' => AuctionSettlement::FUND_SCHEDULED,
            'disbursement_date' => $disbursementDate,
            'estimated_delivery_date' => $estimatedDeliveryDate,
            'approved_by' => $admin->id,
            'approved_at' => now(),
            'admin_notes' => $notes,
        ]);

        Log::info('Auction settlement approved', [
            'settlement_id' => $settlement->id,
            'admin_id' => $admin->id,
            'disbursement_date' => $disbursementDate,
            'estimated_delivery_date' => $estimatedDeliveryDate,
        ]);

        return $settlement->fresh();
    }

    /**
     * Process scheduled disbursements (transfer funds to seller balance).
     * Called by scheduler when disbursement_date has passed.
     */
    public function processScheduledDisbursements(): int
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, AuctionSettlement> $settlements */
        $settlements = AuctionSettlement::readyToDisburse()->get();
        $count = 0;

        foreach ($settlements as $settlement) {
            try {
                $this->disburseToSeller($settlement);
                $count++;
            } catch (Exception $e) {
                Log::error('Failed to disburse settlement', [
                    'settlement_id' => $settlement->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        if ($count > 0) {
            Log::info('Scheduled disbursements processed', ['count' => $count]);
        }

        return $count;
    }

    /**
     * Disburse funds to seller's balance.
     *
     * @throws Exception
     */
    public function disburseToSeller(AuctionSettlement $settlement): AuctionSettlement
    {
        if (!$settlement->canBeDisbursed()) {
            throw new Exception('Dana belum bisa dicairkan.');
        }

        return DB::transaction(function () use ($settlement) {
            // Transfer seller_amount to seller's balance
            $seller = User::lockForUpdate()->find($settlement->seller_id);
            if (!$seller) {
                throw new Exception('Seller tidak ditemukan.');
            }

            $seller->increment('balance', $settlement->seller_amount);

            // Record settlement transaction for seller
            \App\Models\Transaction::record(
                $seller->id,
                \App\Models\Transaction::TYPE_SETTLEMENT_SELLER,
                $settlement->seller_amount,
                'Pencairan dana lelang: ' . ($settlement->auction->title ?? 'Lelang #' . $settlement->auction_id),
                $settlement
            );

            $settlement->update([
                'fund_status' => AuctionSettlement::FUND_DISBURSED,
                'disbursed_at' => now(),
            ]);

            // If delivery is also done, mark as completed
            if ($settlement->delivery_status === AuctionSettlement::DELIVERY_DELIVERED) {
                $settlement->update(['status' => AuctionSettlement::STATUS_COMPLETED]);
            } else {
                $settlement->update(['status' => AuctionSettlement::STATUS_DISBURSED]);
            }

            Log::info('Settlement funds disbursed to seller', [
                'settlement_id' => $settlement->id,
                'seller_id' => $settlement->seller_id,
                'amount' => $settlement->seller_amount,
            ]);

            return $settlement->fresh();
        });
    }

    /**
     * Confirm that item is being shipped to winner.
     *
     * @throws Exception
     */
    public function confirmShipping(AuctionSettlement $settlement, User $admin): AuctionSettlement
    {
        if (!$settlement->canConfirmShipping()) {
            throw new Exception('Pengiriman tidak dapat dikonfirmasi pada status ini.');
        }

        $settlement->update([
            'delivery_status' => AuctionSettlement::DELIVERY_SHIPPING,
        ]);

        Log::info('Settlement shipping confirmed', [
            'settlement_id' => $settlement->id,
            'admin_id' => $admin->id,
        ]);

        return $settlement->fresh();
    }

    /**
     * Mark item as delivered to winner.
     *
     * @throws Exception
     */
    public function markDelivered(AuctionSettlement $settlement, User $admin): AuctionSettlement
    {
        if (!$settlement->canMarkDelivered()) {
            throw new Exception('Barang belum dalam status pengiriman.');
        }

        $settlement->update([
            'delivery_status' => AuctionSettlement::DELIVERY_DELIVERED,
            'delivery_confirmed_at' => now(),
        ]);

        // If funds are also disbursed, mark settlement as completed
        if ($settlement->fund_status === AuctionSettlement::FUND_DISBURSED) {
            $settlement->update(['status' => AuctionSettlement::STATUS_COMPLETED]);
        }

        Log::info('Settlement delivery confirmed', [
            'settlement_id' => $settlement->id,
            'admin_id' => $admin->id,
        ]);

        return $settlement->fresh();
    }

    /**
     * Reject a settlement.
     *
     * @throws Exception
     */
    public function reject(AuctionSettlement $settlement, User $admin, string $reason): AuctionSettlement
    {
        if (!$settlement->canBeRejected()) {
            throw new Exception('Settlement ini tidak dapat ditolak.');
        }

        return DB::transaction(function () use ($settlement, $admin, $reason) {
            // Refund the winning bid amount back to the winner's balance
            $winner = User::lockForUpdate()->find($settlement->winner_id);
            if ($winner) {
                $winner->increment('balance', $settlement->amount);

                // Record refund transaction for winner
                \App\Models\Transaction::record(
                    $winner->id,
                    \App\Models\Transaction::TYPE_SETTLEMENT_REFUND,
                    $settlement->amount,
                    'Pengembalian dana lelang (ditolak): ' . ($settlement->auction->title ?? 'Lelang #' . $settlement->auction_id),
                    $settlement
                );
            }

            $settlement->update([
                'status' => AuctionSettlement::STATUS_REJECTED,
                'approved_by' => $admin->id,
                'admin_notes' => $reason,
            ]);

            Log::info('Settlement rejected', [
                'settlement_id' => $settlement->id,
                'admin_id' => $admin->id,
                'reason' => $reason,
            ]);

            return $settlement->fresh();
        });
    }
}
