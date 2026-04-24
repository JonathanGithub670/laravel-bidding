import { Head, Link, router } from '@inertiajs/react';
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    DollarSign,
    AlertCircle,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Auction {
    id: number;
    title: string;
    images?: string[];
}

interface Winner {
    id: number;
    name: string;
}

interface Settlement {
    id: number;
    auction_id: number;
    seller_id: number;
    winner_id: number;
    amount: number;
    admin_fee: number;
    seller_amount: number;
    status: string;
    fund_status: string;
    delivery_status: string;
    disbursement_date: string | null;
    estimated_delivery_date: string | null;
    delivery_confirmed_at: string | null;
    approved_at: string | null;
    disbursed_at: string | null;
    admin_notes: string | null;
    reference_number: string;
    created_at: string;
    formatted_amount: string;
    formatted_admin_fee: string;
    formatted_seller_amount: string;
    status_badge: { label: string; color: string };
    fund_status_badge: { label: string; color: string };
    delivery_status_badge: { label: string; color: string };
    auction: Auction;
    winner: Winner;
}

interface PaginatedData {
    data: Settlement[];
    current_page: number;
    last_page: number;
}

interface Props {
    settlements: PaginatedData;
    counts: {
        total: number;
        pending: number;
        shipping: number;
        completed: number;
    };
}

const deliveryStatusConfig: Record<
    string,
    { icon: typeof Clock; colorClass: string }
> = {
    pending: {
        icon: Clock,
        colorClass:
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    shipping: {
        icon: Truck,
        colorClass:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    delivered: {
        icon: CheckCircle,
        colorClass:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
};

const fundStatusConfig: Record<string, { colorClass: string }> = {
    held: {
        colorClass:
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    scheduled: {
        colorClass:
            'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    disbursed: {
        colorClass:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
};

export default function SellerSettlements({ settlements, counts }: Props) {
    const [confirmingId, setConfirmingId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleConfirmShipping = (settlementId: number) => {
        setProcessing(true);
        router.post(
            `/my-auctions/settlements/${settlementId}/confirm-shipping`,
            {},
            {
                onSuccess: () => {
                    setConfirmingId(null);
                    setProcessing(false);
                },
                onError: () => {
                    setProcessing(false);
                },
            },
        );
    };

    const canConfirmShipping = (settlement: Settlement) => {
        return (
            ['pending', 'approved'].includes(settlement.status) &&
            settlement.delivery_status === 'pending'
        );
    };

    return (
        <AppLayout>
            <Head title="Barang Terjual" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        📦 Barang Terjual
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Kelola pengiriman barang yang berhasil terjual melalui
                        lelang
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
                                <Package className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-600">
                                    {counts.total}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/40">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {counts.pending}
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    Belum Dikirim
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                                <Truck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">
                                    {counts.shipping}
                                </p>
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                    Sedang Dikirim
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">
                                    {counts.completed}
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    Selesai
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settlements list */}
                {settlements.data.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <Package className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Belum ada barang terjual
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Barang yang Anda jual melalui lelang akan muncul di
                            sini
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {settlements.data.map((settlement) => {
                            const deliveryConfig =
                                deliveryStatusConfig[
                                    settlement.delivery_status
                                ] || deliveryStatusConfig.pending;
                            const fundConfig =
                                fundStatusConfig[settlement.fund_status] ||
                                fundStatusConfig.held;
                            const DeliveryIcon = deliveryConfig.icon;

                            return (
                                <div
                                    key={settlement.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Item info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4">
                                                {/* Auction image */}
                                                {settlement.auction?.images &&
                                                settlement.auction.images
                                                    .length > 0 ? (
                                                    <img
                                                        src={`/storage/${settlement.auction.images[0]}`}
                                                        alt={
                                                            settlement.auction
                                                                .title
                                                        }
                                                        className="h-16 w-16 rounded-xl border border-gray-200 object-cover dark:border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {settlement.auction
                                                            ?.title ||
                                                            `Lelang #${settlement.auction_id}`}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Ref:{' '}
                                                        {
                                                            settlement.reference_number
                                                        }
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        Pemenang:{' '}
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            {settlement.winner
                                                                ?.name || '-'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price info */}
                                        <div className="flex flex-col items-end gap-1 text-right">
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                {
                                                    settlement.formatted_seller_amount
                                                }
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Harga:{' '}
                                                {settlement.formatted_amount} •
                                                Fee:{' '}
                                                {settlement.formatted_admin_fee}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status badges & actions */}
                                    <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 lg:flex-row lg:items-center lg:justify-between dark:border-gray-700">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Delivery status */}
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${deliveryConfig.colorClass}`}
                                            >
                                                <DeliveryIcon className="h-3.5 w-3.5" />
                                                {
                                                    settlement
                                                        .delivery_status_badge
                                                        .label
                                                }
                                            </span>

                                            {/* Fund status */}
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${fundConfig.colorClass}`}
                                            >
                                                <DollarSign className="h-3.5 w-3.5" />
                                                {
                                                    settlement.fund_status_badge
                                                        .label
                                                }
                                            </span>

                                            {/* Overall status */}
                                            {settlement.status ===
                                                'rejected' && (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    Ditolak
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Dates */}
                                            {settlement.disbursed_at && (
                                                <p className="text-xs text-green-600 dark:text-green-400">
                                                    Dana dicairkan:{' '}
                                                    {formatDate(
                                                        settlement.disbursed_at,
                                                    )}
                                                </p>
                                            )}

                                            {/* Confirm shipping button */}
                                            {canConfirmShipping(settlement) && (
                                                <>
                                                    {confirmingId ===
                                                    settlement.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                Yakin?
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleConfirmShipping(
                                                                        settlement.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                                            >
                                                                {processing
                                                                    ? 'Mengirim...'
                                                                    : 'Ya, Kirim'}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setConfirmingId(
                                                                        null,
                                                                    )
                                                                }
                                                                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                setConfirmingId(
                                                                    settlement.id,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                        >
                                                            <Truck className="h-4 w-4" />
                                                            Konfirmasi Kirim
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {settlement.delivery_status ===
                                                'shipping' && (
                                                <span className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                                    <Truck className="h-4 w-4 animate-pulse" />
                                                    Barang sedang dikirim
                                                </span>
                                            )}

                                            {settlement.delivery_status ===
                                                'delivered' && (
                                                <span className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Barang telah sampai
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Admin notes */}
                                    {settlement.admin_notes && (
                                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                                {settlement.admin_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Pagination */}
                        {settlements.last_page > 1 && (
                            <div className="flex justify-center gap-2 pt-4">
                                {Array.from(
                                    { length: settlements.last_page },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/my-auctions/settlements?page=${page}`}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                                            page === settlements.current_page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
