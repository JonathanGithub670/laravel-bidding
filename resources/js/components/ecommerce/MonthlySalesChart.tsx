import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MonthlySalesChart() {
    // Bar chart data representation
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const data = [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112];
    const maxValue = Math.max(...data);

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Monthly Sales
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <MoreHorizontal className="size-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>View More</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="mt-6 pb-5">
                <div className="flex h-[180px] items-end justify-between gap-2">
                    {data.map((value, index) => (
                        <div
                            key={months[index]}
                            className="flex flex-1 flex-col items-center gap-2"
                        >
                            <div
                                className="w-full min-w-[20px] rounded-t-md bg-brand-500 transition-all duration-300 hover:bg-brand-600"
                                style={{
                                    height: `${(value / maxValue) * 100}%`,
                                }}
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {months[index]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
