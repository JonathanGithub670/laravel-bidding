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
        Schema::create('topups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->string('payment_method', 20); // BCA_VA, OVO, GOPAY, DANA, QRIS, etc.
            $table->string('payment_type', 20); // bank_transfer, e_wallet, qris
            $table->enum('status', ['pending', 'paid', 'expired', 'failed'])->default('pending');
            $table->string('external_id')->nullable(); // Transaction ID from payment gateway
            $table->string('reference_number')->unique(); // Internal reference
            $table->string('virtual_account_number')->nullable(); // VA number for bank transfer
            $table->string('qr_code_url')->nullable(); // QR code for QRIS/e-wallet
            $table->text('payment_instructions')->nullable(); // JSON encoded instructions
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('status');
            $table->index('reference_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topups');
    }
};
