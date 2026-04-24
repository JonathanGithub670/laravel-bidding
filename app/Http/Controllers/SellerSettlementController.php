<?php

namespace App\Http\Controllers;

use App\Models\AuctionSettlement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SellerSettlementController extends Controller
{
    /**
     * Display seller's sold items and their settlement status.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $settlements = AuctionSettlement::where('seller_id', $user->id)
            ->with(['auction', 'winner'])
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Append formatted attributes
        $settlements->getCollection()->transform(function ($settlement) {
            $settlement->append(['status_badge', 'fund_status_badge', 'delivery_status_badge', 'formatted_amount', 'formatted_admin_fee', 'formatted_seller_amount']);

            return $settlement;
        });

        // Get counts for stats
        $counts = [
            'total' => AuctionSettlement::where('seller_id', $user->id)->count(),
            'pending' => AuctionSettlement::where('seller_id', $user->id)->where('status', AuctionSettlement::STATUS_PENDING)->count(),
            'shipping' => AuctionSettlement::where('seller_id', $user->id)->where('delivery_status', AuctionSettlement::DELIVERY_SHIPPING)->count(),
            'completed' => AuctionSettlement::where('seller_id', $user->id)->where('status', AuctionSettlement::STATUS_COMPLETED)->count(),
        ];

        return Inertia::render('my-auctions/settlements', [
            'settlements' => $settlements,
            'counts' => $counts,
        ]);
    }

    /**
     * Seller confirms that item has been shipped.
     */
    public function confirmShipping(Request $request, AuctionSettlement $settlement): RedirectResponse
    {
        $user = $request->user();

        // Ensure the seller owns this settlement
        if ($settlement->seller_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke settlement ini.');
        }

        // Check if shipping can be confirmed
        if (! $settlement->canSellerConfirmShipping()) {
            return back()->with('error', 'Pengiriman tidak dapat dikonfirmasi pada status ini.');
        }

        $settlement->update([
            'delivery_status' => AuctionSettlement::DELIVERY_SHIPPING,
        ]);

        return back()->with('success', 'Pengiriman berhasil dikonfirmasi! Barang sedang dalam perjalanan.');
    }
}
