<?php

namespace App\Http\Middleware;

use App\Models\Auction;
use App\Models\AuctionCategory;
use App\Models\AuctionSettlement;
use App\Models\BadgeRead;
use App\Models\Chat;
use App\Models\Message;
use App\Models\Reimbursement;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Load role relationship if user exists
        if ($user) {
            $user->load('role');
        }

        // Get user badge counts for sidebar (only new items since last visit)
        $userBadges = null;
        if ($user) {
            // Get last-read timestamps for each page
            $chatReadAt = BadgeRead::getReadAt($user->id, 'chat');
            $myAuctionsReadAt = BadgeRead::getReadAt($user->id, 'my-auctions');
            $auctionsListReadAt = BadgeRead::getReadAt($user->id, 'auctions-list');

            // Count unread chat messages created after last visit
            $chatQuery = Message::where('sender_id', '!=', $user->id)
                ->where('is_read', false)
                ->whereIn('chat_id', Chat::where('user_one_id', $user->id)
                    ->orWhere('user_two_id', $user->id)
                    ->pluck('id'));
            if ($chatReadAt) {
                $chatQuery->where('created_at', '>', $chatReadAt);
            }
            $unreadChats = $chatQuery->count();

            // Count user's pending auction submissions created after last visit
            $myAuctionsQuery = Auction::where('seller_id', $user->id)
                ->where('status', 'pending');
            if ($myAuctionsReadAt) {
                $myAuctionsQuery->where('updated_at', '>', $myAuctionsReadAt);
            }
            $pendingMyAuctions = $myAuctionsQuery->count();

            // Count live auctions started after last visit
            $liveAuctionsQuery = Auction::where('status', 'live')
                ->where('ends_at', '>', now());
            if ($auctionsListReadAt) {
                $liveAuctionsQuery->where('updated_at', '>', $auctionsListReadAt);
            }
            $liveAuctions = $liveAuctionsQuery->count();

            $userBadges = [
                'unreadChats' => $unreadChats,
                'pendingMyAuctions' => $pendingMyAuctions,
                'liveAuctions' => $liveAuctions,
            ];
        }

        // Get admin badge counts if user is admin/superadmin
        $adminBadges = null;
        if ($user && $user->role && in_array($user->role->name, ['admin', 'superadmin'])) {
            $pendingAuctionsReadAt = BadgeRead::getReadAt($user->id, 'admin-pending-auctions');
            $categoriesReadAt = BadgeRead::getReadAt($user->id, 'admin-categories');
            $verificationReadAt = BadgeRead::getReadAt($user->id, 'admin-user-verification');

            // Pending auctions since last visit
            $pendingAuctionsQuery = Auction::where('status', 'pending');
            if ($pendingAuctionsReadAt) {
                $pendingAuctionsQuery->where('created_at', '>', $pendingAuctionsReadAt);
            }

            // New categories since last visit
            $categoriesQuery = AuctionCategory::query();
            if ($categoriesReadAt) {
                $categoriesQuery->where('created_at', '>', $categoriesReadAt);
            }

            // Pending verifications since last visit
            $verificationsQuery = User::where('verification_status', User::STATUS_PENDING);
            if ($verificationReadAt) {
                $verificationsQuery->where('created_at', '>', $verificationReadAt);
            }

            $adminBadges = [
                'pendingAuctions' => $pendingAuctionsQuery->count(),
                'pendingReimbursements' => Reimbursement::whereIn('status', ['pending', 'eligible'])->count(),
                'pendingSettlements' => AuctionSettlement::where('status', AuctionSettlement::STATUS_PENDING)->count(),
                'totalCategories' => $categoriesQuery->count(),
                'pendingVerifications' => $verificationsQuery->count(),
            ];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'userBadges' => $userBadges,
            'adminBadges' => $adminBadges,
            'unreadNotifications' => $user ? $user->unreadNotifications()->count() : 0,
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
