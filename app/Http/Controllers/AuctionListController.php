<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionCategory;
use App\Models\BadgeRead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AuctionListController extends Controller
{
    /**
     * Display all approved auctions with category filtering.
     */
    public function index(Request $request): Response
    {
        // Mark auctions-list badge as read
        if ($user = $request->user()) {
            BadgeRead::markRead($user->id, 'auctions-list');
        }

        $categorySlug = $request->get('category');
        $status = $request->get('status', 'all');

        // Build a real-time status expression for SQL-level filtering/sorting
        // The model accessor handles display, but SQL queries need this for WHERE/ORDER BY
        $now = now()->toDateTimeString();
        $realtimeStatusExpr = "CASE
            WHEN status = 'live' AND ends_at <= '{$now}' THEN 'ended'
            WHEN status = 'scheduled' AND starts_at <= '{$now}' THEN 'live'
            ELSE status
        END";

        // Query only approved auctions (scheduled, live, ended)
        // For ended auctions, only show if the logged-in user participated (registered or bid)
        $userId = $request->user()?->id;

        $query = Auction::whereIn('status', ['scheduled', 'live', 'ended'])
            ->with(['category', 'seller'])
            ->withCount(['bids', 'views']);

        // Filter ended auctions: only show if user participated
        if ($userId) {
            $query->where(function ($q) use ($realtimeStatusExpr, $userId) {
                // Show all non-ended auctions
                $q->whereRaw("({$realtimeStatusExpr}) != 'ended'")
                    // OR ended auctions where user is a participant or bidder
                    ->orWhere(function ($q2) use ($realtimeStatusExpr, $userId) {
                        $q2->whereRaw("({$realtimeStatusExpr}) = 'ended'")
                            ->where(function ($q3) use ($userId) {
                                $q3->whereHas('participants', function ($pq) use ($userId) {
                                    $pq->where('user_id', $userId);
                                })->orWhereHas('bids', function ($bq) use ($userId) {
                                    $bq->where('user_id', $userId);
                                });
                            });
                    });
            });
        } else {
            // Not logged in: only show live and scheduled
            $query->whereRaw("({$realtimeStatusExpr}) != 'ended'");
        }

        // Filter by category if provided
        if ($categorySlug) {
            $category = AuctionCategory::where('slug', $categorySlug)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        // Filter by real-time status if provided
        if ($status !== 'all') {
            $query->whereRaw("({$realtimeStatusExpr}) = ?", [$status]);
        }

        // Order by real-time status priority (live first, then scheduled, then ended)
        $query->orderByRaw("CASE ({$realtimeStatusExpr}) WHEN 'live' THEN 1 WHEN 'scheduled' THEN 2 WHEN 'ended' THEN 3 ELSE 4 END")
            ->orderBy('starts_at', 'desc');

        $auctions = $query->paginate(12)->withQueryString();

        // Get all active categories for the filter
        $categories = AuctionCategory::active()
            ->ordered()
            ->withCount([
                'auctions' => function ($query) {
                    $query->whereIn('status', ['scheduled', 'live', 'ended']);
                }
            ])
            ->get();

        return Inertia::render('auctions/list', [
            'auctions' => $auctions,
            'categories' => $categories,
            'currentCategory' => $categorySlug,
            'currentStatus' => $status,
        ]);
    }
}
