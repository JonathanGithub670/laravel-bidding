<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{id}', function ($user, $id) {
    \Illuminate\Support\Facades\Log::info("Channel auth attempt: User {$user->id} for Chat {$id}");
    $chat = \App\Models\Chat::find($id);

    if (!$chat) {
        \Illuminate\Support\Facades\Log::warning("Channel auth failed: Chat {$id} not found");
        return false;
    }

    $isParticipant = $chat->user_one_id == $user->id || $chat->user_two_id == $user->id;
    \Illuminate\Support\Facades\Log::info("Channel auth result for Chat {$id}: " . ($isParticipant ? 'Allowed' : 'Denied'));

    return $isParticipant;
});

// Auction presence channel - allows user info to be shared with other participants
Broadcast::channel('auction.{id}', function ($user, $id) {
    $auction = \App\Models\Auction::find($id);

    if (!$auction) {
        return false;
    }

    // Any authenticated user can join a live auction
    if ($auction->status !== 'live') {
        return false;
    }

    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});
