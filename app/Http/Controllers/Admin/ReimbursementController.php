<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reimbursement;
use App\Services\ReimbursementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReimbursementController extends Controller
{
    public function __construct(
        protected ReimbursementService $reimbursementService
    ) {
    }

    /**
     * Display a listing of all reimbursements for admin.
     */
    public function index(Request $request): Response
    {
        // First, mark any newly eligible reimbursements
        $this->reimbursementService->markEligible();

        $status = $request->input('status', 'all');

        $query = Reimbursement::with(['user', 'auction', 'participant', 'processedByUser'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $reimbursements = $query->paginate(15)->withQueryString();

        // Get counts for each status
        $counts = [
            'all' => Reimbursement::count(),
            'pending' => Reimbursement::where('status', Reimbursement::STATUS_PENDING)->count(),
            'eligible' => Reimbursement::where('status', Reimbursement::STATUS_ELIGIBLE)->count(),
            'completed' => Reimbursement::where('status', Reimbursement::STATUS_COMPLETED)->count(),
            'rejected' => Reimbursement::where('status', Reimbursement::STATUS_REJECTED)->count(),
        ];

        return Inertia::render('admin/reimbursements/index', [
            'reimbursements' => $reimbursements,
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Approve a reimbursement request.
     */
    public function approve(Request $request, Reimbursement $reimbursement)
    {
        try {
            $this->reimbursementService->approve($reimbursement, $request->user());
            return back()->with('success', 'Reimbursement berhasil disetujui. Dana telah dikembalikan ke saldo user.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Reject a reimbursement request.
     */
    public function reject(Request $request, Reimbursement $reimbursement)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $this->reimbursementService->reject($reimbursement, $request->user(), $validated['reason']);
            return back()->with('success', 'Reimbursement berhasil ditolak.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
