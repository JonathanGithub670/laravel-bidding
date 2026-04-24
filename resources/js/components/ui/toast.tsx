import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
    return (
        <SonnerToaster
            position="top-right"
            toastOptions={{
                classNames: {
                    toast: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl',
                    title: 'text-gray-900 dark:text-white font-medium',
                    description: 'text-gray-600 dark:text-gray-400',
                    success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30',
                    error: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30',
                },
            }}
            expand={false}
            richColors
        />
    );
}

export { toast } from 'sonner';
