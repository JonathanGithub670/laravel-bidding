import {
    MoreHorizontal,
    Eye,
    Package,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Order {
    id: string;
    customer: string;
    email: string;
    amount: string;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
}

const orders: Order[] = [
    {
        id: '#ORD001',
        customer: 'John Smith',
        email: 'john@example.com',
        amount: '$125.00',
        status: 'completed',
        date: 'Jan 28, 2026',
    },
    {
        id: '#ORD002',
        customer: 'Sarah Johnson',
        email: 'sarah@example.com',
        amount: '$89.00',
        status: 'pending',
        date: 'Jan 28, 2026',
    },
    {
        id: '#ORD003',
        customer: 'Michael Brown',
        email: 'michael@example.com',
        amount: '$259.00',
        status: 'completed',
        date: 'Jan 27, 2026',
    },
    {
        id: '#ORD004',
        customer: 'Emily Davis',
        email: 'emily@example.com',
        amount: '$45.00',
        status: 'cancelled',
        date: 'Jan 27, 2026',
    },
    {
        id: '#ORD005',
        customer: 'Robert Wilson',
        email: 'robert@example.com',
        amount: '$178.00',
        status: 'pending',
        date: 'Jan 26, 2026',
    },
];

const statusConfig = {
    pending: {
        label: 'Pending',
        icon: Package,
        className:
            'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500',
    },
    completed: {
        label: 'Completed',
        icon: CheckCircle,
        className:
            'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        className:
            'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
    },
};

export default function RecentOrders() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between px-5 py-4 sm:px-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Recent Orders
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <MoreHorizontal className="size-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>View All</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                            <th className="px-5 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Order ID
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Customer
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Amount
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Status
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Date
                            </th>
                            <th className="px-5 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {orders.map((order) => {
                            const status = statusConfig[order.status];
                            const StatusIcon = status.icon;
                            return (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                                >
                                    <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                        {order.id}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                {order.customer}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                                        {order.amount}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                                        >
                                            <StatusIcon className="size-3" />
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {order.date}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button className="text-gray-400 transition-colors hover:text-brand-500">
                                            <Eye className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
