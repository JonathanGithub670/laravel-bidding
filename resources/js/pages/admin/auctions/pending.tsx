import { Head, Link } from '@inertiajs/react';
import { Clock, Eye, Gavel, CheckCircle, RefreshCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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
    registration_fee: number;
    created_at: string;
    category: Category;
    seller: Seller;
    metadata?: {
        requested_duration_hours?: number;
    };
}

interface Props {
    auctions: {
        data: Auction[];
        links: { url: string | null; label: string; active: boolean }[];
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
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function PendingAuctions({ auctions }: Props) {
    return (
        <AppLayout>
            <Head title="Persetujuan Lelang - Admin" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Persetujuan Lelang
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tinjau dan setujui pengajuan lelang dari pengguna
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/reimbursements"
                            className="flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-2.5 font-medium text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-800/40"
                        >
                            <RefreshCcw className="h-5 w-5" />
                            Reimburse Lelang
                        </Link>
                        <Link
                            href="/admin/auctions/history"
                            className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Clock className="h-5 w-5" />
                            Riwayat
                        </Link>
                    </div>
                </div>

                {/* Pending Count */}
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="text-yellow-800 dark:text-yellow-300">
                        <strong>{auctions.data.length}</strong> pengajuan
                        menunggu persetujuan
                    </span>
                </div>

                {/* Auctions List */}
                {auctions.data.length === 0 ? (
                    <div className="rounded-2xl bg-white py-16 text-center dark:bg-gray-800">
                        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
                            Semua Sudah Ditinjau
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada pengajuan lelang yang perlu ditinjau
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
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
                                        Biaya Pendaftaran
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Durasi
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Diajukan
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {auctions.data.map((auction) => (
                                    <tr
                                        key={auction.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                                    {auction.primary_image ? (
                                                        <img
                                                            src={
                                                                auction.primary_image
                                                            }
                                                            alt={auction.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <Gavel className="h-6 w-6 text-gray-400" />
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
                                                {auction.category.icon}{' '}
                                                {auction.category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    auction.starting_price,
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`font-medium ${auction.registration_fee > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}
                                            >
                                                {auction.registration_fee > 0
                                                    ? formatCurrency(
                                                          auction.registration_fee,
                                                      )
                                                    : 'Gratis'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {auction.metadata
                                                ?.requested_duration_hours ||
                                                24}{' '}
                                            Jam
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {formatDate(auction.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/auctions/${auction.uuid}/review`}
                                                className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Tinjau
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
