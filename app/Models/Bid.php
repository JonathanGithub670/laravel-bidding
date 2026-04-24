<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bid extends Model
{
    use \App\Traits\LogActivity;

    public $timestamps = false;

    protected $fillable = [
        'auction_id',
        'user_id',
        'amount',
        'is_winning',
        'is_auto_bid',
        'ip_address',
        'created_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'is_winning' => 'boolean',
        'is_auto_bid' => 'boolean',
        'created_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($bid) {
            $bid->created_at = $bid->created_at ?? now();
        });
    }

    /**
     * Get the auction this bid belongs to.
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Get the user who placed this bid.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get bidder name (anonymized).
     */
    public function getAnonymizedNameAttribute(): string
    {
        $name = $this->user->name;
        if (strlen($name) <= 3) {
            return $name[0] . '***';
        }
        return substr($name, 0, 3) . '***';
    }

    /**
     * Format amount as IDR.
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    /**
     * Scope to get winning bids only.
     */
    public function scopeWinning($query)
    {
        return $query->where('is_winning', true);
    }

    /**
     * Scope to order by highest amount.
     */
    public function scopeHighest($query)
    {
        return $query->orderByDesc('amount');
    }
}
