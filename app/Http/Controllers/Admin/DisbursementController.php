<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Disbursement;
use App\Services\DisbursementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DisbursementController extends Controller
{
    public function __construct(
        protected DisbursementService $disbursementService
    ) {}

    /**
     * Display a listing of all disbursements for admin.
     */
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'all');

        $query = Disbursement::with(['user', 'bankAccount', 'processedByUser'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $disbursements = $query->paginate(15)->withQueryString();

        // Get counts for each status
        $counts = [
            'all' => Disbursement::count(),
            'pending' => Disbursement::where('status', Disbursement::STATUS_PENDING)->count(),
            'approved' => Disbursement::where('status', Disbursement::STATUS_APPROVED)->count(),
            'processing' => Disbursement::where('status', Disbursement::STATUS_PROCESSING)->count(),
            'completed' => Disbursement::where('status', Disbursement::STATUS_COMPLETED)->count(),
            'failed' => Disbursement::where('status', Disbursement::STATUS_FAILED)->count(),
            'rejected' => Disbursement::where('status', Disbursement::STATUS_REJECTED)->count(),
        ];

        return Inertia::render('admin/disbursements/index', [
            'disbursements' => $disbursements,
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Display the specified disbursement.
     */
    public function show(Disbursement $disbursement): Response
    {
        $disbursement->load(['user', 'bankAccount', 'processedByUser']);

        return Inertia::render('admin/disbursements/show', [
            'disbursement' => $disbursement,
        ]);
    }

    /**
     * Approve a disbursement request.
     */
    public function approve(Request $request, Disbursement $disbursement)
    {
        try {
            $this->disbursementService->approveDisbursement($disbursement, $request->user());

            return back()->with('success', 'Disbursement berhasil disetujui dan diproses');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reject a disbursement request.
     */
    public function reject(Request $request, Disbursement $disbursement)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $this->disbursementService->rejectDisbursement($disbursement, $request->user(), $validated['reason']);

            return back()->with('success', 'Disbursement berhasil ditolak');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
