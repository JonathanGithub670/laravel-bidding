import { Head, useForm, Link } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    AlertCircle,
    Search,
    ChevronDown,
    Check,
    CheckCircle2,
    XCircle,
    Save,
    Loader2,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface Duration {
    id: number;
    hours: number;
    label: string;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    categories: Category[];
    durations: Duration[];
}

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

function formatCurrency(amount: number): string {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID').format(amount);
}

export default function CreateAuction({
    categories: initialCategories,
    durations,
}: Props) {
    // Local categories state (so we can add new ones dynamically)
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    // Category search state
    const [categorySearch, setCategorySearch] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);

    // Create category modal state
    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [newCategoryData, setNewCategoryData] = useState({
        name: '',
        icon: '📦',
        description: '',
    });
    const [categoryFormProcessing, setCategoryFormProcessing] = useState(false);
    const [categoryFormErrors, setCategoryFormErrors] = useState<
        Record<string, string>
    >({});

    // Images state for file objects and previews
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validation state
    const [touched, setTouched] = useState({
        title: false,
        description: false,
        category_id: false,
        starting_price: false,
        bid_increment: false,
        images: false,
    });

    const [validationErrors, setValidationErrors] = useState<
        Record<string, string>
    >({});

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        starting_price: '',
        bid_increment: '',
        registration_fee: '',
        duration_hours:
            durations.length > 0 ? durations[0].hours.toString() : '24',
        images: [] as File[],
    });

    // Validation helper functions
    const validateField = (
        field: string,
        value: string | File[],
    ): string | null => {
        switch (field) {
            case 'title':
                if (!value || value.trim() === '')
                    return 'Nama barang harus diisi';
                if (value.length > 255)
                    return 'Nama barang maksimal 255 karakter';
                return null;

            case 'description':
                if (!value || value.trim() === '')
                    return 'Deskripsi harus diisi';
                if (value.length < 50)
                    return `Deskripsi minimal 50 karakter (saat ini: ${value.length})`;
                return null;

            case 'category_id':
                if (!value || value === '') return 'Kategori harus dipilih';
                return null;

            case 'starting_price': {
                if (!value || value === '') return 'Harga awal harus diisi';
                const startPrice = parseInt(value as string);
                if (isNaN(startPrice)) return 'Harga awal harus berupa angka';
                if (startPrice < 100000) return 'Harga awal minimal Rp 100.000';
                return null;
            }

            case 'bid_increment': {
                if (!value || value === '') return 'Kelipatan bid harus diisi';
                const bidInc = parseInt(value as string);
                if (isNaN(bidInc)) return 'Kelipatan bid harus berupa angka';
                if (bidInc < 10000) return 'Kelipatan bid minimal Rp 10.000';
                return null;
            }

            case 'images': {
                if (!value || (value as File[]).length === 0)
                    return 'Minimal 1 foto harus diupload';
                if ((value as File[]).length > 5) return 'Maksimal 5 foto';
                // Check file sizes (2MB = 2048KB = 2097152 bytes)
                const maxSize = 2048 * 1024;
                const oversized = (value as File[]).filter(
                    (file: File) => file.size > maxSize,
                );
                if (oversized.length > 0) {
                    const oversizedNames = oversized
                        .map((file: File) => {
                            const sizeInMB = (
                                file.size /
                                (1024 * 1024)
                            ).toFixed(2);
                            return `${file.name} (${sizeInMB} MB)`;
                        })
                        .join(', ');
                    return `File terlalu besar (max 2MB): ${oversizedNames}`;
                }
                return null;
            }

            default:
                return null;
        }
    };

    const isFieldValid = (field: string): boolean => {
        const value =
            field === 'images' ? data.images : data[field as keyof typeof data];
        return validateField(field, value) === null;
    };

    const getFieldError = (field: string): string | undefined => {
        return (
            validationErrors[field] ||
            (errors[field as keyof typeof errors] as string | undefined)
        );
    };

    // Filter categories based on search
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );

    // Get selected category
    const selectedCategory = categories.find(
        (cat) => cat.id.toString() === data.category_id,
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(event.target as Node)
            ) {
                setIsCategoryDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleSelectCategory = (categoryId: number) => {
        setData('category_id', categoryId.toString());
        setIsCategoryDropdownOpen(false);
        setCategorySearch('');
        setTouched((prev) => ({ ...prev, category_id: true }));
        // Clear error for category if previously had one
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.category_id;
            return newErrors;
        });
    };

    const handleCreateCategory = async () => {
        setCategoryFormProcessing(true);
        setCategoryFormErrors({});

        try {
            const response = await axios.post(
                '/my-auctions/categories',
                newCategoryData,
            );
            const newCategory: Category = response.data;

            // Add category to local state
            setCategories((prev) => [...prev, newCategory]);

            // Auto-select the new category
            handleSelectCategory(newCategory.id);

            // Reset form and close modal
            setNewCategoryData({ name: '', icon: '📦', description: '' });
            setIsCreateCategoryOpen(false);

            toast.success('Kategori berhasil dibuat!', {
                description: `Kategori "${newCategory.name}" telah ditambahkan dan dipilih.`,
            });
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    status?: number;
                    data?: { errors?: Record<string, string[]> };
                };
            };
            if (axiosError.response?.status === 422) {
                const errors = axiosError.response.data?.errors;
                const formattedErrors: Record<string, string> = {};
                for (const key in errors) {
                    formattedErrors[key] = errors[key][0];
                }
                setCategoryFormErrors(formattedErrors);
            } else {
                toast.error('Gagal membuat kategori', {
                    description: 'Terjadi kesalahan, silakan coba lagi.',
                });
            }
        } finally {
            setCategoryFormProcessing(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxSizeInBytes = 2048 * 1024; // 2MB in bytes
            const errors: string[] = [];

            // Validate file types (JPG/JPEG only)
            const invalidTypeFiles = files.filter(
                (file) =>
                    file.type !== 'image/jpeg' && file.type !== 'image/jpg',
            );
            if (invalidTypeFiles.length > 0) {
                errors.push(
                    `${invalidTypeFiles.length} file(s) ditolak: Hanya JPG/JPEG yang diperbolehkan`,
                );
            }

            const validTypeFiles = files.filter(
                (file) =>
                    file.type === 'image/jpeg' || file.type === 'image/jpg',
            );

            // Validate file sizes
            const oversizedFiles = validTypeFiles.filter(
                (file) => file.size > maxSizeInBytes,
            );
            if (oversizedFiles.length > 0) {
                const oversizedList = oversizedFiles
                    .map((file) => {
                        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                        return `${file.name} (${sizeInMB} MB)`;
                    })
                    .join(', ');
                errors.push(`File terlalu besar (max 2MB): ${oversizedList}`);
            }

            const validFiles = validTypeFiles.filter(
                (file) => file.size <= maxSizeInBytes,
            );

            // Limit to 5 files total
            const remainingSlots = 5 - selectedFiles.length;
            const filesToAdd = validFiles.slice(0, remainingSlots);

            if (validFiles.length > remainingSlots) {
                errors.push(
                    `${validFiles.length - remainingSlots} file(s) ditolak: Maksimal 5 foto`,
                );
            }

            if (filesToAdd.length > 0) {
                const newFiles = [...selectedFiles, ...filesToAdd];
                setSelectedFiles(newFiles);
                setData('images', newFiles);

                // Create object URLs for preview
                const newPreviews = filesToAdd.map((file) =>
                    URL.createObjectURL(file),
                );
                setPreviewUrls([...previewUrls, ...newPreviews]);

                // Mark as touched and validate
                setTouched((prev) => ({ ...prev, images: true }));
                const error = validateField('images', newFiles);
                if (error) {
                    setValidationErrors((prev) => ({ ...prev, images: error }));
                } else if (errors.length > 0) {
                    // Show file validation errors
                    setValidationErrors((prev) => ({
                        ...prev,
                        images: errors.join('; '),
                    }));
                    toast.error('Beberapa file ditolak', {
                        description: errors.join('. '),
                    });
                } else {
                    setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.images;
                        return newErrors;
                    });
                }
            } else if (errors.length > 0) {
                // All files were rejected
                setTouched((prev) => ({ ...prev, images: true }));
                setValidationErrors((prev) => ({
                    ...prev,
                    images: errors.join('; '),
                }));
                toast.error('File ditolak', {
                    description: errors.join('. '),
                });
            }
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        const newPreviews = previewUrls.filter((_, i) => i !== index);

        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(previewUrls[index]);

        setSelectedFiles(newFiles);
        setPreviewUrls(newPreviews);
        setData('images', newFiles);

        // Revalidate images
        if (touched.images) {
            const error = validateField('images', newFiles);
            if (error) {
                setValidationErrors((prev) => ({ ...prev, images: error }));
            } else {
                setValidationErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.images;
                    return newErrors;
                });
            }
        }
    };

    const handlePriceChange = (
        field: 'starting_price' | 'bid_increment',
        value: string,
    ) => {
        const numericValue = value.replace(/\D/g, '');
        setData(field, numericValue);

        // Validate in real-time if field has been touched
        if (touched[field]) {
            const error = validateField(field, numericValue);
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                if (error) newErrors[field] = error;
                else delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields before submission
        const errors: Record<string, string> = {};
        const fieldsToValidate = [
            'title',
            'description',
            'category_id',
            'starting_price',
            'bid_increment',
            'images',
        ];

        fieldsToValidate.forEach((field) => {
            const value =
                field === 'images'
                    ? data.images
                    : data[field as keyof typeof data];
            const error = validateField(field, value);
            if (error) {
                errors[field] = error;
            }
        });

        // Mark all fields as touched
        setTouched({
            title: true,
            description: true,
            category_id: true,
            starting_price: true,
            bid_increment: true,
            images: true,
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error('Form tidak valid', {
                description: 'Silakan perbaiki kesalahan pada form.',
            });
            // Scroll to top to show validation summary
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        post('/my-auctions', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Pengajuan lelang berhasil!', {
                    description:
                        'Barang Anda sedang menunggu persetujuan admin.',
                });
            },
            onError: () => {
                toast.error('Gagal mengajukan lelang', {
                    description: 'Silakan periksa kembali form Anda.',
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Ajukan Lelang - Jual Barang" />

            <div className="mx-auto max-w-4xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Link
                        href="/my-auctions"
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Ajukan Barang Lelang
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Isi detail barang yang ingin Anda lelang
                        </p>
                    </div>
                </div>

                {/* Notice */}
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#4A7FB5]/30 bg-sky-50 p-4 dark:border-[#4A7FB5]/40 dark:bg-sky-900/20">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#4A7FB5]" />
                    <div>
                        <p className="font-medium text-[#3D6E99] dark:text-[#6B9FCC]">
                            Perlu Persetujuan Admin
                        </p>
                        <p className="text-sm text-[#4A7FB5] dark:text-[#5B8DB8]">
                            Pengajuan lelang Anda akan ditinjau oleh admin
                            sebelum bisa ditampilkan dan dimulai.
                        </p>
                    </div>
                </div>

                {/* Validation Summary - Show if there are errors after trying to submit */}
                {Object.keys(validationErrors).length > 0 && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                        <div className="flex-1">
                            <p className="mb-2 font-medium text-red-800 dark:text-red-300">
                                Ada {Object.keys(validationErrors).length}{' '}
                                kesalahan pada form:
                            </p>
                            <ul className="list-inside list-disc space-y-1 text-sm text-red-700 dark:text-red-400">
                                {Object.entries(validationErrors).map(
                                    ([field, error]) => (
                                        <li key={field}>{error}</li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl bg-white p-6 dark:bg-gray-800"
                >
                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nama Barang <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => {
                                    setData('title', e.target.value);
                                    if (touched.title) {
                                        const error = validateField(
                                            'title',
                                            e.target.value,
                                        );
                                        setValidationErrors((prev) => {
                                            const newErrors = { ...prev };
                                            if (error) newErrors.title = error;
                                            else delete newErrors.title;
                                            return newErrors;
                                        });
                                    }
                                }}
                                onBlur={() => {
                                    setTouched((prev) => ({
                                        ...prev,
                                        title: true,
                                    }));
                                    const error = validateField(
                                        'title',
                                        data.title,
                                    );
                                    if (error) {
                                        setValidationErrors((prev) => ({
                                            ...prev,
                                            title: error,
                                        }));
                                    }
                                }}
                                placeholder="Contoh: Rolex Daytona Cosmograph 2020"
                                className={`w-full rounded-xl border px-4 py-3 pr-10 ${
                                    getFieldError('title')
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touched.title && isFieldValid('title')
                                          ? 'border-green-500 focus:ring-green-500'
                                          : 'border-gray-300 focus:ring-[#4A7FB5] dark:border-gray-600'
                                } bg-white text-gray-900 focus:border-transparent focus:ring-2 dark:bg-gray-700 dark:text-white`}
                            />
                            {touched.title && (
                                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                    {isFieldValid('title') ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500" />
                                    )}
                                </div>
                            )}
                        </div>
                        {getFieldError('title') && (
                            <p className="mt-1 text-sm text-red-500">
                                {getFieldError('title')}
                            </p>
                        )}
                    </div>

                    {/* Category - Search & Select */}
                    <div ref={categoryDropdownRef} className="relative">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Kategori <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            {/* Selected value / Trigger button */}
                            <button
                                type="button"
                                onClick={() =>
                                    setIsCategoryDropdownOpen(
                                        !isCategoryDropdownOpen,
                                    )
                                }
                                onBlur={() => {
                                    setTimeout(() => {
                                        if (
                                            !categoryDropdownRef.current?.contains(
                                                document.activeElement,
                                            )
                                        ) {
                                            setTouched((prev) => ({
                                                ...prev,
                                                category_id: true,
                                            }));
                                            const error = validateField(
                                                'category_id',
                                                data.category_id,
                                            );
                                            if (error) {
                                                setValidationErrors((prev) => ({
                                                    ...prev,
                                                    category_id: error,
                                                }));
                                            }
                                        }
                                    }, 200);
                                }}
                                className={`w-full rounded-xl border px-4 py-3 pr-16 ${
                                    getFieldError('category_id')
                                        ? 'border-red-500 focus:ring-red-500'
                                        : touched.category_id &&
                                            isFieldValid('category_id')
                                          ? 'border-green-500 focus:ring-green-500'
                                          : 'border-gray-300 focus:ring-[#4A7FB5] dark:border-gray-600'
                                } flex items-center justify-between bg-white text-gray-900 focus:border-transparent focus:ring-2 dark:bg-gray-700 dark:text-white`}
                            >
                                {selectedCategory ? (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {selectedCategory.icon}
                                        </span>
                                        <span>{selectedCategory.name}</span>
                                    </span>
                                ) : (
                                    <span className="text-gray-400">
                                        Pilih Kategori
                                    </span>
                                )}
                                <div className="flex items-center gap-1">
                                    {touched.category_id &&
                                        (isFieldValid('category_id') ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        ))}
                                    <ChevronDown
                                        className={`h-5 w-5 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </div>
                            </button>

                            {/* Dropdown */}
                            {isCategoryDropdownOpen && (
                                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                    {/* Search input + Create button */}
                                    <div className="border-b border-gray-200 p-3 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={categorySearch}
                                                    onChange={(e) =>
                                                        setCategorySearch(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Cari kategori..."
                                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    autoFocus
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsCategoryDropdownOpen(
                                                        false,
                                                    );
                                                    setIsCreateCategoryOpen(
                                                        true,
                                                    );
                                                }}
                                                className="flex-shrink-0 rounded-lg bg-[#4A7FB5] p-2 text-white transition-colors hover:bg-[#3D6E99]"
                                                title="Buat kategori baru"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Category list */}
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredCategories.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                Kategori tidak ditemukan
                                            </div>
                                        ) : (
                                            filteredCategories.map(
                                                (category) => (
                                                    <button
                                                        key={category.id}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectCategory(
                                                                category.id,
                                                            )
                                                        }
                                                        className={`flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                                            data.category_id ===
                                                            category.id.toString()
                                                                ? 'bg-sky-50 dark:bg-sky-900/20'
                                                                : ''
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <span className="text-xl">
                                                                {category.icon}
                                                            </span>
                                                            <span className="text-gray-900 dark:text-white">
                                                                {category.name}
                                                            </span>
                                                        </span>
                                                        {data.category_id ===
                                                            category.id.toString() && (
                                                            <Check className="h-5 w-5 text-[#4A7FB5]" />
                                                        )}
                                                    </button>
                                                ),
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {getFieldError('category_id') && (
                            <p className="mt-1 text-sm text-red-500">
                                {getFieldError('category_id')}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Deskripsi <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => {
                                setData('description', e.target.value);
                                if (touched.description) {
                                    const error = validateField(
                                        'description',
                                        e.target.value,
                                    );
                                    setValidationErrors((prev) => {
                                        const newErrors = { ...prev };
                                        if (error)
                                            newErrors.description = error;
                                        else delete newErrors.description;
                                        return newErrors;
                                    });
                                }
                            }}
                            onBlur={() => {
                                setTouched((prev) => ({
                                    ...prev,
                                    description: true,
                                }));
                                const error = validateField(
                                    'description',
                                    data.description,
                                );
                                if (error) {
                                    setValidationErrors((prev) => ({
                                        ...prev,
                                        description: error,
                                    }));
                                }
                            }}
                            placeholder="Deskripsikan kondisi, spesifikasi, dan keunggulan barang Anda secara detail (minimal 50 karakter)"
                            rows={5}
                            className={`w-full rounded-xl border px-4 py-3 ${
                                getFieldError('description')
                                    ? 'border-red-500 focus:ring-red-500'
                                    : touched.description &&
                                        isFieldValid('description')
                                      ? 'border-green-500 focus:ring-green-500'
                                      : 'border-gray-300 focus:ring-amber-500 dark:border-gray-600'
                            } resize-none bg-white text-gray-900 focus:border-transparent focus:ring-2 dark:bg-gray-700 dark:text-white`}
                        />
                        <p
                            className={`mt-1 text-xs ${
                                data.description.length < 50
                                    ? 'text-[#4A7FB5] dark:text-[#5B8DB8]'
                                    : 'text-gray-500'
                            }`}
                        >
                            {data.description.length}/50 karakter minimum
                        </p>
                        {getFieldError('description') && (
                            <p className="mt-1 text-sm text-red-500">
                                {getFieldError('description')}
                            </p>
                        )}
                    </div>

                    {/* Prices */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Harga Awal (Rp){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <input
                                    type="text"
                                    value={formatCurrency(
                                        parseInt(data.starting_price) || 0,
                                    )}
                                    onChange={(e) =>
                                        handlePriceChange(
                                            'starting_price',
                                            e.target.value,
                                        )
                                    }
                                    onBlur={() => {
                                        setTouched((prev) => ({
                                            ...prev,
                                            starting_price: true,
                                        }));
                                        const error = validateField(
                                            'starting_price',
                                            data.starting_price,
                                        );
                                        if (error) {
                                            setValidationErrors((prev) => ({
                                                ...prev,
                                                starting_price: error,
                                            }));
                                        }
                                    }}
                                    placeholder="100.000.000"
                                    className={`w-full rounded-xl border py-3 pr-10 pl-12 ${
                                        getFieldError('starting_price')
                                            ? 'border-red-500 focus:ring-red-500'
                                            : touched.starting_price &&
                                                isFieldValid('starting_price')
                                              ? 'border-green-500 focus:ring-green-500'
                                              : 'border-gray-300 focus:ring-amber-500 dark:border-gray-600'
                                    } bg-white text-gray-900 focus:border-transparent focus:ring-2 dark:bg-gray-700 dark:text-white`}
                                />
                                {touched.starting_price && (
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                        {isFieldValid('starting_price') ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Minimum Rp 100.000
                            </p>
                            {getFieldError('starting_price') && (
                                <p className="mt-1 text-sm text-red-500">
                                    {getFieldError('starting_price')}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Kelipatan Bid (Rp){' '}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-gray-500">
                                    Rp
                                </span>
                                <input
                                    type="text"
                                    value={formatCurrency(
                                        parseInt(data.bid_increment) || 0,
                                    )}
                                    onChange={(e) =>
                                        handlePriceChange(
                                            'bid_increment',
                                            e.target.value,
                                        )
                                    }
                                    onBlur={() => {
                                        setTouched((prev) => ({
                                            ...prev,
                                            bid_increment: true,
                                        }));
                                        const error = validateField(
                                            'bid_increment',
                                            data.bid_increment,
                                        );
                                        if (error) {
                                            setValidationErrors((prev) => ({
                                                ...prev,
                                                bid_increment: error,
                                            }));
                                        }
                                    }}
                                    placeholder="1.000.000"
                                    className={`w-full rounded-xl border py-3 pr-10 pl-12 ${
                                        getFieldError('bid_increment')
                                            ? 'border-red-500 focus:ring-red-500'
                                            : touched.bid_increment &&
                                                isFieldValid('bid_increment')
                                              ? 'border-green-500 focus:ring-green-500'
                                              : 'border-gray-300 focus:ring-amber-500 dark:border-gray-600'
                                    } bg-white text-gray-900 focus:border-transparent focus:ring-2 dark:bg-gray-700 dark:text-white`}
                                />
                                {touched.bid_increment && (
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                        {isFieldValid('bid_increment') ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Minimum Rp 10.000
                            </p>
                            {getFieldError('bid_increment') && (
                                <p className="mt-1 text-sm text-red-500">
                                    {getFieldError('bid_increment')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Registration Fee */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Biaya Pendaftaran (Rp)
                        </label>
                        <div className="relative">
                            <span className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-gray-500">
                                Rp
                            </span>
                            <input
                                type="text"
                                value={formatCurrency(
                                    parseInt(data.registration_fee) || 0,
                                )}
                                onChange={(e) => {
                                    const numericValue = e.target.value.replace(
                                        /\D/g,
                                        '',
                                    );
                                    setData('registration_fee', numericValue);
                                }}
                                placeholder="0"
                                className="w-full rounded-xl border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Kosongkan atau isi 0 untuk lelang gratis tanpa biaya
                            pendaftaran. Peserta harus membayar biaya ini untuk
                            bisa ikut bidding.
                        </p>
                        {errors.registration_fee && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.registration_fee}
                            </p>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Durasi Lelang{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.duration_hours}
                            onChange={(e) =>
                                setData('duration_hours', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {durations.map((d) => (
                                <option key={d.id} value={d.hours.toString()}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                        {errors.duration_hours && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.duration_hours}
                            </p>
                        )}
                    </div>

                    {/* Images - File Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Foto Barang <span className="text-red-500">*</span>
                        </label>
                        <p className="mb-3 text-xs text-gray-500">
                            Format: JPG, JPEG saja. Maksimal 5 foto (Max 2MB per
                            foto).
                        </p>

                        {/* File Input Area */}
                        <div
                            className={`mb-4 rounded-xl border-2 border-dashed p-4 ${
                                getFieldError('images')
                                    ? 'border-red-500'
                                    : touched.images && isFieldValid('images')
                                      ? 'border-green-500'
                                      : 'border-gray-300 dark:border-gray-600'
                            }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".jpg,.jpeg,image/jpeg"
                                multiple
                                className="hidden"
                            />

                            <div className="flex flex-wrap gap-3">
                                {/* Upload Button */}
                                {selectedFiles.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-[#4A7FB5] hover:bg-sky-50 hover:text-[#4A7FB5] dark:border-gray-600 dark:hover:bg-sky-900/10"
                                    >
                                        <Upload className="mb-2 h-8 w-8" />
                                        <span className="text-xs font-medium">
                                            Upload Foto
                                        </span>
                                    </button>
                                )}

                                {/* Image Previews */}
                                {previewUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="group relative h-32 w-32 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                                    >
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                        {/* File size indicator */}
                                        <div className="absolute right-0 bottom-0 left-0 bg-black/70 px-1 py-0.5 text-center text-xs text-white">
                                            {selectedFiles[index] && (
                                                <span>
                                                    {(
                                                        selectedFiles[index]
                                                            .size /
                                                        (1024 * 1024)
                                                    ).toFixed(2)}{' '}
                                                    MB
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedFiles.length === 0 && (
                                <p className="mt-3 text-center text-xs text-gray-400">
                                    Belum ada foto. Klik tombol di atas untuk
                                    upload.
                                </p>
                            )}
                            {selectedFiles.length > 0 && (
                                <p className="mt-3 text-center text-xs text-gray-500">
                                    {selectedFiles.length}/5 foto terpilih
                                </p>
                            )}
                        </div>
                        {getFieldError('images') && (
                            <p className="mt-1 text-sm text-red-500">
                                {getFieldError('images')}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                        <Link
                            href="/my-auctions"
                            className="rounded-xl px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#3D6E99] px-8 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#4A7FB5]/25 disabled:opacity-50"
                        >
                            {processing ? 'Mengirim...' : 'Ajukan Lelang'}
                        </button>
                    </div>
                </form>

                {/* Create Category Dialog */}
                <Dialog
                    open={isCreateCategoryOpen}
                    onOpenChange={setIsCreateCategoryOpen}
                >
                    <DialogContent className="bg-white sm:max-w-lg dark:bg-gray-800">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-white">
                                Buat Kategori Baru
                            </DialogTitle>
                            <DialogDescription>
                                Tambahkan kategori baru untuk barang lelang
                                Anda.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5 py-2">
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
                                            onClick={() =>
                                                setNewCategoryData((prev) => ({
                                                    ...prev,
                                                    icon,
                                                }))
                                            }
                                            className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all ${
                                                newCategoryData.icon === icon
                                                    ? 'border-2 border-[#4A7FB5] bg-sky-100 dark:bg-sky-900/30'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={newCategoryData.icon}
                                    onChange={(e) =>
                                        setNewCategoryData((prev) => ({
                                            ...prev,
                                            icon: e.target.value,
                                        }))
                                    }
                                    placeholder="Atau masukkan emoji custom"
                                    maxLength={10}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Category Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nama Kategori{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newCategoryData.name}
                                    onChange={(e) => {
                                        setNewCategoryData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }));
                                        if (categoryFormErrors.name) {
                                            setCategoryFormErrors((prev) => {
                                                const n = { ...prev };
                                                delete n.name;
                                                return n;
                                            });
                                        }
                                    }}
                                    placeholder="Contoh: Jam Tangan"
                                    className={`w-full rounded-xl border px-4 py-2.5 ${
                                        categoryFormErrors.name
                                            ? 'border-red-500'
                                            : 'border-gray-300 dark:border-gray-600'
                                    } bg-white text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:bg-gray-700 dark:text-white`}
                                />
                                {categoryFormErrors.name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {categoryFormErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Deskripsi{' '}
                                    <span className="text-xs font-normal text-gray-400">
                                        (opsional)
                                    </span>
                                </label>
                                <textarea
                                    value={newCategoryData.description}
                                    onChange={(e) =>
                                        setNewCategoryData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Deskripsi singkat kategori"
                                    rows={2}
                                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#4A7FB5] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreateCategoryOpen(false);
                                    setNewCategoryData({
                                        name: '',
                                        icon: '📦',
                                        description: '',
                                    });
                                    setCategoryFormErrors({});
                                }}
                                className="rounded-xl px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateCategory}
                                disabled={
                                    categoryFormProcessing ||
                                    !newCategoryData.name.trim()
                                }
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A7FB5] to-[#3D6E99] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#4A7FB5]/25 disabled:opacity-50"
                            >
                                {categoryFormProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {categoryFormProcessing
                                    ? 'Menyimpan...'
                                    : 'Simpan'}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
