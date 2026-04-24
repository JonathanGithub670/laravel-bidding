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
        Schema::table('auction_settlements', function (Blueprint $table) {
            $table->bigInteger('app_fee')->default(20000)->after('admin_fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('auction_settlements', function (Blueprint $table) {
            $table->dropColumn('app_fee');
        });
    }
};
