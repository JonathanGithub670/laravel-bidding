import { useState, useEffect, useRef } from 'react';
import { Send, Gavel, MessageCircle, Users, TrendingUp } from 'lucide-react';

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

export default function WarRoom({ activities, onSendMessage, disabled = false }: WarRoomProps) {
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
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const getMessageBadge = (type: string) => {
        switch (type) {
            case 'bid':
                return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-500 text-white">
                    <Gavel className="w-3 h-3" />
                    BID
                </span>;
            case 'system':
                return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-500 text-white">
                    SYSTEM
                </span>;
            default:
                return null;
        }
    };

    // Calculate bid stats
    const bidActivities = activities.filter(a => a.type === 'bid');
    const uniqueBidders = new Set(bidActivities.map(a => a.display_name)).size;

    return (
        <div className="flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Header - YouTube Style */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Live Chat</h3>
                            <p className="text-white/90 text-xs">Real-time auction activity</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{uniqueBidders || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Gavel className="w-4 h-4" />
                            <span>{bidActivities.length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-xs font-medium">LIVE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area - YouTube Live Chat Style */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 min-h-[300px] max-h-[400px] bg-slate-800/50 dark:bg-slate-900/50">
                {activities.length === 0 ? (
                    <div className="text-center py-16">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                        <p className="text-slate-400 text-sm">Belum ada aktivitas</p>
                        <p className="text-slate-500 text-xs mt-1">Jadilah yang pertama!</p>
                    </div>
                ) : (
                    <>
                        {[...activities].reverse().map((activity) => (
                            <div
                                key={activity.id}
                                className={`
                                    group py-1.5 px-3 rounded-lg transition-colors duration-150
                                    ${activity.type === 'bid' 
                                        ? 'hover:bg-amber-500/10' 
                                        : activity.type === 'system'
                                        ? 'hover:bg-blue-500/10'
                                        : 'hover:bg-slate-700/50'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-2">
                                    {/* Time (YouTube style - before message) */}
                                    <span className="text-[10px] text-slate-400 mt-0.5 flex-shrink-0">
                                        {formatTime(activity.created_at)}
                                    </span>

                                    {/* Message Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            {/* User Name with Badge */}
                                            {activity.type === 'bid' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
                                                    <Gavel className="w-3 h-3" />
                                                    {activity.display_name}
                                                </span>
                                            ) : activity.type === 'system' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex-shrink-0">
                                                    SYSTEM
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                                                    <Users className="w-3 h-3" />
                                                    {activity.display_name}
                                                </span>
                                            )}

                                            {/* Message */}
                                            <span className={`
                                                text-sm break-words
                                                ${activity.type === 'bid'
                                                    ? 'text-amber-200 font-medium'
                                                    : activity.type === 'system'
                                                    ? 'text-blue-200 italic'
                                                    : 'text-slate-200'
                                                }
                                            `}>
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
            <div className="p-4 border-t border-slate-700 bg-slate-800 dark:bg-slate-900">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={disabled ? "Login to chat..." : "Say something..."}
                        disabled={disabled || isSending}
                        maxLength={200}
                        className="
                            flex-1 px-4 py-2.5 rounded-lg
                            bg-slate-700 dark:bg-slate-800 
                            text-white placeholder-slate-400
                            border border-slate-600 dark:border-slate-700
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                            disabled:opacity-50 disabled:cursor-not-allowed
                            text-sm
                        "
                    />
                    <button
                        onClick={handleSend}
                        disabled={disabled || isSending || !message.trim()}
                        className="
                            px-5 py-2.5 rounded-lg
                            bg-gradient-to-r from-red-600 to-pink-600
                            hover:from-red-700 hover:to-pink-700
                            text-white font-medium text-sm
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-200
                            flex items-center gap-2
                        "
                    >
                        {isSending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Send</span>
                            </>
                        )}
                    </button>
                </div>
                {message.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2 text-right">
                        {message.length}/200
                    </p>
                )}
            </div>
        </div>
    );
}
