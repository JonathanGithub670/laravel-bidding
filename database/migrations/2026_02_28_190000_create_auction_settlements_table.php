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
        Schema::create('auction_settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained('auctions')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('winner_id')->constrained('users')->cascadeOnDelete();
            $table->bigInteger('amount'); // Winning bid amount
            $table->bigInteger('admin_fee')->default(0); // Admin fee (5%)
            $table->bigInteger('seller_amount'); // Amount seller receives (amount - admin_fee)
            $table->enum('status', ['pending', 'approved', 'disbursed', 'completed', 'rejected'])->default('pending');
            $table->enum('fund_status', ['held', 'approved', 'scheduled', 'disbursed'])->default('held');
            $table->enum('delivery_status', ['pending', 'shipping', 'delivered'])->default('pending');
            $table->timestamp('disbursement_date')->nullable(); // Scheduled disbursement date
            $table->timestamp('estimated_delivery_date')->nullable(); // Estimated item delivery date
            $table->timestamp('delivery_confirmed_at')->nullable(); // When delivery was confirmed
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('disbursed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->string('reference_number')->unique();
            $table->timestamps();

            $table->index(['status']);
            $table->index(['fund_status']);
            $table->index(['delivery_status']);
            $table->index(['auction_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auction_settlements');
    }
};
