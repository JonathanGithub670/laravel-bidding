<?php

namespace Database\Seeders;

use App\Models\AuctionDuration;
use Illuminate\Database\Seeder;

class AuctionDurationSeeder extends Seeder
{
    public function run(): void
    {
        $durations = [
            ['hours' => 1, 'label' => '1 Jam', 'sort_order' => 1],
            ['hours' => 3, 'label' => '3 Jam', 'sort_order' => 2],
            ['hours' => 6, 'label' => '6 Jam', 'sort_order' => 3],
            ['hours' => 12, 'label' => '12 Jam', 'sort_order' => 4],
            ['hours' => 24, 'label' => '24 Jam (1 Hari)', 'sort_order' => 5],
            ['hours' => 48, 'label' => '48 Jam (2 Hari)', 'sort_order' => 6],
            ['hours' => 72, 'label' => '72 Jam (3 Hari)', 'sort_order' => 7],
            ['hours' => 168, 'label' => '168 Jam (7 Hari)', 'sort_order' => 8],
        ];

        foreach ($durations as $duration) {
            AuctionDuration::create($duration);
        }
    }
}
