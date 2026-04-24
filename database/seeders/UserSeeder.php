<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get role IDs
        $superadminRole = Role::where('name', Role::SUPERADMIN)->first();
        $adminRole = Role::where('name', Role::ADMIN)->first();
        $userRole = Role::where('name', Role::USER)->first();

        // Create Superadmin user
        User::updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role_id' => $superadminRole?->id,
            ]
        );

        // Create Admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role_id' => $adminRole?->id,
            ]
        );

        // Create Regular user
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Regular User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role_id' => $userRole?->id,
            ]
        );
    }
}
