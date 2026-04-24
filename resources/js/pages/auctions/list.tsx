import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { 
    Gavel, 
    Clock, 
    Eye, 
    Filter, 
    ChevronRight,
    Trophy,
    Calendar,
    X
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    auctions_count: number;
}

interface Seller {
    id: number;
    name: string;
}

interface Auction {
    id: number;
    uuid: string;
    title: string;
    description: string;
    images: string[];
    primary_image: string | null;
    current_price: number;
    starting_price: number;
    status: 'scheduled' | 'live' | 'ended';
    starts_at: string;
    ends_at: string;
    bids_count: number;
    views_count: number;
    category: Category;
    seller: Seller;
}

interface PaginatedAuctions {
    data: Auction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    auctions: PaginatedAuctions;
    categories: Category[];
    currentCategory: string | null;
    currentStatus: string;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
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

function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        live: 'Sedang Berlangsung',
        scheduled: 'Akan Datang',
        ended: 'Selesai',
    };
    return labels[status] || status;
}

function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        live: 'bg-red-500 text-white',
        scheduled: 'bg-blue-500 text-white',
        ended: 'bg-gray-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
}

export default function AuctionList({ auctions, categories, currentCategory, currentStatus }: Props) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleCategoryFilter = (slug: string | null) => {
        router.get('/auctions/list', {
            category: slug,
            status: currentStatus !== 'all' ? currentStatus : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusFilter = (status: string) => {
        router.get('/auctions/list', {
            category: currentCategory,
            status: status !== 'all' ? status : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get('/auctions/list', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = currentCategory || currentStatus !== 'all';

    return (
        <AppLayout>
            <Head title="Daftar Lelang" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Gavel className="w-7 h-7 text-amber-500" />
                            Daftar Lelang
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Jelajahi semua lelang yang tersedia
                        </p>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filter
                        {hasActiveFilters && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-xs">
                                {(currentCategory ? 1 : 0) + (currentStatus !== 'all' ? 1 : 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                {isFilterOpen && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Filter</h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
                                >
                                    Hapus Semua Filter
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status Lelang
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'all', label: 'Semua' },
                                    { value: 'live', label: 'Sedang Berlangsung' },
                                    { value: 'scheduled', label: 'Akan Datang' },
                                    { value: 'ended', label: 'Selesai' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleStatusFilter(option.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            currentStatus === option.value
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kategori
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleCategoryFilter(null)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        !currentCategory
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Semua Kategori
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryFilter(category.slug)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                                            currentCategory === category.slug
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <span>{category.icon}</span>
                                        {category.name}
                                        <span className="text-xs opacity-75">({category.auctions_count})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                        {currentCategory && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm">
                                {categories.find(c => c.slug === currentCategory)?.icon}{' '}
                                {categories.find(c => c.slug === currentCategory)?.name}
                                <button
                                    onClick={() => handleCategoryFilter(null)}
                                    className="ml-1 hover:text-amber-900 dark:hover:text-amber-300"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {currentStatus !== 'all' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                {getStatusLabel(currentStatus)}
                                <button
                                    onClick={() => handleStatusFilter('all')}
                                    className="ml-1 hover:text-blue-900 dark:hover:text-blue-300"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Menampilkan {auctions.data.length} dari {auctions.total} lelang</span>
                </div>

                {/* Auction Grid */}
                {auctions.data.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {auctions.data.map((auction) => (
                            <Link
                                key={auction.id}
                                href={`/auctions/${auction.uuid}`}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg shadow-gray-900/5 dark:shadow-black/10 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                                    {auction.primary_image ? (
                                        <img
                                            src={auction.primary_image}
                                            alt={auction.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Gavel className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                        </div>
                                    )}
                                    
                                    {/* Status Badge */}
                                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(auction.status)}`}>
                                        {auction.status === 'live' && (
                                            <span className="inline-flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                LIVE
                                            </span>
                                        )}
                                        {auction.status === 'scheduled' && (
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                SOON
                                            </span>
                                        )}
                                        {auction.status === 'ended' && (
                                            <span className="inline-flex items-center gap-1">
                                                <Trophy className="w-3 h-3" />
                                                SELESAI
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                            {auction.category?.icon} {auction.category?.name}
                                        </p>
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate mt-1">
                                            {auction.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {auction.status === 'scheduled' ? 'Harga Awal' : 'Harga Saat Ini'}
                                            </p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(auction.current_price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {auction.status === 'scheduled' ? 'Mulai' : auction.status === 'live' ? 'Berakhir' : 'Selesai'}
                                            </p>
                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(auction.status === 'scheduled' ? auction.starts_at : auction.ends_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Gavel className="w-3 h-3" />
                                                {auction.bids_count} bid
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {auction.views_count}
                                            </span>
                                        </div>
                                        <span className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                                            Lihat Detail
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <Gavel className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Tidak ada lelang ditemukan
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Coba ubah filter pencarian Anda
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                Hapus Semua Filter
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {auctions.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {auctions.links.map((link, index) => (
                            <span key={index}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
