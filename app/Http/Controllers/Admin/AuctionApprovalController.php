<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Auction;
use App\Models\BadgeRead;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuctionApprovalController extends Controller
{
    /**
     * Display pending auction submissions for approval.
     */
    public function index(): Response
    {
        // Mark admin pending auctions badge as read
        if ($user = auth()->user()) {
            BadgeRead::markRead($user->id, 'admin-pending-auctions');
        }

        $pendingAuctions = Auction::where('status', 'pending')
            ->with(['category', 'seller'])
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return Inertia::render('admin/auctions/pending', [
            'auctions' => $pendingAuctions,
        ]);
    }

    /**
     * Display approval history (approved and rejected auctions).
     */
    public function history(Request $request): Response
    {
        $statusFilter = $request->get('status', 'all');

        $query = Auction::whereIn('status', ['scheduled', 'live', 'ended', 'rejected'])
            ->with(['category', 'seller']);

        if ($statusFilter === 'approved') {
            $query->whereIn('status', ['scheduled', 'live', 'ended']);
        } elseif ($statusFilter === 'rejected') {
            $query->where('status', 'rejected');
        }

        $auctions = $query->orderByDesc('updated_at')->paginate(20);

        return Inertia::render('admin/auctions/history', [
            'auctions' => $auctions,
            'currentFilter' => $statusFilter,
        ]);
    }

    /**
     * Show a specific pending auction for review.
     */
    public function show(Auction $auction): Response|\Illuminate\Http\RedirectResponse
    {
        // Use raw DB status to avoid accessor override
        $rawStatus = $auction->getAttributes()['status'] ?? $auction->status;
        if ($rawStatus !== 'pending') {
            return redirect()->route('admin.auctions.pending')
                ->with('error', 'Lelang ini sudah diproses sebelumnya.');
        }

        $auction->load(['category', 'seller']);

        return Inertia::render('admin/auctions/review', [
            'auction' => $auction,
        ]);
    }

    /**
     * Approve an auction submission.
     */
    public function approve(Request $request, Auction $auction)
    {
        // Prevent double submission
        $rawStatus = $auction->getAttributes()['status'] ?? $auction->status;
        if ($rawStatus !== 'pending') {
            return redirect()->route('admin.auctions.pending')
                ->with('error', 'Lelang ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'starts_at' => 'required|date|after:now',
        ]);

        // Get the requested duration from metadata
        $durationHours = (int) ($auction->metadata['requested_duration_hours'] ?? 24);

        $startsAt = \Carbon\Carbon::parse($validated['starts_at']);
        $endsAt = $startsAt->copy()->addHours($durationHours);

        $auction->update([
            'status' => 'scheduled',
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'original_ends_at' => $endsAt,
            'metadata' => array_merge($auction->metadata ?? [], [
                'approved_by' => $request->user()->id,
                'approved_at' => now()->toISOString(),
            ]),
        ]);

        return redirect()->route('admin.auctions.pending')
            ->with('success', "Lelang '{$auction->title}' telah disetujui!");
    }

    /**
     * Reject an auction submission.
     */
    public function reject(Request $request, Auction $auction)
    {
        // Prevent double submission
        $rawStatus = $auction->getAttributes()['status'] ?? $auction->status;
        if ($rawStatus !== 'pending') {
            return redirect()->route('admin.auctions.pending')
                ->with('error', 'Lelang ini sudah diproses sebelumnya.');
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $auction->update([
            'status' => 'rejected',
            'metadata' => array_merge($auction->metadata ?? [], [
                'rejection_reason' => $validated['rejection_reason'],
                'rejected_by' => $request->user()->id,
                'rejected_at' => now()->toISOString(),
            ]),
        ]);

        return redirect()->route('admin.auctions.pending')
            ->with('success', "Lelang '{$auction->title}' telah ditolak.");
    }
}
