<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('pin', 6)->unique()->nullable()->after('email');
        });

        // Generate unique PINs for existing users
        $users = DB::table('users')->get();
        $usedPins = [];

        foreach ($users as $user) {
            $pin = $this->generateUniquePin($usedPins);
            $usedPins[] = $pin;

            DB::table('users')
                ->where('id', $user->id)
                ->update(['pin' => $pin]);
        }

        // Make pin not nullable after populating existing records
        Schema::table('users', function (Blueprint $table) {
            $table->string('pin', 6)->nullable(false)->change();
        });
    }

    /**
     * Generate a unique 6-digit PIN.
     */
    private function generateUniquePin(array $usedPins): string
    {
        do {
            $pin = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (in_array($pin, $usedPins) || DB::table('users')->where('pin', $pin)->exists());

        return $pin;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('pin');
        });
    }
};
