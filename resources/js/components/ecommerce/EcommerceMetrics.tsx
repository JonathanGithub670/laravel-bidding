import { ArrowUpIcon, ArrowDownIcon, GroupIcon, ShoppingBagIcon } from '@/icons';

interface BadgeProps {
    children: React.ReactNode;
    color: 'success' | 'error' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({ children, color }) => {
    const colorClasses = {
        success: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
        error: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
        warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${colorClasses[color]}`}
        >
            {children}
        </span>
    );
};

export default function EcommerceMetrics() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* Metric Item - Customers */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Customers
                        </span>
                        <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                            3,782
                        </h4>
                    </div>
                    <Badge color="success">
                        <ArrowUpIcon />
                        11.01%
                    </Badge>
                </div>
            </div>

            {/* Metric Item - Orders */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <ShoppingBagIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Orders
                        </span>
                        <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                            5,359
                        </h4>
                    </div>

                    <Badge color="error">
                        <ArrowDownIcon />
                        9.05%
                    </Badge>
                </div>
            </div>
        </div>
    );
}
