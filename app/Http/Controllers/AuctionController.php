<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionCategory;
use App\Models\AuctionDeposit;
use App\Models\AuctionParticipant;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use App\Models\AuctionView;
use App\Services\BiddingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AuctionController extends Controller
{
    protected BiddingService $biddingService;

    public function __construct(BiddingService $biddingService)
    {
        $this->biddingService = $biddingService;
    }

    /**
     * Display the auction room (live bidding page).
     */
    public function show(Request $request, Auction $auction): Response
    {
        $auction->load(['category', 'seller', 'winner']);
        $auction->loadCount(['bids', 'views']);

        // Record unique user view
        if ($request->user()) {
            AuctionView::recordView($auction->id, $request->user()->id);
            // Refresh the views count
            $auction->loadCount('views');
        }

        // Get recent bids
        $recentBids = $auction->bids()
            ->with('user:id,name')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        // Get recent activities for War Room
        $activities = $auction->activities()
            ->with('user:id,name')
            ->recent(50)
            ->get();

        // Get quick bid amounts
        $quickBids = $this->biddingService->getQuickBidAmounts($auction);

        return Inertia::render('auctions/show', [
            'auction' => [
                'id' => $auction->id,
                'uuid' => $auction->uuid,
                'title' => $auction->title,
                'description' => $auction->description,
                'images' => $auction->images ?? [],
                'primary_image' => $auction->primary_image,
                'starting_price' => $auction->starting_price,
                'current_price' => $auction->current_price,
                'formatted_price' => $auction->formatted_price,
                'bid_increment' => $auction->bid_increment,
                'next_min_bid' => $auction->next_min_bid,
                'starts_at' => $auction->starts_at?->toISOString(),
                'ends_at' => $auction->ends_at?->toISOString(),
                'remaining_seconds' => $auction->remaining_seconds,
                'status' => $auction->status,
                'is_live' => $auction->is_live,
                'is_extended' => $auction->is_extended,
                'total_bids' => $auction->total_bids,
                'view_count' => $auction->views_count,
                'category' => $auction->category,
                'seller' => [
                    'id' => $auction->seller->id,
                    'name' => $auction->seller->name,
                ],
                'winner' => $auction->winner ? [
                    'id' => $auction->winner->id,
                    'name' => substr($auction->winner->name, 0, 3) . '***',
                ] : null,
                'registration_fee' => $auction->registration_fee,
                'formatted_registration_fee' => $auction->formatted_registration_fee,
                'requires_registration' => $auction->requiresRegistration(),
                'is_user_registered' => $request->user() ? $auction->isUserRegistered($request->user()->id) : false,
                'participants_count' => $auction->participants()->active()->count(),
            ],
            'userBalance' => $request->user() ? [
                'amount' => (float) $request->user()->balance,
                'formatted' => 'Rp ' . number_format($request->user()->balance, 0, ',', '.'),
            ] : null,
            'userDeposit' => $request->user() ? (int) (AuctionDeposit::where('auction_id', $auction->id)
                ->where('user_id', $request->user()->id)
                ->value('amount') ?? 0) : 0,
            'recentBids' => $recentBids->map(fn($bid) => [
                'id' => $bid->id,
                'amount' => $bid->amount,
                'formatted_amount' => $bid->formatted_amount,
                'bidder_name' => $bid->anonymized_name,
                'bidder_id' => $bid->user_id,
                'is_winning' => $bid->is_winning,
                'created_at' => $bid->created_at->toISOString(),
            ]),
            'activities' => $activities->map(fn($activity) => [
                'id' => $activity->id,
                'type' => $activity->type,
                'content' => $activity->content,
                'display_name' => $activity->display_name,
                'is_system' => $activity->is_system,
                'created_at' => $activity->created_at->toISOString(),
            ]),
            'quickBids' => $quickBids,
        ]);
    }

    /**
     * Place a bid on an auction.
     */
    public function placeBid(Request $request, Auction $auction)
    {
        $request->validate([
            'amount' => 'required|integer|min:1',
        ]);

        try {
            $result = $this->biddingService->placeBid(
                $auction,
                $request->user(),
                $request->input('amount'),
                $request->ip()
            );

            $bid = $result['bid'];

            // Refresh user to get updated balance
            $request->user()->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Bid berhasil! Dipotong Rp ' . number_format($result['charge_amount'], 0, ',', '.'),
                'bid' => [
                    'id' => $bid->id,
                    'amount' => $bid->amount,
                    'formatted_amount' => $bid->formatted_amount,
                ],
                'new_balance' => (float) $request->user()->balance,
                'formatted_balance' => 'Rp ' . number_format($request->user()->balance, 0, ',', '.'),
                'charge_amount' => $result['charge_amount'],
                'deposit_amount' => $result['deposit_amount'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Register user as participant in auction.
     */
    public function register(Request $request, Auction $auction)
    {
        $user = $request->user();

        // Check if auction is live or scheduled
        if (!in_array($auction->status, ['live', 'scheduled'])) {
            return response()->json([
                'success' => false,
                'message' => 'Lelang ini tidak dapat didaftarkan.',
            ], 422);
        }

        // Check if already registered
        if ($auction->isUserRegistered($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah terdaftar di lelang ini.',
            ], 422);
        }

        // Check if seller is trying to register
        if ($auction->seller_id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Penjual tidak bisa mendaftar di lelang sendiri.',
            ], 422);
        }

        $registrationFee = $auction->registration_fee;

        // Check balance if registration fee > 0
        if ($registrationFee > 0) {
            if ($user->balance < $registrationFee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Saldo tidak cukup. Biaya pendaftaran: Rp ' . number_format($registrationFee, 0, ',', '.') . '. Saldo Anda: Rp ' . number_format($user->balance, 0, ',', '.'),
                    'required_balance' => $registrationFee,
                    'current_balance' => $user->balance,
                ], 422);
            }
        }

        try {
            DB::transaction(function () use ($user, $auction, $registrationFee) {
                // Deduct balance from user
                if ($registrationFee > 0) {
                    $user->decrement('balance', $registrationFee);

                    // Record expense transaction for user
                    Transaction::record(
                        $user->id,
                        Transaction::TYPE_REGISTRATION_FEE,
                        $registrationFee,
                        'Biaya pendaftaran lelang: ' . $auction->title,
                        $auction
                    );

                    // Transfer registration fee to superadmin's balance
                    $superadmin = User::whereHas('role', function ($query) {
                        $query->where('name', Role::SUPERADMIN);
                    })->first();

                    if ($superadmin) {
                        $superadmin->increment('balance', $registrationFee);

                        // Record income transaction for superadmin
                        Transaction::record(
                            $superadmin->id,
                            Transaction::TYPE_REGISTRATION_INCOME,
                            $registrationFee,
                            'Pendapatan pendaftaran lelang: ' . $auction->title . ' (dari ' . $user->name . ')',
                            $auction
                        );
                    }
                }

                // Create participant record
                AuctionParticipant::create([
                    'auction_id' => $auction->id,
                    'user_id' => $user->id,
                    'fee_paid' => $registrationFee,
                    'status' => 'active',
                    'registered_at' => now(),
                ]);
            });

            return response()->json([
                'success' => true,
                'message' => $registrationFee > 0
                    ? 'Berhasil mendaftar! Saldo Anda telah dikurangi Rp ' . number_format($registrationFee, 0, ',', '.')
                    : 'Berhasil mendaftar! Silakan mulai bidding.',
                'new_balance' => $user->fresh()->balance,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mendaftar: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new auction (for sellers).
     */
    public function create(): Response
    {
        $categories = AuctionCategory::active()->ordered()->get();

        return Inertia::render('auctions/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created auction.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:auction_categories,id',
            'starting_price' => 'required|integer|min:100000',
            'bid_increment' => 'required|integer|min:10000',
            'starts_at' => 'required|date|after:now',
            'ends_at' => 'required|date|after:starts_at',
            'images' => 'nullable|array',
            'images.*' => 'string|url',
        ]);

        $auction = Auction::create([
            ...$validated,
            'current_price' => $validated['starting_price'],
            'original_ends_at' => $validated['ends_at'],
            'seller_id' => $request->user()->id,
            'status' => 'scheduled',
        ]);

        return redirect()->route('auctions.show', $auction)
            ->with('success', 'Lelang berhasil dibuat!');
    }
}
