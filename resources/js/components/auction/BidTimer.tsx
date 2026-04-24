import { Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface BidTimerProps {
    endsAt: string;
    onTimeUp?: () => void;
    className?: string;
}

export default function BidTimer({
    endsAt,
    onTimeUp,
    className = '',
}: BidTimerProps) {
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [isUrgent, setIsUrgent] = useState(false);
    const [isCritical, setIsCritical] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const calculateRemaining = () => {
            const endTime = new Date(endsAt).getTime();
            const now = Date.now();
            const diff = Math.max(0, Math.floor((endTime - now) / 1000));
            return diff;
        };

        const initial = calculateRemaining();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRemainingSeconds(initial);

        intervalRef.current = setInterval(() => {
            const remaining = calculateRemaining();
            setRemainingSeconds(remaining);
            setIsUrgent(remaining <= 60 && remaining > 10);
            setIsCritical(remaining <= 10);

            if (remaining <= 0) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                onTimeUp?.();
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [endsAt, onTimeUp]);

    // Update when endsAt changes (time extension)
    useEffect(() => {
        const calculateRemaining = () => {
            const endTime = new Date(endsAt).getTime();
            const now = Date.now();
            return Math.max(0, Math.floor((endTime - now) / 1000));
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRemainingSeconds(calculateRemaining());
    }, [endsAt]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = (): number => {
        // Assume max display is 1 hour for progress bar
        const maxSeconds = 3600;
        return Math.min(100, (remainingSeconds / maxSeconds) * 100);
    };

    const getProgressColor = (): string => {
        if (isCritical) return 'bg-red-500';
        if (isUrgent) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getTextColor = (): string => {
        if (isCritical) return 'text-red-500';
        if (isUrgent) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Progress Bar */}
            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                    className={`h-full transition-all duration-1000 ${getProgressColor()} ${isCritical ? 'animate-pulse' : ''}`}
                    style={{ width: `${getProgressPercentage()}%` }}
                />
            </div>

            {/* Timer Display */}
            <div
                className={`flex items-center justify-center gap-2 ${getTextColor()}`}
            >
                <Clock
                    className={`h-5 w-5 ${isCritical ? 'animate-bounce' : ''}`}
                />
                <span
                    className={`font-mono text-2xl font-bold ${isCritical ? 'animate-pulse' : ''}`}
                >
                    {formatTime(remainingSeconds)}
                </span>
            </div>

            {/* Status Text */}
            {isCritical && (
                <p className="animate-pulse text-center font-semibold text-red-500">
                    ⚠️ Waktu hampir habis!
                </p>
            )}
        </div>
    );
}
