<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionDeposit extends Model
{
    protected $fillable = [
        'auction_id',
        'user_id',
        'amount',
    ];

    protected $casts = [
        'amount' => 'integer',
    ];

    /**
     * Get the auction this deposit belongs to.
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Get the user who owns this deposit.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get or create a deposit record for a user in an auction.
     */
    public static function getOrCreate(int $auctionId, int $userId): self
    {
        return static::firstOrCreate(
            ['auction_id' => $auctionId, 'user_id' => $userId],
            ['amount' => 0]
        );
    }
}
