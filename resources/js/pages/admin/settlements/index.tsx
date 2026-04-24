import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import {
    Clock,
    CheckCircle,
    XCircle,
    HandCoins,
    Truck,
    Package,
    Check,
    X,
    AlertCircle,
    CalendarClock,
    Banknote,
    ShieldCheck,
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Auction {
    id: number;
    title: string;
    status: string;
    primary_image: string | null;
}

interface Settlement {
    id: number;
    auction_id: number;
    amount: number;
    admin_fee: number;
    app_fee: number;
    seller_amount: number;
    status: 'pending' | 'approved' | 'disbursed' | 'completed' | 'rejected';
    fund_status: 'held' | 'approved' | 'scheduled' | 'disbursed';
    delivery_status: 'pending' | 'shipping' | 'delivered';
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
    formatted_app_fee: string;
    formatted_seller_amount: string;
    status_badge: { label: string; color: string };
    fund_status_badge: { label: string; color: string };
    delivery_status_badge: { label: string; color: string };
    auction: Auction;
    seller: User;
    winner: User;
    approved_by_user: User | null;
}

interface PaginatedData {
    data: Settlement[];
    current_page: number;
    last_page: number;
}

interface Props {
    settlements: PaginatedData;
    counts: Record<string, number>;
    currentStatus: string;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending: {
        label: 'Menunggu',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    approved: {
        label: 'Disetujui',
        icon: ShieldCheck,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    disbursed: {
        label: 'Dana Dicairkan',
        icon: Banknote,
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    completed: {
        label: 'Selesai',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    rejected: {
        label: 'Ditolak',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

const fundStatusColors: Record<string, string> = {
    held: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    scheduled: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    disbursed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const deliveryStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    shipping: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function AdminSettlementsIndex({ settlements, counts, currentStatus }: Props) {
    const [approvingId, setApprovingId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [confirmShippingId, setConfirmShippingId] = useState<number | null>(null);
    const [confirmDeliveredId, setConfirmDeliveredId] = useState<number | null>(null);

    const approveForm = useForm({
        disbursement_date: '',
        estimated_delivery_date: '',
        notes: '',
    });

    const rejectForm = useForm({ reason: '' });
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props as any;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleApprove = (id: number) => {
        approveForm.post(`/admin/settlements/${id}/approve`, {
            onSuccess: () => {
                setApprovingId(null);
                approveForm.reset();
            },
        });
    };

    const handleReject = (id: number) => {
        rejectForm.post(`/admin/settlements/${id}/reject`, {
            onSuccess: () => {
                setRejectingId(null);
                rejectForm.reset();
            },
        });
    };

    const handleConfirmShipping = (id: number) => {
        setConfirmShippingId(null);
        setProcessingId(id);
        router.post(`/admin/settlements/${id}/confirm-shipping`, {}, {
            onFinish: () => setProcessingId(null),
        });
    };

    const handleMarkDelivered = (id: number) => {
        setConfirmDeliveredId(null);
        setProcessingId(id);
        router.post(`/admin/settlements/${id}/mark-delivered`, {}, {
            onFinish: () => setProcessingId(null),
        });
    };

    const tabs = [
        { key: 'all', label: 'Semua' },
        { key: 'pending', label: 'Menunggu' },
        { key: 'approved', label: 'Disetujui' },
        { key: 'disbursed', label: 'Dicairkan' },
        { key: 'completed', label: 'Selesai' },
        { key: 'rejected', label: 'Ditolak' },
    ];

    return (
        <AppLayout>
            <Head title="Penyelesaian Lelang" />

            <div className="p-6">
                {/* Confirm Shipping Modal */}
                {confirmShippingId !== null && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                                <Truck className="h-8 w-8 text-indigo-500" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-bold text-gray-900 dark:text-white">
                                Konfirmasi Pengiriman
                            </h3>
                            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                                Konfirmasi bahwa barang telah dikirim ke pemenang lelang?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmShippingId(null)}
                                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Tidak
                                </button>
                                <button
                                    onClick={() => handleConfirmShipping(confirmShippingId)}
                                    className="flex-1 rounded-xl bg-indigo-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Setuju
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirm Delivered Modal */}
                {confirmDeliveredId !== null && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="relative mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <Package className="h-8 w-8 text-green-500" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-bold text-gray-900 dark:text-white">
                                Konfirmasi Barang Sampai
                            </h3>
                            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-400">
                                Konfirmasi bahwa barang telah sampai ke pemenang lelang?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmDeliveredId(null)}
                                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Tidak
                                </button>
                                <button
                                    onClick={() => handleMarkDelivered(confirmDeliveredId)}
                                    className="flex-1 rounded-xl bg-green-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Setuju
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            {flash.success}
                        </p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            {flash.error}
                        </p>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Penyelesaian Lelang
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Kelola pencairan dana dan pengiriman barang dari lelang yang sudah berakhir
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/40">
                                <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">Menunggu</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                                <ShieldCheck className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{counts.approved}</p>
                                <p className="text-sm text-blue-700 dark:text-blue-400">Disetujui</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-indigo-100 p-2 dark:bg-indigo-900/40">
                                <Banknote className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-indigo-600">{counts.disbursed}</p>
                                <p className="text-sm text-indigo-700 dark:text-indigo-400">Dicairkan</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{counts.completed}</p>
                                <p className="text-sm text-green-700 dark:text-green-400">Selesai</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
                                <p className="text-sm text-red-700 dark:text-red-400">Ditolak</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-4 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={`/admin/settlements?status=${tab.key}`}
                            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition-colors ${
                                currentStatus === tab.key
                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                        >
                            {tab.label}
                            <span className="ml-2 text-xs">({counts[tab.key] || 0})</span>
                        </Link>
                    ))}
                </div>

                {/* Table */}
                {settlements.data.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <HandCoins className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Tidak ada data
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tidak ada penyelesaian lelang dengan status ini
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {settlements.data.map((item) => {
                            const status = statusConfig[item.status] || statusConfig.pending;
                            const isApproving = approvingId === item.id;
                            const isRejecting = rejectingId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900/50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {item.reference_number}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                                            >
                                                <status.icon className="h-3.5 w-3.5" />
                                                {status.label}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(item.created_at)}
                                        </span>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="grid gap-6 md:grid-cols-3">
                                            {/* Auction Info */}
                                            <div>
                                                <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                                                    Lelang
                                                </h4>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {item.auction?.title || '-'}
                                                </p>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Pemilik:</span>{' '}
                                                        {item.seller?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        <span className="font-medium">Pemenang:</span>{' '}
                                                        {item.winner?.name}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Financial Info */}
                                            <div>
                                                <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                                                    Dana
                                                </h4>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-500">
                                                        Bid Pemenang:{' '}
                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                            {item.formatted_amount}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Biaya Admin:{' '}
                                                        <span className="font-semibold text-green-600">
                                                            Gratis
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Biaya Aplikasi:{' '}
                                                        <span className="text-red-500">
                                                            -{item.formatted_app_fee}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm font-semibold text-green-600">
                                                        Dana Seller: {item.formatted_seller_amount}
                                                    </p>
                                                </div>
                                                <div className="mt-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${fundStatusColors[item.fund_status] || ''}`}
                                                    >
                                                        <Banknote className="h-3 w-3" />
                                                        {item.fund_status_badge?.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delivery & Schedule Info */}
                                            <div>
                                                <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                                                    Pengiriman & Jadwal
                                                </h4>
                                                <div className="space-y-1">
                                                    {item.disbursement_date && (
                                                        <p className="flex items-center gap-1.5 text-sm text-gray-500">
                                                            <CalendarClock className="h-3.5 w-3.5" />
                                                            Pencairan:{' '}
                                                            <span className="font-medium">
                                                                {formatDateShort(item.disbursement_date)}
                                                            </span>
                                                        </p>
                                                    )}
                                                    {item.estimated_delivery_date && (
                                                        <p className="flex items-center gap-1.5 text-sm text-gray-500">
                                                            <Truck className="h-3.5 w-3.5" />
                                                            Estimasi Sampai:{' '}
                                                            <span className="font-medium">
                                                                {formatDateShort(
                                                                    item.estimated_delivery_date,
                                                                )}
                                                            </span>
                                                        </p>
                                                    )}
                                                    {item.delivery_confirmed_at && (
                                                        <p className="flex items-center gap-1.5 text-sm text-green-600">
                                                            <Package className="h-3.5 w-3.5" />
                                                            Terkirim:{' '}
                                                            {formatDateShort(
                                                                item.delivery_confirmed_at,
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${deliveryStatusColors[item.delivery_status] || ''}`}
                                                    >
                                                        <Truck className="h-3 w-3" />
                                                        {item.delivery_status_badge?.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Notes */}
                                        {item.admin_notes && (
                                            <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/30">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">Catatan Admin:</span>{' '}
                                                    {item.admin_notes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Approve Form */}
                                        {isApproving && (
                                            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                                <h4 className="mb-3 font-semibold text-blue-700 dark:text-blue-400">
                                                    Approve Pencairan Dana
                                                </h4>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Tanggal Pencairan Dana
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={approveForm.data.disbursement_date}
                                                            onChange={(e) =>
                                                                approveForm.setData(
                                                                    'disbursement_date',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            min={
                                                                new Date()
                                                                    .toISOString()
                                                                    .split('T')[0]
                                                            }
                                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                        {approveForm.errors.disbursement_date && (
                                                            <p className="mt-1 text-xs text-red-500">
                                                                {approveForm.errors.disbursement_date}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Estimasi Barang Sampai
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={
                                                                approveForm.data
                                                                    .estimated_delivery_date
                                                            }
                                                            onChange={(e) =>
                                                                approveForm.setData(
                                                                    'estimated_delivery_date',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            min={
                                                                new Date()
                                                                    .toISOString()
                                                                    .split('T')[0]
                                                            }
                                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                        />
                                                        {approveForm.errors
                                                            .estimated_delivery_date && (
                                                            <p className="mt-1 text-xs text-red-500">
                                                                {
                                                                    approveForm.errors
                                                                        .estimated_delivery_date
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Catatan (Opsional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={approveForm.data.notes}
                                                        onChange={(e) =>
                                                            approveForm.setData(
                                                                'notes',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Catatan tambahan..."
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                                <div className="mt-3 flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(item.id)}
                                                        disabled={
                                                            !approveForm.data.disbursement_date ||
                                                            !approveForm.data
                                                                .estimated_delivery_date ||
                                                            approveForm.processing
                                                        }
                                                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        Approve & Jadwalkan
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setApprovingId(null);
                                                            approveForm.reset();
                                                        }}
                                                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Reject Form */}
                                        {isRejecting && (
                                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                                                <h4 className="mb-3 font-semibold text-red-700 dark:text-red-400">
                                                    Tolak Settlement
                                                </h4>
                                                <input
                                                    type="text"
                                                    value={rejectForm.data.reason}
                                                    onChange={(e) =>
                                                        rejectForm.setData(
                                                            'reason',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Alasan penolakan..."
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                                {rejectForm.errors.reason && (
                                                    <p className="mt-1 text-xs text-red-500">
                                                        {rejectForm.errors.reason}
                                                    </p>
                                                )}
                                                <div className="mt-3 flex gap-2">
                                                    <button
                                                        onClick={() => handleReject(item.id)}
                                                        disabled={
                                                            !rejectForm.data.reason ||
                                                            rejectForm.processing
                                                        }
                                                        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Tolak
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setRejectingId(null);
                                                            rejectForm.reset();
                                                        }}
                                                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {!isApproving && !isRejecting && (
                                            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                                                {item.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => setApprovingId(item.id)}
                                                            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                        >
                                                            <ShieldCheck className="h-4 w-4" />
                                                            Approve Dana
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectingId(item.id)}
                                                            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}

                                                {item.status === 'approved' &&
                                                    item.delivery_status === 'pending' && (
                                                        <button
                                                            onClick={() =>
                                                                setConfirmShippingId(item.id)
                                                            }
                                                            disabled={processingId === item.id}
                                                            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                                                        >
                                                            <Truck className="h-4 w-4" />
                                                            Konfirmasi Kirim Barang
                                                        </button>
                                                    )}

                                                {item.delivery_status === 'shipping' && (
                                                    <button
                                                        onClick={() =>
                                                            setConfirmDeliveredId(item.id)
                                                        }
                                                        disabled={processingId === item.id}
                                                        className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        Barang Sudah Sampai
                                                    </button>
                                                )}

                                                {item.approved_by_user && (
                                                    <span className="ml-auto self-center text-xs text-gray-400">
                                                        Diproses oleh {item.approved_by_user.name}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                        href={`/admin/settlements?status=${currentStatus}&page=${page}`}
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                                            page === settlements.current_page
                                                ? 'bg-violet-600 text-white'
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
