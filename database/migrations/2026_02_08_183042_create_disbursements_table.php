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
        Schema::create('disbursements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('bank_account_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2); // Amount requested
            $table->decimal('fee', 15, 2)->default(0); // Admin/service fee
            $table->decimal('total', 15, 2); // Total received = amount - fee
            $table->enum('status', ['pending', 'approved', 'processing', 'completed', 'failed', 'rejected'])->default('pending');
            $table->string('external_id')->nullable(); // ID from payment gateway
            $table->string('reference_number')->nullable(); // Internal reference
            $table->text('notes')->nullable(); // User notes
            $table->text('admin_notes')->nullable(); // Admin rejection/approval notes
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('status');
            $table->index('external_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disbursements');
    }
};
