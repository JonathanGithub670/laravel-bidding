<?php

namespace App\Events;

use App\Models\Auction;
use App\Models\AuctionActivity;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ActivityPosted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public AuctionActivity $activity;

    /**
     * Create a new event instance.
     */
    public function __construct(AuctionActivity $activity)
    {
        $this->activity = $activity->load('user');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('auction.' . $this->activity->auction_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'ActivityPosted';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'activity' => [
                'id' => $this->activity->id,
                'auction_id' => $this->activity->auction_id,
                'type' => $this->activity->type,
                'content' => $this->activity->content,
                'user' => $this->activity->user ? [
                    'id' => $this->activity->user->id,
                    'name' => $this->activity->user->name,
                ] : null,
                'display_name' => $this->activity->display_name,
                'is_system' => $this->activity->is_system,
                'metadata' => $this->activity->metadata,
                'created_at' => $this->activity->created_at->toISOString(),
            ],
        ];
    }
}
