export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    userBadges?: {
        unreadChats: number;
        pendingMyAuctions: number;
        liveAuctions: number;
    } | null;
    adminBadges?: {
        pendingAuctions: number;
        pendingReimbursements: number;
        pendingSettlements: number;
        totalCategories: number;
        pendingVerifications: number;
    } | null;
    unreadNotifications?: number;
    [key: string]: unknown;
};
