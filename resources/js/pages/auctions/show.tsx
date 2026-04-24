import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import BidTimer from '@/components/auction/BidTimer';
import BidControls from '@/components/auction/BidControls';
import WarRoom from '@/components/auction/WarRoom';
import PriceDisplay from '@/components/auction/PriceDisplay';
import { 
    Gavel, 
    Eye, 
    Users, 
    ChevronLeft, 
    Share2, 
    Heart,
    Trophy,
    AlertTriangle,
    Clock,
    XCircle,
    Wallet,
    UserPlus,
    Loader2,
    CheckCircle,
    X
} from 'lucide-react';
import type { SharedData } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface QuickBid {
    label: string;
    amount: number;
}

interface Bid {
    id: number;
    amount: number;
    formatted_amount: string;
    bidder_name: string;
    bidder_id: number;
    is_winning: boolean;
    created_at: string;
}

interface Activity {
    id: number;
    type: 'bid' | 'chat' | 'system' | 'join' | 'leave';
    content: string;
    display_name: string;
    is_system: boolean;
    created_at: string;
}

interface Auction {
    id: number;
    uuid: string;
    title: string;
    description: string;
    images: string[];
    primary_image: string | null;
    starting_price: number;
    current_price: number;
    formatted_price: string;
    bid_increment: number;
    next_min_bid: number;
    starts_at: string;
    ends_at: string;
    remaining_seconds: number;
    status: string;
    is_live: boolean;
    is_extended: boolean;
    total_bids: number;
    view_count: number;
    category: Category;
    seller: {
        id: number;
        name: string;
    };
    winner: {
        id: number;
        name: string;
    } | null;
    // Registration fields
    registration_fee: number;
    formatted_registration_fee: string;
    requires_registration: boolean;
    is_user_registered: boolean;
    participants_count: number;
}

interface UserBalance {
    amount: number;
    formatted: string;
}

interface Props {
    auction: Auction;
    recentBids: Bid[];
    activities: Activity[];
    quickBids: QuickBid[];
    userBalance: UserBalance | null;
    userDeposit: number;
}

