<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BadgeRead;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserVerificationController extends Controller
{
    /**
     * Display a listing of users pending verification.
     */
    public function index(): Response
    {
        // Mark admin user verification badge as read
        if ($user = auth()->user()) {
            BadgeRead::markRead($user->id, 'admin-user-verification');
        }

        $pendingUsers = User::where('verification_status', User::STATUS_PENDING)
            ->with('role')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'pin' => $user->pin,
                    'role' => $user->role?->display_name ?? 'N/A',
                    'created_at' => $user->created_at->format('d M Y, H:i'),
                    'created_at_human' => $user->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('admin/users/verification', [
            'pendingUsers' => $pendingUsers,
        ]);
    }

    /**
     * Approve a user.
     */
    public function approve(Request $request, User $user)
    {
        if ($user->verification_status !== User::STATUS_PENDING) {
            return back()->with('error', 'User is not pending verification.');
        }

        $user->update([
            'verification_status' => User::STATUS_APPROVED,
            'verified_at' => now(),
            'verified_by' => auth()->id(),
            'verification_note' => null,
        ]);

        return back()->with('success', "User {$user->name} has been approved successfully.");
    }

    /**
     * Reject a user.
     */
    public function reject(Request $request, User $user)
    {
        if ($user->verification_status !== User::STATUS_PENDING) {
            return back()->with('error', 'User is not pending verification.');
        }

        $request->validate([
            'note' => 'nullable|string|max:500',
        ]);

        $user->update([
            'verification_status' => User::STATUS_REJECTED,
            'verified_at' => now(),
            'verified_by' => auth()->id(),
            'verification_note' => $request->input('note'),
        ]);

        return back()->with('success', "User {$user->name} has been rejected.");
    }
}
