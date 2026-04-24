<?php

namespace App\Http\Controllers;

use App\Events\ActivityPosted;
use App\Models\Auction;
use App\Models\AuctionActivity;
use Illuminate\Http\Request;

class AuctionActivityController extends Controller
{
    /**
     * Post a chat message to the auction War Room.
     */
    public function store(Request $request, Auction $auction)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        // Check if auction is live
        if (!$auction->is_live) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat mengirim pesan. Lelang tidak aktif.',
            ], 422);
        }

        // Create the activity
        $activity = AuctionActivity::create([
            'auction_id' => $auction->id,
            'user_id' => $request->user()->id,
            'type' => 'chat',
            'content' => $request->input('content'),
        ]);

        $activity->load('user:id,name');

        // Broadcast to other users
        broadcast(new ActivityPosted($activity))->toOthers();

        return response()->json([
            'success' => true,
            'activity' => [
                'id' => $activity->id,
                'type' => $activity->type,
                'content' => $activity->content,
                'display_name' => $activity->display_name,
                'is_system' => $activity->is_system,
                'created_at' => $activity->created_at->toISOString(),
            ],
        ]);
    }
}
