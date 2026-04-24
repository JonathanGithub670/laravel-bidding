import { Head, router, usePage } from '@inertiajs/react';
import { MessageSquare, Send, Search, MoreVertical, UserPlus, Copy, Check, Hash, Shield, ShieldCheck, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { type SharedData } from '@/types';

type ChatUser = {
    id: number;
    name: string;
    email: string;
    pin?: string;
    is_online?: boolean; 
};

type ChatItem = {
    id: number;
    user: ChatUser;
    lastMessage: {
        content: string;
        time: string;
        date: string;
    } | null;
    unreadCount: number;
};

type Message = {
    id: number;
    content: string;
    time: string;
    isMine: boolean;
    sender: {
        id: number;
        name: string;
    };
    // Allow optional handling if backend structure varies lightly
    [key: string]: any;
};

type AdminUser = {
    id: number;
    name: string;
    role: string;
    role_display: string;
    is_online?: boolean;
};

type Props = {
    chats: ChatItem[];
    currentUserPin: string;
    adminUsers: AdminUser[];
    selectedChatId?: number | null;
};

const OnlineIndicator = ({ isOnline }: { isOnline?: boolean }) => (
    <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-gray-900 z-10 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
);

export default function Chat({ chats, currentUserPin, adminUsers, selectedChatId }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [chatList, setChatList] = useState<ChatItem[]>(chats);
    const [selectedChat, setSelectedChat] = useState<ChatItem | null>(() => {
        if (selectedChatId) {
            const found = chats.find(c => c.id === selectedChatId);
            if (found) return found;
        }
        return chats[0] || null;
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
    const [pinSearch, setPinSearch] = useState('');
    const [pinSearchResult, setPinSearchResult] = useState<ChatUser | null>(null);
    const [pinSearchError, setPinSearchError] = useState('');
    const [isSearchingPin, setIsSearchingPin] = useState(false);
    const [copiedPin, setCopiedPin] = useState(false);
    const [isStartingAdminChat, setIsStartingAdminChat] = useState<number | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const deleteChat = async () => {
        if (!selectedChat || isDeleting) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`/chat/${selectedChat.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
            });
            if (response.ok) {
                // Remove from sidebar
                const updatedChats = chatList.filter(c => c.id !== selectedChat.id);
                setChatList(updatedChats);
                // Leave the Echo channel
                (window as any).Echo.leave(`chat.${selectedChat.id}`);
                // Select next chat or null
                setSelectedChat(updatedChats[0] || null);
                setMessages([]);
            }
        } catch (error) {
            console.error('Failed to delete chat:', error);
        } finally {
            setIsDeleting(false);
            setDeleteConfirmOpen(false);
            setMenuOpen(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedChat) {
            const channel = (window as any).Echo.private(`chat.${selectedChat.id}`);
            
            channel.listen('.MessageSent', (e: { message: Message }) => {
                // Skip if this message is from the current user based on sender ID
                // This prevents the "ghost" message on the left because broadcast events 
                // typically have isMine: false hardcoded or relative to receiver
                if (e.message.sender.id === auth.user.id) {
                    return;
                }
                
                // Check if message already exists to prevent duplicates
                setMessages((prevMessages) => {
                    const exists = prevMessages.some(m => m.id === e.message.id);
                    if (exists) {
                        return prevMessages;
                    }
                    return [...prevMessages, e.message];
                });
                
                // Update last message in chat list
                setChatList((prevChats) => prevChats.map(chat => {
                    if (chat.id === selectedChat.id) {
                        return {
                            ...chat,
                            lastMessage: {
                                content: e.message.content,
                                time: e.message.time,
                                date: e.message.time
                            }
                        };
                    }
                    return chat;
                }));
            });

            return () => {
                channel.stopListening('.MessageSent');
            };
        }
    }, [selectedChat, auth.user.id]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
             if (selectedChat) {
                 (window as any).Echo.leave(`chat.${selectedChat.id}`);
             }
        };
    }, []);

    // Subscribe to all chat channels for unread notifications
    useEffect(() => {
        const channels: any[] = [];
        
        chatList.forEach((chat) => {
            // Skip the currently selected chat (already handled above)
            if (selectedChat?.id === chat.id) return;
            
            const channel = (window as any).Echo.private(`chat.${chat.id}`);
            channels.push({ id: chat.id, channel });
            
            channel.listen('.MessageSent', (e: { message: Message }) => {
                // Increment unread count for this chat
                setChatList((prevChats) => prevChats.map(c => {
                    if (c.id === chat.id) {
                        return {
                            ...c,
                            unreadCount: c.unreadCount + 1,
                            lastMessage: {
                                content: e.message.content,
                                time: e.message.time,
                                date: e.message.time
                            }
                        };
                    }
                    return c;
                }));
            });
        });

        return () => {
            channels.forEach(({ id, channel }) => {
                if (selectedChat?.id !== id) {
                    channel.stopListening('.MessageSent');
                }
            });
        };
    }, [chatList.length, selectedChat?.id]);

    // Function to select chat and reset unread count
    const handleSelectChat = (chatItem: ChatItem) => {
        // Reset unread count for the selected chat
        setChatList((prevChats) => prevChats.map(chat => {
            if (chat.id === chatItem.id) {
                return { ...chat, unreadCount: 0 };
            }
            return chat;
        }));
        setSelectedChat(chatItem);
    };

    const loadMessages = async (chatId: number) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/chat/${chatId}/messages`);
            const data = await response.json();
            setMessages(data.messages);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedChat) {
            loadMessages(selectedChat.id);
        }
    }, [selectedChat]);

    const sendMessage = async () => {
        if (!messageInput.trim() || !selectedChat) return;

        const content = messageInput;
        setMessageInput('');

        try {
            const response = await fetch(`/chat/${selectedChat.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages([...messages, data.message]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessageInput(content); // Restore message if failed
        }
    };

    const searchUserByPin = async () => {
        if (pinSearch.length !== 6) {
            setPinSearchError('PIN must be 6 digits');
            return;
        }

        setIsSearchingPin(true);
        setPinSearchError('');
        setPinSearchResult(null);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/chat/search-by-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ pin: pinSearch }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setPinSearchResult(data.user);
            } else {
                setPinSearchError(data.message || 'User not found with this PIN');
            }
        } catch (error) {
            console.error('Search error:', error);
            setPinSearchError('Failed to search user. Please try again.');
        } finally {
            setIsSearchingPin(false);
        }
    };

    const startNewChat = async (userId: number) => {
        try {
            const response = await fetch('/chat/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ user_id: userId }),
            });

            if (response.ok) {
                setNewChatDialogOpen(false);
                setPinSearch('');
                setPinSearchResult(null);
                setPinSearchError('');
                router.reload();
            }
        } catch (error) {
            console.error('Failed to create chat:', error);
        }
    };

    const copyPinToClipboard = () => {
        navigator.clipboard.writeText(currentUserPin);
        setCopiedPin(true);
        setTimeout(() => setCopiedPin(false), 2000);
    };

    const handlePinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setPinSearch(value);
        setPinSearchError('');
        setPinSearchResult(null);
    };

    const filteredChats = chatList.filter((chat) =>
        chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.user.pin?.includes(searchQuery)
    );

    const startAdminChat = async (adminUserId: number) => {
        setIsStartingAdminChat(adminUserId);
        try {
            const response = await fetch('/chat/start-admin-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ admin_user_id: adminUserId }),
            });

            if (response.ok) {
                const data = await response.json();
                router.visit('/chat');
            }
        } catch (error) {
            console.error('Failed to start admin chat:', error);
        } finally {
            setIsStartingAdminChat(null);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <AppLayout>
            <Head title="Chat" />
            <div className="flex h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                {/* Sidebar - Contact List */}
                <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
                    {/* Search Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-6 w-6 text-brand-500" />
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Messages</h2>
                            </div>
                            <Dialog open={newChatDialogOpen} onOpenChange={(open) => {
                                setNewChatDialogOpen(open);
                                if (!open) {
                                    setPinSearch('');
                                    setPinSearchResult(null);
                                    setPinSearchError('');
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <UserPlus className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-gray-800 dark:text-white">Start New Chat</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {/* PIN Search Section */}
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Search user by their 6-digit PIN
                                            </p>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        placeholder="Enter 6-digit PIN"
                                                        value={pinSearch}
                                                        onChange={handlePinInputChange}
                                                        className="pl-9 font-mono tracking-widest text-center text-lg"
                                                        maxLength={6}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={searchUserByPin}
                                                    disabled={pinSearch.length !== 6 || isSearchingPin}
                                                    className="bg-brand-500 hover:bg-brand-600"
                                                >
                                                    {isSearchingPin ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    ) : (
                                                        <Search className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                            
                                            {/* Error Message */}
                                            {pinSearchError && (
                                                <p className="text-sm text-error-500">{pinSearchError}</p>
                                            )}

                                            {/* Search Result */}
                                            {pinSearchResult && (
                                                <div
                                                    onClick={() => startNewChat(pinSearchResult.id)}
                                                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-brand-500 bg-brand-50 dark:bg-brand-500/10 cursor-pointer hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                                                >
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarFallback className="bg-brand-500 text-white text-lg">
                                                            {getInitials(pinSearchResult.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-800 dark:text-white">{pinSearchResult.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{pinSearchResult.email}</p>
                                                        <p className="text-xs font-mono text-brand-500 mt-1">PIN: {pinSearchResult.pin}</p>
                                                    </div>
                                                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Click to chat</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Divider */}
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Your PIN</span>
                                            </div>
                                        </div>

                                        {/* Your PIN Info */}
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Share your PIN to receive chat requests</p>
                                                <p className="text-2xl font-mono font-bold text-gray-800 dark:text-white tracking-widest mt-1">
                                                    {currentUserPin}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={copyPinToClipboard}
                                                className="h-10 w-10"
                                            >
                                                {copiedPin ? (
                                                    <Check className="h-4 w-4 text-success-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        
                        {/* Your PIN Badge */}
                        <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-800">
                            <Hash className="h-4 w-4 text-brand-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Your PIN:</span>
                            <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">{currentUserPin}</span>
                            <button
                                onClick={copyPinToClipboard}
                                className="ml-auto p-1 hover:bg-brand-100 dark:hover:bg-brand-500/20 rounded transition-colors"
                            >
                                {copiedPin ? (
                                    <Check className="h-3.5 w-3.5 text-success-500" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5 text-brand-500" />
                                )}
                            </button>
                        </div>

                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search by name or PIN..."
                                className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Admin Quick Chat Buttons */}
                        {adminUsers && adminUsers.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {adminUsers.map((admin) => (
                                    <button
                                        key={admin.id}
                                        onClick={() => startAdminChat(admin.id)}
                                        disabled={isStartingAdminChat === admin.id}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left ${
                                            admin.role === 'superadmin'
                                                ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-500/20 dark:hover:to-orange-500/20'
                                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-500/20 dark:hover:to-indigo-500/20'
                                        }`}
                                    >
                                        <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${
                                            admin.role === 'superadmin'
                                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                                : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                        }`}>
                                            {admin.role === 'superadmin' ? (
                                                <ShieldCheck className="h-4 w-4" />
                                            ) : (
                                                <Shield className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${
                                                admin.role === 'superadmin'
                                                    ? 'text-amber-700 dark:text-amber-300'
                                                    : 'text-blue-700 dark:text-blue-300'
                                            }`}>
                                                Chat {admin.role_display}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{admin.name}</p>
                                        </div>
                                        {isStartingAdminChat === admin.id ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            <MessageSquare className={`h-4 w-4 ${
                                                admin.role === 'superadmin'
                                                    ? 'text-amber-500'
                                                    : 'text-blue-500'
                                            }`} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact List */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-2">
                            {filteredChats.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No conversations yet</p>
                                    <p className="text-sm">Search by PIN to start a new chat</p>
                                </div>
                            ) : (
                                filteredChats.map((chatItem) => (
                                    <div
                                        key={chatItem.id}
                                        onClick={() => handleSelectChat(chatItem)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                                            selectedChat?.id === chatItem.id
                                                ? 'bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-800'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarFallback className="bg-brand-500 text-white">
                                                    {getInitials(chatItem.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <OnlineIndicator isOnline={chatItem.user.is_online} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-800 dark:text-white truncate">{chatItem.user.name}</span>
                                                {chatItem.lastMessage && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {chatItem.lastMessage.time}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
                                                    {chatItem.lastMessage?.content || 'No messages yet'}
                                                </p>
                                                {chatItem.user.pin && (
                                                    <span className="text-xs font-mono text-brand-500">#{chatItem.user.pin}</span>
                                                )}
                                            </div>
                                        </div>
                                        {chatItem.unreadCount > 0 && (
                                            <span className="flex items-center justify-center h-5 w-5 text-xs font-medium rounded-full bg-brand-500 text-white">
                                                {chatItem.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900/50">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-11 w-11">
                                            <AvatarFallback className="bg-brand-500 text-white">
                                                {getInitials(selectedChat.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <OnlineIndicator isOnline={selectedChat.user.is_online} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                                            {selectedChat.user.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {selectedChat.user.pin && (
                                                <span className="font-mono text-brand-500">PIN: {selectedChat.user.pin}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative" ref={menuRef}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-500 dark:text-gray-400"
                                        onClick={() => setMenuOpen(!menuOpen)}
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>

                                    {/* Dropdown Menu */}
                                    {menuOpen && (
                                        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            <button
                                                onClick={() => {
                                                    setDeleteConfirmOpen(true);
                                                    setMenuOpen(false);
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Hapus Chat
                                            </button>
                                        </div>
                                    )}

                                    {/* Delete Confirmation Dialog */}
                                    {deleteConfirmOpen && (
                                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                            <div className="mx-4 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 dark:bg-red-500/20">
                                                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hapus Chat</h3>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                                    Apakah Anda yakin ingin menghapus seluruh chat dengan <strong>{selectedChat?.user.name}</strong>? Semua pesan akan dihapus permanen.
                                                </p>
                                                <div className="flex gap-3 justify-end">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setDeleteConfirmOpen(false)}
                                                        disabled={isDeleting}
                                                        className="rounded-lg"
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        onClick={deleteChat}
                                                        disabled={isDeleting}
                                                        className="rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        {isDeleting ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                        ) : (
                                                            'Hapus'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                        <div className="text-center">
                                            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No messages yet</p>
                                            <p className="text-sm">Send a message to start the conversation</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                                        message.isMine
                                                            ? 'bg-brand-500 text-white rounded-br-md'
                                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-md shadow-sm'
                                                    }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${
                                                            message.isMine
                                                                ? 'text-white/70'
                                                                : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        {message.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <Button
                                        size="icon"
                                        className="bg-brand-500 hover:bg-brand-600 h-10 w-10"
                                        onClick={sendMessage}
                                        disabled={!messageInput.trim()}
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                            <div className="text-center">
                                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-1 text-gray-800 dark:text-white">Welcome to Chat</h3>
                                <p>Select a conversation or search by PIN to start a new chat</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
