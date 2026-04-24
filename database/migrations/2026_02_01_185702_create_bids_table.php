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
        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained('auctions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->bigInteger('amount');
            $table->boolean('is_winning')->default(false);
            $table->boolean('is_auto_bid')->default(false);
            $table->ipAddress('ip_address')->nullable();
            $table->timestamp('created_at');

            // Composite index for quick lookups
            $table->index(['auction_id', 'amount']);
            $table->index(['auction_id', 'is_winning']);
            $table->index(['user_id', 'auction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bids');
    }
};
