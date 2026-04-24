<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use \App\Traits\LogActivity, HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * User verification status constants.
     */
    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'pin',
        'balance',
        'role_id',
        'last_seen_at',
        'verification_status',
        'verification_note',
        'verified_at',
        'verified_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'last_seen_at' => 'datetime',
            'verified_at' => 'datetime',
            'balance' => 'decimal:2',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->pin)) {
                $user->pin = static::generateUniquePin();
            }
        });
    }

    /**
     * Generate a unique 6-digit PIN.
     */
    public static function generateUniquePin(): string
    {
        do {
            $pin = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (static::where('pin', $pin)->exists());

        return $pin;
    }

    /**
     * Find user by PIN.
     *
     * @return static|null
     */
    public static function findByPin(string $pin): ?self
    {
        return static::where('pin', $pin)->first();
    }

    /**
     * Get the role of the user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Check if user is superadmin.
     */
    public function isSuperadmin(): bool
    {
        return $this->role && $this->role->name === Role::SUPERADMIN;
    }

    /**
     * Check if user is guru.
     */
    public function isGuru(): bool
    {
        return $this->role && $this->role->name === Role::GURU;
    }

    /**
     * Check if user is murid.
     */
    public function isMurid(): bool
    {
        return $this->role && $this->role->name === Role::MURID;
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasRole(string|array $roles): bool
    {
        if (! $this->role) {
            return false;
        }

        $roles = is_array($roles) ? $roles : [$roles];

        return in_array($this->role->name, $roles);
    }

    /**
     * Check if user is online.
     */
    public function getIsOnlineAttribute(): bool
    {
        return $this->last_seen_at && $this->last_seen_at->diffInMinutes(now()) < 5;
    }

    /**
     * Get the admin who verified this user.
     */
    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Check if user verification is pending.
     */
    public function isPending(): bool
    {
        return $this->verification_status === self::STATUS_PENDING;
    }

    /**
     * Check if user is approved.
     */
    public function isApproved(): bool
    {
        return $this->verification_status === self::STATUS_APPROVED;
    }

    /**
     * Check if user is rejected.
     */
    public function isRejected(): bool
    {
        return $this->verification_status === self::STATUS_REJECTED;
    }
}
