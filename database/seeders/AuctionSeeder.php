<?php

namespace Database\Seeders;

use App\Models\Auction;
use App\Models\AuctionCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class AuctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a seller user
        $seller = User::firstOrCreate(
            ['email' => 'seller@bidwar.com'],
            [
                'name' => 'BidWar Official',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $categories = AuctionCategory::all();

        $auctions = [
            [
                'title' => 'Rolex Daytona Cosmograph 116500LN',
                'description' => 'Jam tangan mewah Rolex Daytona Cosmograph dengan bezel Cerachrom hitam. Kondisi mint, full set box dan sertifikat.',
                'images' => [
                    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
                    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
                ],
                'starting_price' => 500000000,
                'bid_increment' => 5000000,
                'category_slug' => 'watches',
                'duration_hours' => 2,
            ],
            [
                'title' => 'Ferrari 458 Italia 2015',
                'description' => 'Supercar Ferrari 458 Italia tahun 2015. Warna Rosso Corsa, interior hitam. Kilometer rendah 15.000 km. Full service record resmi.',
                'images' => [
                    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
                    'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800',
                ],
                'starting_price' => 3500000000,
                'bid_increment' => 50000000,
                'category_slug' => 'vehicles',
                'duration_hours' => 4,
            ],
            [
                'title' => 'Hermès Birkin 35 Togo Leather',
                'description' => 'Tas Hermès Birkin 35 dengan kulit Togo warna Gold dan hardware palladium. Kondisi excellent, stamp A.',
                'images' => [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
                ],
                'starting_price' => 400000000,
                'bid_increment' => 5000000,
                'category_slug' => 'fashion',
                'duration_hours' => 3,
            ],
            [
                'title' => 'Diamond Necklace 18K White Gold',
                'description' => 'Kalung berlian dengan total 5.5 carat. Setting 18K white gold. GIA certified. Perfect untuk koleksi atau hadiah spesial.',
                'images' => [
                    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
                ],
                'starting_price' => 750000000,
                'bid_increment' => 10000000,
                'category_slug' => 'jewelry',
                'duration_hours' => 5,
            ],
            [
                'title' => 'Patek Philippe Nautilus 5711/1A',
                'description' => 'Jam tangan Patek Philippe Nautilus referensi 5711/1A-010. Dial biru ikonik, bracelet stainless steel. Discontinued model.',
                'images' => [
                    'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800',
                ],
                'starting_price' => 1200000000,
                'bid_increment' => 25000000,
                'category_slug' => 'watches',
                'duration_hours' => 6,
            ],
            [
                'title' => 'Lamborghini Huracán EVO 2022',
                'description' => 'Lamborghini Huracán EVO tahun 2022. Warna Verde Mantis, full carbon package. Kilometer 5.000 km. Like new condition.',
                'images' => [
                    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
                ],
                'starting_price' => 6500000000,
                'bid_increment' => 100000000,
                'category_slug' => 'vehicles',
                'duration_hours' => 8,
            ],
        ];

        foreach ($auctions as $index => $auctionData) {
            $category = $categories->where('slug', $auctionData['category_slug'])->first();

            if (!$category)
                continue;

            $startsAt = now()->addMinutes($index * 5 + 1);
            $endsAt = $startsAt->copy()->addHours($auctionData['duration_hours']);

            Auction::create([
                'title' => $auctionData['title'],
                'description' => $auctionData['description'],
                'images' => $auctionData['images'],
                'starting_price' => $auctionData['starting_price'],
                'current_price' => $auctionData['starting_price'],
                'bid_increment' => $auctionData['bid_increment'],
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'original_ends_at' => $endsAt,
                'status' => 'live', // Start as live for testing
                'category_id' => $category->id,
                'seller_id' => $seller->id,
            ]);
        }
    }
}
