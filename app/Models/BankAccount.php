<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankAccount extends Model
{
    use HasFactory;

    /**
     * Available bank codes
     */
    public const BANKS = [
        'BCA' => 'Bank Central Asia',
        'BNI' => 'Bank Negara Indonesia',
        'BRI' => 'Bank Rakyat Indonesia',
        'MANDIRI' => 'Bank Mandiri',
        'CIMB' => 'CIMB Niaga',
        'PERMATA' => 'Bank Permata',
        'BJB' => 'Bank BJB',
        'BSI' => 'Bank Syariah Indonesia',
        'DANAMON' => 'Bank Danamon',
        'BTPN' => 'Bank BTPN',
        'JAGO' => 'Bank Jago',
        'SEABANK' => 'SeaBank',
        'OVO' => 'OVO',
        'GOPAY' => 'GoPay',
        'DANA' => 'DANA',
    ];

    protected $fillable = [
        'user_id',
        'bank_code',
        'bank_name',
        'account_number',
        'account_name',
        'is_verified',
        'is_primary',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_primary' => 'boolean',
    ];

    /**
     * Get the user that owns the bank account.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get disbursements for this account.
     */
    public function disbursements(): HasMany
    {
        return $this->hasMany(Disbursement::class);
    }

    /**
     * Get masked account number.
     */
    public function getMaskedAccountNumberAttribute(): string
    {
        $number = $this->account_number;
        $length = strlen($number);

        if ($length <= 4) {
            return $number;
        }

        return str_repeat('*', $length - 4) . substr($number, -4);
    }

    /**
     * Set as primary and unset others.
     */
    public function setAsPrimary(): void
    {
        // Unset other primary accounts
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_primary' => false]);

        $this->update(['is_primary' => true]);
    }
}
