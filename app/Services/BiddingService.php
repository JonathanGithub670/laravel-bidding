<?php

namespace App\Services;

use App\Events\ActivityPosted;
use App\Events\AuctionEnded;
use App\Events\AuctionTimeExtended;
use App\Events\BidPlaced;
use App\Models\Auction;
use App\Models\AuctionActivity;
use App\Models\AuctionDeposit;
use App\Models\Bid;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Exception;

class BiddingService
{
    /**
     * Time in seconds to extend when bid is placed in last moments
     */
    protected const EXTENSION_SECONDS = 15;

    /**
     * Threshold in seconds for triggering time extension
     */
    protected const EXTENSION_THRESHOLD = 10;

    /**
     * Snap lock duration in seconds (to prevent rapid fire bids)
     */
    protected const SNAP_LOCK_SECONDS = 1;

    /**
     * Place a bid on an auction
     *
     * Uses a deposit-hold model:
     * - Each user's total held amount is tracked in auction_deposits
     * - When bidding, only the difference between new bid and current deposit is charged
     * - When outbid, the deposit is NOT refunded (stays held)
     * - Refunds happen only when the auction ends (for non-winners)
     *
     * @throws Exception
     */
    public function placeBid(Auction $auction, User $user, int $amount, ?string $ipAddress = null): array
    {
        // Check snap lock - prevent rapid bidding
        $lockKey = "auction_bid_lock:{$auction->id}";
        if (!Cache::add($lockKey, true, self::SNAP_LOCK_SECONDS)) {
            throw new Exception('Sistem sedang memproses bid lain. Coba lagi dalam 1 detik.');
        }

        try {
            /** @var array{bid: \App\Models\Bid, charge_amount: int, deposit_amount: int} */
            return DB::transaction(function () use ($auction, $user, $amount, $ipAddress) {
                // Lock the auction row for update to prevent race conditions
                $auction = Auction::lockForUpdate()->find($auction->id);

                // Validate auction is live
                $this->validateAuctionIsLive($auction);

                // Validate bid amount
                $this->validateBidAmount($auction, $amount);

                // Validate user is not the seller
                $this->validateNotSeller($auction, $user);

                // Lock user row for balance update
                $user = User::lockForUpdate()->find($user->id);

                // Check if time extension is needed
                $shouldExtend = $auction->isInLastSeconds(self::EXTENSION_THRESHOLD);

                // Get or create the user's deposit record for this auction
                $deposit = AuctionDeposit::lockForUpdate()->firstOrCreate(
                    ['auction_id' => $auction->id, 'user_id' => $user->id],
                    ['amount' => 0]
                );

                // Calculate charge: only the difference between new bid and existing deposit
                $chargeAmount = $amount - $deposit->amount;

                // Validate user has enough balance for the incremental charge
                $this->validateUserBalance($user, $chargeAmount);

                // Mark previous winning bid as not winning
                $auction->bids()->where('is_winning', true)->update(['is_winning' => false]);

                // Create the new bid (always records the full bid amount)
                $bid = $auction->bids()->create([
                    'user_id' => $user->id,
                    'amount' => $amount,
                    'is_winning' => true,
                    'is_auto_bid' => false,
                    'ip_address' => $ipAddress,
                ]);

                // Deduct only the incremental charge from user's balance
                $user->decrement('balance', $chargeAmount);

                // Record bid transaction
                if ($chargeAmount > 0) {
                    Transaction::record(
                        $user->id,
                        Transaction::TYPE_BID,
                        $chargeAmount,
                        'Bid lelang: ' . $auction->title . ' (Rp ' . number_format($amount, 0, ',', '.') . ')',
                        $bid
                    );
                }

                // Update user's deposit to the new bid amount
                $deposit->update(['amount' => $amount]);

                // Update auction current price and total bids
                $auction->update([
                    'current_price' => $amount,
                    'total_bids' => $auction->total_bids + 1,
                ]);

                // Extend time if bid is in last seconds
                if ($shouldExtend) {
                    $auction->extendTime(self::EXTENSION_SECONDS);
                    broadcast(new AuctionTimeExtended($auction, self::EXTENSION_SECONDS))->toOthers();

                    // Create system activity for time extension
                    $activity = AuctionActivity::createSystemActivity(
                        $auction,
                        "⏰ Waktu diperpanjang +{self::EXTENSION_SECONDS} detik!"
                    );
                    broadcast(new ActivityPosted($activity))->toOthers();
                }

                // Reload auction to get fresh data
                $auction->refresh();

                // Broadcast bid placed event
                broadcast(new BidPlaced($auction, $bid))->toOthers();

                // Create bid activity for War Room
                $activity = AuctionActivity::createBidActivity($auction, $bid);
                broadcast(new ActivityPosted($activity))->toOthers();

                return [
                    'bid' => $bid,
                    'charge_amount' => $chargeAmount,
                    'deposit_amount' => $amount,
                ];
            });
        } finally {
            // Release the snap lock
            Cache::forget($lockKey);
        }
    }

    /**
     * Validate that the auction is currently live
     *
     * @throws Exception
     */
    protected function validateAuctionIsLive(Auction $auction): void
    {
        if ($auction->status !== 'live') {
            throw new Exception('Lelang ini tidak sedang berlangsung.');
        }

        if ($auction->ends_at <= now()) {
            throw new Exception('Lelang ini sudah berakhir.');
        }
    }

