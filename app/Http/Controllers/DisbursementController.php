<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use App\Models\Disbursement;
use App\Services\DisbursementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DisbursementController extends Controller
{
    public function __construct(
        protected DisbursementService $disbursementService
    ) {
    }

    /**
     * Display a listing of user's disbursements.
     */
    public function index(Request $request): Response
    {
        $disbursements = Disbursement::with('bankAccount')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('disbursements/index', [
            'disbursements' => $disbursements,
        ]);
    }

    /**
     * Show the form for creating a new disbursement.
     */
    public function create(Request $request): Response
    {
        $accounts = BankAccount::where('user_id', $request->user()->id)
            ->orderBy('is_primary', 'desc')
            ->get();

        $balance = (float) $request->user()->balance;

        return Inertia::render('disbursements/create', [
            'accounts' => $accounts,
            'balance' => $balance,
            'formattedBalance' => 'Rp ' . number_format($balance, 0, ',', '.'),
            'minAmount' => Disbursement::MIN_AMOUNT,
            'feePercentage' => Disbursement::FEE_PERCENTAGE,
        ]);
    }

    /**
     * Store a newly created disbursement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_account_id' => 'required|exists:bank_accounts,id',
            'amount' => 'required|numeric|min:' . Disbursement::MIN_AMOUNT,
            'notes' => 'nullable|string|max:500',
        ]);

        $bankAccount = BankAccount::findOrFail($validated['bank_account_id']);

        try {
            $this->disbursementService->createDisbursement(
                $request->user(),
                $bankAccount,
                $validated['amount'],
                $validated['notes'] ?? null
            );

            return redirect()->route('disbursements.index')
                ->with('success', 'Permintaan penarikan berhasil diajukan');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified disbursement.
     */
    public function show(Request $request, Disbursement $disbursement): Response
    {
        // Ensure user owns this disbursement
        if ($disbursement->user_id !== $request->user()->id) {
            abort(403);
        }

        $disbursement->load('bankAccount');

        return Inertia::render('disbursements/show', [
            'disbursement' => $disbursement,
        ]);
    }

    /**
     * Cancel a pending disbursement.
     */
    public function cancel(Request $request, Disbursement $disbursement)
    {
        try {
            $this->disbursementService->cancelDisbursement($disbursement, $request->user());
            return back()->with('success', 'Permintaan penarikan berhasil dibatalkan');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Get fee preview for amount.
     */
    public function feePreview(Request $request)
    {
        $amount = (float) $request->input('amount', 0);
        return response()->json($this->disbursementService->getFeePreview($amount));
    }
}
