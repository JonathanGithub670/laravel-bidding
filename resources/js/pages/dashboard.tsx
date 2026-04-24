import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Wallet, TrendingUp, ArrowUpRight, Plus, CreditCard } from 'lucide-react';
import type { SharedData } from '@/types';

interface Props {
    balance: number;
    formattedBalance: string;
}

export default function Dashboard({ balance, formattedBalance }: Props) {
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
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Kelola saldo dan transaksi Anda di sini
                    </p>
                </div>

                {/* Balance Card */}
                <div className="max-w-lg">
                    <a 
                        href="/transactions"
                        className="block relative overflow-hidden rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-shadow cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #4A7FB5 0%, #5B8DB8 35%, #3d6d9e 70%, #2c5f8a 100%)' }}
                    >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white" />
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10">
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                        <Wallet className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-sm">Saldo Anda</p>
                                        <p className="text-white/60 text-xs">Klik untuk lihat riwayat</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-medium">
                                    <TrendingUp className="w-3 h-3" />
                                    Active
                                </div>
                            </div>

                            {/* Balance Amount */}
                            <div className="mb-8">
                                <p className="text-5xl font-bold text-white tracking-tight">
                                    {formattedBalance}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                                <a 
                                    href="/topups/create" 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white font-semibold hover:bg-white/90 transition-colors shadow-lg"
                                    style={{ color: '#2c5f8a' }}
                                >
                                    <Plus className="w-5 h-5" />
                                    Top Up
                                </a>
                                <a 
                                    href="/disbursements/create" 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20"
                                >
                                    <ArrowUpRight className="w-5 h-5" />
                                    Tarik Dana
                                </a>
                            </div>
                        </div>

                        {/* Card Chip Design */}
                        <div className="absolute top-8 right-8">
                            <CreditCard className="w-12 h-12 text-white/20" />
                        </div>
                    </a>

                    {/* Quick Info */}
                    <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: '#f0f6fc', borderColor: '#d4e4f1' }}>
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(74, 127, 181, 0.12)' }}>
                                <Wallet className="w-4 h-4" style={{ color: '#4A7FB5' }} />
                            </div>
                            <div>
                                <p className="text-sm font-medium" style={{ color: '#2c5f8a' }}>
                                    Gunakan saldo untuk bidding
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: '#6B9AC4' }}>
                                    Top up saldo Anda untuk mengikuti lelang dan memenangkan barang impian Anda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
