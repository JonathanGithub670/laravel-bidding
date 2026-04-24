import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

// Common emoji icons for categories
const commonIcons = [
    '⌚',
    '🚗',
    '💎',
    '👜',
    '🎨',
    '🏠',
    '📱',
    '💻',
    '🎸',
    '📸',
    '🎮',
    '⚽',
    '📦',
    '✨',
];

export default function CreateCategory() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        icon: '📦',
        description: '',
        is_active: true,
        sort_order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories');
    };

    return (
        <AppLayout>
            <Head title="Tambah Kategori - Admin" />

            <div className="mx-auto max-w-2xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/admin/categories"
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Tambah Kategori
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Buat kategori baru untuk barang lelang
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl bg-white p-6 dark:bg-gray-800"
                >
                    {/* Icon Selection */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Ikon
                        </label>
                        <div className="mb-3 flex flex-wrap gap-2">
                            {commonIcons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setData('icon', icon)}
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all ${
                                        data.icon === icon
                                            ? 'border-2 border-[#4A7FB5] bg-[#4A7FB5]/10 dark:bg-[#4A7FB5]/20'
                                            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                            placeholder="Atau masukkan emoji custom"
                            maxLength={10}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nama Kategori{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Jam Tangan"
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Deskripsi singkat kategori (opsional)"
                            rows={3}
                            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Urutan
                        </label>
                        <input
                            type="number"
                            value={data.sort_order}
                            onChange={(e) =>
                                setData(
                                    'sort_order',
                                    parseInt(e.target.value) || 0,
                                )
                            }
                            min={0}
                            className="w-32 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Semakin kecil, semakin di atas
                        </p>
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-300 text-[#4A7FB5] focus:ring-[#4A7FB5]"
                        />
                        <label
                            htmlFor="is_active"
                            className="text-gray-700 dark:text-gray-300"
                        >
                            Aktif (tampilkan di pilihan kategori)
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                        <Link
                            href="/admin/categories"
                            className="rounded-xl px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#3d6d9e] px-8 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#4A7FB5]/25 disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
