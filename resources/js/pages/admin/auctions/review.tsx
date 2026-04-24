import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
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
    Hash
} from 'lucide-react';

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
            approveForm.setError('starts_at', 'Waktu mulai harus lebih dari waktu saat ini.');
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
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
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

            <div className="p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/admin/auctions/pending"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
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

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Auction Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Images */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4">
                            {auction.images && auction.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {auction.images.map((image, index) => (
                                        <div 
                                            key={index} 
                                            className={`rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 ${
                                                index === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${auction.title} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <Gavel className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="text-sm text-amber-600 dark:text-amber-400">
                                        {auction.category.icon} {auction.category.name}
                                    </span>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                                        {auction.title}
                                    </h2>
                                </div>
                            </div>
                            
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                    {auction.description}
                                </p>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-amber-500" />
                                Informasi Penjual
                            </h3>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                    {auction.seller.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                        {auction.seller.name}
                                    </p>
                                    
                                    {/* Contact Details */}
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{auction.seller.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Hash className="w-4 h-4 text-gray-400" />
                                            <span>PIN: <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">{auction.seller.pin}</span></span>
                                        </div>
                                    </div>
                                    
                                    {/* Chat Button */}
                                    <button
                                        onClick={handleStartChat}
                                        disabled={isChatting}
                                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        {isChatting ? 'Membuka Chat...' : 'Chat dengan Penjual'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Price & Duration Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-amber-500" />
                                Detail Lelang
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Harga Awal</span>
                                    <span className="font-bold text-amber-500">
                                        {formatCurrency(auction.starting_price)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Kelipatan Bid</span>
                                    <span className="text-gray-900 dark:text-white">
                                        {formatCurrency(auction.bid_increment)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Biaya Pendaftaran</span>
                                    <span className={`font-medium ${auction.registration_fee > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {auction.registration_fee > 0 ? formatCurrency(auction.registration_fee) : 'Gratis'}
                                    </span>
                                </div>

                                {/* Separator */}
                                <div className="border-t border-gray-200 dark:border-gray-700" />

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        Durasi
                                    </span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg text-sm">
                                        {auction.metadata?.requested_duration_hours || 24} Jam
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Diajukan
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm text-right">
                                        {formatDateTime(auction.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Approve Form */}
                        <form onSubmit={handleApprove} className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-500" />
                                Jadwalkan Lelang
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Waktu Mulai
                                </label>
                                <input
                                    type="datetime-local"
                                    value={approveForm.data.starts_at}
                                    onChange={(e) => approveForm.setData('starts_at', e.target.value)}
                                    min={getMinDateTime()}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                {approveForm.errors.starts_at && (
                                    <p className="text-red-500 text-sm mt-1">{approveForm.errors.starts_at}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={approveForm.processing}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="w-5 h-5" />
                                {approveForm.processing ? 'Menyetujui...' : 'Setujui Lelang'}
                            </button>
                        </form>

                        {/* Reject Button */}
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                            <XCircle className="w-5 h-5" />
                            Tolak Pengajuan
                        </button>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Tolak Pengajuan
                        </h3>
                        <form onSubmit={handleReject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Alasan Penolakan
                                </label>
                                <textarea
                                    value={rejectForm.data.rejection_reason}
                                    onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                    placeholder="Jelaskan alasan penolakan..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                />
                                {rejectForm.errors.rejection_reason && (
                                    <p className="text-red-500 text-sm mt-1">{rejectForm.errors.rejection_reason}</p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={rejectForm.processing}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {rejectForm.processing ? 'Menolak...' : 'Tolak'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
