<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the old status column and create a new one with updated enum values
        Schema::table('auctions', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('auctions', function (Blueprint $table) {
            $table->enum('status', ['draft', 'pending', 'scheduled', 'live', 'ended', 'cancelled', 'rejected'])
                ->default('draft')
                ->after('original_ends_at');
        });

        // Make starts_at and ends_at nullable
        DB::statement('ALTER TABLE auctions ALTER COLUMN starts_at DROP NOT NULL');
        DB::statement('ALTER TABLE auctions ALTER COLUMN ends_at DROP NOT NULL');

        // Add metadata column
        Schema::table('auctions', function (Blueprint $table) {
            $table->json('metadata')->nullable()->after('view_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auctions', function (Blueprint $table) {
            $table->dropColumn(['metadata', 'status']);
        });

        Schema::table('auctions', function (Blueprint $table) {
            $table->enum('status', ['draft', 'scheduled', 'live', 'ended', 'cancelled'])
                ->default('draft');
        });
    }
};
