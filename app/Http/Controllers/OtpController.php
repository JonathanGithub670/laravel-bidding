<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\EmailOtp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OtpController extends Controller
{
    /**
     * Send OTP to the given email address.
     */
    public function send(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email tidak valid.',
            ], 422);
        }

        $email = $request->input('email');

        // Rate limit: check if OTP was sent recently (within last 60 seconds)
        $recent = EmailOtp::where('email', $email)
            ->where('created_at', '>=', now()->subSeconds(60))
            ->first();

        if ($recent) {
            $secondsLeft = 60 - now()->diffInSeconds($recent->created_at);
            return response()->json([
                'success' => false,
                'message' => "Tunggu {$secondsLeft} detik sebelum mengirim ulang.",
                'seconds_left' => (int) $secondsLeft,
            ], 429);
        }

        // Generate OTP
        $otp = EmailOtp::generate($email);

        // Send email
        try {
            Mail::to($email)->send(new OtpMail($otp->otp_code));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim email. Silakan coba lagi.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP telah dikirim ke email Anda.',
        ]);
    }

    /**
     * Verify OTP code.
     */
    public function verify(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp_code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
            ], 422);
        }

        $isValid = EmailOtp::verify(
            $request->input('email'),
            $request->input('otp_code')
        );

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kedaluwarsa.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP valid.',
        ]);
    }
}
