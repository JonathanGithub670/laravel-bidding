<?php

namespace App\Services;

use App\Models\BankAccount;
use App\Models\Disbursement;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DisbursementService
{
    /**
     * Create a new disbursement request.
     *
     * @throws Exception
     */
    public function createDisbursement(User $user, BankAccount $bankAccount, float $amount, ?string $notes = null): Disbursement
    {
        // Validate minimum amount
        if ($amount < Disbursement::MIN_AMOUNT) {
            throw new Exception('Minimum penarikan adalah Rp '.number_format(Disbursement::MIN_AMOUNT, 0, ',', '.'));
        }

        // Validate sufficient balance
        if ($user->balance < $amount) {
            throw new Exception('Saldo tidak mencukupi. Saldo Anda: Rp '.number_format($user->balance, 0, ',', '.'));
        }

        // Validate bank account ownership
        if ($bankAccount->user_id !== $user->id) {
            throw new Exception('Rekening bank tidak valid.');
        }

        // Check for pending disbursements
        $pendingCount = Disbursement::where('user_id', $user->id)
            ->whereIn('status', [Disbursement::STATUS_PENDING, Disbursement::STATUS_APPROVED, Disbursement::STATUS_PROCESSING])
            ->count();

        if ($pendingCount > 0) {
            throw new Exception('Anda masih memiliki penarikan yang sedang diproses. Harap tunggu hingga selesai.');
        }

        return DB::transaction(function () use ($user, $bankAccount, $amount, $notes) {
            // Create disbursement
            $disbursement = Disbursement::create([
                'user_id' => $user->id,
                'bank_account_id' => $bankAccount->id,
                'amount' => $amount,
                'notes' => $notes,
                'status' => Disbursement::STATUS_PENDING,
            ]);

            // Hold the balance (deduct immediately to prevent double spending)
            $user->decrement('balance', $amount);

            // Record disbursement transaction
            \App\Models\Transaction::record(
                $user->id,
                \App\Models\Transaction::TYPE_DISBURSEMENT,
                $amount,
                'Penarikan saldo ke rekening bank',
                $disbursement
            );

            Log::info('Disbursement created', [
                'disbursement_id' => $disbursement->id,
                'user_id' => $user->id,
                'amount' => $amount,
            ]);

            return $disbursement;
        });
    }

    /**
     * Approve a disbursement request (Admin).
     *
     * @throws Exception
     */
    public function approveDisbursement(Disbursement $disbursement, User $admin): Disbursement
    {
        if (! $disbursement->canBeApproved()) {
            throw new Exception('Disbursement ini tidak dapat disetujui.');
        }

        $disbursement->update([
            'status' => Disbursement::STATUS_APPROVED,
            'processed_by' => $admin->id,
            'approved_at' => now(),
        ]);

        Log::info('Disbursement approved', [
            'disbursement_id' => $disbursement->id,
            'admin_id' => $admin->id,
        ]);

        // Auto-process after approval (simulation)
        $this->processDisbursement($disbursement);

        return $disbursement->fresh();
    }

    /**
     * Reject a disbursement request (Admin).
     *
     * @throws Exception
     */
    public function rejectDisbursement(Disbursement $disbursement, User $admin, string $reason): Disbursement
    {
        if (! $disbursement->canBeApproved()) {
            throw new Exception('Disbursement ini tidak dapat ditolak.');
        }

        return DB::transaction(function () use ($disbursement, $admin, $reason) {
            // Refund the balance
            $disbursement->user->increment('balance', $disbursement->amount);

            // Record refund transaction
            \App\Models\Transaction::record(
                $disbursement->user_id,
                \App\Models\Transaction::TYPE_DISBURSEMENT_REFUND,
                $disbursement->amount,
                'Pengembalian dana penarikan (ditolak admin)',
                $disbursement
            );

            $disbursement->update([
                'status' => Disbursement::STATUS_REJECTED,
                'processed_by' => $admin->id,
                'admin_notes' => $reason,
                'processed_at' => now(),
            ]);

            Log::info('Disbursement rejected', [
                'disbursement_id' => $disbursement->id,
                'admin_id' => $admin->id,
                'reason' => $reason,
            ]);

            return $disbursement;
        });
    }

    /**
     * Cancel a disbursement request (User).
     *
     * @throws Exception
     */
    public function cancelDisbursement(Disbursement $disbursement, User $user): Disbursement
    {
        if ($disbursement->user_id !== $user->id) {
            throw new Exception('Anda tidak memiliki akses ke disbursement ini.');
        }

        if (! $disbursement->canBeCancelled()) {
            throw new Exception('Disbursement ini tidak dapat dibatalkan.');
        }

        return DB::transaction(function () use ($disbursement) {
            // Refund the balance
            $disbursement->user->increment('balance', $disbursement->amount);

            // Record refund transaction
            \App\Models\Transaction::record(
                $disbursement->user_id,
                \App\Models\Transaction::TYPE_DISBURSEMENT_REFUND,
                $disbursement->amount,
                'Pengembalian dana penarikan (dibatalkan)',
                $disbursement
            );

            $disbursement->update([
                'status' => Disbursement::STATUS_REJECTED,
                'admin_notes' => 'Dibatalkan oleh user',
                'processed_at' => now(),
            ]);

            Log::info('Disbursement cancelled by user', [
                'disbursement_id' => $disbursement->id,
                'user_id' => $disbursement->user_id,
            ]);

            return $disbursement;
        });
    }

    /**
     * Process disbursement (call payment gateway).
     * This is a simulation - replace with actual API call.
     */
    public function processDisbursement(Disbursement $disbursement): Disbursement
    {
        if (! $disbursement->canBeProcessed()) {
            throw new Exception('Disbursement tidak dalam status yang dapat diproses.');
        }

        // Update to processing
        $disbursement->update([
            'status' => Disbursement::STATUS_PROCESSING,
            'processed_at' => now(),
        ]);

        // SIMULATION: In production, this would be an async job
        // that calls the payment gateway API (Xendit/Midtrans)
        // For now, we'll simulate success after a delay

        // Simulate API call with external ID
        $externalId = 'SIM-'.strtoupper(uniqid());

        // Simulate success (in production, this would be a webhook callback)
        $disbursement->update([
            'status' => Disbursement::STATUS_COMPLETED,
            'external_id' => $externalId,
            'completed_at' => now(),
        ]);

        Log::info('Disbursement completed (simulated)', [
            'disbursement_id' => $disbursement->id,
            'external_id' => $externalId,
        ]);

        return $disbursement->fresh();
    }

    /**
     * Handle webhook callback from payment gateway.
     * This is for future production use.
     */
    public function handleCallback(string $externalId, string $status, array $data = []): ?Disbursement
    {
        $disbursement = Disbursement::where('external_id', $externalId)->first();

        if (! $disbursement) {
            Log::warning('Disbursement callback received for unknown external_id', [
                'external_id' => $externalId,
            ]);

            return null;
        }

        if ($status === 'COMPLETED') {
            $disbursement->update([
                'status' => Disbursement::STATUS_COMPLETED,
                'completed_at' => now(),
            ]);
        } elseif ($status === 'FAILED') {
            // Refund balance on failure
            $disbursement->user->increment('balance', $disbursement->amount);

            $disbursement->update([
                'status' => Disbursement::STATUS_FAILED,
                'admin_notes' => $data['failure_reason'] ?? 'Unknown error',
            ]);
        }

        return $disbursement;
    }

    /**
     * Get fee preview.
     */
    public function getFeePreview(float $amount): array
    {
        $fee = Disbursement::calculateFee($amount);
        $total = Disbursement::calculateTotal($amount);

        return [
            'amount' => $amount,
            'fee' => $fee,
            'fee_percentage' => Disbursement::FEE_PERCENTAGE,
            'total' => $total,
            'formatted_amount' => 'Rp '.number_format($amount, 0, ',', '.'),
            'formatted_fee' => 'Rp '.number_format($fee, 0, ',', '.'),
            'formatted_total' => 'Rp '.number_format($total, 0, ',', '.'),
        ];
    }
}
