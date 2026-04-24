<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response
    {
        // Logout user yang baru saja di-register karena perlu verifikasi superadmin
        // Fortify secara default langsung login user setelah registrasi
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $request->wantsJson()
            ? new JsonResponse(['message' => 'Registration successful. Please wait for superadmin approval.'], 201)
            : redirect()->route('login')->with('status', 'Akun Anda berhasil dibuat. Silakan tunggu persetujuan dari superadmin untuk dapat login.');
    }
}