    /**
     * Validate bid amount meets minimum requirements
     *
     * @throws Exception
     */
    protected function validateBidAmount(Auction $auction, int $amount): void
    {
        $minBid = $auction->next_min_bid;

        if ($amount < $minBid) {
            throw new Exception(
                "Bid minimum adalah Rp " . number_format($minBid, 0, ',', '.') .
                ". Anda menawar Rp " . number_format($amount, 0, ',', '.')
            );
        }

        // Check if amount is a valid increment from current price
        $difference = $amount - $auction->current_price;
        if ($difference % $auction->bid_increment !== 0) {
            throw new Exception(
                "Bid harus kelipatan Rp " . number_format($auction->bid_increment, 0, ',', '.')
            );
        }
    }

    /**
     * Validate user is not the seller
     *
     * @throws Exception
     */
    protected function validateNotSeller(Auction $auction, User $user): void
    {
        if ($auction->seller_id === $user->id) {
            throw new Exception('Anda tidak dapat menawar barang Anda sendiri.');
        }
    }

    /**
     * Validate user has sufficient balance for the bid
     *
     * @throws Exception
     */
    protected function validateUserBalance(User $user, int $amount): void
    {
        if ($user->balance < $amount) {
            throw new Exception(
                'Saldo tidak mencukupi. Saldo Anda: Rp ' . number_format($user->balance, 0, ',', '.') .
                ', Bid: Rp ' . number_format($amount, 0, ',', '.')
            );
        }
    }

    /**
     * Get quick bid amounts for an auction
     */
    public function getQuickBidAmounts(Auction $auction): array
    {
        $currentPrice = $auction->current_price;
        $increment = $auction->bid_increment;

        return [
            [
                'label' => '+' . $this->formatShort($increment),
                'amount' => $currentPrice + $increment,
            ],
            [
                'label' => '+' . $this->formatShort($increment * 2),
                'amount' => $currentPrice + ($increment * 2),
            ],
            [
                'label' => '+' . $this->formatShort($increment * 5),
                'amount' => $currentPrice + ($increment * 5),
            ],
            [
                'label' => '+' . $this->formatShort($increment * 10),
                'amount' => $currentPrice + ($increment * 10),
            ],
        ];
    }

    /**
     * Format number to short form (1M, 500K, etc)
     */
    protected function formatShort(int $number): string
    {
        if ($number >= 1000000000) {
            return round($number / 1000000000, 1) . 'B';
        }
        if ($number >= 1000000) {
            return round($number / 1000000, 1) . 'M';
        }
        if ($number >= 1000) {
            return round($number / 1000, 1) . 'K';
        }
        return (string) $number;
    }

    /**
     * End an auction and determine winner.
     * Refunds all non-winner deposits back to their balance.
     */
    public function endAuction(Auction $auction): void
    {
        DB::transaction(function () use ($auction) {
            $auction = Auction::lockForUpdate()->find($auction->id);

            if ($auction->status !== 'live') {
                return;
            }

            // Get the highest bid
            $winningBid = $auction->bids()->highest()->first();

            if ($winningBid) {
                // Set winner
                $auction->update([
                    'status' => 'ended',
                    'winner_id' => $winningBid->user_id,
                ]);

                // Mark bid as winning
                $winningBid->update(['is_winning' => true]);

                // Refund all NON-WINNER deposits
                $deposits = AuctionDeposit::where('auction_id', $auction->id)
                    ->where('user_id', '!=', $winningBid->user_id)
                    ->where('amount', '>', 0)
                    ->get();

                foreach ($deposits as $deposit) {
                    $depositor = User::lockForUpdate()->find($deposit->user_id);
                    if ($depositor) {
                        $depositor->increment('balance', $deposit->amount);

                        // Record bid refund transaction
                        Transaction::record(
                            $depositor->id,
                            Transaction::TYPE_BID_REFUND,
                            $deposit->amount,
                            'Pengembalian deposit lelang: ' . $auction->title,
                            $auction
                        );

                        $deposit->update(['amount' => 0]);
                    }
                }
            } else {
                // No bids - auction ended without winner
                $auction->update(['status' => 'ended']);

                // Refund ALL deposits (no winner)
                $deposits = AuctionDeposit::where('auction_id', $auction->id)
                    ->where('amount', '>', 0)
                    ->get();

                foreach ($deposits as $deposit) {
                    $depositor = User::lockForUpdate()->find($deposit->user_id);
                    if ($depositor) {
                        $depositor->increment('balance', $deposit->amount);

                        // Record bid refund transaction
                        Transaction::record(
                            $depositor->id,
                            Transaction::TYPE_BID_REFUND,
                            $deposit->amount,
                            'Pengembalian deposit lelang (tanpa pemenang): ' . $auction->title,
                            $auction
                        );

                        $deposit->update(['amount' => 0]);
                    }
                }
            }

            // Broadcast auction ended
            broadcast(new AuctionEnded($auction));

            // Create system activity
            if ($winningBid) {
                AuctionActivity::createSystemActivity(
                    $auction,
                    "🎉 Lelang berakhir! Pemenang: {$winningBid->anonymized_name} dengan bid {$winningBid->formatted_amount}"
                );
            } else {
                AuctionActivity::createSystemActivity(
                    $auction,
                    "⚠️ Lelang berakhir tanpa pemenang."
                );
            }
        });
    }
}
