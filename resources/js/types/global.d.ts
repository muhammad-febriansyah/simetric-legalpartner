import type { Auth } from '@/types/auth';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            siteBrand: {
                logo: string;
                favicon: string;
                logoAltText: string;
            };
            adminNotifications: {
                unreadCount: number;
                items: Array<{
                    id: string;
                    title: string;
                    description: string;
                    categoryLabel: string;
                    readAt: string | null;
                    createdAt: string | null;
                    partnershipApplicationId: number | null;
                }>;
            };
            [key: string]: unknown;
        };
    }
}
