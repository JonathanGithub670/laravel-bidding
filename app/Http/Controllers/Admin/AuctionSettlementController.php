<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuctionSettlement;
use App\Services\AuctionSettlementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuctionSettlementController extends Controller
{
    public function __construct(
        protected AuctionSettlementService $settlementService
    ) {}

    /**
     * Display a listing of all auction settlements for admin.
     */
    public function index(Request $request): Response
    {
        // Process any scheduled disbursements first
        $this->settlementService->processScheduledDisbursements();

        $status = $request->input('status', 'all');

        $query = AuctionSettlement::with(['auction', 'seller', 'winner', 'approvedByUser'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $settlements = $query->paginate(15)->withQueryString();

        // Append computed attributes
        $settlements->getCollection()->each(function ($settlement) {
            $settlement->append([
                'formatted_amount',
                'formatted_admin_fee',
                'formatted_app_fee',
                'formatted_seller_amount',
                'status_badge',
                'fund_status_badge',
                'delivery_status_badge',
            ]);
        });

        // Get counts for each status
        $counts = [
            'all' => AuctionSettlement::count(),
            'pending' => AuctionSettlement::where('status', AuctionSettlement::STATUS_PENDING)->count(),
            'approved' => AuctionSettlement::where('status', AuctionSettlement::STATUS_APPROVED)->count(),
            'disbursed' => AuctionSettlement::where('status', AuctionSettlement::STATUS_DISBURSED)->count(),
            'completed' => AuctionSettlement::where('status', AuctionSettlement::STATUS_COMPLETED)->count(),
            'rejected' => AuctionSettlement::where('status', AuctionSettlement::STATUS_REJECTED)->count(),
        ];

        return Inertia::render('admin/settlements/index', [
            'settlements' => $settlements,
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Approve a settlement - set disbursement date and estimated delivery date.
     */
    public function approve(Request $request, AuctionSettlement $settlement)
    {
        $validated = $request->validate([
            'disbursement_date' => 'required|date|after_or_equal:today',
            'estimated_delivery_date' => 'required|date|after_or_equal:today',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            $this->settlementService->approveFunds(
                $settlement,
                $request->user(),
                $validated['disbursement_date'],
                $validated['estimated_delivery_date'],
                $validated['notes'] ?? null
            );

            return back()->with('success', 'Settlement berhasil disetujui. Dana dijadwalkan untuk dicairkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Confirm that the item is being shipped to the winner.
     */
    public function confirmShipping(Request $request, AuctionSettlement $settlement)
    {
        try {
            $this->settlementService->confirmShipping($settlement, $request->user());

            return back()->with('success', 'Pengiriman barang telah dikonfirmasi.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Mark item as delivered.
     */
    public function markDelivered(Request $request, AuctionSettlement $settlement)
    {
        try {
            $this->settlementService->markDelivered($settlement, $request->user());

            return back()->with('success', 'Barang telah sampai ke pemenang.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reject a settlement.
     */
    public function reject(Request $request, AuctionSettlement $settlement)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $this->settlementService->reject($settlement, $request->user(), $validated['reason']);

            return back()->with('success', 'Settlement berhasil ditolak. Dana dikembalikan ke pemenang.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
