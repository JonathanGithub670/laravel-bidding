import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, Eye, Gavel, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface Auction {
    id: number;
    title: string;
    primary_image: string | null;
    starting_price: number;
    current_price: number;
    status: 'pending' | 'scheduled' | 'live' | 'ended' | 'rejected' | 'cancelled';
    created_at: string;
    starts_at: string | null;
    ends_at: string | null;
    category: Category;
    metadata?: {
        rejection_reason?: string;
    };
}

interface Props {
    auctions: {
        data: Auction[];
        links: any;
    };
}

function formatCurrency(amount: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const statusConfig = {
    pending: {
        label: 'Menunggu Persetujuan',
        icon: Loader2,
        spin: true,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    scheduled: {
        label: 'Disetujui',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    live: {
        label: 'Sedang Berlangsung',
        icon: AlertCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
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
    cancelled: {
        label: 'Dibatalkan',
        icon: XCircle,
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    },
};

export default function MyAuctionsIndex({ auctions }: Props) {
    return (
        <AppLayout>
            <Head title="Jual Barang - My Auctions" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Jual Barang
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Kelola barang yang ingin Anda lelang
                        </p>
                    </div>
                    <Link
                        href="/my-auctions/create"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#3D6E99] text-white font-semibold hover:shadow-lg hover:shadow-[#4A7FB5]/25 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Ajukan Lelang
                    </Link>
                </div>

                {/* Auctions List */}
                {auctions.data.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                        <Gavel className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Belum Ada Barang
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Anda belum mengajukan barang untuk dilelang
                        </p>
                        <Link
                            href="/my-auctions/create"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4A7FB5] text-white font-semibold hover:bg-[#3D6E99] transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Ajukan Lelang Pertama
                        </Link>
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
                                        Kategori
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Harga Awal
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {auctions.data.map((auction) => {
                                    const status = statusConfig[auction.status];
                                    const StatusIcon = status.icon;

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
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                                    <StatusIcon className={`w-4 h-4 ${'spin' in status && status.spin ? 'animate-spin' : ''}`} />
                                                    {status.label}
                                                </span>
                                                {auction.status === 'rejected' && auction.metadata?.rejection_reason && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        Alasan: {auction.metadata.rejection_reason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {formatDate(auction.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/my-auctions/${auction.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-[#4A7FB5] hover:bg-sky-50 dark:text-[#6B9FCC] dark:hover:bg-sky-900/20 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
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
