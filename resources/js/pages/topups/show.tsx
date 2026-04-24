import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Copy, Check, Clock, AlertCircle, CheckCircle, Building2, Wallet, QrCode, ChevronDown, ChevronUp, Loader2, X, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Topup {
    id: number;
    amount: string;
    payment_method: string;
    payment_type: string;
    status: string;
    reference_number: string;
    virtual_account_number: string | null;
    qr_code_url: string | null;
    payment_instructions: any;
    expired_at: string;
    paid_at: string | null;
    created_at: string;
    formatted_amount: string;
    payment_method_name: string;
    remaining_seconds: number;
}

interface Props {
    topup: Topup;
    isPending: boolean;
}

export default function TopupShow({ topup, isPending }: Props) {
    const [copied, setCopied] = useState(false);
    const [remainingTime, setRemainingTime] = useState(topup.remaining_seconds);
    const [expandedInstruction, setExpandedInstruction] = useState<string | null>('mobile_banking');
    const [showSimulateModal, setShowSimulateModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (!isPending || remainingTime <= 0) return;

        const timer = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPending, remainingTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSimulatePayment = () => {
        setIsProcessing(true);
        router.post(`/topups/${topup.id}/simulate`, {}, {
            onFinish: () => {
                setIsProcessing(false);
                setShowSimulateModal(false);
            }
        });
    };

    const getStatusBadge = () => {
        switch (topup.status) {
            case 'pending':
                return { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Loader2, spin: true };
            case 'paid':
                return { label: 'Berhasil', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, spin: false };
            case 'expired':
                return { label: 'Kadaluarsa', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: AlertCircle, spin: false };
            case 'failed':
                return { label: 'Gagal', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle, spin: false };
            default:
                return { label: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: AlertCircle, spin: false };
        }
    };

    const statusBadge = getStatusBadge();
    const StatusIcon = statusBadge.icon;

    return (
        <AppLayout>
            <Head title="Detail Top Up" />

            <div className="p-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/topups"
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Riwayat
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Detail Top Up
                        </h1>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                            <StatusIcon className={`w-4 h-4 ${statusBadge.spin ? 'animate-spin' : ''}`} />
                            {statusBadge.label}
                        </span>
                    </div>
                </div>

                {/* Success Message */}
                {topup.status === 'paid' && (
                    <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl mb-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <h3 className="font-semibold text-green-800 dark:text-green-200">
                                    Pembayaran Berhasil!
                                </h3>
                                <p className="text-green-700 dark:text-green-300">
                                    Saldo Anda telah bertambah {topup.formatted_amount}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Expired Message */}
                {topup.status === 'expired' && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-8 h-8 text-gray-500" />
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                    Top Up Kadaluarsa
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Silakan buat top up baru untuk mengisi saldo.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/topups/create"
                            className="inline-block mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors"
                        >
                            Top Up Baru
                        </Link>
                    </div>
                )}

                {/* Amount Card */}
                <div className="p-6 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl text-white mb-6">
                    <p className="text-white/80 text-sm">Nominal Top Up</p>
                    <p className="text-4xl font-bold mt-1">{topup.formatted_amount}</p>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="px-2 py-1 bg-white/20 rounded text-sm">
                            {topup.payment_method_name}
                        </span>
                    </div>
                </div>

                {/* Waiting for Payment - Spinner */}
                {isPending && remainingTime > 0 && (
                    <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex flex-col items-center text-center">
                            {/* Spinner */}
                            <div className="relative mb-6">
                                <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-violet-600 animate-spin"></div>
                                <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-violet-600 animate-pulse" />
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Menunggu Pembayaran
                            </h3>
                            
                            {/* Nominal */}
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {topup.formatted_amount}
                            </p>
                            
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                                Selesaikan pembayaran sebelum waktu habis
                            </p>
                            
                            {/* Countdown */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                <Clock className="w-5 h-5 text-amber-600" />
                                <span className="font-mono font-bold text-2xl text-amber-600 dark:text-amber-400">
                                    {formatTime(remainingTime)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Details */}
                {isPending && (
                    <div className="space-y-6">
                        {/* Virtual Account */}
                        {topup.virtual_account_number && (
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <Building2 className="w-5 h-5 text-gray-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Nomor Virtual Account
                                    </h3>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                    <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                                        {topup.virtual_account_number}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(topup.virtual_account_number!)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg text-sm font-medium hover:bg-violet-200 transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Tersalin' : 'Salin'}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                    Transfer sebesar <strong>{topup.formatted_amount}</strong> ke nomor virtual account di atas
                                </p>
                            </div>
                        )}

                        {/* QRIS */}
                        {topup.qr_code_url && (
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <QrCode className="w-5 h-5 text-gray-500" />
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Scan QR Code
                                    </h3>
                                </div>
                                <div className="flex justify-center p-4 bg-white rounded-xl">
                                    <img 
                                        src={topup.qr_code_url} 
                                        alt="QR Code" 
                                        className="w-64 h-64"
                                    />
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                                    Scan dengan aplikasi e-wallet atau mobile banking
                                </p>
                            </div>
                        )}

                        {/* Payment Instructions */}
                        {topup.payment_instructions && topup.payment_type === 'bank_transfer' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                        Cara Pembayaran
                                    </h3>
                                </div>
                                {['mobile_banking', 'atm', 'internet_banking'].map((key) => {
                                    const instructions = topup.payment_instructions[key];
                                    if (!instructions) return null;
                                    
                                    const labels: Record<string, string> = {
                                        mobile_banking: 'Mobile Banking',
                                        atm: 'ATM',
                                        internet_banking: 'Internet Banking',
                                    };

                                    return (
                                        <div key={key} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                            <button
                                                onClick={() => setExpandedInstruction(expandedInstruction === key ? null : key)}
                                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                            >
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {labels[key] || key}
                                                </span>
                                                {expandedInstruction === key ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>
                                            {expandedInstruction === key && (
                                                <div className="px-6 pb-4">
                                                    <ol className="space-y-2">
                                                        {instructions.map((item: any) => (
                                                            <li key={item.step} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-medium">
                                                                    {item.step}
                                                                </span>
                                                                {item.text}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* E-Wallet Instructions */}
                        {topup.payment_instructions && topup.payment_type === 'e_wallet' && (
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                    Cara Pembayaran
                                </h3>
                                <ol className="space-y-3">
                                    {topup.payment_instructions.map((item: any) => (
                                        <li key={item.step} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-medium">
                                                {item.step}
                                            </span>
                                            {item.text}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {/* Simulate Payment Button (Dev Only) */}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <strong>Mode Simulasi:</strong> Klik tombol di bawah untuk mensimulasikan pembayaran berhasil.
                            </p>
                            <button
                                onClick={() => setShowSimulateModal(true)}
                                className="w-full py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-xl transition-colors"
                            >
                                Simulasi Pembayaran Berhasil
                            </button>
                        </div>
                    </div>
                )}

                {/* Reference Info */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">No. Referensi</span>
                        <span className="font-mono text-gray-900 dark:text-white">{topup.reference_number}</span>
                    </div>
                </div>
            </div>

            {/* Simulate Payment Modal */}
            {showSimulateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !isProcessing && setShowSimulateModal(false)}
                    />
                    
                    {/* Modal */}
                    <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Close Button */}
                        {!isProcessing && (
                            <button
                                onClick={() => setShowSimulateModal(false)}
                                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        <div className="p-6">
                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                    <CreditCard className="w-8 h-8 text-emerald-600" />
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                                Konfirmasi Pembayaran
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                                Simulasi pembayaran sebesar:
                            </p>

                            {/* Amount */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-6">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                                    {topup.formatted_amount}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                                    {topup.payment_method_name}
                                </p>
                            </div>

                            {/* Info */}
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mb-6">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 text-center">
                                    Saldo Anda akan bertambah setelah konfirmasi
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSimulateModal(false)}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSimulatePayment}
                                    disabled={isProcessing}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Konfirmasi'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
