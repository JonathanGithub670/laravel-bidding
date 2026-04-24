import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useSidebar } from '@/context/SidebarContext';
import { GridIcon, ChatIcon, SettingsIcon, ChevronDownIcon, HorizontalDotsIcon } from '@/icons';
import { type SharedData } from '@/types';
import { Gavel, HandCoins, ShieldCheck, Tag, UserCheck, Receipt, Wallet, RefreshCcw, ArrowLeftRight, Package, UserPlus } from 'lucide-react';

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string }[];
    adminOnly?: boolean;
};

const navItems: NavItem[] = [
    {
        icon: <GridIcon />,
        name: 'Dashboard',
        path: '/dashboard',
    },
    {
        icon: <Gavel className="w-6 h-6" />,
        name: 'Jual Barang',
        path: '/my-auctions',
    },
    {
        icon: <Package className="w-6 h-6" />,
        name: 'Barang Terjual',
        path: '/my-auctions/settlements',
    },
    {
        icon: <Receipt className="w-6 h-6" />,
        name: 'Tagihan',
        path: '/user/invoices',
    },
    {
        icon: <Wallet className="w-6 h-6" />,
        name: 'Reimbursement',
        path: '/user/reimbursements',
    },
    {
        icon: <ChatIcon />,
        name: 'Chat',
        path: '/chat',
    },
];

const adminItems: NavItem[] = [
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        name: 'Persetujuan Lelang',
        path: '/admin/auctions/pending',
        adminOnly: true,
    },
    {
        icon: <Tag className="w-6 h-6" />,
        name: 'Kelola Kategori',
        path: '/admin/categories',
        adminOnly: true,
    },
    {
        icon: <Gavel className="w-6 h-6" />,
        name: 'Daftar Lelang',
        path: '/auctions/list',
    },
    {
        icon: <RefreshCcw className="w-6 h-6" />,
        name: 'Verifikasi Reimbursement',
        path: '/admin/reimbursements',
        adminOnly: true,
    },
    {
        icon: <HandCoins className="w-6 h-6" />,
        name: 'Penyelesaian Lelang',
        path: '/admin/settlements',
        adminOnly: true,
    },
];

const superadminItems: NavItem[] = [
    {
        icon: <UserCheck className="w-6 h-6" />,
        name: 'Verifikasi User',
        path: '/admin/users/verification',
        adminOnly: true,
    },
    {
        icon: <UserPlus className="w-6 h-6" />,
        name: 'Kelola Admin',
        path: '/admin/users/admins',
        adminOnly: true,
    },
];

const othersItems: NavItem[] = [
    {
        icon: <SettingsIcon />,
        name: 'Settings',
        subItems: [
            { name: 'Profile', path: '/settings/profile' },
            { name: 'Password', path: '/settings/password' },
            { name: 'Two-Factor Auth', path: '/settings/two-factor' },
            { name: 'Appearance', path: '/settings/appearance' },
        ],
    },
];

export const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const { url, props } = usePage<SharedData>();
    const { auth, userBadges, adminBadges } = props;

    // Check if user is superadmin
    const isSuperadmin = auth.user.role?.name === 'superadmin';
    
    // Build badge map: path -> count
    const badgeMap = useMemo(() => {
        const map: Record<string, number> = {};
        if (userBadges) {
            if (userBadges.unreadChats > 0) map['/chat'] = userBadges.unreadChats;
            if (userBadges.pendingMyAuctions > 0) map['/my-auctions'] = userBadges.pendingMyAuctions;
            if (userBadges.liveAuctions > 0) map['/auctions/list'] = userBadges.liveAuctions;
        }
        if (adminBadges) {
            if (adminBadges.pendingAuctions > 0) map['/admin/auctions/pending'] = adminBadges.pendingAuctions;
            if (adminBadges.pendingReimbursements > 0) map['/admin/reimbursements'] = adminBadges.pendingReimbursements;
            if (adminBadges.pendingSettlements > 0) map['/admin/settlements'] = adminBadges.pendingSettlements;
            if (adminBadges.totalCategories > 0) map['/admin/categories'] = adminBadges.totalCategories;
            if (adminBadges.pendingVerifications > 0) map['/admin/users/verification'] = adminBadges.pendingVerifications;
        }
        return map;
    }, [userBadges, adminBadges]);

    // Combine ALL nav items and filter based on role
    let combinedItems = [...navItems, ...adminItems];
    if (isSuperadmin) {
        combinedItems = [...combinedItems, ...superadminItems];
    }
    
    const allNavItems = combinedItems.filter(item => {
        if (item.adminOnly) {
           return auth.user.role?.name === 'superadmin' || auth.user.role?.name === 'admin';
        }
        return true;
    });

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: 'main' | 'others';
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback((path: string) => url.startsWith(path), [url]);

    useEffect(() => {
        let submenuMatched = false;
        ['main', 'others'].forEach((menuType) => {
            const items = menuType === 'main' ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as 'main' | 'others',
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [url, isActive]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (items: NavItem[], menuType: 'main' | 'others') => (
        <ul className="flex flex-col gap-2">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${
                                openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? 'menu-item-active'
                                    : 'menu-item-inactive'
                            } cursor-pointer ${
                                !isExpanded && !isHovered
                                    ? 'lg:justify-center'
                                    : 'lg:justify-start'
                            }`}
                        >
                            <span
                                className={`menu-item-icon-size ${
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? 'menu-item-icon-active'
                                        : 'menu-item-icon-inactive'
                                }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text">{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                        openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                            ? 'rotate-180 text-brand-500'
                                            : ''
                                    }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                href={nav.path}
                                className={`menu-item group relative ${
                                    isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                                } ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'lg:justify-start'
                                }`}
                            >
                                <span
                                    className={`menu-item-icon-size ${
                                        isActive(nav.path)
                                            ? 'menu-item-icon-active'
                                            : 'menu-item-icon-inactive'
                                    }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                                {/* Blue badge */}
                                {nav.path && badgeMap[nav.path] && (
                                    (isExpanded || isHovered || isMobileOpen) ? (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
                                            {badgeMap[nav.path]}
                                        </span>
                                    ) : (
                                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                                    )
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={(el) => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : '0px',
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map((subItem) => (
                                    <li key={subItem.name}>
                                        <Link
                                            href={subItem.path}
                                            className={`menu-dropdown-item ${
                                                isActive(subItem.path)
                                                    ? 'menu-dropdown-item-active'
                                                    : 'menu-dropdown-item-inactive'
                                            }`}
                                        >
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
                ${
                    isExpanded || isMobileOpen
                        ? 'w-[290px]'
                        : isHovered
                          ? 'w-[290px]'
                          : 'w-[90px]'
                }
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`py-0 flex overflow-hidden ${
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-center'
                }`}
            >
                <Link href="/dashboard" className="block overflow-hidden -mx-5">
                    <img src="/Logo.png" alt="nathBid" className="h-40 w-auto object-contain -my-8" />
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Menu'
                                ) : (
                                    <HorizontalDotsIcon className="size-6" />
                                )}
                            </h2>
                            {renderMenuItems(allNavItems, 'main')}
                        </div>
                        <div className="">
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Others'
                                ) : (
                                    <HorizontalDotsIcon />
                                )}
                            </h2>
                            {renderMenuItems(othersItems, 'others')}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
