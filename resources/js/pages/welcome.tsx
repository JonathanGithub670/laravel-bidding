import { Head, Link, usePage } from '@inertiajs/react';
import {
    Gavel,
    Diamond,
    Clock,
    Users,
    ArrowRight,
    Sun,
    Moon,
    Star,
    ChevronRight,
    Play,
} from 'lucide-react';
import { useState } from 'react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

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

export default function Welcome({
    canRegister = true,
    featuredAuctions = [],
    categories = [],
    stats = {
        activeAuctions: 0,
        totalUsers: 0,
        itemsSold: 0,
        verifiedSellers: 0,
    },
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;
        const dark = savedTheme === 'dark' || (!savedTheme && systemDark);
        if (dark) {
            document.documentElement.classList.add('dark');
        }
        return dark;
    });

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

            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Navigation */}
                <nav className="fixed top-0 right-0 left-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between lg:h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <img
                                    src="/Logo.png"
                                    alt="nathBid"
                                    className="h-42 w-auto"
                                />
                            </div>

                            {/* Nav Links */}
                            <div className="hidden items-center gap-8 md:flex">
                                <a
                                    href="#auctions"
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-[#4A7FB5] dark:text-slate-300 dark:hover:text-sky-400"
                                >
                                    Live Auctions
                                </a>
                                <a
                                    href="#categories"
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-[#4A7FB5] dark:text-slate-300 dark:hover:text-sky-400"
                                >
                                    Categories
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="text-sm font-medium text-slate-600 transition-colors hover:text-[#4A7FB5] dark:text-slate-300 dark:hover:text-sky-400"
                                >
                                    How It Works
                                </a>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-3">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="rounded-xl bg-slate-100 p-2.5 text-slate-600 transition-all duration-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    {isDark ? (
                                        <Sun className="h-5 w-5" />
                                    ) : (
                                        <Moon className="h-5 w-5" />
                                    )}
                                </button>

                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300/25"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        >
                                            Login
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300/25"
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
                <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-[#4A7FB5] dark:bg-sky-900/30 dark:text-sky-400">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4A7FB5] opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3D6E99]"></span>
                                    </span>
                                    Live Auction Now
                                </div>

                                <h1 className="text-4xl leading-tight font-bold text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                                    Temukan & Lelang{' '}
                                    <span className="bg-gradient-to-r from-[#3D6E99] via-[#4A7FB5] to-[#6B9FCC] bg-clip-text text-transparent">
                                        Barang Premium
                                    </span>
                                </h1>

                                <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                                    Bergabunglah dengan platform lelang live
                                    paling eksklusif. Ikuti lelang untuk
                                    mendapatkan barang-barang premium dari
                                    penjual terverifikasi.
                                </p>

                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Link
                                        href={register()}
                                        className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-300/30"
                                    >
                                        Mulai Lelang
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:border-[#4A7FB5] hover:text-[#4A7FB5] dark:border-slate-700 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-400">
                                        <Play className="h-5 w-5" />
                                        Lihat Demo
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-8 sm:grid-cols-4 dark:border-slate-800">
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold text-slate-900 lg:text-3xl dark:text-white">
                                            {stats.activeAuctions}+
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Lelang Aktif
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold text-slate-900 lg:text-3xl dark:text-white">
                                            {stats.totalUsers}+
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Total Pengguna
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold text-slate-900 lg:text-3xl dark:text-white">
                                            {stats.itemsSold}+
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">
                                            Barang Terjual
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold text-slate-900 lg:text-3xl dark:text-white">
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
                                        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#4A7FB5]/20 via-[#5B8DB8]/20 to-[#6B9FCC]/20 blur-3xl"></div>
                                        <div className="relative rounded-3xl border border-slate-200/50 bg-white p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/50 dark:shadow-black/20">
                                            {featuredAuctions[0].isLive && (
                                                <div className="absolute top-4 right-4 flex animate-pulse items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                                                    <span className="h-2 w-2 rounded-full bg-white"></span>
                                                    LIVE
                                                </div>
                                            )}

                                            <div className="mb-6 aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-700">
                                                {featuredAuctions[0].image ? (
                                                    <img
                                                        src={
                                                            featuredAuctions[0]
                                                                .image
                                                        }
                                                        alt={
                                                            featuredAuctions[0]
                                                                .title
                                                        }
                                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Gavel className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-[#4A7FB5] dark:text-sky-400">
                                                            {
                                                                featuredAuctions[0]
                                                                    .category
                                                                    ?.icon
                                                            }{' '}
                                                            {
                                                                featuredAuctions[0]
                                                                    .category
                                                                    ?.name
                                                            }
                                                        </p>
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                            {
                                                                featuredAuctions[0]
                                                                    .title
                                                            }
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[#4A7FB5]">
                                                        <Star className="h-5 w-5 fill-current" />
                                                        <span className="font-semibold">
                                                            4.9
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            Current Bid
                                                        </p>
                                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                            {
                                                                featuredAuctions[0]
                                                                    .formattedPrice
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {featuredAuctions[0]
                                                                .isLive
                                                                ? 'Ends In'
                                                                : 'Starts In'}
                                                        </p>
                                                        <p className="flex items-center gap-1 text-lg font-semibold text-rose-500">
                                                            <Clock className="h-4 w-4" />
                                                            {featuredAuctions[0]
                                                                .timeLeft ||
                                                                'Soon'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3, 4].map(
                                                            (i) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#6B9FCC] to-[#4A7FB5] text-xs font-bold text-white dark:border-slate-800"
                                                                >
                                                                    {String.fromCharCode(
                                                                        65 + i,
                                                                    )}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                        {
                                                            featuredAuctions[0]
                                                                .totalBids
                                                        }{' '}
                                                        bids placed
                                                    </span>
                                                </div>

                                                <Link
                                                    href={`/auctions/${featuredAuctions[0].uuid}`}
                                                    className="block w-full rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#5B8DB8] py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300/25"
                                                >
                                                    {featuredAuctions[0].isLive
                                                        ? 'Pasang Bid Sekarang'
                                                        : 'Lihat Detail'}
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="relative rounded-3xl bg-white p-12 text-center shadow-2xl backdrop-blur-xl dark:bg-slate-800/50">
                                        <Gavel className="mx-auto mb-4 h-20 w-20 text-slate-300 dark:text-slate-600" />
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Belum ada lelang aktif
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Auctions Section */}
                <section
                    id="auctions"
                    className="bg-white/50 px-4 py-20 sm:px-6 lg:px-8 dark:bg-slate-900/50"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl dark:text-white">
                                    Lelang Aktif
                                </h2>
                                <p className="mt-2 text-slate-600 dark:text-slate-400">
                                    Jangan lewatkan barang-barang eksklusif ini
                                </p>
                            </div>
                            <Link
                                href="#"
                                className="hidden items-center gap-2 font-medium text-[#4A7FB5] transition-all hover:gap-3 sm:flex dark:text-sky-400"
                            >
                                Lihat Semua
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredAuctions.length > 0 ? (
                                featuredAuctions.map((auction) => (
                                    <Link
                                        key={auction.id}
                                        href={`/auctions/${auction.uuid}`}
                                        className="group rounded-2xl border border-slate-200/50 bg-white p-4 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800 dark:shadow-black/10"
                                    >
                                        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
                                            {auction.isLive && (
                                                <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
                                                    LIVE
                                                </div>
                                            )}
                                            {!auction.isLive &&
                                                auction.status ===
                                                    'scheduled' && (
                                                    <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-[#4A7FB5] px-2 py-1 text-xs font-semibold text-white">
                                                        <Clock className="h-3 w-3" />
                                                        SEGERA
                                                    </div>
                                                )}
                                            {auction.image ? (
                                                <img
                                                    src={auction.image}
                                                    alt={auction.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Gavel className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs font-medium text-[#4A7FB5] dark:text-sky-400">
                                                    {auction.category?.icon}{' '}
                                                    {auction.category?.name}
                                                </p>
                                                <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                                                    {auction.title}
                                                </h3>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Bid Saat Ini
                                                    </p>
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        {auction.formattedPrice}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {auction.isLive
                                                            ? 'Berakhir'
                                                            : 'Dimulai'}
                                                    </p>
                                                    <p className="flex items-center gap-1 text-sm font-medium text-rose-500">
                                                        <Clock className="h-3 w-3" />
                                                        {auction.timeLeft ||
                                                            'Segera'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {auction.totalBids} bid
                                                </span>
                                                <span className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-medium text-[#4A7FB5] transition-colors group-hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:group-hover:bg-sky-900/50">
                                                    {auction.isLive
                                                        ? 'Bid Sekarang'
                                                        : 'Lihat'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-16 text-center">
                                    <Gavel className="mx-auto mb-4 h-16 w-16 text-slate-300 dark:text-slate-600" />
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Belum ada lelang aktif. Silakan kembali
                                        lagi nanti!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-bold text-slate-900 lg:text-4xl dark:text-white">
                                Jelajahi Kategori
                            </h2>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Temukan koleksi barang-barang pilihan kami
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    className="group cursor-pointer rounded-2xl border border-slate-200/50 bg-white p-6 text-center shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#4A7FB5]/50 hover:shadow-xl dark:border-slate-700/50 dark:bg-slate-800 dark:shadow-black/10 dark:hover:border-sky-500/50"
                                >
                                    <div className="mb-3 text-4xl">
                                        {category.icon}
                                    </div>
                                    <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-[#4A7FB5] dark:text-white dark:group-hover:text-sky-400">
                                        {category.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {category.count} barang
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section
                    id="how-it-works"
                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20 sm:px-6 lg:px-8 dark:from-black dark:via-slate-900 dark:to-black"
                >
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold text-white lg:text-4xl">
                                Cara Kerja
                            </h2>
                            <p className="mt-2 text-slate-400">
                                Mulai ikuti lelang dalam 3 langkah mudah
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    step: '01',
                                    title: 'Buat Akun',
                                    description:
                                        'Daftar gratis dan selesaikan verifikasi Anda untuk mulai mengikuti lelang barang-barang eksklusif.',
                                    icon: Users,
                                },
                                {
                                    step: '02',
                                    title: 'Temukan Barang',
                                    description:
                                        'Jelajahi koleksi barang-barang pilihan kami dari berbagai kategori.',
                                    icon: Diamond,
                                },
                                {
                                    step: '03',
                                    title: 'Pasang Bid',
                                    description:
                                        'Ikuti lelang live dan pasang bid secara real-time. Menangkan dan terima barang Anda dengan aman.',
                                    icon: Gavel,
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#6B9FCC]/50"
                                >
                                    <div className="absolute -top-4 -left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A7FB5] to-[#5B8DB8] font-bold text-white shadow-lg shadow-blue-500/25">
                                        {item.step}
                                    </div>
                                    <div className="pt-6">
                                        <item.icon className="mb-4 h-12 w-12 text-[#6B9FCC]" />
                                        <h3 className="mb-2 text-xl font-semibold text-white">
                                            {item.title}
                                        </h3>
                                        <p className="leading-relaxed text-slate-400">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3D6E99] via-[#4A7FB5] to-[#6B9FCC] p-12">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
                            <div className="relative">
                                <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                                    Siap Untuk Mulai Lelang?
                                </h2>
                                <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
                                    Bergabunglah dengan ribuan kolektor dan
                                    penggemar. Buat akun Anda hari ini dan
                                    dapatkan akses ke lelang eksklusif.
                                </p>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-[#4A7FB5] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                >
                                    Buat Akun Gratis
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-200 px-4 py-12 sm:px-6 lg:px-8 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/Logo.png"
                                    alt="nathBid"
                                    className="h-42 w-auto"
                                />
                            </div>

                            <div className="flex items-center gap-8">
                                <a
                                    href="#"
                                    className="text-sm text-slate-600 transition-colors hover:text-[#4A7FB5] dark:text-slate-400 dark:hover:text-sky-400"
                                >
                                    Kebijakan Privasi
                                </a>
                                <a
                                    href="#"
                                    className="text-sm text-slate-600 transition-colors hover:text-[#4A7FB5] dark:text-slate-400 dark:hover:text-sky-400"
                                >
                                    Ketentuan Layanan
                                </a>
                                <a
                                    href="#"
                                    className="text-sm text-slate-600 transition-colors hover:text-[#4A7FB5] dark:text-slate-400 dark:hover:text-sky-400"
                                >
                                    Kontak
                                </a>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                © 2026 nathBid. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
