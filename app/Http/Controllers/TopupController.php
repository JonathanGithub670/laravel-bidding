<?php

namespace App\Http\Controllers;

use App\Models\Topup;
use App\Services\TopupService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopupController extends Controller
{
    public function __construct(
        protected TopupService $topupService
    ) {
    }

    /**
     * Display a listing of user's topups.
     */
    public function index(Request $request): Response
    {
        $topups = Topup::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('topups/index', [
            'topups' => $topups,
        ]);
    }

    /**
     * Show the form for creating a new topup.
     */
    public function create(Request $request): Response
    {
        $balance = (float) $request->user()->balance;

        // Group payment methods by type
        $paymentMethods = collect(Topup::PAYMENT_METHODS)->map(function ($method, $code) {
            return [
                'code' => $code,
                'name' => $method['name'],
                'type' => $method['type'],
                'icon' => $method['icon'],
            ];
        })->groupBy('type')->toArray();

        return Inertia::render('topups/create', [
            'balance' => $balance,
            'formattedBalance' => 'Rp ' . number_format($balance, 0, ',', '.'),
            'presetAmounts' => Topup::PRESET_AMOUNTS,
            'minAmount' => Topup::MIN_AMOUNT,
            'maxAmount' => Topup::MAX_AMOUNT,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Store a newly created topup.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:' . Topup::MIN_AMOUNT . '|max:' . Topup::MAX_AMOUNT,
            'payment_method' => 'required|string|in:' . implode(',', array_keys(Topup::PAYMENT_METHODS)),
        ]);

        try {
            $topup = $this->topupService->createTopup(
                $request->user(),
                $validated['amount'],
                $validated['payment_method']
            );

            return redirect()->route('topups.show', $topup)
                ->with('success', 'Top up berhasil dibuat. Silakan selesaikan pembayaran.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified topup with payment instructions.
     */
    public function show(Request $request, Topup $topup): Response
    {
        // Ensure user owns this topup
        if ($topup->user_id !== $request->user()->id) {
            abort(403);
        }

        // Check if expired
        if ($topup->status === Topup::STATUS_PENDING && $topup->isExpired()) {
            $topup->update(['status' => Topup::STATUS_EXPIRED]);
        }

        return Inertia::render('topups/show', [
            'topup' => $topup,
            'isPending' => $topup->isPendingPayment(),
        ]);
    }

    /**
     * Simulate payment (for development/testing).
     */
    public function simulatePayment(Request $request, Topup $topup)
    {
        // Ensure user owns this topup
        if ($topup->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $this->topupService->confirmPayment($topup);
            return redirect()->route('topups.show', $topup)
                ->with('success', 'Pembayaran berhasil! Saldo Anda sudah bertambah.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
