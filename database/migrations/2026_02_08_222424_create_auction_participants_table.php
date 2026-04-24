<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('auction_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained('auctions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->bigInteger('fee_paid')->default(0);
            $table->enum('status', ['active', 'refunded', 'cancelled'])->default('active');
            $table->timestamp('registered_at');
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();

            // Unique constraint: one user can only register once per auction
            $table->unique(['auction_id', 'user_id']);

            // Indexes
            $table->index(['auction_id', 'status']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_participants');
    }
};
