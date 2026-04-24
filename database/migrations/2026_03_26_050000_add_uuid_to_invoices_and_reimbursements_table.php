<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // Add UUID to invoices
        Schema::table('invoices', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Generate UUIDs for existing invoices
        foreach (\Illuminate\Support\Facades\DB::table('invoices')->get() as $row) {
            \Illuminate\Support\Facades\DB::table('invoices')
                ->where('id', $row->id)
                ->update(['uuid' => Str::uuid()->toString()]);
        }

        Schema::table('invoices', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });

        // Add UUID to reimbursements
        Schema::table('reimbursements', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique()->after('id');
        });

        // Generate UUIDs for existing reimbursements
        foreach (\Illuminate\Support\Facades\DB::table('reimbursements')->get() as $row) {
            \Illuminate\Support\Facades\DB::table('reimbursements')
                ->where('id', $row->id)
                ->update(['uuid' => Str::uuid()->toString()]);
        }

        Schema::table('reimbursements', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
        Schema::table('reimbursements', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
