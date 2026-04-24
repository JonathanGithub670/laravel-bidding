<?php

namespace App\Events;

use App\Models\Auction;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AuctionTimeExtended implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Auction $auction;
    public int $extendedSeconds;

    /**
     * Create a new event instance.
     */
    public function __construct(Auction $auction, int $extendedSeconds = 15)
    {
        $this->auction = $auction;
        $this->extendedSeconds = $extendedSeconds;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('auction.' . $this->auction->id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'TimeExtended';
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
            'extended_seconds' => $this->extendedSeconds,
            'new_ends_at' => $this->auction->ends_at->toISOString(),
            'remaining_seconds' => $this->auction->remaining_seconds,
            'message' => "⏰ Waktu diperpanjang +{$this->extendedSeconds} detik!",
        ];
    }
}
