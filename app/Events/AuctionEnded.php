<?php

namespace App\Events;

use App\Models\Auction;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuctionEnded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Auction $auction;

    /**
     * Create a new event instance.
     */
    public function __construct(Auction $auction)
    {
        $this->auction = $auction->load(['winner', 'winningBid']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('auction.'.$this->auction->id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'AuctionEnded';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $winner = $this->auction->winner;
        $winningBid = $this->auction->winningBid;

        return [
            'auction_id' => $this->auction->id,
            'status' => 'ended',
            'final_price' => $this->auction->current_price,
            'formatted_final_price' => $this->auction->formatted_price,
            'total_bids' => $this->auction->total_bids,
            'winner' => $winner ? [
                'id' => $winner->id,
                'name' => substr($winner->name, 0, 3).'***',
            ] : null,
            'winning_bid' => $winningBid ? [
                'amount' => $winningBid->amount,
                'formatted_amount' => $winningBid->formatted_amount,
            ] : null,
            'ended_at' => now()->toISOString(),
        ];
    }
}
