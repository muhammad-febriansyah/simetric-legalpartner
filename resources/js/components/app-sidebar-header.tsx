import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    ChevronDown,
    Clock3,
    Handshake,
    Search,
    UserRoundPen,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { markRead as markAdminNotificationRead } from '@/actions/App/Http/Controllers/Admin/AdminNotificationController';
import { mainNavGroups } from '@/components/admin-navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { index as partnershipApplicationsIndex } from '@/routes/admin/partnership-applications';
import { edit as profileEdit } from '@/routes/profile';

const searchGroups = [
    ...mainNavGroups,
    {
        title: 'Akun',
        items: [
            {
                title: 'Edit Profil',
                description: 'Ubah profil dan password akun',
                href: profileEdit(),
                icon: UserRoundPen,
            },
        ],
    },
];

export function AppSidebarHeader() {
    const { auth, adminNotifications } = usePage().props;
    const getInitials = useInitials();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const matchingSearchGroups = searchGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(({ title, description }) =>
                `${title} ${description}`
                    .toLocaleLowerCase()
                    .includes(searchQuery.toLocaleLowerCase()),
            ),
        }))
        .filter((group) => group.items.length > 0);

    useEffect(() => {
        const focusSearch = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', focusSearch);

        return () => window.removeEventListener('keydown', focusSearch);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-30 flex h-[68px] shrink-0 items-center border-b border-slate-200 bg-white px-4 transition-[height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[68px] sm:px-6 lg:px-8">
                <div className="flex w-full items-center gap-3 sm:gap-5">
                    <SidebarTrigger className="size-9 shrink-0 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900" />

                    <div
                        className="relative max-w-[480px] min-w-0 flex-1"
                        onBlur={(event) => {
                            const nextFocusedElement = event.relatedTarget;

                            if (
                                !(nextFocusedElement instanceof Node) ||
                                !event.currentTarget.contains(
                                    nextFocusedElement,
                                )
                            ) {
                                setIsSearchOpen(false);
                            }
                        }}
                    >
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            ref={searchInputRef}
                            type="search"
                            aria-label="Cari menu dan pengaturan"
                            aria-expanded={isSearchOpen}
                            aria-controls="admin-search-results"
                            placeholder="Cari menu, pengaturan, atau bantuan…"
                            value={searchQuery}
                            onChange={(event) => {
                                setSearchQuery(event.currentTarget.value);
                                setIsSearchOpen(true);
                            }}
                            onFocus={() => setIsSearchOpen(true)}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape') {
                                    setIsSearchOpen(false);
                                }
                            }}
                            className="h-10 rounded-xl border-slate-200 bg-[#F7F8FD] pr-3 pl-10 text-sm shadow-none placeholder:text-slate-400 focus-visible:border-[#2547F9]/40 focus-visible:ring-[#2547F9]/15 sm:pr-16"
                        />
                        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
                            ⌘ K
                        </kbd>
                        {isSearchOpen && (
                            <div
                                id="admin-search-results"
                                role="listbox"
                                className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10"
                            >
                                <p className="px-2.5 py-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                                    Navigasi
                                </p>
                                {matchingSearchGroups.length > 0 ? (
                                    matchingSearchGroups.map((group) => (
                                        <div
                                            key={group.title}
                                            role="group"
                                            aria-label={group.title}
                                            className="px-1 pb-1"
                                        >
                                            <p className="px-1.5 py-2 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                                                {group.title}
                                            </p>
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    role="option"
                                                    aria-selected="false"
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-[#F7F8FD] focus-visible:bg-[#F7F8FD] focus-visible:outline-none"
                                                >
                                                    {item.icon && (
                                                        <item.icon className="size-4 shrink-0 text-slate-400" />
                                                    )}
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate font-medium text-slate-800">
                                                            {item.title}
                                                        </span>
                                                        <span className="block truncate text-xs text-slate-500">
                                                            {item.description}
                                                        </span>
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <p className="px-2.5 py-3 text-sm text-slate-500">
                                        Tidak ada menu yang cocok.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Buka notifikasi"
                                    className="relative size-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                >
                                    <Bell className="size-[18px]" />
                                    {adminNotifications.unreadCount > 0 && (
                                        <Badge className="absolute -top-0.5 -right-0.5 min-w-5 justify-center rounded-full border-2 border-white bg-[#2547F9] px-1 text-[10px] leading-4 text-white">
                                            {adminNotifications.unreadCount > 99
                                                ? '99+'
                                                : adminNotifications.unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="gap-0 bg-white p-0 sm:max-w-md"
                            >
                                <SheetHeader className="gap-1 border-b border-slate-100 px-5 py-5 pr-14">
                                    <div className="flex items-center gap-2">
                                        <SheetTitle className="text-base font-semibold text-slate-900">
                                            Notifikasi
                                        </SheetTitle>
                                        {adminNotifications.unreadCount > 0 && (
                                            <Badge
                                                variant="secondary"
                                                className="rounded-full bg-[#EEF1FF] text-[#2547F9]"
                                            >
                                                {adminNotifications.unreadCount}{' '}
                                                belum dibaca
                                            </Badge>
                                        )}
                                    </div>
                                    <SheetDescription className="text-sm text-slate-500">
                                        Informasi terbaru yang membutuhkan
                                        tindak lanjut.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto">
                                    {adminNotifications.items.length > 0 ? (
                                        <div className="flex flex-col">
                                            {adminNotifications.items.map(
                                                (notification, index) => (
                                                    <div key={notification.id}>
                                                        <Link
                                                            href={markAdminNotificationRead(
                                                                {
                                                                    notification:
                                                                        notification.id,
                                                                },
                                                            )}
                                                            method="post"
                                                            as="button"
                                                            className={cn(
                                                                'flex w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none',
                                                                notification.readAt
                                                                    ? 'bg-white'
                                                                    : 'bg-[#F7F8FD]/70',
                                                            )}
                                                        >
                                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-[#2547F9]">
                                                                <Handshake className="size-[18px]" />
                                                            </span>
                                                            <span className="min-w-0 flex-1">
                                                                <span className="flex items-center justify-between gap-3">
                                                                    <span
                                                                        className={cn(
                                                                            'truncate text-sm text-slate-900',
                                                                            notification.readAt
                                                                                ? 'font-medium'
                                                                                : 'font-semibold',
                                                                        )}
                                                                    >
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </span>
                                                                    {!notification.readAt && (
                                                                        <span
                                                                            className="size-2 shrink-0 rounded-full bg-[#2547F9]"
                                                                            aria-label="Belum dibaca"
                                                                        />
                                                                    )}
                                                                </span>
                                                                <span className="mt-1 block truncate text-sm text-slate-600">
                                                                    {
                                                                        notification.description
                                                                    }
                                                                </span>
                                                                <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                                                    <span>
                                                                        {
                                                                            notification.categoryLabel
                                                                        }
                                                                    </span>
                                                                    {notification.createdAt && (
                                                                        <>
                                                                            <span aria-hidden="true">
                                                                                ·
                                                                            </span>
                                                                            <Clock3 className="size-3" />
                                                                            <time
                                                                                dateTime={
                                                                                    notification.createdAt
                                                                                }
                                                                            >
                                                                                {new Intl.DateTimeFormat(
                                                                                    'id-ID',
                                                                                    {
                                                                                        dateStyle:
                                                                                            'medium',
                                                                                        timeStyle:
                                                                                            'short',
                                                                                    },
                                                                                ).format(
                                                                                    new Date(
                                                                                        notification.createdAt,
                                                                                    ),
                                                                                )}
                                                                            </time>
                                                                        </>
                                                                    )}
                                                                </span>
                                                            </span>
                                                        </Link>
                                                        {index <
                                                            adminNotifications
                                                                .items.length -
                                                                1 && (
                                                            <Separator />
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                                            <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                                <BellRing className="size-5" />
                                            </span>
                                            <p className="text-sm font-medium text-slate-900">
                                                Tidak ada notifikasi baru
                                            </p>
                                            <p className="mt-1 max-w-64 text-sm text-slate-500">
                                                Pendaftar mitra baru akan muncul
                                                di sini.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {adminNotifications.items.some(
                                    (notification) =>
                                        notification.partnershipApplicationId !==
                                        null,
                                ) && (
                                    <div className="border-t border-slate-100 p-4">
                                        <Link
                                            href={partnershipApplicationsIndex({
                                                query: { status: 'new' },
                                            })}
                                            className="flex h-10 items-center justify-center rounded-lg bg-[#2547F9] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1E3FE0] focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 focus-visible:outline-none"
                                        >
                                            Lihat semua pendaftar baru
                                        </Link>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>

                        {auth.user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-11 gap-2 rounded-xl px-1.5 hover:bg-slate-50 sm:gap-3 sm:px-2"
                                    >
                                        <Avatar className="size-9 border border-[#2547F9]/10 bg-[#EEF1FF]">
                                            <AvatarImage
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="rounded-full bg-[#E8EDFF] text-xs font-semibold text-[#2547F9]">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden min-w-0 text-left sm:grid">
                                            <span className="max-w-36 truncate text-sm leading-5 font-semibold text-slate-800">
                                                {auth.user.name}
                                            </span>
                                            <span className="text-xs leading-4 text-slate-500">
                                                Administrator
                                            </span>
                                        </span>
                                        <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-60 rounded-xl"
                                >
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
