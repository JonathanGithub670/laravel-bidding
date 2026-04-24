<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BankAccountController extends Controller
{
    /**
     * Display a listing of user's bank accounts.
     */
    public function index(Request $request): Response
    {
        $accounts = BankAccount::where('user_id', $request->user()->id)
            ->orderBy('is_primary', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('bank-accounts/index', [
            'accounts' => $accounts,
            'banks' => BankAccount::BANKS,
        ]);
    }

    /**
     * Store a newly created bank account.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_code' => 'required|string|max:10',
            'account_number' => 'required|string|max:30',
            'account_name' => 'required|string|max:100',
        ]);

        // Check if bank code is valid
        if (! array_key_exists($validated['bank_code'], BankAccount::BANKS)) {
            return back()->withErrors(['bank_code' => 'Bank tidak valid']);
        }

        $validated['bank_name'] = BankAccount::BANKS[$validated['bank_code']];
        $validated['user_id'] = $request->user()->id;

        // If this is the first account, make it primary
        $existingCount = BankAccount::where('user_id', $request->user()->id)->count();
        $validated['is_primary'] = $existingCount === 0;

        BankAccount::create($validated);

        return back()->with('success', 'Rekening bank berhasil ditambahkan');
    }

    /**
     * Update the specified bank account.
     */
    public function update(Request $request, BankAccount $bankAccount)
    {
        // Ensure user owns this account
        if ($bankAccount->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'bank_code' => 'required|string|max:10',
            'account_number' => 'required|string|max:30',
            'account_name' => 'required|string|max:100',
        ]);

        if (! array_key_exists($validated['bank_code'], BankAccount::BANKS)) {
            return back()->withErrors(['bank_code' => 'Bank tidak valid']);
        }

        $validated['bank_name'] = BankAccount::BANKS[$validated['bank_code']];

        $bankAccount->update($validated);

        return back()->with('success', 'Rekening bank berhasil diperbarui');
    }

    /**
     * Remove the specified bank account.
     */
    public function destroy(Request $request, BankAccount $bankAccount)
    {
        // Ensure user owns this account
        if ($bankAccount->user_id !== $request->user()->id) {
            abort(403);
        }

        // Check if account has pending disbursements
        $pendingCount = $bankAccount->disbursements()
            ->whereIn('status', ['pending', 'approved', 'processing'])
            ->count();

        if ($pendingCount > 0) {
            return back()->withErrors(['error' => 'Tidak dapat menghapus rekening dengan penarikan yang sedang diproses']);
        }

        $bankAccount->delete();

        return back()->with('success', 'Rekening bank berhasil dihapus');
    }

    /**
     * Set bank account as primary.
     */
    public function setPrimary(Request $request, BankAccount $bankAccount)
    {
        // Ensure user owns this account
        if ($bankAccount->user_id !== $request->user()->id) {
            abort(403);
        }

        $bankAccount->setAsPrimary();

        return back()->with('success', 'Rekening utama berhasil diubah');
    }
}
