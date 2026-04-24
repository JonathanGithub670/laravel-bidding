import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Save } from 'lucide-react';

// Common emoji icons for categories
const commonIcons = ['⌚', '🚗', '💎', '👜', '🎨', '🏠', '📱', '💻', '🎸', '📸', '🎮', '⚽', '📦', '✨'];

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

            <div className="p-6 max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/admin/categories"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
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
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6">
                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ikon
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {commonIcons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setData('icon', icon)}
                                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                                        data.icon === icon
                                            ? 'bg-[#4A7FB5]/10 dark:bg-[#4A7FB5]/20 border-2 border-[#4A7FB5]'
                                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4A7FB5] focus:border-transparent"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nama Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Contoh: Jam Tangan"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4A7FB5] focus:border-transparent"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Deskripsi singkat kategori (opsional)"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4A7FB5] focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Sort Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Urutan
                        </label>
                        <input
                            type="number"
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                            min={0}
                            className="w-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#4A7FB5] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Semakin kecil, semakin di atas</p>
                    </div>

                    {/* Is Active */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-[#4A7FB5] focus:ring-[#4A7FB5]"
                        />
                        <label htmlFor="is_active" className="text-gray-700 dark:text-gray-300">
                            Aktif (tampilkan di pilihan kategori)
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            href="/admin/categories"
                            className="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#3d6d9e] text-white font-semibold hover:shadow-lg hover:shadow-[#4A7FB5]/25 transition-all disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
