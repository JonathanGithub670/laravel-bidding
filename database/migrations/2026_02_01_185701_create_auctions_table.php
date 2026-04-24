<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('description');
            $table->json('images')->nullable();
            $table->bigInteger('starting_price');
            $table->bigInteger('current_price');
            $table->bigInteger('bid_increment')->default(500000); // 500K IDR default
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->timestamp('original_ends_at')->nullable();
            $table->enum('status', ['draft', 'scheduled', 'live', 'ended', 'cancelled'])->default('draft');
            $table->foreignId('winner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('category_id')->constrained('auction_categories')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->integer('total_bids')->default(0);
            $table->integer('view_count')->default(0);
            $table->timestamps();

            // Indexes for performance
            $table->index(['status', 'ends_at']);
            $table->index(['category_id', 'status']);
            $table->index('seller_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auctions');
    }
};
