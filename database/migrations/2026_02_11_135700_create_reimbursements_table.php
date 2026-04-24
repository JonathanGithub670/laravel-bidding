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
        Schema::create('reimbursements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auction_id')->constrained('auctions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('auction_participant_id')->constrained('auction_participants')->cascadeOnDelete();
            $table->bigInteger('amount'); // Same as fee_paid
            $table->enum('status', ['pending', 'eligible', 'approved', 'completed', 'rejected'])->default('pending');
            $table->string('reference_number')->unique();
            $table->text('admin_notes')->nullable();
            $table->timestamp('eligible_at'); // auction ends_at + 3 days
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['auction_id', 'status']);
            $table->index('user_id');
            $table->index('status');
            $table->index('eligible_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimbursements');
    }
};
