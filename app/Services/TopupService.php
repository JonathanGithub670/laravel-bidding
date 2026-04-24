<?php

namespace App\Services;

use App\Models\Topup;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TopupService
{
    /**
     * Create a new topup request.
     */
    public function createTopup(User $user, float $amount, string $paymentMethod): Topup
    {
        // Validate amount
        if ($amount < Topup::MIN_AMOUNT) {
            throw new Exception('Minimum top up adalah Rp ' . number_format(Topup::MIN_AMOUNT, 0, ',', '.'));
        }

        if ($amount > Topup::MAX_AMOUNT) {
            throw new Exception('Maksimum top up adalah Rp ' . number_format(Topup::MAX_AMOUNT, 0, ',', '.'));
        }

        // Validate payment method
        if (!array_key_exists($paymentMethod, Topup::PAYMENT_METHODS)) {
            throw new Exception('Metode pembayaran tidak valid.');
        }

        // Check for pending topups
        $pendingCount = Topup::where('user_id', $user->id)
            ->where('status', Topup::STATUS_PENDING)
            ->where('expired_at', '>', now())
            ->count();

        if ($pendingCount >= 3) {
            throw new Exception('Anda masih memiliki 3 top up yang belum dibayar. Selesaikan atau tunggu kadaluarsa.');
        }

        $topup = Topup::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'payment_method' => $paymentMethod,
            'status' => Topup::STATUS_PENDING,
        ]);

        // Generate payment details (simulation)
        $this->generatePaymentDetails($topup);

        Log::info('Topup created', [
            'topup_id' => $topup->id,
            'user_id' => $user->id,
            'amount' => $amount,
            'payment_method' => $paymentMethod,
        ]);

        return $topup->fresh();
    }

    /**
     * Generate payment details based on method.
     * In production, this would call the actual payment gateway API.
     */
    protected function generatePaymentDetails(Topup $topup): void
    {
        $method = Topup::PAYMENT_METHODS[$topup->payment_method];

        switch ($method['type']) {
            case 'bank_transfer':
                $this->generateVirtualAccount($topup);
                break;
            case 'e_wallet':
                $this->generateEWalletPayment($topup);
                break;
            case 'qris':
                $this->generateQRIS($topup);
                break;
        }
    }

    /**
     * Generate virtual account number (simulation).
     */
    protected function generateVirtualAccount(Topup $topup): void
    {
        $prefixes = [
            'BCA_VA' => '8777',
            'BNI_VA' => '8810',
            'BRI_VA' => '8820',
            'MANDIRI_VA' => '8899',
        ];

        $prefix = $prefixes[$topup->payment_method] ?? '8800';
        $vaNumber = $prefix . str_pad($topup->user_id, 8, '0', STR_PAD_LEFT) . rand(1000, 9999);

        $instructions = $this->getBankInstructions($topup->payment_method, $vaNumber, $topup->amount);

        $topup->update([
            'virtual_account_number' => $vaNumber,
            'payment_instructions' => $instructions,
        ]);
    }

    /**
     * Generate e-wallet payment link (simulation).
     */
    protected function generateEWalletPayment(Topup $topup): void
    {
        // In production, this would return a deep link or redirect URL
        $topup->update([
            'external_id' => 'EW-' . strtoupper(uniqid()),
            'payment_instructions' => [
                ['step' => 1, 'text' => 'Buka aplikasi ' . $topup->payment_method_name],
                ['step' => 2, 'text' => 'Pilih menu "Bayar" atau "Scan"'],
                ['step' => 3, 'text' => 'Klik tombol "Bayar Sekarang" di bawah'],
                ['step' => 4, 'text' => 'Konfirmasi pembayaran di aplikasi'],
            ],
        ]);
    }

    /**
     * Generate QRIS code (simulation).
     */
    protected function generateQRIS(Topup $topup): void
    {
        // In production, this would generate actual QR code from payment gateway
        $topup->update([
            'external_id' => 'QRIS-' . strtoupper(uniqid()),
            'qr_code_url' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SIMULATED_QRIS_' . $topup->reference_number,
            'payment_instructions' => [
                ['step' => 1, 'text' => 'Buka aplikasi e-wallet atau mobile banking'],
                ['step' => 2, 'text' => 'Pilih menu "Scan" atau "QRIS"'],
                ['step' => 3, 'text' => 'Scan QR code di bawah'],
                ['step' => 4, 'text' => 'Konfirmasi pembayaran sebesar ' . $topup->formatted_amount],
            ],
        ]);
    }

    /**
     * Get bank transfer instructions.
     */
    protected function getBankInstructions(string $method, string $vaNumber, float $amount): array
    {
        $bankName = Topup::PAYMENT_METHODS[$method]['name'] ?? 'Bank';
        $formattedAmount = 'Rp ' . number_format($amount, 0, ',', '.');

        return [
            'atm' => [
                ['step' => 1, 'text' => 'Masukkan kartu ATM dan PIN'],
                ['step' => 2, 'text' => 'Pilih menu "Transfer" > "Virtual Account"'],
                ['step' => 3, 'text' => 'Masukkan nomor VA: ' . $vaNumber],
                ['step' => 4, 'text' => 'Konfirmasi detail dan nominal ' . $formattedAmount],
                ['step' => 5, 'text' => 'Simpan bukti transfer'],
            ],
            'mobile_banking' => [
                ['step' => 1, 'text' => 'Login ke aplikasi ' . $bankName],
                ['step' => 2, 'text' => 'Pilih menu "Transfer" > "Virtual Account"'],
                ['step' => 3, 'text' => 'Masukkan nomor VA: ' . $vaNumber],
                ['step' => 4, 'text' => 'Konfirmasi pembayaran sebesar ' . $formattedAmount],
                ['step' => 5, 'text' => 'Masukkan PIN/password untuk konfirmasi'],
            ],
            'internet_banking' => [
                ['step' => 1, 'text' => 'Login ke ' . $bankName . ' Internet Banking'],
                ['step' => 2, 'text' => 'Pilih menu "Transfer" > "Virtual Account"'],
                ['step' => 3, 'text' => 'Masukkan nomor VA: ' . $vaNumber],
                ['step' => 4, 'text' => 'Ikuti instruksi untuk menyelesaikan pembayaran'],
            ],
        ];
    }

    /**
     * Simulate payment confirmation.
     * In production, this would be called by webhook from payment gateway.
     */
    public function confirmPayment(Topup $topup): Topup
    {
        if ($topup->status !== Topup::STATUS_PENDING) {
            throw new Exception('Top up ini sudah diproses.');
        }

        if ($topup->isExpired()) {
            $topup->update(['status' => Topup::STATUS_EXPIRED]);
            throw new Exception('Top up sudah kadaluarsa.');
        }

        return DB::transaction(function () use ($topup) {
            // Update topup status
            $topup->update([
                'status' => Topup::STATUS_PAID,
                'paid_at' => now(),
            ]);

            // Add balance to user
            $topup->user->increment('balance', $topup->amount);

            // Record topup transaction
            \App\Models\Transaction::record(
                $topup->user_id,
                \App\Models\Transaction::TYPE_TOPUP,
                $topup->amount,
                'Top Up Saldo via ' . ($topup->payment_method_name ?? $topup->payment_method),
                $topup
            );

            Log::info('Topup confirmed', [
                'topup_id' => $topup->id,
                'user_id' => $topup->user_id,
                'amount' => $topup->amount,
            ]);

            return $topup;
        });
    }

    /**
     * Handle payment callback from gateway.
     * For future production use.
     */
    public function handleCallback(string $referenceNumber, string $status, array $data = []): ?Topup
    {
        $topup = Topup::where('reference_number', $referenceNumber)->first();

        if (!$topup) {
            Log::warning('Topup callback for unknown reference', [
                'reference_number' => $referenceNumber,
            ]);
            return null;
        }

        if ($status === 'PAID' || $status === 'SETTLEMENT') {
            return $this->confirmPayment($topup);
        } elseif ($status === 'EXPIRED') {
            $topup->update(['status' => Topup::STATUS_EXPIRED]);
        } elseif ($status === 'FAILED') {
            $topup->update(['status' => Topup::STATUS_FAILED]);
        }

        return $topup;
    }

    /**
     * Expire old pending topups.
     */
    public function expireOldTopups(): int
    {
        /** @var int */
        return Topup::needsExpiry()->update(['status' => Topup::STATUS_EXPIRED]);
    }
}
