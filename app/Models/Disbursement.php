<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disbursement extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REJECTED = 'rejected';

    /**
     * Fee percentage (2.5%)
     */
    public const FEE_PERCENTAGE = 2.5;

    /**
     * Minimum withdrawal amount
     */
    public const MIN_AMOUNT = 50000;

    protected $fillable = [
        'user_id',
        'bank_account_id',
        'amount',
        'fee',
        'total',
        'status',
        'external_id',
        'reference_number',
        'notes',
        'admin_notes',
        'processed_by',
        'approved_at',
        'processed_at',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
        'total' => 'decimal:2',
        'approved_at' => 'datetime',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($disbursement) {
            // Calculate fee and total
            $disbursement->fee = $disbursement->amount * (self::FEE_PERCENTAGE / 100);
            $disbursement->total = $disbursement->amount - $disbursement->fee;

            // Generate reference number
            $disbursement->reference_number = 'DSB-'.strtoupper(uniqid()).'-'.date('Ymd');
        });
    }

    /**
     * Get the user that owns the disbursement.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the bank account.
     */
    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    /**
     * Get the admin who processed this.
     */
    public function processedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Get formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'Rp '.number_format($this->amount, 0, ',', '.');
    }

    /**
     * Get formatted fee.
     */
    public function getFormattedFeeAttribute(): string
    {
        return 'Rp '.number_format($this->fee, 0, ',', '.');
    }

    /**
     * Get formatted total.
     */
    public function getFormattedTotalAttribute(): string
    {
        return 'Rp '.number_format($this->total, 0, ',', '.');
    }

    /**
     * Get status badge info.
     */
    public function getStatusBadgeAttribute(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING => ['label' => 'Menunggu', 'color' => 'yellow'],
            self::STATUS_APPROVED => ['label' => 'Disetujui', 'color' => 'blue'],
            self::STATUS_PROCESSING => ['label' => 'Diproses', 'color' => 'indigo'],
            self::STATUS_COMPLETED => ['label' => 'Selesai', 'color' => 'green'],
            self::STATUS_FAILED => ['label' => 'Gagal', 'color' => 'red'],
            self::STATUS_REJECTED => ['label' => 'Ditolak', 'color' => 'red'],
            default => ['label' => 'Unknown', 'color' => 'gray'],
        };
    }

    /**
     * Check if can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if can be approved.
     */
    public function canBeApproved(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if can be processed.
     */
    public function canBeProcessed(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Scope for pending disbursements.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for processing disbursements.
     */
    public function scopeProcessing($query)
    {
        return $query->whereIn('status', [self::STATUS_APPROVED, self::STATUS_PROCESSING]);
    }

    /**
     * Calculate fee for amount.
     */
    public static function calculateFee(float $amount): float
    {
        return $amount * (self::FEE_PERCENTAGE / 100);
    }

    /**
     * Calculate total received for amount.
     */
    public static function calculateTotal(float $amount): float
    {
        return $amount - self::calculateFee($amount);
    }
}
