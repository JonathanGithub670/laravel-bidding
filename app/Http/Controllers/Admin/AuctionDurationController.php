<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuctionDuration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuctionDurationController extends Controller
{
    public function index(): Response
    {
        $durations = AuctionDuration::ordered()->get();

        return Inertia::render('admin/durations', [
            'durations' => $durations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hours' => 'required|integer|min:1|max:720',
            'label' => 'required|string|max:100',
        ]);

        // Auto sort_order: max + 1
        $maxSort = AuctionDuration::max('sort_order') ?? 0;

        AuctionDuration::create([
            'hours' => $validated['hours'],
            'label' => $validated['label'],
            'is_active' => true,
            'sort_order' => $maxSort + 1,
        ]);

        return redirect()->route('admin.durations.index')
            ->with('success', 'Durasi berhasil ditambahkan!');
    }

    public function destroy(AuctionDuration $duration)
    {
        $duration->delete();

        return redirect()->route('admin.durations.index')
            ->with('success', 'Durasi berhasil dihapus!');
    }
}
