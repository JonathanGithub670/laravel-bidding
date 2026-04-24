<?php

namespace App\Http\Controllers;

use App\Models\BadgeRead;
use App\Models\Chat;
use App\Models\Message;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = auth()->user();

        // Mark chat badge as read
        BadgeRead::markRead($user->id, 'chat');

        $chats = Chat::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->with(['userOne', 'userTwo', 'latestMessage'])
            ->get()
            ->map(function ($chat) use ($user) {
                $otherUser = $chat->getOtherUser($user->id);

                return [
                    'id' => $chat->id,
                    'user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                        'pin' => $otherUser->pin,
                        'is_online' => $otherUser->is_online,
                    ],
                    'lastMessage' => $chat->latestMessage ? [
                        'content' => $chat->latestMessage->content,
                        'time' => $chat->latestMessage->created_at->format('H:i'),
                        'date' => $chat->latestMessage->created_at->format('Y-m-d'),
                    ] : null,
                    'unreadCount' => $chat->unreadMessagesCount($user->id),
                ];
            });

        // Include current user's PIN
        $currentUserPin = $user->pin;

        // Get admin/superadmin users for quick chat buttons
        $adminUsers = [];
        $isCurrentUserAdmin = $user->hasRole([Role::SUPERADMIN, Role::ADMIN]);

        if (! $isCurrentUserAdmin) {
            $adminRoles = Role::whereIn('name', [Role::SUPERADMIN, Role::ADMIN])->pluck('id');
            $adminUsers = User::whereIn('role_id', $adminRoles)
                ->where('id', '!=', $user->id)
                ->get()
                ->map(function ($adminUser) {
                    return [
                        'id' => $adminUser->id,
                        'name' => $adminUser->name,
                        'role' => $adminUser->role?->name,
                        'role_display' => $adminUser->role?->name === Role::SUPERADMIN ? 'Super Admin' : 'Admin',
                        'is_online' => $adminUser->is_online,
                    ];
                })
                ->values()
                ->toArray();
        }

        return Inertia::render('chat', [
            'chats' => $chats,
            'currentUserPin' => $currentUserPin,
            'adminUsers' => $adminUsers,
            'selectedChatId' => session('selected_chat_id'),
        ]);
    }

    /**
     * Search user by PIN.
     */
    public function searchByPin(Request $request)
    {
        $request->validate([
            'pin' => 'required|string|size:6',
        ]);

        /** @var User $currentUser */
        $currentUser = auth()->user();

        $foundUser = User::where('pin', $request->pin)
            ->where('id', '!=', $currentUser->id)
            ->first();

        if (! $foundUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found with this PIN',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $foundUser->id,
                'name' => $foundUser->name,
                'email' => $foundUser->email,
                'pin' => $foundUser->pin,
                'is_online' => $foundUser->is_online,
            ],
        ]);
    }

    public function getMessages(Chat $chat)
    {
        /** @var User $user */
        $user = auth()->user();

        // Verify user is part of this chat
        if ($chat->user_one_id !== $user->id && $chat->user_two_id !== $user->id) {
            abort(403);
        }

        // Mark messages as read
        $chat->messages()
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        $messages = $chat->messages()
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) use ($user) {
                return [
                    'id' => $message->id,
                    'content' => $message->content,
                    'time' => $message->created_at->format('H:i'),
                    'isMine' => $message->sender_id === $user->id,
                    'sender' => [
                        'id' => $message->sender->id,
                        'name' => $message->sender->name,
                    ],
                ];
            });

        return response()->json([
            'messages' => $messages,
        ]);
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        /** @var User $user */
        $user = auth()->user();

        // Verify user is part of this chat
        if ($chat->user_one_id !== $user->id && $chat->user_two_id !== $user->id) {
            abort(403);
        }

        $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $message = Message::create([
            'chat_id' => $chat->id,
            'sender_id' => $user->id,
            'content' => $request->input('content'),
        ]);

        \App\Events\MessageSent::dispatch($message);

        return response()->json([
            'message' => [
                'id' => $message->id,
                'content' => $message->content,
                'time' => $message->created_at->format('H:i'),
                'isMine' => true,
                'sender' => [
                    'id' => $user->id,
                    'name' => $user->name,
                ],
            ],
        ]);
    }

    public function createChat(Request $request)
    {
        /** @var User $user */
        $user = auth()->user();

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $otherUserId = $request->user_id;

        // Prevent creating chat with self
        if ($otherUserId == $user->id) {
            return response()->json([
                'error' => 'Cannot create chat with yourself',
            ], 400);
        }

        // Check if chat already exists
        $existingChat = Chat::where(function ($query) use ($user, $otherUserId) {
            $query->where('user_one_id', $user->id)
                ->where('user_two_id', $otherUserId);
        })->orWhere(function ($query) use ($user, $otherUserId) {
            $query->where('user_one_id', $otherUserId)
                ->where('user_two_id', $user->id);
        })->first();

        if ($existingChat) {
            return response()->json(['chat_id' => $existingChat->id]);
        }

        // Create new chat
        $chat = Chat::create([
            'user_one_id' => $user->id,
            'user_two_id' => $otherUserId,
        ]);

        return response()->json(['chat_id' => $chat->id]);
    }

    /**
     * Start a chat with admin or superadmin.
     */
    public function startAdminChat(Request $request)
    {
        /** @var User $user */
        $user = auth()->user();

        $request->validate([
            'admin_user_id' => 'required|exists:users,id',
        ]);

        $adminUser = User::findOrFail($request->admin_user_id);

        // Verify the target user is actually an admin or superadmin
        if (! $adminUser->hasRole([Role::SUPERADMIN, Role::ADMIN])) {
            return response()->json(['error' => 'Target user is not an admin'], 400);
        }

        // Prevent chatting with self
        if ($adminUser->id === $user->id) {
            return response()->json(['error' => 'Cannot chat with yourself'], 400);
        }

        // Check if chat already exists
        $existingChat = Chat::where(function ($query) use ($user, $adminUser) {
            $query->where('user_one_id', $user->id)
                ->where('user_two_id', $adminUser->id);
        })->orWhere(function ($query) use ($user, $adminUser) {
            $query->where('user_one_id', $adminUser->id)
                ->where('user_two_id', $user->id);
        })->first();

        if ($existingChat) {
            session()->flash('selected_chat_id', $existingChat->id);

            return response()->json([
                'success' => true,
                'chat_id' => $existingChat->id,
            ]);
        }

        // Create new chat
        $chat = Chat::create([
            'user_one_id' => $user->id,
            'user_two_id' => $adminUser->id,
        ]);

        session()->flash('selected_chat_id', $chat->id);

        return response()->json([
            'success' => true,
            'chat_id' => $chat->id,
        ]);
    }

    /**
     * Delete a chat and all its messages.
     */
    public function destroy(Chat $chat)
    {
        /** @var User $user */
        $user = auth()->user();

        // Verify user is part of this chat
        if ($chat->user_one_id !== $user->id && $chat->user_two_id !== $user->id) {
            abort(403);
        }

        // Delete all messages first
        $chat->messages()->delete();

        // Delete the chat
        $chat->delete();

        return response()->json(['success' => true]);
    }
}
