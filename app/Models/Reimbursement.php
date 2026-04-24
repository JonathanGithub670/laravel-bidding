<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Reimbursement extends Model
{
    use HasFactory;

    /**
     * Status constants
     */
    public const STATUS_PENDING = 'pending';

    public const STATUS_ELIGIBLE = 'eligible';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_REJECTED = 'rejected';

    /**
     * Minimum days before reimbursement becomes eligible
     */
    public const MIN_DAYS = 3;

    /**
     * Instant mode: when true, reimbursements become eligible immediately.
     * Set to false for production (3-day waiting period).
     * Set to true for testing (instant refund after admin approval).
     */
    public const INSTANT_MODE = true;

    protected $fillable = [
        'uuid',
        'auction_id',
        'user_id',
        'auction_participant_id',
        'amount',
        'status',
        'reference_number',
        'admin_notes',
        'eligible_at',
        'processed_by',
        'approved_at',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'integer',
        'eligible_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_amount',
        'status_badge',
        'remaining_days',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($reimbursement) {
            if (empty($reimbursement->uuid)) {
                $reimbursement->uuid = Str::uuid()->toString();
            }
            if (! $reimbursement->reference_number) {
                $reimbursement->reference_number = 'RMB-'.strtoupper(uniqid()).'-'.date('Ymd');
            }
        });
    }

    /**
     * Get the auction.
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Get the user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the auction participant record.
     */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(AuctionParticipant::class, 'auction_participant_id');
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
     * Get status badge info.
     */
    public function getStatusBadgeAttribute(): array
    {
        return match ($this->status) {
            self::STATUS_PENDING => ['label' => 'Menunggu', 'color' => 'yellow'],
            self::STATUS_ELIGIBLE => ['label' => 'Eligible', 'color' => 'blue'],
            self::STATUS_APPROVED => ['label' => 'Disetujui', 'color' => 'indigo'],
            self::STATUS_COMPLETED => ['label' => 'Selesai', 'color' => 'green'],
            self::STATUS_REJECTED => ['label' => 'Ditolak', 'color' => 'red'],
            default => ['label' => 'Unknown', 'color' => 'gray'],
        };
    }

    /**
     * Check if reimbursement is now eligible (past the 3-day waiting period).
     */
    public function isEligible(): bool
    {
        return $this->eligible_at && $this->eligible_at->isPast();
    }

    /**
     * Check if can be approved by admin.
     */
    public function canBeApproved(): bool
    {
        return $this->status === self::STATUS_ELIGIBLE;
    }

    /**
     * Check if can be rejected by admin.
     */
    public function canBeRejected(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_ELIGIBLE]);
    }

    /**
     * Get remaining days until eligible.
     */
    public function getRemainingDaysAttribute(): int
    {
        if (! $this->eligible_at || $this->eligible_at->isPast()) {
            return 0;
        }

        return (int) now()->diffInDays($this->eligible_at, false);
    }

    /**
     * Scope for pending reimbursements.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for eligible reimbursements.
     */
    public function scopeEligible($query)
    {
        return $query->where('status', self::STATUS_ELIGIBLE);
    }

    /**
     * Scope for reimbursements that should become eligible.
     */
    public function scopeShouldBeEligible($query)
    {
        return $query->where('status', self::STATUS_PENDING)
            ->where('eligible_at', '<=', now());
    }
}
