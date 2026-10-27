import { Link, usePage } from '@inertiajs/react';
import { Globe2, UserRoundPen } from 'lucide-react';
import { edit as websiteSettingsEdit } from '@/actions/App/Http/Controllers/Admin/WebsiteSettingsController';
import { NavFooter } from '@/components/nav-footer';
import { mainNavGroups } from '@/components/admin-navigation';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { edit as profileEdit } from '@/routes/profile';
import type { NavItem } from '@/types';
import { dashboard } from '@/routes';

const footerNavItems: NavItem[] = [
    {
        title: 'Edit Profil',
        href: profileEdit(),
        icon: UserRoundPen,
    },
];

export function AppSidebar() {
    const { siteBrand } = usePage().props;

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader className="px-4 py-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto rounded-lg p-2 hover:bg-slate-50"
                        >
                            <Link href={dashboard()} prefetch>
                                <img
                                    src={siteBrand.logo}
                                    alt={siteBrand.logoAltText}
                                    className="h-10 w-44 object-contain object-left"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-3">
                <NavMain groups={mainNavGroups} />
            </SidebarContent>

            <SidebarFooter className="px-3 pt-3 pb-4">
                <div className="space-y-3 rounded-xl border border-[#2547F9]/10 bg-gradient-to-br from-[#2547F9]/[0.07] to-white p-4 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Globe2 className="size-4 text-[#2547F9]" />
                        Panel website
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">
                        Kelola identitas, layanan, dan informasi publik
                        LegalPartner.ID.
                    </p>
                    <Link
                        href={websiteSettingsEdit()}
                        className="inline-flex h-8 w-full items-center justify-center rounded-md bg-white text-xs font-medium text-[#2547F9] shadow-sm ring-1 ring-border transition hover:bg-[#2547F9] hover:text-white"
                    >
                        Buka pengaturan website
                    </Link>
                </div>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
