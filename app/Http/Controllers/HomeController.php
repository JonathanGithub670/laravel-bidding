<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionCategory;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Get ONLY live auctions (currently running)
        // Scheduled auctions will automatically become live when their start time is reached
        $liveAuctions = Auction::where('status', 'live')
            ->where('ends_at', '>', now())
            ->with(['category', 'seller'])
            ->orderBy('ends_at', 'asc')
            ->limit(8) // Increased from 4 since we're not showing scheduled separately
            ->get();

        // Format auctions for display
        $featuredAuctions = $liveAuctions
            ->map(function ($auction) {
                $remaining = $auction->ends_at ? $auction->ends_at->diffForHumans(null, true, true) : null;

                return [
                    'id' => $auction->id,
                    'uuid' => $auction->uuid,
                    'title' => $auction->title,
                    'category' => $auction->category ? [
                        'name' => $auction->category->name,
                        'icon' => $auction->category->icon,
                    ] : null,
                    'currentBid' => $auction->current_price,
                    'formattedPrice' => 'Rp ' . number_format($auction->current_price, 0, ',', '.'),
                    'image' => $auction->primary_image,
                    'timeLeft' => $remaining,
                    'startsAt' => $auction->starts_at?->toISOString(),
                    'endsAt' => $auction->ends_at?->toISOString(),
                    'totalBids' => $auction->total_bids,
                    'isLive' => true, // Always true since we only show live auctions
                    'status' => $auction->status,
                ];
            });

        // Get categories with auction counts
        $categories = AuctionCategory::withCount([
            'auctions' => function ($query) {
                $query->whereIn('status', ['live', 'scheduled']);
            }
        ])
            ->whereRaw('"is_active" = true')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'icon' => $category->icon,
                    'count' => $category->auctions_count,
                ];
            });

        // Stats
        $stats = [
            'activeAuctions' => Auction::whereIn('status', ['live', 'scheduled'])->count(),
            'totalUsers' => \App\Models\User::count(),
            'itemsSold' => Auction::where('status', 'ended')->whereNotNull('winner_id')->count(),
            'verifiedSellers' => Auction::distinct('seller_id')->count('seller_id'),
        ];

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'featuredAuctions' => $featuredAuctions,
            'categories' => $categories,
            'stats' => $stats,
        ]);
    }
}
