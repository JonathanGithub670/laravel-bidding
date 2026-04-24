<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionSettlement extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_DISBURSED = 'disbursed';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_REJECTED = 'rejected';

    /**
     * Fund status constants
     */
    public const FUND_HELD = 'held';
    public const FUND_APPROVED = 'approved';
    public const FUND_SCHEDULED = 'scheduled';
    public const FUND_DISBURSED = 'disbursed';

    /**
     * Delivery status constants
     */
    public const DELIVERY_PENDING = 'pending';
    public const DELIVERY_SHIPPING = 'shipping';
    public const DELIVERY_DELIVERED = 'delivered';

    /**
     * Admin fee percentage (0% = free)
     */
    public const ADMIN_FEE_PERCENTAGE = 0;

    /**
     * Application fee (flat Rp 20.000)
     */
    public const APP_FEE = 20000;

    protected $fillable = [
        'auction_id',
        'seller_id',
        'winner_id',
        'amount',
        'admin_fee',
        'app_fee',
        'seller_amount',
        'status',
        'fund_status',
        'delivery_status',
        'disbursement_date',
        'estimated_delivery_date',
        'delivery_confirmed_at',
        'approved_by',
        'approved_at',
        'disbursed_at',
        'admin_notes',
        'reference_number',
    ];

    protected $casts = [
        'amount' => 'integer',
        'admin_fee' => 'integer',
        'app_fee' => 'integer',
        'seller_amount' => 'integer',
        'disbursement_date' => 'datetime',
        'estimated_delivery_date' => 'datetime',
        'delivery_confirmed_at' => 'datetime',
        'approved_at' => 'datetime',
        'disbursed_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($settlement) {
            if (!$settlement->reference_number) {
                $settlement->reference_number = 'STL-' . strtoupper(uniqid()) . '-' . date('Ymd');
            }
        });
    }

    // ─── Relationships ─────────────────────────────────────

    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // ─── Formatted Attributes ──────────────────────────────

    public function getFormattedAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    public function getFormattedAdminFeeAttribute(): string
    {
        return 'Rp ' . number_format($this->admin_fee, 0, ',', '.');
    }

    public function getFormattedAppFeeAttribute(): string
    {
        return 'Rp ' . number_format($this->app_fee, 0, ',', '.');
    }

    public function getFormattedSellerAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->seller_amount, 0, ',', '.');
    }

    // ─── Status Badges ─────────────────────────────────────

    public function getStatusBadgeAttribute(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING => ['label' => 'Menunggu Approval', 'color' => 'yellow'],
            self::STATUS_APPROVED => ['label' => 'Disetujui', 'color' => 'blue'],
            self::STATUS_DISBURSED => ['label' => 'Dana Dicairkan', 'color' => 'indigo'],
            self::STATUS_COMPLETED => ['label' => 'Selesai', 'color' => 'green'],
            self::STATUS_REJECTED => ['label' => 'Ditolak', 'color' => 'red'],
            default => ['label' => 'Unknown', 'color' => 'gray'],
        };
    }

    public function getFundStatusBadgeAttribute(): array
    {
        return match ($this->fund_status) {
            self::FUND_HELD => ['label' => 'Dana Ditahan', 'color' => 'yellow'],
            self::FUND_APPROVED => ['label' => 'Disetujui', 'color' => 'blue'],
            self::FUND_SCHEDULED => ['label' => 'Dijadwalkan', 'color' => 'indigo'],
            self::FUND_DISBURSED => ['label' => 'Dicairkan', 'color' => 'green'],
            default => ['label' => 'Unknown', 'color' => 'gray'],
        };
    }

    public function getDeliveryStatusBadgeAttribute(): array
    {
        return match ($this->delivery_status) {
            self::DELIVERY_PENDING => ['label' => 'Menunggu Kirim', 'color' => 'yellow'],
            self::DELIVERY_SHIPPING => ['label' => 'Sedang Dikirim', 'color' => 'blue'],
            self::DELIVERY_DELIVERED => ['label' => 'Terkirim', 'color' => 'green'],
            default => ['label' => 'Unknown', 'color' => 'gray'],
        };
    }

    // ─── State Checks ──────────────────────────────────────

    public function canBeApproved(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function canConfirmShipping(): bool
    {
        return $this->status === self::STATUS_APPROVED
            && $this->delivery_status === self::DELIVERY_PENDING;
    }

    public function canMarkDelivered(): bool
    {
        return $this->delivery_status === self::DELIVERY_SHIPPING;
    }

    public function canBeDisbursed(): bool
    {
        return $this->fund_status === self::FUND_SCHEDULED
            && $this->disbursement_date
            && $this->disbursement_date->isPast();
    }

    public function canBeRejected(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if seller can confirm shipping.
     * Seller can confirm when settlement is approved/pending and delivery is pending.
     */
    public function canSellerConfirmShipping(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_APPROVED])
            && $this->delivery_status === self::DELIVERY_PENDING;
    }

    // ─── Scopes ────────────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeReadyToDisburse($query)
    {
        return $query->where('fund_status', self::FUND_SCHEDULED)
            ->where('disbursement_date', '<=', now());
    }

    // ─── Helpers ───────────────────────────────────────────

    public static function calculateAdminFee(int $amount): int
    {
        return (int) ($amount * self::ADMIN_FEE_PERCENTAGE / 100);
    }

    public static function calculateAppFee(): int
    {
        return self::APP_FEE;
    }

    public static function calculateSellerAmount(int $amount): int
    {
        return $amount - self::calculateAdminFee($amount) - self::calculateAppFee();
    }
}
