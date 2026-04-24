<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display a listing of admin users.
     */
    public function index(): Response
    {
        $adminRole = Role::where('name', Role::ADMIN)->first();

        $admins = User::where('role_id', $adminRole?->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'pin' => $user->pin,
                    'is_online' => $user->is_online,
                    'created_at' => $user->created_at->format('d M Y, H:i'),
                    'created_at_human' => $user->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('admin/users/admins', [
            'admins' => $admins,
        ]);
    }

    /**
     * Store a newly created admin user.
     * No email verification required — admin is created ready to use.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $adminRole = Role::where('name', Role::ADMIN)->first();

        if (! $adminRole) {
            return back()->with('error', 'Role admin tidak ditemukan.');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $adminRole->id,
            'email_verified_at' => now(), // Skip email verification
            'verification_status' => User::STATUS_APPROVED, // Auto-approved
            'verified_at' => now(),
            'verified_by' => auth()->id(),
        ]);

        return back()->with('success', "Admin {$request->name} berhasil dibuat.");
    }

    /**
     * Delete an admin user.
     */
    public function destroy(User $user)
    {
        // Ensure we're only deleting admin users, not superadmins
        if (! $user->hasRole(Role::ADMIN)) {
            return back()->with('error', 'Hanya user dengan role admin yang bisa dihapus dari sini.');
        }

        $name = $user->name;
        $user->delete();

        return back()->with('success', "Admin {$name} berhasil dihapus.");
    }

    /**
     * Reset an admin user's password.
     */
    public function resetPassword(Request $request, User $user)
    {
        // Ensure we're only resetting admin passwords
        if (! $user->hasRole(Role::ADMIN)) {
            return back()->with('error', 'Hanya password admin yang bisa direset dari sini.');
        }

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Force logout: delete all sessions for this admin
        \Illuminate\Support\Facades\DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        return back()->with('success', "Password untuk admin {$user->name} berhasil direset. Admin telah otomatis logout.");
    }
}
