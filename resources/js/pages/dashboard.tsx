import { Head, usePage } from '@inertiajs/react';
import {
    Wallet,
    TrendingUp,
    ArrowUpRight,
    Plus,
    CreditCard,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';

interface Props {
    balance: number;
    formattedBalance: string;
}

export default function Dashboard({ formattedBalance }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="p-6">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Selamat datang, {auth.user?.name}! 👋
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Kelola saldo dan transaksi Anda di sini
                    </p>
                </div>

                {/* Balance Card */}
                <div className="max-w-lg">
                    <a
                        href="/transactions"
                        className="hover:shadow-3xl relative block cursor-pointer overflow-hidden rounded-3xl p-8 shadow-2xl transition-shadow"
                        style={{
                            background:
                                'linear-gradient(135deg, #4A7FB5 0%, #5B8DB8 35%, #3d6d9e 70%, #2c5f8a 100%)',
                        }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white" />
                            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white" />
                            <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10">
                            {/* Card Header */}
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                        <Wallet className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/80">
                                            Saldo Anda
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Klik untuk lihat riwayat
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-medium text-emerald-300">
                                    <TrendingUp className="h-3 w-3" />
                                    Active
                                </div>
                            </div>

                            {/* Balance Amount */}
                            <div className="mb-8">
                                <p className="text-5xl font-bold tracking-tight text-white">
                                    {formattedBalance}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div
                                className="flex gap-3"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <a
                                    href="/topups/create"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold shadow-lg transition-colors hover:bg-white/90"
                                    style={{ color: '#2c5f8a' }}
                                >
                                    <Plus className="h-5 w-5" />
                                    Top Up
                                </a>
                                <a
                                    href="/disbursements/create"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/20 px-4 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                                >
                                    <ArrowUpRight className="h-5 w-5" />
                                    Tarik Dana
                                </a>
                            </div>
                        </div>

                        {/* Card Chip Design */}
                        <div className="absolute top-8 right-8">
                            <CreditCard className="h-12 w-12 text-white/20" />
                        </div>
                    </a>

                    {/* Quick Info */}
                    <div
                        className="mt-6 rounded-xl border p-4"
                        style={{
                            backgroundColor: '#f0f6fc',
                            borderColor: '#d4e4f1',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="rounded-lg p-2"
                                style={{
                                    backgroundColor: 'rgba(74, 127, 181, 0.12)',
                                }}
                            >
                                <Wallet
                                    className="h-4 w-4"
                                    style={{ color: '#4A7FB5' }}
                                />
                            </div>
                            <div>
                                <p
                                    className="text-sm font-medium"
                                    style={{ color: '#2c5f8a' }}
                                >
                                    Gunakan saldo untuk bidding
                                </p>
                                <p
                                    className="mt-0.5 text-xs"
                                    style={{ color: '#6B9AC4' }}
                                >
                                    Top up saldo Anda untuk mengikuti lelang dan
                                    memenangkan barang impian Anda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
