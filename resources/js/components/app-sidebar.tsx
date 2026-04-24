import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, MessageSquare, Gavel, ShieldCheck, Clock } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { chat, dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Jual Barang',
        href: '/my-auctions',
        icon: Gavel,
    },
    {
        title: 'Chat',
        href: chat(),
        icon: MessageSquare,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Persetujuan Lelang',
        href: '/admin/auctions/pending',
        icon: ShieldCheck,
    },
    {
        title: 'Durasi Lelang',
        href: '/admin/durations',
        icon: Clock,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth, adminBadges } = usePage<SharedData>().props;
    
    // Check if user is admin or superadmin
    const isAdmin = auth.user?.role?.name === 'admin' || auth.user?.role?.name === 'superadmin';

    // Add badge counts to admin nav items
    const adminNavWithBadges: NavItem[] = adminNavItems.map((item) => {
        if (item.href === '/admin/auctions/pending') {
            return { ...item, badge: adminBadges?.pendingAuctions ?? 0 };
        }
        return item;
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Menu" />
                {isAdmin && <NavMain items={adminNavWithBadges} label="Admin" />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

