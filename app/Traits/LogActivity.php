<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

trait LogActivity
{
    /**
     * Boot the LogActivity trait.
     */
    protected static function bootLogActivity()
    {
        // Log Created Event
        static::created(function ($model) {
            self::logToCrud('CREATED', $model);
        });

        // Log Updated Event
        static::updated(function ($model) {
            self::logToCrud('UPDATED', $model);
        });

        // Log Deleted Event
        static::deleted(function ($model) {
            self::logToCrud('DELETED', $model);
        });
    }

    /**
     * Log the activity to the 'crud' channel.
     *
     * @param  string  $action
     * @param  mixed  $model
     * @return void
     */
    protected static function logToCrud($action, $model)
    {
        $user = Auth::user();
        $userId = $user ? $user->id : 'system';
        $userEmail = $user ? $user->email : 'N/A';
        $ipAddress = request()->ip();

        $logData = [
            'action' => $action,
            'model' => class_basename($model),
            'id' => $model->id,
            'user_id' => $userId,
            'user_email' => $userEmail,
            'ip' => $ipAddress,
            'timestamp' => now()->toDateTimeString(),
        ];

        // Specific handling for updates to show what changed
        if ($action === 'UPDATED') {
            $logData['changes'] = $model->getChanges();
            $logData['original'] = $model->getOriginal();
        } else {
            // For Created and Deleted, show the attributes
            $logData['attributes'] = $model->toArray();
        }

        Log::channel('crud')->info("{$action} ".class_basename($model)." #{$model->id} by {$userEmail}", $logData);
    }
}
