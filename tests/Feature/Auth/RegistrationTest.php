<?php

namespace Tests\Feature\Auth;

use App\Models\EmailOtp;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register()
    {
        // Create the required 'user' role
        Role::create(['name' => Role::USER, 'display_name' => 'User']);

        // Generate a valid OTP for the test email
        $otp = EmailOtp::generate('test@example.com');

        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'otp_code' => $otp->otp_code,
        ]);

        // User should NOT be authenticated after registration (requires superadmin approval)
        $this->assertGuest();

        // Should redirect to login page
        $response->assertRedirect(route('login'));

        // User should have pending verification status
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'verification_status' => User::STATUS_PENDING,
        ]);
    }
}
