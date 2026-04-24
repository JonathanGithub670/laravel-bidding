<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Transaction extends Model
{
    use HasFactory;

    // Income types
    public const TYPE_TOPUP = 'topup';

    public const TYPE_REGISTRATION_INCOME = 'registration_income';

    public const TYPE_BID_REFUND = 'bid_refund';

    public const TYPE_REIMBURSEMENT = 'reimbursement';

    public const TYPE_SETTLEMENT_SELLER = 'settlement_seller';

    public const TYPE_SETTLEMENT_REFUND = 'settlement_refund';

    public const TYPE_DISBURSEMENT_REFUND = 'disbursement_refund';

    // Expense types
    public const TYPE_REGISTRATION_FEE = 'registration_fee';

    public const TYPE_BID = 'bid';

    public const TYPE_DISBURSEMENT = 'disbursement';

    public const INCOME_TYPES = [
        self::TYPE_TOPUP,
        self::TYPE_REGISTRATION_INCOME,
        self::TYPE_BID_REFUND,
        self::TYPE_REIMBURSEMENT,
        self::TYPE_SETTLEMENT_SELLER,
        self::TYPE_SETTLEMENT_REFUND,
        self::TYPE_DISBURSEMENT_REFUND,
    ];

    public const EXPENSE_TYPES = [
        self::TYPE_REGISTRATION_FEE,
        self::TYPE_BID,
        self::TYPE_DISBURSEMENT,
    ];

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'description',
        'reference_id',
        'reference_type',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'integer',
        'metadata' => 'array',
    ];

    protected $appends = [
        'formatted_amount',
        'category',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reference model (polymorphic).
     */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Check if this is an income transaction.
     */
    public function isIncome(): bool
    {
        return in_array($this->type, self::INCOME_TYPES);
    }

    /**
     * Check if this is an expense transaction.
     */
    public function isExpense(): bool
    {
        return in_array($this->type, self::EXPENSE_TYPES);
    }

    /**
     * Get formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'Rp '.number_format($this->amount, 0, ',', '.');
    }

    /**
     * Get category (income/expense).
     */
    public function getCategoryAttribute(): string
    {
        return $this->isIncome() ? 'income' : 'expense';
    }

    /**
     * Record a transaction.
     */
    public static function record(
        int $userId,
        string $type,
        int $amount,
        string $description,
        ?Model $reference = null,
        ?array $metadata = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'type' => $type,
            'amount' => abs($amount),
            'description' => $description,
            'reference_id' => $reference?->id,
            'reference_type' => $reference ? get_class($reference) : null,
            'metadata' => $metadata,
        ]);
    }

    /**
     * Scope for income transactions.
     */
    public function scopeIncome($query)
    {
        return $query->whereIn('type', self::INCOME_TYPES);
    }

    /**
     * Scope for expense transactions.
     */
    public function scopeExpense($query)
    {
        return $query->whereIn('type', self::EXPENSE_TYPES);
    }
}
