<?php

namespace Database\Seeders;

use App\Models\AuctionCategory;
use Illuminate\Database\Seeder;

class AuctionCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Watches',
                'slug' => 'watches',
                'icon' => '⌚',
                'description' => 'Luxury watches from premium brands',
                'sort_order' => 1,
            ],
            [
                'name' => 'Vehicles',
                'slug' => 'vehicles',
                'icon' => '🚗',
                'description' => 'Exotic cars, motorcycles, and luxury vehicles',
                'sort_order' => 2,
            ],
            [
                'name' => 'Jewelry',
                'slug' => 'jewelry',
                'icon' => '💎',
                'description' => 'Fine jewelry, diamonds, and precious gems',
                'sort_order' => 3,
            ],
            [
                'name' => 'Art',
                'slug' => 'art',
                'icon' => '🎨',
                'description' => 'Paintings, sculptures, and fine art pieces',
                'sort_order' => 4,
            ],
            [
                'name' => 'Fashion',
                'slug' => 'fashion',
                'icon' => '👜',
                'description' => 'Designer bags, clothing, and accessories',
                'sort_order' => 5,
            ],
            [
                'name' => 'Collectibles',
                'slug' => 'collectibles',
                'icon' => '🏆',
                'description' => 'Rare collectibles, memorabilia, and antiques',
                'sort_order' => 6,
            ],
            [
                'name' => 'Real Estate',
                'slug' => 'real-estate',
                'icon' => '🏠',
                'description' => 'Luxury properties and real estate',
                'sort_order' => 7,
            ],
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'icon' => '📱',
                'description' => 'Premium electronics and gadgets',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            AuctionCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
