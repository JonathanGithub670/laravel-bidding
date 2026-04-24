<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop indexes that reference the status column first (required for SQLite compatibility)
        Schema::table('auctions', function (Blueprint $table) {
            $table->dropIndex(['status', 'ends_at']);
            $table->dropIndex(['category_id', 'status']);
        });

        // Drop the old status column and create a new one with updated enum values
        Schema::table('auctions', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('auctions', function (Blueprint $table) {
            $table->string('status')->default('draft')->after('original_ends_at');
            $table->index(['status', 'ends_at']);
            $table->index(['category_id', 'status']);
        });

        // Make starts_at and ends_at nullable
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE auctions ALTER COLUMN starts_at DROP NOT NULL');
            DB::statement('ALTER TABLE auctions ALTER COLUMN ends_at DROP NOT NULL');
        } else {
            // SQLite columns created via Schema are already nullable by default in the original migration
            // For SQLite we need to recreate the columns
            Schema::table('auctions', function (Blueprint $table) {
                $table->timestamp('starts_at')->nullable()->change();
                $table->timestamp('ends_at')->nullable()->change();
            });
        }

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
