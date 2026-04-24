import { TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PriceDisplayProps {
    amount: number;
    previousAmount?: number;
    showAnimation?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

function formatCurrency(amount: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

export default function PriceDisplay({
    amount,
    previousAmount,
    showAnimation = true,
    size = 'lg',
}: PriceDisplayProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayAmount, setDisplayAmount] = useState(amount);

    useEffect(() => {
        if (previousAmount && amount !== previousAmount && showAnimation) {
            setIsAnimating(true);

            // Animate the number change
            const duration = 500;
            const steps = 20;
            const increment = (amount - previousAmount) / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                if (currentStep >= steps) {
                    setDisplayAmount(amount);
                    clearInterval(timer);
                    setTimeout(() => setIsAnimating(false), 500);
                } else {
                    setDisplayAmount(
                        Math.round(previousAmount + increment * currentStep),
                    );
                }
            }, duration / steps);

            return () => clearInterval(timer);
        } else {
            setDisplayAmount(amount);
        }
    }, [amount, previousAmount, showAnimation]);

    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-5xl',
    };

    return (
        <div className="relative">
            {/* Price Display */}
            <div
                className={`font-bold text-slate-900 transition-all duration-300 dark:text-white ${sizeClasses[size]} ${isAnimating ? 'scale-110 text-amber-500' : 'scale-100'} `}
            >
                {formatCurrency(displayAmount)}
            </div>

            {/* Increase Indicator */}
            {isAnimating && previousAmount && amount > previousAmount && (
                <div className="absolute -top-6 left-1/2 flex -translate-x-1/2 animate-bounce items-center gap-1 text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                        +{formatCurrency(amount - previousAmount)}
                    </span>
                </div>
            )}

            {/* Pop Animation Overlay */}
            {isAnimating && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-xl bg-amber-500/20" />
                </div>
            )}
        </div>
    );
}
