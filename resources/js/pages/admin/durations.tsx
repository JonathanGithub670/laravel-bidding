import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { ArrowLeft, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';

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

            <div className="p-6 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/auctions/pending"
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
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
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Durasi
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-amber-200 dark:border-amber-800 shadow-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-amber-500" />
                            Tambah Durasi Baru
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Jam <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={form.data.hours}
                                        onChange={(e) => {
                                            form.setData('hours', e.target.value);
                                            form.setData('label', generateLabel(e.target.value));
                                        }}
                                        min="1"
                                        max="720"
                                        placeholder="Contoh: 6"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                    {form.errors.hours && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.hours}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Label <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.label}
                                        onChange={(e) => form.setData('label', e.target.value)}
                                        placeholder="Contoh: 6 Jam"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                    {form.errors.label && (
                                        <p className="text-red-500 text-sm mt-1">{form.errors.label}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); form.reset(); }}
                                    className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    {form.processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Duration List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                    {durations.length === 0 ? (
                        <div className="p-12 text-center">
                            <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">Belum ada durasi.</p>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                                Klik "Tambah Durasi" untuk menambahkan opsi durasi lelang.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-medium text-gray-500 dark:text-gray-400">
                                <div className="col-span-1">#</div>
                                <div className="col-span-3">Jam</div>
                                <div className="col-span-5">Label</div>
                                <div className="col-span-3 text-right">Aksi</div>
                            </div>

                            {/* Rows */}
                            {durations.map((duration, index) => (
                                <div
                                    key={duration.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                >
                                    <div className="col-span-1 text-sm text-gray-500 dark:text-gray-400">
                                        {index + 1}
                                    </div>
                                    <div className="col-span-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                            <Clock className="w-3.5 h-3.5" />
                                            {duration.hours} jam
                                        </span>
                                    </div>
                                    <div className="col-span-5 text-gray-900 dark:text-white font-medium">
                                        {duration.label}
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <button
                                            onClick={() => handleDelete(duration.id)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>Durasi yang ditambahkan akan muncul sebagai opsi di form pengajuan lelang oleh penjual.</p>
                </div>
            </div>
        </AppLayout>
    );
}
