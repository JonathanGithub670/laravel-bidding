<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use \App\Traits\LogActivity, HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    /**
     * Role constants.
     */
    public const SUPERADMIN = 'superadmin';

    public const GURU = 'guru';

    public const MURID = 'murid';

    // Backwards compatibility if needed, otherwise these might be deprecated
    public const ADMIN = 'admin';

    public const USER = 'user';

    /**
     * Get users with this role.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if this is the superadmin role.
     */
    public function isSuperadmin(): bool
    {
        return $this->name === self::SUPERADMIN;
    }

    /**
     * Check if this is the admin role.
     */
    public function isAdmin(): bool
    {
        return $this->name === self::ADMIN;
    }

    /**
     * Check if this is the user role.
     */
    public function isUser(): bool
    {
        return $this->name === self::USER;
    }
}
