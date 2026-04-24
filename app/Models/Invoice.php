<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Invoice extends Model
{
    use \App\Traits\LogActivity;

    protected $fillable = [
        'uuid',
        'invoice_number',
        'auction_id',
        'winner_id',
        'amount',
        'admin_fee',
        'registration_fee',
        'app_fee',
        'total_amount',
        'status',
        'payment_due_at',
        'paid_at',
        'payment_method',
        'payment_reference',
        'payment_details',
        'notes',
    ];

    protected $casts = [
        'amount' => 'integer',
        'admin_fee' => 'integer',
        'registration_fee' => 'integer',
        'app_fee' => 'integer',
        'total_amount' => 'integer',
        'payment_due_at' => 'datetime',
        'paid_at' => 'datetime',
        'payment_details' => 'array',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            if (empty($invoice->uuid)) {
                $invoice->uuid = Str::uuid()->toString();
            }
            if (! $invoice->invoice_number) {
                $invoice->invoice_number = static::generateInvoiceNumber();
            }
            if (! $invoice->total_amount) {
                $invoice->total_amount = $invoice->amount + $invoice->admin_fee + $invoice->app_fee;
            }
        });
    }

    /**
     * Generate unique invoice number.
     */
    public static function generateInvoiceNumber(): string
    {
        $prefix = 'INV';
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(6));

        return "{$prefix}-{$date}-{$random}";
    }

    /**
     * Get the auction for this invoice.
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * Get the winner (buyer) for this invoice.
     */
    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    /**
     * Check if invoice is expired.
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->status === 'pending' && $this->payment_due_at < now();
    }

    /**
     * Check if invoice is paid.
     */
    public function getIsPaidAttribute(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Get remaining payment time in seconds.
     */
    public function getRemainingPaymentSecondsAttribute(): int
    {
        if ($this->status !== 'pending') {
            return 0;
        }

        return max(0, $this->payment_due_at->diffInSeconds(now(), false) * -1);
    }

    /**
     * Format total amount as IDR.
     */
    public function getFormattedTotalAttribute(): string
    {
        return 'Rp '.number_format($this->total_amount, 0, ',', '.');
    }

    public function getFormattedAmountAttribute(): string
    {
        return 'Rp '.number_format($this->amount, 0, ',', '.');
    }

    public function getFormattedAdminFeeAttribute(): string
    {
        return 'Rp '.number_format($this->admin_fee, 0, ',', '.');
    }

    public function getFormattedRegistrationFeeAttribute(): string
    {
        return 'Rp '.number_format($this->registration_fee, 0, ',', '.');
    }

    public function getFormattedAppFeeAttribute(): string
    {
        return 'Rp '.number_format($this->app_fee, 0, ',', '.');
    }

    /**
     * Scope to get pending invoices.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get expired invoices.
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'pending')
            ->where('payment_due_at', '<', now());
    }

    /**
     * Mark invoice as paid.
     */
    public function markAsPaid(string $method, string $reference, array $details = []): void
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
            'payment_method' => $method,
            'payment_reference' => $reference,
            'payment_details' => $details,
        ]);
    }

    /**
     * Mark invoice as expired.
     */
    public function markAsExpired(): void
    {
        $this->update(['status' => 'expired']);
    }
}
