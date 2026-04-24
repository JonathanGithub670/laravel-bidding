<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'auction_id',
        'user_id',
        'fee_paid',
        'status',
        'registered_at',
        'refunded_at',
    ];

    protected $casts = [
        'fee_paid' => 'integer',
        'registered_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    /**
     * Get the auction.
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Get the user (participant).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope for active participants.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Check if participant is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get formatted fee paid.
     */
    public function getFormattedFeePaidAttribute(): string
    {
        return 'Rp '.number_format($this->fee_paid, 0, ',', '.');
    }
}
