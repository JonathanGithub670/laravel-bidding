import { Send, Gavel, MessageCircle, Users, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Activity {
    id: number;
    type: 'bid' | 'chat' | 'system' | 'join' | 'leave';
    content: string;
    display_name: string;
    is_system: boolean;
    created_at: string;
}

interface WarRoomProps {
    activities: Activity[];
    onSendMessage: (content: string) => Promise<void>;
    disabled?: boolean;
}

export default function WarRoom({
    activities,
    onSendMessage,
    disabled = false,
}: WarRoomProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new activity arrives
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activities]);

    const handleSend = async () => {
        if (!message.trim() || isSending) return;

        setIsSending(true);
        try {
            await onSendMessage(message.trim());
            setMessage('');
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Calculate bid stats
    const bidActivities = activities.filter((a) => a.type === 'bid');
    const uniqueBidders = new Set(bidActivities.map((a) => a.display_name))
        .size;

    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl dark:from-slate-950 dark:to-slate-900">
            {/* Header - YouTube Style */}
            <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                Live Chat
                            </h3>
                            <p className="text-xs text-white/90">
                                Real-time auction activity
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/90">
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            <span>{uniqueBidders || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gavel className="h-4 w-4" />
                            <span>{bidActivities.length}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-white/20 px-2.5 py-1">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                            </span>
                            <span className="text-xs font-medium">LIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area - YouTube Live Chat Style */}
            <div className="max-h-[400px] min-h-[300px] flex-1 space-y-1 overflow-y-auto bg-slate-800/50 p-3 dark:bg-slate-900/50">
                {activities.length === 0 ? (
                    <div className="py-16 text-center">
                        <MessageCircle className="mx-auto mb-3 h-12 w-12 text-slate-500" />
                        <p className="text-sm text-slate-400">
                            Belum ada aktivitas
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Jadilah yang pertama!
                        </p>
                    </div>
                ) : (
                    <>
                        {[...activities].reverse().map((activity) => (
                            <div
                                key={activity.id}
                                className={`group rounded-lg px-3 py-1.5 transition-colors duration-150 ${
                                    activity.type === 'bid'
                                        ? 'hover:bg-amber-500/10'
                                        : activity.type === 'system'
                                          ? 'hover:bg-blue-500/10'
                                          : 'hover:bg-slate-700/50'
                                } `}
                            >
                                <div className="flex items-start gap-2">
                                    {/* Time (YouTube style - before message) */}
                                    <span className="mt-0.5 flex-shrink-0 text-[10px] text-slate-400">
                                        {formatTime(activity.created_at)}
                                    </span>

                                    {/* Message Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            {/* User Name with Badge */}
                                            {activity.type === 'bid' ? (
                                                <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                                                    <Gavel className="h-3 w-3" />
                                                    {activity.display_name}
                                                </span>
                                            ) : activity.type === 'system' ? (
                                                <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">
                                                    SYSTEM
                                                </span>
                                            ) : (
                                                <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                                                    <Users className="h-3 w-3" />
                                                    {activity.display_name}
                                                </span>
                                            )}

                                            {/* Message */}
                                            <span
                                                className={`text-sm break-words ${
                                                    activity.type === 'bid'
                                                        ? 'font-medium text-amber-200'
                                                        : activity.type ===
                                                            'system'
                                                          ? 'text-blue-200 italic'
                                                          : 'text-slate-200'
                                                } `}
                                            >
                                                {activity.content}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Chat Input - YouTube Style */}
            <div className="border-t border-slate-700 bg-slate-800 p-4 dark:bg-slate-900">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            disabled ? 'Login to chat...' : 'Say something...'
                        }
                        disabled={disabled || isSending}
                        maxLength={200}
                        className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <button
                        onClick={handleSend}
                        disabled={disabled || isSending || !message.trim()}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:from-red-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                <span>Send</span>
                            </>
                        )}
                    </button>
                </div>
                {message.length > 0 && (
                    <p className="mt-2 text-right text-xs text-slate-500">
                        {message.length}/200
                    </p>
                )}
            </div>
        </div>
    );
}
