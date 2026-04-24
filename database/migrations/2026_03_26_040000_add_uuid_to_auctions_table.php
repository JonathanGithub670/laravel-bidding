<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Generate UUIDs for existing auctions
        $auctions = \App\Models\Auction::withoutGlobalScopes()->get();
        foreach ($auctions as $auction) {
            \Illuminate\Support\Facades\DB::table('auctions')
                ->where('id', $auction->id)
                ->update(['uuid' => Str::uuid()->toString()]);
        }

        // Make the column non-nullable after populating
        Schema::table('auctions', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
