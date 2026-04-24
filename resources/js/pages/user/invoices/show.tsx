import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Printer,
    Download,
    Calendar,
    Hash,
    Gavel,
    Clock,
    Shield,
    CreditCard,
    FileText,
    CheckCircle2,
    AlertCircle,
    XCircle,
    BadgeCheck,
} from 'lucide-react';
import { useRef } from 'react';
import AppLayout from '@/layouts/app-layout';

interface DocumentData {
    type: 'invoice' | 'reimbursement';
    reference: string;
    title: string;
    auction_title: string;
    auction_category: string | null;
    seller_name: string | null;
    winner_name: string | null;
    amount: number;
    admin_fee: number;
    registration_fee: number;
    app_fee: number;
    total_amount: number;
    formatted_amount: string;
    formatted_admin_fee: string;
    formatted_registration_fee: string;
    formatted_app_fee: string;
    formatted_total: string;
    status: string;
    status_label: string;
    status_color: string;
    created_at: string;
    due_at: string | null;
    paid_at: string | null;
}

interface Props {
    document: DocumentData;
}

const statusIcons: Record<string, typeof CheckCircle2> = {
    paid: CheckCircle2,
    pending: Clock,
    expired: XCircle,
    completed: CheckCircle2,
    eligible: BadgeCheck,
    approved: Shield,
    rejected: XCircle,
};

const statusBgColors: Record<string, string> = {
    yellow: 'bg-amber-50 border-amber-200 text-amber-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
};

