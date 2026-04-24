import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Edit, Trash2, Tag, Package } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    auctions_count: number;
}

interface Props {
    categories: Category[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (category: Category) => {
        if (confirm(`Hapus kategori "${category.name}"?`)) {
            setDeletingId(category.id);
            router.delete(`/admin/categories/${category.id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Kelola Kategori - Admin" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Kelola Kategori
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Tambah dan kelola kategori barang lelang
                        </p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#3d6d9e] text-white font-semibold hover:shadow-lg hover:shadow-[#4A7FB5]/25 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Kategori
                    </Link>
                </div>

                {/* Categories Grid */}
                {categories.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                        <Tag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Belum Ada Kategori
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Tambahkan kategori pertama untuk barang lelang
                        </p>
                        <Link
                            href="/admin/categories/create"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4A7FB5] text-white font-semibold hover:bg-[#3d6d9e] transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Kategori
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all ${
                                    category.is_active
                                        ? 'border-transparent hover:border-[#4A7FB5]/30 dark:hover:border-[#4A7FB5]/40'
                                        : 'border-gray-200 dark:border-gray-700 opacity-60'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{category.icon}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {category.slug}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        category.is_active
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                        {category.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>

                                {category.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Package className="w-4 h-4" />
                                        <span className="text-sm">{category.auctions_count} Lelang</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/categories/${category.id}/edit`}
                                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            disabled={deletingId === category.id || category.auctions_count > 0}
                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={category.auctions_count > 0 ? 'Tidak dapat dihapus karena masih memiliki lelang' : 'Hapus kategori'}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
