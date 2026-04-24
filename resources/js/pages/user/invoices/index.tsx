import { Head, Link } from '@inertiajs/react';
import { FileText, ArrowRight, Receipt, Wallet } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface InvoiceItem {
    id: number;
    type: 'invoice' | 'reimbursement';
    reference: string;
    title: string;
    description: string;
    amount: number;
    formatted_amount: string;
    status: string;
    status_label: string;
    status_color: string;
    created_at: string;
    due_at: string | null;
}

interface Props {
    items: InvoiceItem[];
    counts: Record<string, number>;
    currentType: string;
}

const statusColorMap: Record<string, string> = {
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const typeIconMap = {
    invoice: Receipt,
    reimbursement: Wallet,
};

export default function UserInvoicesIndex({
    items,
    counts,
    currentType,
}: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const tabs = [
        { key: 'all', label: 'Semua', icon: FileText },
        { key: 'invoice', label: 'Invoice Lelang', icon: Receipt },
        { key: 'reimbursement', label: 'Reimbursement', icon: Wallet },
    ];

    return (
        <AppLayout>
            <Head title="Tagihan Saya" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        💰 Tagihan Saya
                    </h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Semua invoice dari lelang yang dimenangkan dan
                        pengembalian dana
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/40">
                                <FileText className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {counts.all}
                                </p>
                                <p className="text-sm text-gray-500">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/40">
                                <Receipt className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600">
                                    {counts.invoice}
                                </p>
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    Invoice Lelang
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                                <Wallet className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">
                                    {counts.reimbursement}
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    Reimbursement
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-4 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={`/user/invoices?type=${tab.key}`}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium whitespace-nowrap transition-colors ${
                                currentType === tab.key
                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                            }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            {tab.label}
                            <span className="text-xs">
                                ({counts[tab.key] || 0})
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Items */}
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                        <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                            Tidak ada tagihan
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Belum ada tagihan atau pengembalian dana untuk Anda
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => {
                            const Icon = typeIconMap[item.type];
                            return (
                                <Link
                                    key={`${item.type}-${item.id}`}
                                    href={`/user/invoices/${item.type}/${item.id}`}
                                    className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-violet-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-600"
                                >
                                    {/* Icon */}
                                    <div
                                        className={`rounded-xl p-3 ${
                                            item.type === 'invoice'
                                                ? 'bg-amber-100 dark:bg-amber-900/30'
                                                : 'bg-green-100 dark:bg-green-900/30'
                                        }`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${
                                                item.type === 'invoice'
                                                    ? 'text-amber-600'
                                                    : 'text-green-600'
                                            }`}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <p className="truncate font-semibold text-gray-900 dark:text-white">
                                                {item.title}
                                            </p>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    statusColorMap[
                                                        item.status_color
                                                    ] || statusColorMap.gray
                                                }`}
                                            >
                                                {item.status_label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.description} •{' '}
                                            {item.reference}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            {formatDate(item.created_at)}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right">
                                        <p
                                            className={`text-lg font-bold ${
                                                item.type === 'reimbursement'
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-900 dark:text-white'
                                            }`}
                                        >
                                            {item.type === 'reimbursement'
                                                ? '+'
                                                : ''}
                                            {item.formatted_amount}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-violet-500" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
