<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Auction extends Model
{
    use \App\Traits\LogActivity;

    protected $fillable = [
        'uuid',
        'title',
        'description',
        'images',
        'starting_price',
        'current_price',
        'bid_increment',
        'registration_fee',
        'starts_at',
        'ends_at',
        'original_ends_at',
        'status',
        'winner_id',
        'category_id',
        'seller_id',
        'total_bids',
        'view_count',
        'metadata',
    ];

    protected $casts = [
        'images' => 'array',
        'starting_price' => 'integer',
        'current_price' => 'integer',
        'bid_increment' => 'integer',
        'registration_fee' => 'integer',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'original_ends_at' => 'datetime',
        'total_bids' => 'integer',
        'view_count' => 'integer',
        'metadata' => 'array',
    ];

    /**
     * Attributes to append to the model's array form.
     */
    protected $appends = [
        'primary_image',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($auction) {
            if (empty($auction->uuid)) {
                $auction->uuid = Str::uuid()->toString();
            }
        });
    }

    /**
     * Use UUID for route model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get the category of this auction.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(AuctionCategory::class, 'category_id');
    }

    /**
     * Get the seller of this auction.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Get the winner of this auction.
     */
    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    /**
     * Get all bids for this auction.
     */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class)->orderByDesc('amount');
    }

    /**
     * Get the winning bid.
     */
    public function winningBid(): HasOne
    {
        return $this->hasOne(Bid::class)->where('is_winning', true);
    }

    /**
     * Get the invoice for this auction.
     */
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    /**
     * Get all activities for this auction.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(AuctionActivity::class)->orderByDesc('created_at');
    }

    /**
     * Get all unique views for this auction.
     */
    public function views(): HasMany
    {
        return $this->hasMany(AuctionView::class);
    }

    /**
     * Get all participants for this auction.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(AuctionParticipant::class);
    }

    /**
     * Check if a user is registered as participant.
     */
    public function isUserRegistered(?int $userId): bool
    {
        if (!$userId)
            return false;
        return $this->participants()->where('user_id', $userId)->where('status', 'active')->exists();
    }

    /**
     * Check if registration fee is required.
     */
    public function requiresRegistration(): bool
    {
        return $this->registration_fee > 0;
    }

    /**
     * Get formatted registration fee.
     */
    public function getFormattedRegistrationFeeAttribute(): string
    {
        if ($this->registration_fee <= 0) {
            return 'Gratis';
        }
        return 'Rp ' . number_format($this->registration_fee, 0, ',', '.');
    }

    /**
     * Get count of unique viewers.
     */
    public function getUniqueViewersAttribute(): int
    {
        return $this->views()->count();
    }

    /**
     * Scope to get live auctions.
     */
    public function scopeLive($query)
    {
        return $query->where('status', 'live')
            ->where('ends_at', '>', now());
    }

    /**
     * Scope to get upcoming auctions.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('status', 'scheduled')
            ->where('starts_at', '>', now());
    }

    /**
     * Scope to get ended auctions.
     */
    public function scopeEnded($query)
    {
        return $query->where('status', 'ended');
    }

    /**
     * Scope to get auctions that should end now.
     */
    public function scopeShouldEnd($query)
    {
        return $query->where('status', 'live')
            ->where('ends_at', '<=', now());
    }

    /**
     * Get the real-time status based on current time.
     * This corrects the DB status when the scheduler hasn't run yet.
     * - 'live' + ends_at passed → 'ended'
     * - 'scheduled' + starts_at passed → 'live'
     */
    public function getRealtimeStatusAttribute(): string
    {
        $dbStatus = $this->attributes['status'] ?? 'pending';

        if ($dbStatus === 'live' && $this->ends_at && $this->ends_at <= now()) {
            return 'ended';
        }

        if ($dbStatus === 'scheduled' && $this->starts_at && $this->starts_at <= now()) {
            return 'live';
        }

        return $dbStatus;
    }

    /**
     * Override the status accessor to always return real-time status.
     */
    public function getStatusAttribute(): string
    {
        return $this->realtime_status;
    }

    /**
     * Check if auction is currently live.
     */
    public function getIsLiveAttribute(): bool
    {
        return $this->realtime_status === 'live' && $this->ends_at > now();
    }

    /**
     * Get remaining time in seconds.
     */
    public function getRemainingSecondsAttribute(): int
    {
        if (!$this->is_live) {
            return 0;
        }
        return max(0, $this->ends_at->diffInSeconds(now(), false) * -1);
    }

    /**
     * Get the next minimum bid amount.
     */
    public function getNextMinBidAttribute(): int
    {
        return $this->current_price + $this->bid_increment;
    }

    /**
     * Check if time was extended from original.
     */
    public function getIsExtendedAttribute(): bool
    {
        return $this->original_ends_at && $this->ends_at > $this->original_ends_at;
    }

    /**
     * Get the first image URL.
     */
    public function getPrimaryImageAttribute(): ?string
    {
        return $this->images[0] ?? null;
    }

    /**
     * Format current price as IDR.
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->current_price, 0, ',', '.');
    }

    /**
     * Extend auction time by given seconds.
     */
    public function extendTime(int $seconds = 15): void
    {
        if (!$this->original_ends_at) {
            $this->original_ends_at = $this->ends_at;
        }
        $this->ends_at = $this->ends_at->addSeconds($seconds);
        $this->save();
    }

    /**
     * Check if bid is in the last N seconds.
     */
    public function isInLastSeconds(int $seconds = 10): bool
    {
        return $this->remaining_seconds <= $seconds;
    }
}
