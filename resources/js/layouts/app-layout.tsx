import { SidebarProvider } from '@/context/SidebarContext';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Backdrop } from '@/components/layout/Backdrop';
import { useSidebar } from '@/context/SidebarContext';
import { Toaster } from '@/components/ui/toast';
import type { AppLayoutProps } from '@/types';

const LayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-950">
            <div>
                <AppSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <AppHeader />
                <div className="p-4 mx-auto max-w-[1536px] md:p-6">
                    {children}
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
    );
}

