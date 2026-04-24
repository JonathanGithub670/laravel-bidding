import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { History, CheckCircle, XCircle, Gavel, Clock, Calendar, Eye } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface Seller {
    id: number;
    name: string;
    email: string;
}

interface Auction {
    id: number;
    uuid: string;
    title: string;
    primary_image: string | null;
    starting_price: number;
    status: 'scheduled' | 'live' | 'ended' | 'rejected';
    created_at: string;
    updated_at: string;
    starts_at: string | null;
    ends_at: string | null;
    category: Category;
    seller: Seller;
    metadata?: {
        rejection_reason?: string;
        requested_duration_hours?: number;
    };
}

interface Props {
    auctions: {
        data: Auction[];
        links: any;
    };
    currentFilter: string;
}

function formatCurrency(amount: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const statusConfig = {
    scheduled: {
        label: 'Disetujui',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    live: {
        label: 'Sedang Berlangsung',
        icon: Clock,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    ended: {
        label: 'Selesai',
        icon: CheckCircle,
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    },
    rejected: {
        label: 'Ditolak',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

export default function AuctionHistory({ auctions, currentFilter }: Props) {
    const handleFilterChange = (filter: string) => {
        router.get('/admin/auctions/history', { status: filter }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Riwayat Persetujuan - Admin" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Riwayat Persetujuan
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Daftar lelang yang sudah disetujui atau ditolak
                        </p>
                    </div>
                    <Link
                        href="/admin/auctions/pending"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
                    >
                        <Clock className="w-5 h-5" />
                        Lihat Pending
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {[
                        { value: 'all', label: 'Semua' },
                        { value: 'approved', label: 'Disetujui' },
                        { value: 'rejected', label: 'Ditolak' },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleFilterChange(filter.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentFilter === filter.value
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <History className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                        <strong>{auctions.data.length}</strong> lelang ditemukan
                    </span>
                </div>

                {/* Auctions List */}
                {auctions.data.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                        <History className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Belum Ada Riwayat
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Belum ada lelang yang disetujui atau ditolak
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Barang
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Seller
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Harga Awal
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Waktu Lelang
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {auctions.data.map((auction) => {
                                    const status = statusConfig[auction.status];
                                    const StatusIcon = status?.icon || CheckCircle;

                                    return (
                                        <tr key={auction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                                        {auction.primary_image ? (
                                                            <img
                                                                src={auction.primary_image}
                                                                alt={auction.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Gavel className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {auction.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {auction.seller.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {auction.seller.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {auction.category.icon} {auction.category.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(auction.starting_price)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status?.color || ''}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    {status?.label || auction.status}
                                                </span>
                                                {auction.status === 'rejected' && auction.metadata?.rejection_reason && (
                                                    <p className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={auction.metadata.rejection_reason}>
                                                        Alasan: {auction.metadata.rejection_reason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {auction.starts_at ? (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(auction.starts_at)}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/auctions/${auction.uuid}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Lihat
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
