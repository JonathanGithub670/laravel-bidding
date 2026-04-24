<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionView extends Model
{
    protected $fillable = [
        'auction_id',
        'user_id',
        'viewed_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    /**
     * Get the auction that was viewed.
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Get the user who viewed the auction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Record a view for a user on an auction.
     * Returns true if this is a new view, false if already viewed.
     */
    public static function recordView(int $auctionId, int $userId): bool
    {
        $existingView = self::where('auction_id', $auctionId)
            ->where('user_id', $userId)
            ->first();

        if ($existingView) {
            // Update the viewed_at timestamp
            $existingView->update(['viewed_at' => now()]);

            return false;
        }

        // Create new view record
        self::create([
            'auction_id' => $auctionId,
            'user_id' => $userId,
            'viewed_at' => now(),
        ]);

        return true;
    }
}
