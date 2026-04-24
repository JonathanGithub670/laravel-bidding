import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Gavel,
    Calendar,
    DollarSign,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface Bid {
    id: number;
    amount: number;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface Auction {
    id: number;
    title: string;
    description: string;
    images: string[];
    primary_image: string | null;
    starting_price: number;
    current_price: number;
    bid_increment: number;
    status:
        | 'pending'
        | 'scheduled'
        | 'live'
        | 'ended'
        | 'rejected'
        | 'cancelled';
    created_at: string;
    starts_at: string | null;
    ends_at: string | null;
    total_bids: number;
    category: Category;
    bids: Bid[];
    metadata?: {
        rejection_reason?: string;
        requested_duration_hours?: number;
    };
}

interface Props {
    auction: Auction;
}

function formatCurrency(amount: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const statusConfig = {
    pending: {
        label: 'Menunggu Persetujuan',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        description: 'Pengajuan Anda sedang ditinjau oleh admin',
    },
    scheduled: {
        label: 'Disetujui',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        description: 'Lelang telah disetujui dan akan dimulai sesuai jadwal',
    },
    live: {
        label: 'Sedang Berlangsung',
        icon: AlertCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        description: 'Lelang sedang berlangsung',
    },
    ended: {
        label: 'Selesai',
        icon: CheckCircle,
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        description: 'Lelang telah berakhir',
    },
    rejected: {
        label: 'Ditolak',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        description: 'Pengajuan Anda ditolak oleh admin',
    },
    cancelled: {
        label: 'Dibatalkan',
        icon: XCircle,
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        description: 'Lelang telah dibatalkan',
    },
};

export default function ShowMyAuction({ auction }: Props) {
    const status = statusConfig[auction.status];
    const StatusIcon = status.icon;

    return (
        <AppLayout>
            <Head title={`${auction.title} - My Auctions`} />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/my-auctions"
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {auction.title}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {auction.category.icon} {auction.category.name}
                        </p>
                    </div>
                </div>

                {/* Status Banner */}
                <div
                    className={`mb-6 flex items-start gap-3 rounded-xl p-4 ${status.color}`}
                >
                    <StatusIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">{status.label}</p>
                        <p className="text-sm opacity-80">
                            {status.description}
                        </p>
                        {auction.status === 'rejected' &&
                            auction.metadata?.rejection_reason && (
                                <p className="mt-2 text-sm font-medium">
                                    Alasan: {auction.metadata.rejection_reason}
                                </p>
                            )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Images */}
                    <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
                        {auction.images && auction.images.length > 0 ? (
                            <div className="space-y-3">
                                <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                                    <img
                                        src={auction.images[0]}
                                        alt={auction.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                {auction.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {auction.images
                                            .slice(1)
                                            .map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`${auction.title} - ${index + 2}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                                <Gavel className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        {/* Price Info */}
                        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <DollarSign className="h-5 w-5 text-amber-500" />
                                Informasi Harga
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Harga Awal
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(auction.starting_price)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Harga Saat Ini
                                    </span>
                                    <span className="text-lg font-bold text-amber-500">
                                        {formatCurrency(auction.current_price)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Kelipatan Bid
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        {formatCurrency(auction.bid_increment)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Total Bids
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        {auction.total_bids || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Info */}
                        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <Calendar className="h-5 w-5 text-amber-500" />
                                Jadwal
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Durasi
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        {auction.metadata
                                            ?.requested_duration_hours ||
                                            24}{' '}
                                        Jam
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Diajukan
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        {formatDateTime(auction.created_at)}
                                    </span>
                                </div>
                                {auction.starts_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Mulai
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            {formatDateTime(auction.starts_at)}
                                        </span>
                                    </div>
                                )}
                                {auction.ends_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Berakhir
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            {formatDateTime(auction.ends_at)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-6 rounded-2xl bg-white p-6 dark:bg-gray-800">
                    <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                        Deskripsi
                    </h3>
                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                        {auction.description}
                    </p>
                </div>

                {/* Bids History */}
                {auction.bids && auction.bids.length > 0 && (
                    <div className="mt-6 rounded-2xl bg-white p-6 dark:bg-gray-800">
                        <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                            <Gavel className="h-5 w-5 text-amber-500" />
                            Riwayat Bid
                        </h3>
                        <div className="space-y-2">
                            {auction.bids.map((bid, index) => (
                                <div
                                    key={bid.id}
                                    className={`flex items-center justify-between rounded-lg p-3 ${
                                        index === 0
                                            ? 'bg-amber-50 dark:bg-amber-900/20'
                                            : 'bg-gray-50 dark:bg-gray-700/50'
                                    }`}
                                >
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {bid.user.name.substring(0, 3)}***
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(bid.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
