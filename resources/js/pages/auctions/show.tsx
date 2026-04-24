import { Head, usePage } from '@inertiajs/react';
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
    X,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import BidControls from '@/components/auction/BidControls';
import BidTimer from '@/components/auction/BidTimer';
import PriceDisplay from '@/components/auction/PriceDisplay';
import WarRoom from '@/components/auction/WarRoom';
import AppLayout from '@/layouts/app-layout';
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

export default function AuctionShow({
    auction: initialAuction,
    recentBids: initialBids,
    activities: initialActivities,
    quickBids: initialQuickBids,
    userBalance: initialUserBalance,
    userDeposit: initialUserDeposit,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const [auction, setAuction] = useState(initialAuction);
    const [bids, setBids] = useState<Bid[]>(initialBids);
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [quickBids, setQuickBids] = useState<QuickBid[]>(initialQuickBids);
    const [userBalance, setUserBalance] = useState<UserBalance | null>(
        initialUserBalance,
    );
    const [userDeposit, setUserDeposit] = useState<number>(
        initialUserDeposit || 0,
    );
    const [previousPrice, setPreviousPrice] = useState(
        initialAuction.current_price,
    );
    const [isPlacingBid, setIsPlacingBid] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isUserRegistered, setIsUserRegistered] = useState(
        initialAuction.is_user_registered,
    );
    const [selectedImage, setSelectedImage] = useState(0);
    const [participants, setParticipants] = useState<
        { id: number; name: string }[]
    >([]);
    const [isEnded, setIsEnded] = useState(!initialAuction.is_live);
    const [modal, setModal] = useState<{
        show: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        show: false,
        type: 'success',
        title: '',
        message: '',
    });

    const showModal = (
        type: 'success' | 'error',
        title: string,
        message: string,
    ) => {
        setModal({ show: true, type, title, message });
    };
    const closeModal = () => setModal((prev) => ({ ...prev, show: false }));

    // Subscribe to real-time updates
    useEffect(() => {
        if (!auction.is_live) return;

        const channel = window.Echo?.join(`auction.${auction.id}`);

        if (!channel) {
            console.warn('Echo not available');
            return;
        }

        // Track participants - deduplicate by user ID
        channel
            .here((users: { id: number; name: string }[]) => {
                // Deduplicate by user ID (same user may have multiple connections/tabs)
                const unique = users.filter(
                    (user, index, self) =>
                        self.findIndex((u) => u.id === user.id) === index,
                );
                setParticipants(unique);
            })
            .joining((user: { id: number; name: string }) => {
                // Only add if this user ID is not already in the list
                setParticipants((prev) => {
                    if (prev.some((p) => p.id === user.id)) return prev;
                    return [...prev, user];
                });
            })
            .leaving((user: { id: number; name: string }) => {
                setParticipants((prev) => prev.filter((p) => p.id !== user.id));
            });

        // Listen for bid placed
        channel.listen(
            '.BidPlaced',
            (e: {
                auction: {
                    current_price: number;
                    formatted_price: string;
                    next_min_bid: number;
                    total_bids: number;
                    ends_at: string;
                    remaining_seconds: number;
                    is_extended: boolean;
                    bid_increment: number;
                };
                bid: Bid;
            }) => {
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
                const increment =
                    e.auction.bid_increment || auction.bid_increment;
                const newPrice = e.auction.current_price;
                setQuickBids([
                    {
                        label: '+' + formatShort(increment),
                        amount: newPrice + increment,
                    },
                    {
                        label: '+' + formatShort(increment * 2),
                        amount: newPrice + increment * 2,
                    },
                    {
                        label: '+' + formatShort(increment * 5),
                        amount: newPrice + increment * 5,
                    },
                    {
                        label: '+' + formatShort(increment * 10),
                        amount: newPrice + increment * 10,
                    },
                ]);
            },
        );

        // Listen for time extended
        channel.listen(
            '.TimeExtended',
            (e: { new_ends_at: string; remaining_seconds: number }) => {
                setAuction((prev) => ({
                    ...prev,
                    ends_at: e.new_ends_at,
                    remaining_seconds: e.remaining_seconds,
                    is_extended: true,
                }));
            },
        );

        // Listen for auction ended
        channel.listen(
            '.AuctionEnded',
            (e: {
                auction_id: number;
                winner: { id: number; name: string } | null;
                final_price: number;
            }) => {
                setIsEnded(true);
                setAuction((prev) => ({
                    ...prev,
                    is_live: false,
                    status: 'ended',
                    winner: e.winner,
                }));
            },
        );

        // Listen for activities - dedupe by ID to prevent duplicates
        channel.listen('.ActivityPosted', (e: { activity: Activity }) => {
            setActivities((prev) => {
                // Check if activity already exists
                if (prev.some((a) => a.id === e.activity.id)) {
                    return prev; // Skip duplicate
                }
                return [e.activity, ...prev.slice(0, 49)];
            });
        });

        return () => {
            window.Echo?.leave(`auction.${auction.id}`);
        };
    }, [auction.id]); // Only depend on auction.id - stable identifier

    const formatShort = (num: number): string => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handlePlaceBid = useCallback(
        async (amount: number) => {
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
                        Accept: 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
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
                    throw new Error(
                        'Terjadi kesalahan server. Silakan refresh halaman dan coba lagi.',
                    );
                }

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Gagal menempatkan bid');
                }

                // Update user balance from response
                if (data.new_balance !== undefined) {
                    setUserBalance({
                        amount: data.new_balance,
                        formatted:
                            data.formatted_balance ||
                            'Rp ' +
                                new Intl.NumberFormat('id-ID').format(
                                    data.new_balance,
                                ),
                    });
                }

                // Update user deposit from response
                if (data.deposit_amount !== undefined) {
                    setUserDeposit(data.deposit_amount);
                }

                // Update will come via WebSocket
            } finally {
                setIsPlacingBid(false);
            }
        },
        [auction.id, auth.user],
    );

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
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            // Handle CSRF token mismatch - SessionExpiredModal handles this globally
            if (response.status === 419) {
                return;
            }

            const data = await response.json();

            if (!response.ok || !data.success) {
                showModal(
                    'error',
                    'Gagal Mendaftar',
                    data.message || 'Gagal mendaftar. Silakan coba lagi.',
                );
                return;
            }

            // Success - update state
            setIsUserRegistered(true);
            if (data.new_balance !== undefined && userBalance) {
                setUserBalance({
                    ...userBalance,
                    amount: data.new_balance,
                    formatted:
                        'Rp ' +
                        new Intl.NumberFormat('id-ID').format(data.new_balance),
                });
            }
            showModal('success', 'Berhasil Mendaftar!', data.message);
        } catch (error) {
            console.error('Registration error:', error);
            showModal(
                'error',
                'Gagal Mendaftar',
                'Terjadi kesalahan. Silakan coba lagi.',
            );
        } finally {
            setIsRegistering(false);
        }
    }, [auction.id, auth.user, userBalance]);

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!auth.user) return;

            const response = await fetch(`/auctions/${auction.uuid}/activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Gagal mengirim pesan');
            }

            // Don't add optimistically - let Echo broadcast handle it to prevent duplicates
        },
        [auction.id, auth.user],
    );

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
                <div className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <a
                            href="/auctions/list"
                            className="flex items-center gap-2 text-slate-600 hover:text-amber-500 dark:text-slate-400"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span>Kembali</span>
                        </a>

                        <div className="flex items-center gap-4">
                            {auction.is_live && (
                                <div className="flex animate-pulse items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-sm font-semibold text-white">
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                    LIVE
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Users className="h-4 w-4" />
                                <span className="text-sm">
                                    {participants.length} online
                                </span>
                            </div>
                            <button className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Heart className="h-5 w-5 text-slate-500" />
                            </button>
                            <button className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Share2 className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left Column - Product Images & Info */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Images */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-800">
                                {/* Main Image */}
                                <div className="relative aspect-video bg-slate-100 dark:bg-slate-700">
                                    {isEnded && auction.winner && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
                                            <div className="text-center text-white">
                                                <Trophy className="mx-auto mb-4 h-16 w-16 text-amber-400" />
                                                <h2 className="mb-2 text-2xl font-bold">
                                                    Lelang Selesai!
                                                </h2>
                                                <p className="text-lg">
                                                    Pemenang:{' '}
                                                    {auction.winner.name}
                                                </p>
                                                <p className="mt-2 text-2xl font-bold text-amber-400">
                                                    {auction.formatted_price}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {auction.images &&
                                    auction.images.length > 0 ? (
                                        <img
                                            src={auction.images[selectedImage]}
                                            alt={auction.title}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Gavel className="h-24 w-24 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    )}

                                    {/* Extended Time Badge */}
                                    {auction.is_extended && auction.is_live && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white">
                                            <AlertTriangle className="h-4 w-4" />
                                            Waktu Diperpanjang!
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {auction.images &&
                                    auction.images.length > 1 && (
                                        <div className="flex gap-2 overflow-x-auto p-4">
                                            {auction.images.map(
                                                (image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                index,
                                                            )
                                                        }
                                                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                                            selectedImage ===
                                                            index
                                                                ? 'border-amber-500 shadow-lg'
                                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                        } `}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`${auction.title} - ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>

                            {/* Product Info + Recent Bids - Side by Side */}
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Product Info */}
                                <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
                                    <div className="mb-4 flex items-start justify-between gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                                {auction.category.icon}{' '}
                                                {auction.category.name}
                                            </span>
                                            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                                                {auction.title}
                                            </h1>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Gavel className="h-4 w-4" />
                                                {auction.total_bids} bids
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {auction.view_count}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="prose prose-slate dark:prose-invert max-w-none overflow-hidden">
                                        <p className="break-all whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                                            {auction.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Penjual:{' '}
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {auction.seller.name}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Recent Bids - Accumulated per user */}
                                <div className="flex flex-col rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
                                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <Gavel className="h-5 w-5 text-amber-500" />
                                        Riwayat Bid
                                    </h2>

                                    {bids.length === 0 ? (
                                        <p className="flex flex-1 items-center justify-center py-8 text-center text-slate-500 dark:text-slate-400">
                                            Belum ada bid. Jadilah yang pertama!
                                        </p>
                                    ) : (
                                        (() => {
                                            // Accumulate bids per user: highest bid = total deposit
                                            const userBids = new Map<
                                                number,
                                                {
                                                    name: string;
                                                    totalDeposit: number;
                                                    bidCount: number;
                                                }
                                            >();
                                            bids.forEach((bid) => {
                                                const existing = userBids.get(
                                                    bid.bidder_id,
                                                );
                                                if (
                                                    !existing ||
                                                    bid.amount >
                                                        existing.totalDeposit
                                                ) {
                                                    userBids.set(
                                                        bid.bidder_id,
                                                        {
                                                            name:
                                                                existing?.name ||
                                                                bid.bidder_name,
                                                            totalDeposit:
                                                                bid.amount,
                                                            bidCount:
                                                                (existing?.bidCount ||
                                                                    0) + 1,
                                                        },
                                                    );
                                                } else {
                                                    userBids.set(
                                                        bid.bidder_id,
                                                        {
                                                            ...existing,
                                                            bidCount:
                                                                existing.bidCount +
                                                                1,
                                                        },
                                                    );
                                                }
                                            });

                                            const sorted = Array.from(
                                                userBids.entries(),
                                            )
                                                .map(([id, data]) => ({
                                                    id,
                                                    ...data,
                                                }))
                                                .sort(
                                                    (a, b) =>
                                                        b.totalDeposit -
                                                        a.totalDeposit,
                                                );

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

                                            const rankBadges = [
                                                '🥇',
                                                '🥈',
                                                '🥉',
                                            ];

                                            return (
                                                <div className="max-h-80 flex-1 space-y-2 overflow-y-auto">
                                                    {sorted.map(
                                                        (user, index) => (
                                                            <div
                                                                key={user.id}
                                                                className={`flex items-center justify-between rounded-xl p-3 transition-all ${rankStyles[index] || 'border border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50'} `}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {/* Rank badge */}
                                                                    <div className="flex h-8 w-8 items-center justify-center">
                                                                        {index <
                                                                        3 ? (
                                                                            <span className="text-xl">
                                                                                {
                                                                                    rankBadges[
                                                                                        index
                                                                                    ]
                                                                                }
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
                                                                                #
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p
                                                                            className={`font-semibold ${index === 0 ? 'text-amber-800 dark:text-amber-200' : 'text-slate-900 dark:text-white'}`}
                                                                        >
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                            {
                                                                                user.bidCount
                                                                            }{' '}
                                                                            kali
                                                                            bid
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className={`text-lg font-bold ${rankTextColors[index] || 'text-slate-700 dark:text-slate-300'}`}
                                                                >
                                                                    Rp{' '}
                                                                    {user.totalDeposit.toLocaleString(
                                                                        'id-ID',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Bidding Only */}
                        <div className="space-y-6">
                            {/* Timer & Price */}
                            <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
                                {auction.status === 'pending' ? (
                                    <div className="py-8 text-center">
                                        <Clock className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
                                        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                                            Menunggu Persetujuan
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Lelang ini masih dalam proses review
                                            oleh admin
                                        </p>
                                        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                Harga Awal:{' '}
                                                <span className="font-bold">
                                                    {auction.formatted_price}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ) : auction.status === 'rejected' ? (
                                    <div className="py-8 text-center">
                                        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
                                        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                                            Pengajuan Ditolak
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Maaf, pengajuan lelang ini tidak
                                            disetujui
                                        </p>
                                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                                            <p className="text-sm text-red-700 dark:text-red-400">
                                                Harga:{' '}
                                                <span className="font-bold">
                                                    {auction.formatted_price}
                                                </span>
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
                                        <div className="mb-6 text-center">
                                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                                                Harga Saat Ini
                                            </p>
                                            <PriceDisplay
                                                amount={auction.current_price}
                                                previousAmount={previousPrice}
                                                size="xl"
                                            />
                                        </div>

                                        {/* Registration Card - Show if requires registration and not registered */}
                                        {auction.requires_registration &&
                                            !isUserRegistered &&
                                            auth.user && (
                                                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                                                    <div className="mb-3 flex items-center gap-3">
                                                        <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-800">
                                                            <Wallet className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-amber-800 dark:text-amber-300">
                                                                Biaya
                                                                Pendaftaran
                                                            </p>
                                                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                                {
                                                                    auction.formatted_registration_fee
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="mb-4 text-sm text-amber-700 dark:text-amber-300">
                                                        Daftar dulu untuk bisa
                                                        ikut bidding. Saldo
                                                        Anda:{' '}
                                                        {userBalance?.formatted ||
                                                            'Rp 0'}
                                                    </p>
                                                    <button
                                                        onClick={handleRegister}
                                                        disabled={isRegistering}
                                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                                                    >
                                                        {isRegistering ? (
                                                            <>
                                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                                Mendaftar...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserPlus className="h-5 w-5" />
                                                                Daftar Sekarang
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}

                                        {/* Bid Controls - Only show if registered or no registration required */}
                                        {(!auction.requires_registration ||
                                            isUserRegistered) && (
                                            <BidControls
                                                currentPrice={
                                                    auction.current_price
                                                }
                                                nextMinBid={
                                                    auction.next_min_bid
                                                }
                                                bidIncrement={
                                                    auction.bid_increment
                                                }
                                                quickBids={quickBids}
                                                onPlaceBid={handlePlaceBid}
                                                disabled={!auth.user || isEnded}
                                                isLoading={isPlacingBid}
                                                userBalance={
                                                    userBalance?.amount ?? null
                                                }
                                                userDeposit={userDeposit}
                                            />
                                        )}

                                        {/* Registered badge */}
                                        {auction.requires_registration &&
                                            isUserRegistered && (
                                                <div className="mt-4 flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                                                    <UserPlus className="h-4 w-4" />
                                                    <span className="text-sm font-medium">
                                                        Anda sudah terdaftar
                                                    </span>
                                                </div>
                                            )}

                                        {!auth.user && (
                                            <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                                <a
                                                    href="/login"
                                                    className="text-amber-500 hover:underline"
                                                >
                                                    Login
                                                </a>{' '}
                                                untuk mulai bidding
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Trophy className="mx-auto mb-4 h-16 w-16 text-amber-400" />
                                        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                                            Lelang Selesai
                                        </h2>
                                        <p className="text-lg text-slate-600 dark:text-slate-400">
                                            Harga Akhir
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-amber-500">
                                            {auction.formatted_price}
                                        </p>
                                        {auction.winner && (
                                            <p className="mt-4 text-slate-500 dark:text-slate-400">
                                                Pemenang:{' '}
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {auction.winner.name}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* War Room - Full Width Below */}
                    {auction.status !== 'pending' &&
                        auction.status !== 'rejected' && (
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
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    {/* Modal */}
                    <div className="relative w-full max-w-md animate-in rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl duration-200 zoom-in-95 fade-in dark:border-slate-700 dark:bg-slate-800">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <X className="h-5 w-5 text-slate-400" />
                        </button>
                        <div className="text-center">
                            <div
                                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                                    modal.type === 'success'
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : 'bg-red-100 dark:bg-red-900/30'
                                }`}
                            >
                                {modal.type === 'success' ? (
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                ) : (
                                    <XCircle className="h-8 w-8 text-red-500" />
                                )}
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                                {modal.title}
                            </h3>
                            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                                {modal.message}
                            </p>
                            <button
                                onClick={closeModal}
                                className={`w-full rounded-xl px-6 py-3 font-semibold text-white transition-colors ${
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