export default function UserInvoiceShow({ document: doc }: Props) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateShort = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handlePrint = () => {
        window.print();
    };

    // Build server-side PDF download URL from current path
    const downloadUrl = `${window.location.pathname}/download`;

    const isReimbursement = doc.type === 'reimbursement';
    const StatusIcon = statusIcons[doc.status] || AlertCircle;

    return (
        <AppLayout>
            <Head title={`Tagihan - ${formatDate(doc.created_at)}`} />

            {/* Print-only styles */}
            <style>{`
                @media print {
                    /* Hide everything except the invoice */
                    body * {
                        visibility: hidden;
                    }
                    #invoice-printable, #invoice-printable * {
                        visibility: visible;
                    }
                    #invoice-printable {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 16px;
                        box-shadow: none !important;
                        border: none !important;
                        border-radius: 0 !important;
                    }
                    /* Remove dark mode for print */
                    .dark\\:bg-gray-800, .dark\\:bg-gray-900\\/50 {
                        background: white !important;
                    }
                    .dark\\:text-white, .dark\\:text-gray-300, .dark\\:text-gray-400 {
                        color: inherit !important;
                    }
                    .dark\\:border-gray-700, .dark\\:border-gray-600 {
                        border-color: #e5e7eb !important;
                    }
                }
            `}</style>

            <div className="p-4 md:p-6">
                {/* Back button & actions - hidden on print */}
                <div className="mb-6 flex items-center justify-between print:hidden">
                    <Link
                        href="/user/invoices"
                        className="flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm font-medium">Kembali</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <a
                            href={downloadUrl}
                            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </a>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 rounded-lg bg-[#4A7FB5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3d6d9e]"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak
                        </button>
                    </div>
                </div>

                {/* Invoice Card - this is what gets printed/downloaded */}
                <div
                    id="invoice-printable"
                    ref={invoiceRef}
                    className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 print:rounded-none print:border-none print:shadow-none"
                >
                    {/* Company Letterhead Header — Logo LEFT, Tagline RIGHT */}
                    <div className="relative overflow-hidden">
                        {/* Gradient accent top border */}
                        <div className="h-1.5 bg-gradient-to-r from-[#4A7FB5] via-[#5B8DB8] to-[#4A7FB5]"></div>

                        {/* Letterhead content */}
                        <div className="border-b border-gray-100 bg-gradient-to-b from-slate-50/80 to-white px-6 py-5 sm:py-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
                            <div className="flex items-center justify-between">
                                {/* Left: Logo */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/Logo.png"
                                        alt="nathBid Logo"
                                        className="h-40 w-auto object-contain sm:h-56"
                                    />
                                </div>

                                {/* Right: Tagline & status */}
                                <div className="text-right">
                                    <p className="text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase sm:text-xs dark:text-gray-500">
                                        Platform Lelang Online Terpercaya
                                    </p>
                                    <div className="mt-2">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                                statusBgColors[
                                                    doc.status_color
                                                ] || statusBgColors.gray
                                            }`}
                                        >
                                            <StatusIcon className="h-3 w-3" />
                                            {doc.status_label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Reference number LEFT, Date RIGHT */}
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                    <Hash className="h-3.5 w-3.5" />
                                    <span className="font-mono font-medium">
                                        {doc.reference}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{formatDate(doc.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="border-b border-gray-100 px-6 py-3 dark:border-gray-700">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                            {isReimbursement
                                ? `💰 Pengembalian Dana Lelang: ${doc.auction_title}`
                                : `🎉 Selamat! Anda Memenangkan Lelang: ${doc.auction_title}`}
                        </h1>
                    </div>

                    {/* Body */}
                    <div className="space-y-6 px-6 py-6">
                        {/* Personal Message */}
                        <div className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                            <p>
                                Kepada Yth. <strong>{doc.winner_name}</strong>,
                            </p>

                            {isReimbursement ? (
                                <>
                                    <p>
                                        Kami informasikan bahwa dana pendaftaran
                                        Anda untuk lelang{' '}
                                        <strong>"{doc.auction_title}"</strong>{' '}
                                        telah dikembalikan ke saldo akun Anda.
                                        Berikut rincian pengembalian dana:
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        Selamat! Anda telah memenangkan lelang{' '}
                                        <strong>"{doc.auction_title}"</strong>
                                        {doc.seller_name
                                            ? ` yang diselenggarakan oleh ${doc.seller_name}`
                                            : ''}
                                        . Saldo Anda akan dipotong sesuai dengan
                                        rincian tagihan berikut:
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Invoice Table */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                            {/* Table Header */}
                            <div
                                className={`px-5 py-3 ${
                                    isReimbursement
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                                        : 'bg-violet-50 dark:bg-violet-900/20'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FileText
                                        className={`h-4 w-4 ${
                                            isReimbursement
                                                ? 'text-emerald-600'
                                                : 'text-violet-600'
                                        }`}
                                    />
                                    <h3
                                        className={`text-sm font-semibold ${
                                            isReimbursement
                                                ? 'text-emerald-700 dark:text-emerald-400'
                                                : 'text-violet-700 dark:text-violet-400'
                                        }`}
                                    >
                                        {isReimbursement
                                            ? 'Rincian Pengembalian'
                                            : 'Rincian Tagihan'}
                                    </h3>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {/* Auction Info Row */}
                                <div className="px-5 py-3">
                                    <div className="mb-2 flex items-center gap-2 text-xs tracking-wide text-gray-400 uppercase">
                                        <Gavel className="h-3.5 w-3.5" />
                                        Informasi Lelang
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Nama Lelang
                                            </span>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {doc.auction_title}
                                            </p>
                                        </div>
                                        {doc.auction_category && (
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Kategori
                                                </span>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {doc.auction_category}
                                                </p>
                                            </div>
                                        )}
                                        {doc.seller_name && (
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Penjual
                                                </span>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {doc.seller_name}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                Pemenang
                                            </span>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {doc.winner_name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Fee Breakdown */}
                                <div className="px-5 py-3">
                                    <div className="mb-3 flex items-center gap-2 text-xs tracking-wide text-gray-400 uppercase">
                                        <CreditCard className="h-3.5 w-3.5" />
                                        {isReimbursement
                                            ? 'Rincian Pengembalian'
                                            : 'Rincian Biaya'}
                                    </div>

                                    <div className="space-y-2">
                                        {/* Registration Fee */}
                                        {!isReimbursement && (
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Biaya Pendaftaran
                                                        <span className="ml-1 text-xs text-gray-400">
                                                            (sudah dipotong saat
                                                            daftar)
                                                        </span>
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-500 dark:text-gray-400">
                                                    {doc.formatted_registration_fee ||
                                                        'Rp 0'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Bid Amount */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${isReimbursement ? 'bg-emerald-400' : 'bg-violet-400'}`}
                                                ></div>
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {isReimbursement
                                                        ? 'Biaya Pendaftaran'
                                                        : 'Bid Pemenang'}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {doc.formatted_amount}
                                            </span>
                                        </div>

                                        {/* Admin Fee */}
                                        {!isReimbursement && (
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        Biaya Admin
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    Gratis
                                                </span>
                                            </div>
                                        )}

                                        {/* App Fee */}
                                        {!isReimbursement &&
                                            doc.app_fee > 0 && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            Biaya Aplikasi
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {doc.formatted_app_fee}
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Total */}
                                <div
                                    className={`px-5 py-4 ${
                                        isReimbursement
                                            ? 'bg-emerald-50 dark:bg-emerald-900/10'
                                            : 'bg-violet-50 dark:bg-violet-900/10'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-bold text-gray-900 dark:text-white">
                                            {isReimbursement
                                                ? 'Total Pengembalian'
                                                : 'Total Potongan Saldo'}
                                        </span>
                                        <span
                                            className={`text-xl font-bold ${
                                                isReimbursement
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-violet-600 dark:text-violet-400'
                                            }`}
                                        >
                                            {isReimbursement ? '+' : ''}
                                            {doc.formatted_total}
                                        </span>
                                    </div>
                                    {!isReimbursement &&
                                        doc.registration_fee > 0 && (
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                * Biaya pendaftaran (
                                                {doc.formatted_registration_fee}
                                                ) sudah dipotong dari saldo pada
                                                saat pendaftaran lelang
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>

                        {/* Date Info Cards */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                                <div className="rounded-lg bg-gray-200 p-2 dark:bg-gray-700">
                                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs tracking-wide text-gray-500 uppercase">
                                        Tanggal Dibuat
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatDateShort(doc.created_at)}
                                    </p>
                                </div>
                            </div>
                            {(doc.due_at || doc.paid_at) && (
                                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                                    <div
                                        className={`rounded-lg p-2 ${doc.paid_at ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}
                                    >
                                        {doc.paid_at ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs tracking-wide text-gray-500 uppercase">
                                            {doc.paid_at
                                                ? 'Tanggal Selesai'
                                                : 'Jatuh Tempo'}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDateShort(
                                                doc.paid_at || doc.due_at,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer message */}
                        <div className="border-t border-gray-100 pt-5 dark:border-gray-700">
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {isReimbursement ? (
                                    <p>
                                        Dana telah dikembalikan ke saldo akun
                                        Anda secara otomatis. Silakan cek saldo
                                        Anda di halaman profil.
                                    </p>
                                ) : (
                                    <>
                                        <p>
                                            Saldo Anda telah otomatis dipotong
                                            sesuai rincian tagihan di atas. Jika
                                            ada pertanyaan, jangan ragu untuk
                                            menghubungi tim kami.
                                        </p>
                                    </>
                                )}
                                <p className="text-gray-400 dark:text-gray-500">
                                    Terima kasih telah menggunakan{' '}
                                    <strong className="text-gray-600 dark:text-gray-300">
                                        nathBid
                                    </strong>
                                    .
                                </p>
                            </div>
                        </div>

                        {/* Signature */}
                        <div className="rounded-xl bg-gray-50 px-5 py-4 dark:bg-gray-900/50">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/Logo.png"
                                    alt="nathBid"
                                    className="h-20 w-20 object-contain"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        nathBid
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Platform Lelang Online Terpercaya
                                    </p>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                Dokumen ini diterbitkan secara otomatis oleh
                                sistem pada {formatDateShort(doc.created_at)}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
