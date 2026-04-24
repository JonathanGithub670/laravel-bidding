import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { useSidebar } from '@/context/SidebarContext';
import { MenuIcon, CloseIcon, SearchIcon } from '@/icons';
import { type SharedData } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { Bell, LogOut, Settings, User, Moon, Sun, ChevronUp, Info, Home } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useAppearance } from '@/hooks/use-appearance';

interface NotificationItem {
    id: string;
    data: {
        type: string;
        icon: string;
        title: string;
        message: string;
        url?: string;
    };
    read_at: string | null;
    created_at: string;
    created_at_full: string;
}

export const AppHeader: React.FC = () => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const { auth, unreadNotifications } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const { appearance, updateAppearance } = useAppearance();
    const [localUnreadCount, setLocalUnreadCount] = useState(unreadNotifications || 0);
    
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Sync with server count
    useEffect(() => {
        setLocalUnreadCount(unreadNotifications || 0);
    }, [unreadNotifications]);

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };

    const toggleDarkMode = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications when dropdown is opened
    const fetchNotifications = async () => {
        if (loadingNotifications) return;
        setLoadingNotifications(true);
        try {
            const response = await fetch('/notifications', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await response.json();
            setNotifications(data.notifications || []);
            setLocalUnreadCount(data.unread_count || 0);
        } catch (e) {
            console.error('Failed to fetch notifications', e);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const handleToggleNotifications = () => {
        const willOpen = !isNotificationOpen;
        setIsNotificationOpen(willOpen);
        if (willOpen) {
            fetchNotifications();
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await fetch('/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setLocalUnreadCount(0);
        } catch (e) {
            console.error('Failed to mark all read', e);
        }
    };

    const handleNotificationClick = (notification: NotificationItem) => {
        // Mark as read
        if (!notification.read_at) {
            fetch(`/notifications/${notification.id}/mark-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            setNotifications(prev => prev.map(n =>
                n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            setLocalUnreadCount(prev => Math.max(0, prev - 1));
        }

        // Navigate
        if (notification.data.url) {
            setIsNotificationOpen(false);
            router.visit(notification.data.url);
        }
    };

    const getNotificationIcon = (type: string, fallbackIcon: string): string => {
        const iconMap: Record<string, string> = {
            auction_won: '🏆',
            auction_lost: '💰',
            auction_sold: '📦',
        };
        return iconMap[type] || fallbackIcon || '🔔';
    };

    return (
        <header className="sticky top-0 flex w-full bg-white border-gray-200 z-40 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
            <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
                <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
                    <button
                        className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-40 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={handleToggle}
                        aria-label="Toggle Sidebar"
                    >
                        {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>

                    <Link href="/dashboard" className="lg:hidden">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</span>
                    </Link>

                    <button
                        onClick={toggleApplicationMenu}
                        className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-40 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    <div className="hidden lg:block">
                        <form>
                            <div className="relative">
                                <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                                    <SearchIcon className="fill-gray-500 dark:fill-gray-400" />
                                </span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search or type command..."
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                                />
                                <button 
                                    type="button"
                                    className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                                >
                                    <span>⌘</span>
                                    <span>K</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div
                    className={`${
                        isApplicationMenuOpen ? 'flex' : 'hidden'
                    } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-md lg:justify-end lg:px-0 lg:shadow-none`}
                >
                    <div className="flex items-center gap-3">
                        {/* Home Button - Circular Button */}
                        <Link
                            href="/"
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
                            aria-label="Go to Home"
                        >
                            <Home className="h-5 w-5" />
                        </Link>

                        {/* Dark Mode Toggle - Circular Button */}
                        <button
                            onClick={toggleDarkMode}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {appearance === 'dark' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>
                        
                        {/* Notification Button - Circular with Badge */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={handleToggleNotifications}
                                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                                {localUnreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {localUnreadCount > 99 ? '99+' : localUnreadCount}
                                    </span>
                                )}
                            </button>
                            
                            {/* Notification Dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-3 w-96 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
                                    <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
                                        <h5 className="font-semibold text-gray-800 dark:text-white">Notifikasi</h5>
                                        {localUnreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Tandai semua dibaca
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {loadingNotifications ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="py-8 text-center">
                                                <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Belum ada notifikasi</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                                {notifications.map((notification) => (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                                            !notification.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                        }`}
                                                    >
                                                        <span className="mt-0.5 text-xl">
                                                            {getNotificationIcon(notification.data.type, notification.data.icon)}
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm ${!notification.read_at ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                                                {notification.data.title}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                                {notification.data.message}
                                                            </p>
                                                            <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                                                                {notification.created_at}
                                                            </p>
                                                        </div>
                                                        {!notification.read_at && (
                                                            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500"></span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* User Profile Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                        {auth.user ? (
                            <>
                                <button 
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center gap-3 text-left"
                                >
                                    <Avatar className="h-11 w-11 border-2 border-gray-200 dark:border-gray-700">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-brand-500 text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden lg:flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                                            {auth.user.name}
                                        </span>
                                        <ChevronUp className={`h-4 w-4 text-gray-500 transition-transform ${isUserDropdownOpen ? '' : 'rotate-180'}`} />
                                    </div>
                                </button>
                                
                                {/* User Dropdown Menu */}
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
                                        {/* User Info Header */}
                                        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                                            <h5 className="font-semibold text-gray-800 dark:text-white">
                                                {auth.user.name}
                                            </h5>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                        
                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link
                                                href="/settings/profile"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                Edit profile
                                            </Link>
                                            <Link
                                                href="/settings/profile"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                Account settings
                                            </Link>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <Info className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                Support
                                            </Link>
                                        </div>
                                        
                                        {/* Sign Out */}
                                        <div className="border-t border-gray-200 p-2 dark:border-gray-800">
                                            <button
                                                onClick={() => router.post('/logout')}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                            >
                                                <LogOut className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;
