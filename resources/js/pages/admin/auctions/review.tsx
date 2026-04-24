import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Gavel,
    CheckCircle,
    XCircle,
    User as UserIcon,
    Calendar,
    Clock,
    DollarSign,
    MessageCircle,
    Mail,
    Hash,
} from 'lucide-react';
import { useState } from 'react';
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
    pin: string;
}

interface Auction {
    id: number;
    uuid: string;
    title: string;
    description: string;
    images: string[];
    primary_image: string | null;
    starting_price: number;
    bid_increment: number;
    registration_fee: number;
    created_at: string;
    category: Category;
    seller: Seller;
    metadata?: {
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

export default function ReviewAuction({ auction }: Props) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [isChatting, setIsChatting] = useState(false);

    const approveForm = useForm({
        starts_at: getDefaultStartTime(),
    });

    const rejectForm = useForm({
        rejection_reason: '',
    });

    // Convert Date to local ISO string for datetime-local input (timezone-aware)
    function getLocalISOString(date: Date): string {
        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - offset * 60 * 1000);
        return local.toISOString().slice(0, 16);
    }

    function getDefaultStartTime(): string {
        const date = new Date();
        date.setHours(date.getHours() + 1);
        date.setMinutes(0);
        return getLocalISOString(date);
    }

    function getMinDateTime(): string {
        return getLocalISOString(new Date());
    }

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        // Double-check the selected time is still in the future
        const selectedTime = new Date(approveForm.data.starts_at);
        if (selectedTime <= new Date()) {
            approveForm.setError(
                'starts_at',
                'Waktu mulai harus lebih dari waktu saat ini.',
            );
            return;
        }
        approveForm.post(`/admin/auctions/${auction.uuid}/approve`);
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        rejectForm.post(`/admin/auctions/${auction.uuid}/reject`);
    };

    const handleStartChat = async () => {
        setIsChatting(true);
        try {
            const response = await fetch('/chat/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ user_id: auction.seller.id }),
            });

            if (response.ok) {
                // Redirect to chat page
                router.visit('/chat');
            }
        } catch (error) {
            console.error('Failed to start chat:', error);
        } finally {
            setIsChatting(false);
        }
    };

    return (
        <AppLayout>
            <Head title={`Tinjau: ${auction.title} - Admin`} />

            <div className="mx-auto max-w-5xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/admin/auctions/pending"
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Tinjau Pengajuan Lelang
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Periksa detail dan setujui atau tolak pengajuan ini
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Auction Details */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Images */}
                        <div className="rounded-2xl bg-white p-4 dark:bg-gray-800">
                            {auction.images && auction.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {auction.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 ${
                                                index === 0
                                                    ? 'col-span-2 aspect-video'
                                                    : 'aspect-square'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${auction.title} - ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                                    <Gavel className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <span className="text-sm text-amber-600 dark:text-amber-400">
                                        {auction.category.icon}{' '}
                                        {auction.category.name}
                                    </span>
                                    <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                                        {auction.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                                    {auction.description}
                                </p>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <UserIcon className="h-5 w-5 text-amber-500" />
                                Informasi Penjual
                            </h3>
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white">
                                    {auction.seller.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {auction.seller.name}
                                    </p>

                                    {/* Contact Details */}
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span>{auction.seller.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Hash className="h-4 w-4 text-gray-400" />
                                            <span>
                                                PIN:{' '}
                                                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                                                    {auction.seller.pin}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Chat Button */}
                                    <button
                                        onClick={handleStartChat}
                                        disabled={isChatting}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        {isChatting
                                            ? 'Membuka Chat...'
                                            : 'Chat dengan Penjual'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Price & Duration Info */}
                        <div className="rounded-2xl bg-white p-6 dark:bg-gray-800">
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <DollarSign className="h-5 w-5 text-amber-500" />
                                Detail Lelang
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Harga Awal
                                    </span>
                                    <span className="font-bold text-amber-500">
                                        {formatCurrency(auction.starting_price)}
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
                                        Biaya Pendaftaran
                                    </span>
                                    <span
                                        className={`font-medium ${auction.registration_fee > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}
                                    >
                                        {auction.registration_fee > 0
                                            ? formatCurrency(
                                                  auction.registration_fee,
                                              )
                                            : 'Gratis'}
                                    </span>
                                </div>

                                {/* Separator */}
                                <div className="border-t border-gray-200 dark:border-gray-700" />

                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        Durasi
                                    </span>
                                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                        {auction.metadata
                                            ?.requested_duration_hours ||
                                            24}{' '}
                                        Jam
                                    </span>
                                </div>
                                <div className="flex items-start justify-between">
                                    <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        Diajukan
                                    </span>
                                    <span className="text-right text-sm text-gray-700 dark:text-gray-300">
                                        {formatDateTime(auction.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Approve Form */}
                        <form
                            onSubmit={handleApprove}
                            className="rounded-2xl bg-white p-6 dark:bg-gray-800"
                        >
                            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                <Calendar className="h-5 w-5 text-green-500" />
                                Jadwalkan Lelang
                            </h3>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Waktu Mulai
                                </label>
                                <input
                                    type="datetime-local"
                                    value={approveForm.data.starts_at}
                                    onChange={(e) =>
                                        approveForm.setData(
                                            'starts_at',
                                            e.target.value,
                                        )
                                    }
                                    min={getMinDateTime()}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {approveForm.errors.starts_at && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {approveForm.errors.starts_at}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={approveForm.processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                            >
                                <CheckCircle className="h-5 w-5" />
                                {approveForm.processing
                                    ? 'Menyetujui...'
                                    : 'Setujui Lelang'}
                            </button>
                        </form>

                        {/* Reject Button */}
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-100 px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        >
                            <XCircle className="h-5 w-5" />
                            Tolak Pengajuan
                        </button>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                            Tolak Pengajuan
                        </h3>
                        <form onSubmit={handleReject}>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Alasan Penolakan
                                </label>
                                <textarea
                                    value={rejectForm.data.rejection_reason}
                                    onChange={(e) =>
                                        rejectForm.setData(
                                            'rejection_reason',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Jelaskan alasan penolakan..."
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {rejectForm.errors.rejection_reason && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {rejectForm.errors.rejection_reason}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 rounded-xl px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectForm.processing}
                                    className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                                >
                                    {rejectForm.processing
                                        ? 'Menolak...'
                                        : 'Tolak'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
