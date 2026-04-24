import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Duration {
    id: number;
    hours: number;
    label: string;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    durations: Duration[];
}

export default function DurationsIndex({ durations }: Props) {
    const [showForm, setShowForm] = useState(false);

    const form = useForm({
        hours: '',
        label: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/durations', {
            onSuccess: () => {
                form.reset();
                setShowForm(false);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus durasi ini?')) {
            router.delete(`/admin/durations/${id}`);
        }
    };

    // Auto-generate label from hours
    const generateLabel = (hours: string) => {
        const h = parseInt(hours);
        if (isNaN(h) || h <= 0) return '';
        if (h < 24) return `${h} Jam`;
        const days = Math.floor(h / 24);
        if (h % 24 === 0) return `${h} Jam (${days} Hari)`;
        return `${h} Jam`;
    };

    return (
        <AppLayout>
            <Head title="Durasi Lelang - Admin" />

            <div className="mx-auto max-w-3xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/auctions/pending"
                            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Durasi Lelang
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Kelola opsi durasi yang tersedia untuk lelang
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-amber-600"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Durasi
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-white p-6 shadow-lg dark:border-amber-800 dark:bg-gray-800">
                        <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                            <Plus className="h-5 w-5 text-amber-500" />
                            Tambah Durasi Baru
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Jam{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={form.data.hours}
                                        onChange={(e) => {
                                            form.setData(
                                                'hours',
                                                e.target.value,
                                            );
                                            form.setData(
                                                'label',
                                                generateLabel(e.target.value),
                                            );
                                        }}
                                        min="1"
                                        max="720"
                                        placeholder="Contoh: 6"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {form.errors.hours && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.hours}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Label{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.label}
                                        onChange={(e) =>
                                            form.setData(
                                                'label',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 6 Jam"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    {form.errors.label && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {form.errors.label}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        form.reset();
                                    }}
                                    className="rounded-xl px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-xl bg-amber-500 px-6 py-2 font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Duration List */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
                    {durations.length === 0 ? (
                        <div className="p-12 text-center">
                            <Clock className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                            <p className="text-gray-500 dark:text-gray-400">
                                Belum ada durasi.
                            </p>
                            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                                Klik "Tambah Durasi" untuk menambahkan opsi
                                durasi lelang.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                                <div className="col-span-1">#</div>
                                <div className="col-span-3">Jam</div>
                                <div className="col-span-5">Label</div>
                                <div className="col-span-3 text-right">
                                    Aksi
                                </div>
                            </div>

                            {/* Rows */}
                            {durations.map((duration, index) => (
                                <div
                                    key={duration.id}
                                    className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                >
                                    <div className="col-span-1 text-sm text-gray-500 dark:text-gray-400">
                                        {index + 1}
                                    </div>
                                    <div className="col-span-3">
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            {duration.hours} jam
                                        </span>
                                    </div>
                                    <div className="col-span-5 font-medium text-gray-900 dark:text-white">
                                        {duration.label}
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <button
                                            onClick={() =>
                                                handleDelete(duration.id)
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p>
                        Durasi yang ditambahkan akan muncul sebagai opsi di form
                        pengajuan lelang oleh penjual.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
