import { Link } from '@inertiajs/react';
import { KeyRound, UserRoundPen } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const settingsTabs = [
    { title: 'Edit Profil', href: editProfile(), icon: UserRoundPen },
    { title: 'Ganti Password', href: editSecurity(), icon: KeyRound },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-7 sm:px-6 lg:px-8">
            <nav
                aria-label="Pengaturan akun"
                className="flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm"
            >
                {settingsTabs.map(({ title, href, icon: Icon }) => {
                    const isActive = isCurrentOrParentUrl(href);

                    return (
                        <Link
                            key={toUrl(href)}
                            href={href}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                'inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors sm:px-4',
                                isActive
                                    ? 'bg-[#EEF1FF] text-[#2547F9]'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                            )}
                        >
                            <Icon className="size-4" />
                            {title}
                        </Link>
                    );
                })}
            </nav>

            <div className="min-w-0">{children}</div>
        </div>
    );
}
