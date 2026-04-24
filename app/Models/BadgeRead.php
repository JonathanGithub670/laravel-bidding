<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class BadgeRead extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'page_key', 'read_at'];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    /**
     * Mark a page as read for a user (record current timestamp).
     */
    public static function markRead(int $userId, string $pageKey): void
    {
        static::updateOrCreate(
            ['user_id' => $userId, 'page_key' => $pageKey],
            ['read_at' => now()]
        );
    }

    /**
     * Get the last read timestamp for a user's page.
     * Returns null if the page has never been visited.
     */
    public static function getReadAt(int $userId, string $pageKey): ?Carbon
    {
        $readAt = static::where('user_id', $userId)
            ->where('page_key', $pageKey)
            ->value('read_at');

        return $readAt ? Carbon::parse($readAt) : null;
    }
}
