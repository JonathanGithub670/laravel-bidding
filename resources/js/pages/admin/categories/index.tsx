import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Tag, Package } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

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
                <div className="mb-6 flex items-center justify-between">
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
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#3d6d9e] px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4A7FB5]/25"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Kategori
                    </Link>
                </div>

                {/* Categories Grid */}
                {categories.length === 0 ? (
                    <div className="rounded-2xl bg-white py-16 text-center dark:bg-gray-800">
                        <Tag className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
                            Belum Ada Kategori
                        </h3>
                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            Tambahkan kategori pertama untuk barang lelang
                        </p>
                        <Link
                            href="/admin/categories/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#4A7FB5] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#3d6d9e]"
                        >
                            <Plus className="h-5 w-5" />
                            Tambah Kategori
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={`rounded-2xl border-2 bg-white p-6 transition-all dark:bg-gray-800 ${
                                    category.is_active
                                        ? 'border-transparent hover:border-[#4A7FB5]/30 dark:hover:border-[#4A7FB5]/40'
                                        : 'border-gray-200 opacity-60 dark:border-gray-700'
                                }`}
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">
                                            {category.icon}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {category.slug}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                            category.is_active
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}
                                    >
                                        {category.is_active
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </span>
                                </div>

                                {category.description && (
                                    <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                        {category.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Package className="h-4 w-4" />
                                        <span className="text-sm">
                                            {category.auctions_count} Lelang
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/categories/${category.id}/edit`}
                                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(category)
                                            }
                                            disabled={
                                                deletingId === category.id ||
                                                category.auctions_count > 0
                                            }
                                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-900/20"
                                            title={
                                                category.auctions_count > 0
                                                    ? 'Tidak dapat dihapus karena masih memiliki lelang'
                                                    : 'Hapus kategori'
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
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
