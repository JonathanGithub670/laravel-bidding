<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => Role::SUPERADMIN,
                'display_name' => 'Super Admin',
                'description' => 'Administrator dengan akses penuh ke seluruh sistem',
            ],
            [
                'name' => Role::ADMIN,
                'display_name' => 'Admin',
                'description' => 'Administrator dengan akses untuk mengelola konten',
            ],
            [
                'name' => Role::USER,
                'display_name' => 'User',
                'description' => 'Pengguna biasa dengan akses standar',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                $role
            );
        }
    }
}
