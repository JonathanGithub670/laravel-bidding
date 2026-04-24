<?php

namespace App\Events;

use App\Models\Auction;
use App\Models\Bid;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BidPlaced implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Auction $auction;

    public Bid $bid;

    /**
     * Create a new event instance.
     */
    public function __construct(Auction $auction, Bid $bid)
    {
        $this->auction = $auction;
        $this->bid = $bid;
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
        return 'BidPlaced';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'auction_id' => $this->auction->id,
            'bid' => [
                'id' => $this->bid->id,
                'amount' => $this->bid->amount,
                'formatted_amount' => $this->bid->formatted_amount,
                'bidder_name' => $this->bid->anonymized_name,
                'bidder_id' => $this->bid->user_id,
                'is_auto_bid' => $this->bid->is_auto_bid,
                'created_at' => $this->bid->created_at->toISOString(),
            ],
            'auction' => [
                'current_price' => $this->auction->current_price,
                'formatted_price' => $this->auction->formatted_price,
                'next_min_bid' => $this->auction->next_min_bid,
                'total_bids' => $this->auction->total_bids,
                'ends_at' => $this->auction->ends_at->toISOString(),
                'remaining_seconds' => $this->auction->remaining_seconds,
                'is_extended' => $this->auction->is_extended,
            ],
        ];
    }
}
