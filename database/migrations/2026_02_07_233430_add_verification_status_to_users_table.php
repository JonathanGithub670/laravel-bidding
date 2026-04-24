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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('verification_status', ['pending', 'approved', 'rejected'])
                ->default('approved')
                ->after('role_id')
                ->comment('User account verification status');

            $table->text('verification_note')
                ->nullable()
                ->after('verification_status')
                ->comment('Admin note for approval/rejection');

            $table->timestamp('verified_at')
                ->nullable()
                ->after('verification_note')
                ->comment('Timestamp when user was verified');

            $table->foreignId('verified_by')
                ->nullable()
                ->after('verified_at')
                ->constrained('users')
                ->nullOnDelete()
                ->comment('Admin who verified the user');

            $table->index('verification_status');
        });

        // Set all existing users to 'approved' status
        DB::table('users')->update([
            'verification_status' => 'approved',
            'verified_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['verified_by']);
            $table->dropIndex(['verification_status']);
            $table->dropColumn([
                'verification_status',
                'verification_note',
                'verified_at',
                'verified_by',
            ]);
        });
    }
};
