<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // topup, registration_fee, registration_income, bid, bid_refund, reimbursement, settlement_seller, settlement_refund, disbursement, disbursement_refund
            $table->bigInteger('amount'); // always positive
            $table->string('description');
            $table->nullableMorphs('reference'); // polymorphic: reference_id + reference_type
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
