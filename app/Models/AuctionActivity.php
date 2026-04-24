<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionActivity extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'auction_id',
        'user_id',
        'type',
        'content',
        'metadata',
        'created_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($activity) {
            $activity->created_at = $activity->created_at ?? now();
        });
    }

    /**
     * Get the auction this activity belongs to.
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Get the user who performed this activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if this is a system message.
     */
    public function getIsSystemAttribute(): bool
    {
        return in_array($this->type, ['system', 'bid']);
    }

    /**
     * Get display name for the activity.
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->type === 'system') {
            return '🤖 System';
        }
        return $this->user?->name ?? 'Anonymous';
    }

    /**
     * Scope to get recent activities.
     */
    public function scopeRecent($query, int $limit = 50)
    {
        return $query->orderByDesc('created_at')->limit($limit);
    }

    /**
     * Scope to get chat messages only.
     */
    public function scopeChats($query)
    {
        return $query->where('type', 'chat');
    }

    /**
     * Scope to get bids only.
     */
    public function scopeBids($query)
    {
        return $query->where('type', 'bid');
    }

    /**
     * Create a bid activity.
     */
    public static function createBidActivity(Auction $auction, Bid $bid): static
    {
        return static::create([
            'auction_id' => $auction->id,
            'user_id' => $bid->user_id,
            'type' => 'bid',
            'content' => "🔥 {$bid->anonymized_name} menawar {$bid->formatted_amount}!",
            'metadata' => [
                'bid_id' => $bid->id,
                'amount' => $bid->amount,
            ],
        ]);
    }

    /**
     * Create a system activity.
     */
    public static function createSystemActivity(Auction $auction, string $message, array $metadata = []): static
    {
        return static::create([
            'auction_id' => $auction->id,
            'user_id' => null,
            'type' => 'system',
            'content' => $message,
            'metadata' => $metadata,
        ]);
    }
}
