import { useState } from 'react';
import { Zap, Wallet, AlertTriangle, X } from 'lucide-react';

interface QuickBid {
    label: string;
    amount: number;
}

interface BidControlsProps {
    currentPrice: number;
    nextMinBid: number;
    bidIncrement: number;
    quickBids: QuickBid[];
    onPlaceBid: (amount: number) => Promise<void>;
    disabled?: boolean;
    isLoading?: boolean;
    userBalance?: number | null;
    userDeposit?: number;
}

function formatCurrency(amount: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

export default function BidControls({
    currentPrice,
    nextMinBid,
    bidIncrement,
    quickBids,
    onPlaceBid,
    disabled = false,
    isLoading = false,
    userBalance = null,
    userDeposit = 0,
}: BidControlsProps) {
    const [customAmount, setCustomAmount] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [pendingBidAmount, setPendingBidAmount] = useState<number | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const requestBid = (amount: number) => {
        setError('');

        // Calculate actual charge (bid amount minus existing deposit)
        const chargeAmount = amount - userDeposit;

        // Check balance before showing confirmation (only check incremental charge)
        if (userBalance !== null && userBalance < chargeAmount) {
            setError(
                `Saldo tidak mencukupi. Saldo Anda: ${formatCurrency(userBalance)}, Perlu tambahan: ${formatCurrency(chargeAmount)}`
            );
            return;
        }

        // Show confirmation dialog
        setPendingBidAmount(amount);
        setIsConfirmOpen(true);
    };

    const confirmBid = async () => {
        if (pendingBidAmount === null) return;

        setIsConfirmOpen(false);
        const amount = pendingBidAmount;
        setPendingBidAmount(null);

        try {
            await onPlaceBid(amount);
        } catch (e: any) {
            setError(e.message || 'Gagal menempatkan bid');
        }
    };

    const cancelBid = () => {
        setIsConfirmOpen(false);
        setPendingBidAmount(null);
    };

    const handleQuickBid = (amount: number) => {
        requestBid(amount);
    };

    const handleCustomBid = () => {
        setError('');
        const amount = parseInt(customAmount.replace(/\D/g, ''), 10);

        if (isNaN(amount) || amount < nextMinBid) {
            setError(`Bid minimum adalah ${formatCurrency(nextMinBid)}`);
            return;
        }

        const difference = amount - currentPrice;
        if (difference % bidIncrement !== 0) {
            setError(`Bid harus kelipatan ${formatCurrency(bidIncrement)}`);
            return;
        }

        requestBid(amount);
    };

    const formatInputValue = (value: string): string => {
        const numericValue = value.replace(/\D/g, '');
        if (!numericValue) return '';
        return new Intl.NumberFormat('id-ID').format(parseInt(numericValue, 10));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatInputValue(e.target.value);
        setCustomAmount(formatted);
        setError('');
    };

    return (
        <div className="space-y-4">
            {/* Balance Display */}
            {userBalance !== null && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Wallet className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                        Saldo Anda: <span className="font-bold">{formatCurrency(userBalance)}</span>
                    </span>
                </div>
            )}

            {/* Current Price Display */}
            <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">Harga Saat Ini</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(currentPrice)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Minimum bid: {formatCurrency(nextMinBid)}
                </p>
            </div>

            {/* Quick Bid Buttons */}
            <div className="grid grid-cols-2 gap-2">
                {quickBids.map((bid, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickBid(bid.amount)}
                        disabled={disabled || isLoading}
                        className="group relative py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" />
                            {bid.label}
                        </span>
                        <span className="text-xs opacity-75 block">
                            {formatCurrency(bid.amount)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Custom Bid Input */}
            <div className="space-y-2">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                            Rp
                        </span>
                        <input
                            type="text"
                            value={customAmount}
                            onChange={handleInputChange}
                            placeholder="Masukkan jumlah"
                            disabled={disabled || isLoading}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
                        />
                    </div>
                    <button
                        onClick={handleCustomBid}
                        disabled={disabled || isLoading || !customAmount}
                        className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            'Bid'
                        )}
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* Bid Increment Info */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Kelipatan bid: {formatCurrency(bidIncrement)}
            </p>

            {/* Confirmation Dialog Overlay */}
            {isConfirmOpen && pendingBidAmount !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={cancelBid}
                    />

                    {/* Dialog */}
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
                        {/* Close button */}
                        <button
                            onClick={cancelBid}
                            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        {/* Header */}
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                                <Zap className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Konfirmasi Bid
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Saldo Anda akan dipotong untuk bid ini
                            </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Jumlah Bid</span>
                                <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                                    {formatCurrency(pendingBidAmount)}
                                </span>
                            </div>
                            {userDeposit > 0 && (
                                <>
                                    <div className="border-t border-slate-200 dark:border-slate-600" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Deposit Ditahan</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                            - {formatCurrency(userDeposit)}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className="border-t border-slate-200 dark:border-slate-600" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {userDeposit > 0 ? 'Tambahan Potongan' : 'Potongan Saldo'}
                                </span>
                                <span className="font-bold text-lg text-red-600 dark:text-red-400">
                                    {formatCurrency(pendingBidAmount - userDeposit)}
                                </span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-600" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Saldo Saat Ini</span>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {userBalance !== null ? formatCurrency(userBalance) : '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Saldo Setelah Bid</span>
                                <span className={`font-semibold ${
                                    userBalance !== null && userBalance - (pendingBidAmount - userDeposit) >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {userBalance !== null
                                        ? formatCurrency(Math.max(0, userBalance - (pendingBidAmount - userDeposit)))
                                        : '-'}
                                </span>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Deposit saldo ditahan selama lelang berlangsung. Jika Anda tidak menang, deposit akan dikembalikan setelah lelang berakhir.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={cancelBid}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmBid}
                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                            >
                                Konfirmasi Bid
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
