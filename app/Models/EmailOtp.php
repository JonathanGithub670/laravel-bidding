<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailOtp extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'email',
        'otp_code',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Check if OTP is still valid (not expired).
     */
    public function isValid(): bool
    {
        return $this->expires_at->isFuture();
    }

    /**
     * Generate a new 6-digit OTP for an email.
     */
    public static function generate(string $email): self
    {
        // Delete any existing OTPs for this email
        static::where('email', $email)->delete();

        return static::create([
            'email' => $email,
            'otp_code' => str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'expires_at' => now()->addMinute(),
        ]);
    }

    /**
     * Verify OTP code for an email.
     */
    public static function verify(string $email, string $code): bool
    {
        $otp = static::where('email', $email)
            ->where('otp_code', $code)
            ->first();

        if (!$otp || !$otp->isValid()) {
            return false;
        }

        return true;
    }

    /**
     * Clean up used/expired OTP.
     */
    public static function cleanup(string $email): void
    {
        static::where('email', $email)->delete();
    }
}
