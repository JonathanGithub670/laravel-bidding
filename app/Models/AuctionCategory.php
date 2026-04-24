<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AuctionCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get all auctions in this category.
     */
    public function auctions(): HasMany
    {
        return $this->hasMany(Auction::class, 'category_id');
    }

    /**
     * Scope to get only active categories.
     */
    public function scopeActive($query)
    {
        return $query->whereRaw('"is_active" = true');
    }

    /**
     * Scope to order by sort_order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    /**
     * Get active auction count for this category.
     */
    public function getLiveAuctionCountAttribute(): int
    {
        return $this->auctions()->where('status', 'live')->count();
    }
}
