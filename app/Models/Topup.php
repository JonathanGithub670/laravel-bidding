<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Topup extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    public const STATUS_EXPIRED = 'expired';

    public const STATUS_FAILED = 'failed';

    /**
     * Payment methods
     */
    public const PAYMENT_METHODS = [
        // Bank Transfer (Virtual Account)
        'BCA_VA' => ['name' => 'BCA Virtual Account', 'type' => 'bank_transfer', 'icon' => 'bca'],
        'BNI_VA' => ['name' => 'BNI Virtual Account', 'type' => 'bank_transfer', 'icon' => 'bni'],
        'BRI_VA' => ['name' => 'BRI Virtual Account', 'type' => 'bank_transfer', 'icon' => 'bri'],
        'MANDIRI_VA' => ['name' => 'Mandiri Virtual Account', 'type' => 'bank_transfer', 'icon' => 'mandiri'],

        // E-Wallet
        'OVO' => ['name' => 'OVO', 'type' => 'e_wallet', 'icon' => 'ovo'],
        'GOPAY' => ['name' => 'GoPay', 'type' => 'e_wallet', 'icon' => 'gopay'],
        'DANA' => ['name' => 'DANA', 'type' => 'e_wallet', 'icon' => 'dana'],
        'SHOPEEPAY' => ['name' => 'ShopeePay', 'type' => 'e_wallet', 'icon' => 'shopeepay'],

        // QRIS (Universal)
        'QRIS' => ['name' => 'QRIS', 'type' => 'qris', 'icon' => 'qris'],
    ];

    /**
     * Preset amounts
     */
    public const PRESET_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];

    /**
     * Minimum and maximum amount
     */
    public const MIN_AMOUNT = 10000;

    public const MAX_AMOUNT = 2000000;

    /**
     * Expiry time in minutes
     */
    public const EXPIRY_MINUTES = 60;

    protected $fillable = [
        'user_id',
        'amount',
        'payment_method',
        'payment_type',
        'status',
        'external_id',
        'reference_number',
        'virtual_account_number',
        'qr_code_url',
        'payment_instructions',
        'expired_at',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_instructions' => 'array',
        'expired_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_amount',
        'payment_method_name',
        'remaining_seconds',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($topup) {
            // Generate reference number
            $topup->reference_number = 'TPU-'.strtoupper(uniqid()).'-'.date('Ymd');

            // Set expiry
            $topup->expired_at = now()->addMinutes(self::EXPIRY_MINUTES);

            // Set payment type from method
            if (isset(self::PAYMENT_METHODS[$topup->payment_method])) {
                $topup->payment_type = self::PAYMENT_METHODS[$topup->payment_method]['type'];
            }
        });
    }

    /**
     * Get the user that owns the topup.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'Rp '.number_format($this->amount, 0, ',', '.');
    }

    /**
     * Get payment method name.
     */
    public function getPaymentMethodNameAttribute(): string
    {
        return self::PAYMENT_METHODS[$this->payment_method]['name'] ?? $this->payment_method;
    }

    /**
     * Get status badge info.
     */
    public function getStatusBadgeAttribute(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING => ['label' => 'Menunggu Pembayaran', 'color' => 'yellow'],
            self::STATUS_PAID => ['label' => 'Berhasil', 'color' => 'green'],
            self::STATUS_EXPIRED => ['label' => 'Kadaluarsa', 'color' => 'gray'],
            self::STATUS_FAILED => ['label' => 'Gagal', 'color' => 'red'],
            default => ['label' => 'Unknown', 'color' => 'gray'],
        };
    }

    /**
     * Check if topup is still pending and not expired.
     */
    public function isPendingPayment(): bool
    {
        return $this->status === self::STATUS_PENDING &&
            $this->expired_at &&
            $this->expired_at->isFuture();
    }

    /**
     * Check if expired.
     */
    public function isExpired(): bool
    {
        return $this->expired_at && $this->expired_at->isPast();
    }

    /**
     * Get remaining time in seconds.
     */
    public function getRemainingSecondsAttribute(): int
    {
        if (! $this->expired_at || $this->expired_at->isPast()) {
            return 0;
        }

        return now()->diffInSeconds($this->expired_at);
    }

    /**
     * Scope for pending topups.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for expired topups that need to be updated.
     */
    public function scopeNeedsExpiry($query)
    {
        return $query->where('status', self::STATUS_PENDING)
            ->where('expired_at', '<', now());
    }
}
