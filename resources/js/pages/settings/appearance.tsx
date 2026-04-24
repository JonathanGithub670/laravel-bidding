import { Head } from '@inertiajs/react';
import { Palette, Monitor, Moon, Sun, Check } from 'lucide-react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';

export default function AppearancePage() {
    const { appearance, updateAppearance } = useAppearance();

    const themes: {
        value: Appearance;
        icon: typeof Sun;
        label: string;
        description: string;
    }[] = [
        {
            value: 'light',
            icon: Sun,
            label: 'Light',
            description: 'A clean and bright appearance for daytime use',
        },
        {
            value: 'dark',
            icon: Moon,
            label: 'Dark',
            description: 'Easy on the eyes, perfect for night owls',
        },
        {
            value: 'system',
            icon: Monitor,
            label: 'System',
            description: 'Automatically switch based on your device settings',
        },
    ];

    return (
        <AppLayout>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                            <Palette className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Appearance
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Customize how the application looks on your
                                device
                            </p>
                        </div>
                    </div>

                    {/* Theme Options */}
                    <div className="space-y-3">
                        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Choose your preferred theme
                        </h4>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {themes.map(
                                ({ value, icon: Icon, label, description }) => (
                                    <button
                                        key={value}
                                        onClick={() => updateAppearance(value)}
                                        className={cn(
                                            'relative flex flex-col items-center rounded-xl border-2 p-6 transition-all',
                                            appearance === value
                                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
                                        )}
                                    >
                                        {appearance === value && (
                                            <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                'mb-4 flex h-14 w-14 items-center justify-center rounded-xl',
                                                appearance === value
                                                    ? 'bg-brand-500 text-white'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                                            )}
                                        >
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        <h5
                                            className={cn(
                                                'mb-1 font-medium',
                                                appearance === value
                                                    ? 'text-brand-600 dark:text-brand-400'
                                                    : 'text-gray-800 dark:text-white/90',
                                            )}
                                        >
                                            {label}
                                        </h5>

                                        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                                            {description}
                                        </p>
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Preview Note */}
                    <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-800 dark:text-white/90">
                                Note:
                            </span>{' '}
                            Changes are applied immediately. Your preference
                            will be saved and remembered for future visits.
                        </p>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
