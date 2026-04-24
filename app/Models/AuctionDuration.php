<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuctionDuration extends Model
{
    protected $fillable = [
        'hours',
        'label',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'hours' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->whereRaw('"is_active" = true');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('hours');
    }
}