export default function AuctionShow({ auction: initialAuction, recentBids: initialBids, activities: initialActivities, quickBids: initialQuickBids, userBalance: initialUserBalance, userDeposit: initialUserDeposit }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [auction, setAuction] = useState(initialAuction);
    const [bids, setBids] = useState<Bid[]>(initialBids);
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [quickBids, setQuickBids] = useState<QuickBid[]>(initialQuickBids);
    const [userBalance, setUserBalance] = useState<UserBalance | null>(initialUserBalance);
    const [userDeposit, setUserDeposit] = useState<number>(initialUserDeposit || 0);
    const [previousPrice, setPreviousPrice] = useState(initialAuction.current_price);
    const [isPlacingBid, setIsPlacingBid] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isUserRegistered, setIsUserRegistered] = useState(initialAuction.is_user_registered);
    const [selectedImage, setSelectedImage] = useState(0);
    const [participants, setParticipants] = useState<{ id: number; name: string }[]>([]);
    const [isEnded, setIsEnded] = useState(!initialAuction.is_live);
    const [modal, setModal] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
        show: false, type: 'success', title: '', message: '',
    });

    const showModal = (type: 'success' | 'error', title: string, message: string) => {
        setModal({ show: true, type, title, message });
    };
    const closeModal = () => setModal(prev => ({ ...prev, show: false }));

    // Subscribe to real-time updates
    useEffect(() => {
        if (!auction.is_live) return;

        const channel = (window as any).Echo?.join(`auction.${auction.id}`);

        if (!channel) {
            console.warn('Echo not available');
            return;
        }

        // Track participants - deduplicate by user ID
        channel
            .here((users: { id: number; name: string }[]) => {
                // Deduplicate by user ID (same user may have multiple connections/tabs)
                const unique = users.filter((user, index, self) =>
                    self.findIndex(u => u.id === user.id) === index
                );
                setParticipants(unique);
            })
            .joining((user: { id: number; name: string }) => {
                // Only add if this user ID is not already in the list
                setParticipants((prev) => {
                    if (prev.some(p => p.id === user.id)) return prev;
                    return [...prev, user];
                });
            })
            .leaving((user: { id: number; name: string }) => {
                setParticipants((prev) => prev.filter((p) => p.id !== user.id));
            });

        // Listen for bid placed
        channel.listen('.BidPlaced', (e: { auction: any; bid: Bid }) => {
            setPreviousPrice(auction.current_price);
            setAuction((prev) => ({
                ...prev,
                current_price: e.auction.current_price,
                formatted_price: e.auction.formatted_price,
                next_min_bid: e.auction.next_min_bid,
                total_bids: e.auction.total_bids,
                ends_at: e.auction.ends_at,
                remaining_seconds: e.auction.remaining_seconds,
                is_extended: e.auction.is_extended,
            }));
            setBids((prev) => [e.bid, ...prev.slice(0, 19)]);

            // Update quick bids with new price
            const increment = e.auction.bid_increment || auction.bid_increment;
            const newPrice = e.auction.current_price;
            setQuickBids([
                { label: '+' + formatShort(increment), amount: newPrice + increment },
                { label: '+' + formatShort(increment * 2), amount: newPrice + increment * 2 },
                { label: '+' + formatShort(increment * 5), amount: newPrice + increment * 5 },
                { label: '+' + formatShort(increment * 10), amount: newPrice + increment * 10 },
            ]);
        });

        // Listen for time extended
        channel.listen('.TimeExtended', (e: { new_ends_at: string; remaining_seconds: number }) => {
            setAuction((prev) => ({
                ...prev,
                ends_at: e.new_ends_at,
                remaining_seconds: e.remaining_seconds,
                is_extended: true,
            }));
        });

        // Listen for auction ended
        channel.listen('.AuctionEnded', (e: { auction_id: number; winner: any; final_price: number }) => {
            setIsEnded(true);
            setAuction((prev) => ({
                ...prev,
                is_live: false,
                status: 'ended',
                winner: e.winner,
            }));
        });

        // Listen for activities - dedupe by ID to prevent duplicates
        channel.listen('.ActivityPosted', (e: { activity: Activity }) => {
            setActivities((prev) => {
                // Check if activity already exists
                if (prev.some(a => a.id === e.activity.id)) {
                    return prev; // Skip duplicate
                }
                return [e.activity, ...prev.slice(0, 49)];
            });
        });

        return () => {
            (window as any).Echo?.leave(`auction.${auction.id}`);
        };
    }, [auction.id]); // Only depend on auction.id - stable identifier


    const formatShort = (num: number): string => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handlePlaceBid = useCallback(async (amount: number) => {
        if (!auth.user) {
            window.location.href = '/login';
            return;
        }

        setIsPlacingBid(true);

        try {
            const response = await fetch(`/auctions/${auction.uuid}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ amount }),
            });

            // Handle CSRF token mismatch - SessionExpiredModal handles this globally
            if (response.status === 419) {
                return;
            }

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                // Server returned HTML (likely session expired or error page)
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Terjadi kesalahan server. Silakan refresh halaman dan coba lagi.');
            }

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Gagal menempatkan bid');
            }

            // Update user balance from response
            if (data.new_balance !== undefined) {
                setUserBalance({
                    amount: data.new_balance,
                    formatted: data.formatted_balance || 'Rp ' + new Intl.NumberFormat('id-ID').format(data.new_balance),
                });
            }

            // Update user deposit from response
            if (data.deposit_amount !== undefined) {
                setUserDeposit(data.deposit_amount);
            }

            // Update will come via WebSocket
        } catch (error) {
            throw error;
        } finally {
            setIsPlacingBid(false);
        }
    }, [auction.id, auth.user]);

    const handleRegister = useCallback(async () => {
        if (!auth.user) {
            window.location.href = '/login';
            return;
        }

        setIsRegistering(true);

        try {
            const response = await fetch(`/auctions/${auction.uuid}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            // Handle CSRF token mismatch - SessionExpiredModal handles this globally
            if (response.status === 419) {
                return;
            }

            const data = await response.json();

            if (!response.ok || !data.success) {
                showModal('error', 'Gagal Mendaftar', data.message || 'Gagal mendaftar. Silakan coba lagi.');
                return;
            }

            // Success - update state
            setIsUserRegistered(true);
            if (data.new_balance !== undefined && userBalance) {
                setUserBalance({
                    ...userBalance,
                    amount: data.new_balance,
                    formatted: 'Rp ' + new Intl.NumberFormat('id-ID').format(data.new_balance),
                });
            }
            showModal('success', 'Berhasil Mendaftar!', data.message);
        } catch (error) {
            console.error('Registration error:', error);
            showModal('error', 'Gagal Mendaftar', 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsRegistering(false);
        }
    }, [auction.id, auth.user, userBalance]);

    const handleSendMessage = useCallback(async (content: string) => {
        if (!auth.user) return;

        const response = await fetch(`/auctions/${auction.uuid}/activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ content }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Gagal mengirim pesan');
        }

        // Don't add optimistically - let Echo broadcast handle it to prevent duplicates
    }, [auction.id, auth.user]);


    const handleTimeUp = useCallback(() => {
        setIsEnded(true);
        setAuction((prev) => ({
            ...prev,
            is_live: false,
            status: 'ended',
        }));
    }, []);

    return (
        <AppLayout>
            <Head title={`${auction.title} - BidWar`} />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Top Bar */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <a
                            href="/auctions/list"
                            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-500"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Kembali</span>
                        </a>

                        <div className="flex items-center gap-4">
                            {auction.is_live && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-semibold animate-pulse">
                                    <span className="w-2 h-2 rounded-full bg-white" />
                                    LIVE
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{participants.length} online</span>
                            </div>
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Heart className="w-5 h-5 text-slate-500" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Share2 className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Product Images & Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Images */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
                                {/* Main Image */}
                                <div className="relative aspect-video bg-slate-100 dark:bg-slate-700">
                                    {isEnded && auction.winner && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                                            <div className="text-center text-white">
                                                <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                                                <h2 className="text-2xl font-bold mb-2">Lelang Selesai!</h2>
                                                <p className="text-lg">Pemenang: {auction.winner.name}</p>
                                                <p className="text-2xl font-bold text-amber-400 mt-2">
                                                    {auction.formatted_price}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {auction.images && auction.images.length > 0 ? (
                                        <img
                                            src={auction.images[selectedImage]}
                                            alt={auction.title}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Gavel className="w-24 h-24 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    )}

                                    {/* Extended Time Badge */}
                                    {auction.is_extended && auction.is_live && (
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-amber-500 text-white text-sm font-semibold flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            Waktu Diperpanjang!
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {auction.images && auction.images.length > 1 && (
                                    <div className="flex gap-2 p-4 overflow-x-auto">
                                        {auction.images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`
                                                    flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                                                    ${selectedImage === index
                                                        ? 'border-amber-500 shadow-lg'
                                                        : 'border-transparent opacity-60 hover:opacity-100'
                                                    }
                                                `}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${auction.title} - ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info + Recent Bids - Side by Side */}
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Product Info */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                                {auction.category.icon} {auction.category.name}
                                            </span>
                                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                                {auction.title}
                                            </h1>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Gavel className="w-4 h-4" />
                                                {auction.total_bids} bids
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                {auction.view_count}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="prose prose-slate dark:prose-invert max-w-none overflow-hidden">
                                        <p className="text-slate-600 dark:text-slate-400 break-all whitespace-pre-wrap">
                                            {auction.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Penjual: <span className="font-medium text-slate-900 dark:text-white">{auction.seller.name}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Recent Bids - Accumulated per user */}
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg flex flex-col">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Gavel className="w-5 h-5 text-amber-500" />
                                        Riwayat Bid
                                    </h2>
                                    
                                    {bids.length === 0 ? (
                                        <p className="text-center text-slate-500 dark:text-slate-400 py-8 flex-1 flex items-center justify-center">
                                            Belum ada bid. Jadilah yang pertama!
                                        </p>
                                    ) : (() => {
                                        // Accumulate bids per user: highest bid = total deposit
                                        const userBids = new Map<number, { name: string; totalDeposit: number; bidCount: number }>();
                                        bids.forEach(bid => {
                                            const existing = userBids.get(bid.bidder_id);
                                            if (!existing || bid.amount > existing.totalDeposit) {
                                                userBids.set(bid.bidder_id, {
                                                    name: existing?.name || bid.bidder_name,
                                                    totalDeposit: bid.amount,
                                                    bidCount: (existing?.bidCount || 0) + 1,
                                                });
                                            } else {
                                                userBids.set(bid.bidder_id, {
                                                    ...existing,
                                                    bidCount: existing.bidCount + 1,
                                                });
                                            }
                                        });
                                        
                                        const sorted = Array.from(userBids.entries())
                                            .map(([id, data]) => ({ id, ...data }))
                                            .sort((a, b) => b.totalDeposit - a.totalDeposit);

                                        const rankStyles = [
                                            // #1 - Gold
                                            'bg-gradient-to-r from-amber-100 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/20 border-2 border-amber-400 dark:border-amber-600 shadow-md',
                                            // #2 - Silver
                                            'bg-gradient-to-r from-slate-100 to-gray-50 dark:from-slate-700/60 dark:to-gray-700/40 border border-slate-300 dark:border-slate-500',
                                            // #3 - Bronze
                                            'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border border-orange-200 dark:border-orange-700',
                                        ];

                                        const rankTextColors = [
                                            'text-amber-700 dark:text-amber-300',
                                            'text-slate-600 dark:text-slate-300',
                                            'text-orange-600 dark:text-orange-300',
                                        ];

                                        const rankBadges = ['🥇', '🥈', '🥉'];

                                        return (
                                            <div className="space-y-2 overflow-y-auto flex-1 max-h-80">
                                                {sorted.map((user, index) => (
                                                    <div
                                                        key={user.id}
                                                        className={`
                                                            flex items-center justify-between p-3 rounded-xl transition-all
                                                            ${rankStyles[index] || 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600'}
                                                        `}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {/* Rank badge */}
                                                            <div className="flex items-center justify-center w-8 h-8">
                                                                {index < 3 ? (
                                                                    <span className="text-xl">{rankBadges[index]}</span>
                                                                ) : (
                                                                    <span className="text-sm font-bold text-slate-400 dark:text-slate-500">#{index + 1}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className={`font-semibold ${index === 0 ? 'text-amber-800 dark:text-amber-200' : 'text-slate-900 dark:text-white'}`}>
                                                                    {user.name}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                    {user.bidCount} kali bid
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`font-bold text-lg ${rankTextColors[index] || 'text-slate-700 dark:text-slate-300'}`}>
                                                            Rp {user.totalDeposit.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                        </div>
                    </div>

                        {/* Right Column - Bidding Only */}
                        <div className="space-y-6">
                            {/* Timer & Price */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
                                {auction.status === 'pending' ? (
                                    <div className="text-center py-8">
                                        <Clock className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            Menunggu Persetujuan
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Lelang ini masih dalam proses review oleh admin
                                        </p>
                                        <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                                            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                                                Harga Awal: <span className="font-bold">{auction.formatted_price}</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : auction.status === 'rejected' ? (
                                    <div className="text-center py-8">
                                        <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            Pengajuan Ditolak
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Maaf, pengajuan lelang ini tidak disetujui
                                        </p>
                                        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                            <p className="text-red-700 dark:text-red-400 text-sm">
                                                Harga: <span className="font-bold">{auction.formatted_price}</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : auction.is_live ? (
                                    <>
                                        <BidTimer
                                            endsAt={auction.ends_at}
                                            onTimeUp={handleTimeUp}
                                            className="mb-6"
                                        />
                                        <div className="text-center mb-6">
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                                Harga Saat Ini
                                            </p>
                                            <PriceDisplay
                                                amount={auction.current_price}
                                                previousAmount={previousPrice}
                                                size="xl"
                                            />
                                        </div>

                                        {/* Registration Card - Show if requires registration and not registered */}
                                        {auction.requires_registration && !isUserRegistered && auth.user && (
                                            <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800">
                                                        <Wallet className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-amber-800 dark:text-amber-300">
                                                            Biaya Pendaftaran
                                                        </p>
                                                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                            {auction.formatted_registration_fee}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                                                    Daftar dulu untuk bisa ikut bidding. Saldo Anda: {userBalance?.formatted || 'Rp 0'}
                                                </p>
                                                <button
                                                    onClick={handleRegister}
                                                    disabled={isRegistering}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    {isRegistering ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            Mendaftar...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus className="w-5 h-5" />
                                                            Daftar Sekarang
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Bid Controls - Only show if registered or no registration required */}
                                        {(!auction.requires_registration || isUserRegistered) && (
                                            <BidControls
                                                currentPrice={auction.current_price}
                                                nextMinBid={auction.next_min_bid}
                                                bidIncrement={auction.bid_increment}
                                                quickBids={quickBids}
                                                onPlaceBid={handlePlaceBid}
                                                disabled={!auth.user || isEnded}
                                                isLoading={isPlacingBid}
                                                userBalance={userBalance?.amount ?? null}
                                                userDeposit={userDeposit}
                                            />
                                        )}

                                        {/* Registered badge */}
                                        {auction.requires_registration && isUserRegistered && (
                                            <div className="mt-4 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                                                <UserPlus className="w-4 h-4" />
                                                <span className="text-sm font-medium">Anda sudah terdaftar</span>
                                            </div>
                                        )}

                                        {!auth.user && (
                                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                                                <a href="/login" className="text-amber-500 hover:underline">Login</a> untuk mulai bidding
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Trophy className="w-16 h-16 mx-auto text-amber-400 mb-4" />
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            Lelang Selesai
                                        </h2>
                                        <p className="text-lg text-slate-600 dark:text-slate-400">
                                            Harga Akhir
                                        </p>
                                        <p className="text-3xl font-bold text-amber-500 mt-2">
                                            {auction.formatted_price}
                                        </p>
                                        {auction.winner && (
                                            <p className="text-slate-500 dark:text-slate-400 mt-4">
                                                Pemenang: <span className="font-semibold text-slate-900 dark:text-white">{auction.winner.name}</span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* War Room - Full Width Below */}
                    {(auction.status !== 'pending' && auction.status !== 'rejected') && (
                        <div className="mt-6">
                            <WarRoom
                                activities={activities}
                                onSendMessage={handleSendMessage}
                                disabled={!auth.user || !auction.is_live}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Modal */}
            {modal.show && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
                    {/* Modal */}
                    <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-200 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                        <div className="text-center">
                            <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                                modal.type === 'success'
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                                {modal.type === 'success' ? (
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-500" />
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {modal.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                                {modal.message}
                            </p>
                            <button
                                onClick={closeModal}
                                className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition-colors ${
                                    modal.type === 'success'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-red-500 hover:bg-red-600'
                                }`}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
