import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MonthlyTarget() {
    const targetPercentage = 75.55;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset =
        circumference - (targetPercentage / 100) * circumference;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Monthly Target
                </h3>
                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    February 2026
                </span>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center">
                {/* Circular Progress */}
                <div className="relative h-32 w-32">
                    <svg className="h-32 w-32 -rotate-90 transform">
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="text-brand-500"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800 dark:text-white">
                            {targetPercentage}%
                        </span>
                    </div>
                </div>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    You have achieved {targetPercentage}% of your monthly target
                </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-success-500">
                        <TrendingUp className="size-4" />
                        <span className="text-sm font-medium">+10%</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        Target
                    </span>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-error-500">
                        <TrendingDown className="size-4" />
                        <span className="text-sm font-medium">-5%</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        This Week
                    </span>
                </div>
            </div>
        </div>
    );
}
