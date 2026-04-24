<?php

namespace App\Http\Controllers;

use App\Models\Reimbursement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserReimbursementController extends Controller
{
    /**
     * Display a listing of the user's reimbursements.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $status = $request->input('status', 'all');

        $query = Reimbursement::with(['auction', 'participant'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $reimbursements = $query->paginate(15)->withQueryString();

        // Get counts for each status
        $counts = [
            'all' => Reimbursement::where('user_id', $user->id)->count(),
            'pending' => Reimbursement::where('user_id', $user->id)->where('status', Reimbursement::STATUS_PENDING)->count(),
            'eligible' => Reimbursement::where('user_id', $user->id)->where('status', Reimbursement::STATUS_ELIGIBLE)->count(),
            'completed' => Reimbursement::where('user_id', $user->id)->where('status', Reimbursement::STATUS_COMPLETED)->count(),
            'rejected' => Reimbursement::where('user_id', $user->id)->where('status', Reimbursement::STATUS_REJECTED)->count(),
        ];

        return Inertia::render('user/reimbursements/index', [
            'reimbursements' => $reimbursements,
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }
}
