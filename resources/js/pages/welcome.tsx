import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import { useState, useEffect } from 'react';
import { 
    Gavel, 
    Diamond, 
    Clock, 
    TrendingUp, 
    Shield, 
    Users, 
    ArrowRight,
    Sun,
    Moon,
    Star,
    ChevronRight,
    Play
} from 'lucide-react';

// Interfaces for real data
interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    count: number;
}

interface FeaturedAuction {
    id: number;
    uuid: string;
    title: string;
    category: { name: string; icon: string } | null;
    currentBid: number;
    formattedPrice: string;
    image: string | null;
    timeLeft: string | null;
    startsAt: string | null;
    endsAt: string | null;
    totalBids: number;
    isLive: boolean;
    status: string;
}

interface Stats {
    activeAuctions: number;
    totalUsers: number;
    itemsSold: number;
    verifiedSellers: number;
}

interface WelcomeProps {
    canRegister?: boolean;
    featuredAuctions?: FeaturedAuction[];
    categories?: Category[];
    stats?: Stats;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function Welcome({
    canRegister = true,
    featuredAuctions = [],
    categories = [],
    stats = { activeAuctions: 0, totalUsers: 0, itemsSold: 0, verifiedSellers: 0 },
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference or saved preference
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <>
            <Head title="nathBid - Platform Lelang Premium">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800&display=swap"
                    rel="stylesheet"
                />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
                {/* Navigation */}
                <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 lg:h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <img src="/Logo.png" alt="nathBid" className="h-42 w-auto" />
                            </div>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#auctions" className="text-slate-600 dark:text-slate-300 hover:text-[#4A7FB5] dark:hover:text-sky-400 transition-colors text-sm font-medium">
                                    Live Auctions
                                </a>
                                <a href="#categories" className="text-slate-600 dark:text-slate-300 hover:text-[#4A7FB5] dark:hover:text-sky-400 transition-colors text-sm font-medium">
                                    Categories
                                </a>
                                <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-[#4A7FB5] dark:hover:text-sky-400 transition-colors text-sm font-medium">
                                    How It Works
                                </a>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-3">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
                                >
                                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>

                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-300/25 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="px-5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                                        >
                                            Login
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-300/25 transition-all duration-300 hover:-translate-y-0.5"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-[#4A7FB5] dark:text-sky-400 text-sm font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A7FB5] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3D6E99]"></span>
                                    </span>
                                    Live Auction Now
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                                    Temukan & Lelang{' '}
                                    <span className="bg-gradient-to-r from-[#3D6E99] via-[#4A7FB5] to-[#6B9FCC] bg-clip-text text-transparent">
                                        Barang Premium
                                    </span>
                                </h1>

                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                    Bergabunglah dengan platform lelang live paling eksklusif. Ikuti lelang untuk mendapatkan barang-barang premium dari penjual terverifikasi.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={register()}
                                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-300/30 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        Mulai Lelang
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-lg hover:border-[#4A7FB5] dark:hover:border-sky-500 hover:text-[#4A7FB5] dark:hover:text-sky-400 transition-all duration-300">
                                        <Play className="w-5 h-5" />
                                        Lihat Demo
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                            {stats.activeAuctions}+
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Lelang Aktif
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                            {stats.totalUsers}+
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Total Pengguna
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                            {stats.itemsSold}+
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Barang Terjual
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                            {stats.verifiedSellers}+
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Penjual Terverifikasi
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content - Featured Item */}
                            <div className="relative">
                                {featuredAuctions.length > 0 ? (
                                    <>
                                        <div className="absolute -inset-4 bg-gradient-to-r from-[#4A7FB5]/20 via-[#5B8DB8]/20 to-[#6B9FCC]/20 rounded-3xl blur-3xl"></div>
                                        <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-slate-900/10 dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50">
                                            {featuredAuctions[0].isLive && (
                                                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-semibold animate-pulse">
                                                    <span className="w-2 h-2 rounded-full bg-white"></span>
                                                    LIVE
                                                </div>
                                            )}
                                            
                                            <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-700">
                                                {featuredAuctions[0].image ? (
                                                    <img 
                                                        src={featuredAuctions[0].image}
                                                        alt={featuredAuctions[0].title}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Gavel className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-[#4A7FB5] dark:text-sky-400 text-sm font-medium">
                                                            {featuredAuctions[0].category?.icon} {featuredAuctions[0].category?.name}
                                                        </p>
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                            {featuredAuctions[0].title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[#4A7FB5]">
                                                        <Star className="w-5 h-5 fill-current" />
                                                        <span className="font-semibold">4.9</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">Current Bid</p>
                                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                            {featuredAuctions[0].formattedPrice}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {featuredAuctions[0].isLive ? 'Ends In' : 'Starts In'}
                                                        </p>
                                                        <p className="text-lg font-semibold text-rose-500 flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {featuredAuctions[0].timeLeft || 'Soon'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3, 4].map((i) => (
                                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B9FCC] to-[#4A7FB5] border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold">
                                                                {String.fromCharCode(65 + i)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                        {featuredAuctions[0].totalBids} bids placed
                                                    </span>
                                                </div>

                                                <Link
                                                    href={`/auctions/${featuredAuctions[0].uuid}`}
                                                    className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] text-white font-semibold text-lg text-center hover:shadow-lg hover:shadow-blue-300/25 transition-all duration-300 hover:-translate-y-0.5"
                                                >
                                                    {featuredAuctions[0].isLive ? 'Pasang Bid Sekarang' : 'Lihat Detail'}
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="relative bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center">
                                        <Gavel className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">Belum ada lelang aktif</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Auctions Section */}
                <section id="auctions" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                                    Lelang Aktif
                                </h2>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    Jangan lewatkan barang-barang eksklusif ini
                                </p>
                            </div>
                            <Link
                                href="#"
                                className="hidden sm:flex items-center gap-2 text-[#4A7FB5] dark:text-sky-400 font-medium hover:gap-3 transition-all"
                            >
                                Lihat Semua
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredAuctions.length > 0 ? (
                                featuredAuctions.map((auction) => (
                                    <Link
                                        key={auction.id}
                                        href={`/auctions/${auction.uuid}`}
                                        className="group bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg shadow-slate-900/5 dark:shadow-black/10 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-700">
                                            {auction.isLive && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                                    LIVE
                                                </div>
                                            )}
                                            {!auction.isLive && auction.status === 'scheduled' && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#4A7FB5] text-white text-xs font-semibold">
                                                    <Clock className="w-3 h-3" />
                                                    SEGERA
                                                </div>
                                            )}
                                            {auction.image ? (
                                                <img 
                                                    src={auction.image}
                                                    alt={auction.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Gavel className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-[#4A7FB5] dark:text-sky-400 font-medium">
                                                    {auction.category?.icon} {auction.category?.name}
                                                </p>
                                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                                    {auction.title}
                                                </h3>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Bid Saat Ini</p>
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        {auction.formattedPrice}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {auction.isLive ? 'Berakhir' : 'Dimulai'}
                                                    </p>
                                                    <p className="text-sm font-medium text-rose-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {auction.timeLeft || 'Segera'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {auction.totalBids} bid
                                                </span>
                                                <span className="px-4 py-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-[#4A7FB5] dark:text-sky-400 text-sm font-medium group-hover:bg-sky-200 dark:group-hover:bg-sky-900/50 transition-colors">
                                                    {auction.isLive ? 'Bid Sekarang' : 'Lihat'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <Gavel className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Belum ada lelang aktif. Silakan kembali lagi nanti!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                                Jelajahi Kategori
                            </h2>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Temukan koleksi barang-barang pilihan kami
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className="group p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg shadow-slate-900/5 dark:shadow-black/10 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 hover:border-[#4A7FB5]/50 dark:hover:border-sky-500/50 transition-all duration-300 cursor-pointer text-center"
                                >
                                    <div className="text-4xl mb-3">{category.icon}</div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#4A7FB5] dark:group-hover:text-sky-400 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {category.count} barang
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white">
                                Cara Kerja
                            </h2>
                            <p className="mt-2 text-slate-400">
                                Mulai ikuti lelang dalam 3 langkah mudah
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: '01',
                                    title: 'Buat Akun',
                                    description: 'Daftar gratis dan selesaikan verifikasi Anda untuk mulai mengikuti lelang barang-barang eksklusif.',
                                    icon: Users,
                                },
                                {
                                    step: '02',
                                    title: 'Temukan Barang',
                                    description: 'Jelajahi koleksi barang-barang pilihan kami dari berbagai kategori.',
                                    icon: Diamond,
                                },
                                {
                                    step: '03',
                                    title: 'Pasang Bid',
                                    description: 'Ikuti lelang live dan pasang bid secara real-time. Menangkan dan terima barang Anda dengan aman.',
                                    icon: Gavel,
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#6B9FCC]/50 transition-all duration-300"
                                >
                                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A7FB5] to-[#5B8DB8] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
                                        {item.step}
                                    </div>
                                    <div className="pt-6">
                                        <item.icon className="w-12 h-12 text-[#6B9FCC] mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="relative p-12 rounded-3xl bg-gradient-to-r from-[#3D6E99] via-[#4A7FB5] to-[#6B9FCC] overflow-hidden">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
                            <div className="relative">
                                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                    Siap Untuk Mulai Lelang?
                                </h2>
                                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                    Bergabunglah dengan ribuan kolektor dan penggemar. Buat akun Anda hari ini dan dapatkan akses ke lelang eksklusif.
                                </p>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#4A7FB5] font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    Buat Akun Gratis
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <img src="/Logo.png" alt="nathBid" className="h-42 w-auto" />
                            </div>

                            <div className="flex items-center gap-8">
                                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-[#4A7FB5] dark:hover:text-sky-400 text-sm transition-colors">
                                    Kebijakan Privasi
                                </a>
                                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-[#4A7FB5] dark:hover:text-sky-400 text-sm transition-colors">
                                    Ketentuan Layanan
                                </a>
                                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-[#4A7FB5] dark:hover:text-sky-400 text-sm transition-colors">
                                    Kontak
                                </a>
                            </div>

                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                © 2026 nathBid. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
