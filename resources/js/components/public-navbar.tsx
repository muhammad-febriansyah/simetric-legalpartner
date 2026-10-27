import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Calculator,
    ChevronDown,
    Clock3,
    FileText,
    FileSearch,
    Mail,
    Menu,
    MapPin,
    MessageCircle,
    Search,
    SearchCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { show as aboutShow } from '@/actions/App/Http/Controllers/Site/AboutPageController';
import { index as blogIndex } from '@/actions/App/Http/Controllers/Site/ArticleController';
import { show as legalShow } from '@/actions/App/Http/Controllers/Site/LegalPageController';
import { index as kbliIndex } from '@/actions/App/Http/Controllers/Site/KbliController';
import { index as kbliCheckerIndex } from '@/actions/App/Http/Controllers/Site/KbliCheckerController';
import { exchangeRates as exchangeRatesIndex, index as publicToolsIndex, show as publicToolShow, zoning as zoningIndex } from '@/actions/App/Http/Controllers/Site/PublicToolsController';
import { show as contactShow } from '@/actions/App/Http/Controllers/Site/ContactController';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import {
    index as servicesIndex,
    show as serviceShow,
} from '@/actions/App/Http/Controllers/Site/ServiceController';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { SocialIcon } from '@/components/social-icons';
import { categoryIcon } from '@/lib/category-icons';
import { home } from '@/routes';

type MenuId = 'services' | 'tools' | 'search';

type ServiceMenuService = {
    name: string;
    slug: string;
    excerpt: string | null;
    isFeatured: boolean;
    startingPrice: number | null;
};

type ServiceMenuCategory = {
    name: string;
    slug: string;
    services: ServiceMenuService[];
};

type SharedSiteProps = {
    siteBrand: { logo: string; logoAltText: string };
    siteContact: { email: string | null; whatsapp: string | null; hours: string | null; socials: { key: string; label: string; url: string }[] };
    siteFooter?: { legalPages: { title: string; slug: string }[] };
    serviceMenu: ServiceMenuCategory[];
};

type SearchEntry = { label: string; hint: string; href: string; group: string };

const freeTools: { label: string; hint: string; icon: LucideIcon; href: string; external?: boolean }[] = [
    { label: 'Kurs Tengah BI', hint: 'Nilai tukar referensi terkini', icon: Calculator, href: exchangeRatesIndex().url },
    { label: 'Kalkulator PPh 21', hint: 'Estimasi pajak penghasilan karyawan', icon: Calculator, href: publicToolShow('kalkulator-pph').url },
    { label: 'Kalkulator PPN', hint: 'Hitung perkiraan PPN transaksi', icon: Calculator, href: publicToolShow('kalkulator-ppn').url },
    { label: 'Simulasi Biaya PT', hint: 'Gambaran biaya pendirian perseroan', icon: Calculator, href: publicToolShow('kalkulator-biaya').url },
    { label: 'Kalkulator Biaya Merek', hint: 'Estimasi biaya pendaftaran per kelas', icon: Calculator, href: publicToolShow('kalkulator-biaya-merek').url },
    { label: 'Simulasi Akta PT', hint: 'Gambaran awal struktur pendirian PT', icon: FileText, href: publicToolShow('simulasi-akta').url },
    { label: 'Cek Nama PT', hint: 'Skrining format nama perseroan', icon: SearchCheck, href: publicToolShow('cek-nama-pt').url },
    { label: 'Analisis Nama Merek AI', hint: 'Skrining awal nama dan kemiripan merek', icon: BadgeCheck, href: publicToolShow('cek-merek').url },
    { label: 'Cek Kelas Merek', hint: 'Temukan kelas Nice yang mungkin sesuai', icon: FileSearch, href: publicToolShow('cek-kelas-merek').url },
    { label: 'Cek KBLI 2025', hint: 'Cari kode usaha berdasarkan aktivitas', icon: FileSearch, href: kbliCheckerIndex().url },
    { label: 'Cek Zonasi RDTR', hint: 'Cari ringkasan zonasi area usaha', icon: MapPin, href: zoningIndex().url },
];

const freeToolGroups = [
    { title: 'Kalkulator bisnis', tools: freeTools.slice(0, 6) },
    { title: 'Pemeriksaan usaha', tools: freeTools.slice(6) },
];

const glassBlur = 'backdrop-blur-xl backdrop-saturate-150';

const popoverClass = `rounded-2xl border border-slate-900/[0.08] bg-white/95 ${glassBlur} shadow-[0_24px_50px_-20px_rgba(15,23,42,0.3)]`;

const navItemClass =
    'group/nav relative inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] aria-expanded:text-slate-950 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#2547F9] after:transition-transform after:duration-200 hover:after:scale-x-100 aria-expanded:after:scale-x-100 aria-[current=page]:text-[#2547F9] aria-[current=page]:after:scale-x-100';

const priceFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

function formatWhatsapp(number: string): string {
    if (!number.startsWith('62') || number.length < 10) {
        return `+${number}`;
    }

    const local = number.slice(2);

    return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`;
}

export function PublicNavbar({ className }: { className?: string }) {
    const { props, url } = usePage<SharedSiteProps>();
    const { siteBrand, siteContact, serviceMenu } = props;
    const hasUtilityBar = Boolean(siteContact.email || siteContact.whatsapp);
    const whatsappHref = siteContact.whatsapp ? `https://wa.me/${siteContact.whatsapp}` : null;

    const [isScrolled, setIsScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mobileCategory, setMobileCategory] = useState<string | null>(null);
    const [query, setQuery] = useState('');

    const headerRef = useRef<HTMLElement>(null);
    const closeTimer = useRef<number | undefined>(undefined);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setOpenMenu(null);
        setIsMobileOpen(false);
    }, [url]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]');

            if (event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey) {
                event.preventDefault();
                setOpenMenu('search');
            }

            if (event.key === 'Escape') {
                setOpenMenu(null);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    useEffect(() => {
        if (!openMenu || openMenu === 'search') {
            return;
        }

        const onPointerDown = (event: PointerEvent) => {
            if (!headerRef.current?.contains(event.target as Node)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);

        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [openMenu]);

    useEffect(() => () => window.clearTimeout(closeTimer.current), []);

    const hoverProps = useCallback(
        (id: MenuId) => ({
            onPointerEnter: (event: ReactPointerEvent) => {
                if (event.pointerType !== 'mouse') {
                    return;
                }

                window.clearTimeout(closeTimer.current);
                closeTimer.current = window.setTimeout(() => setOpenMenu(id), 60);
            },
            onPointerLeave: (event: ReactPointerEvent) => {
                if (event.pointerType !== 'mouse') {
                    return;
                }

                window.clearTimeout(closeTimer.current);
                closeTimer.current = window.setTimeout(
                    () => setOpenMenu((current) => (current === id ? null : current)),
                    160,
                );
            },
        }),
        [],
    );

    const toggle = (id: MenuId) => setOpenMenu((current) => (current === id ? null : id));

    const searchEntries = useMemo<SearchEntry[]>(
        () => [
            ...serviceMenu.flatMap((category) =>
                category.services.map((service) => ({
                    label: service.name,
                    hint: category.name,
                    href: serviceShow(service.slug).url,
                    group: 'Layanan',
                })),
            ),
            ...freeTools.map((tool) => ({ label: tool.label, hint: tool.hint, href: tool.href, group: 'Tools gratis' })),
            { label: 'Beranda', hint: 'Informasi dan layanan LegalPartner.ID', href: home().url, group: 'Halaman publik' },
            { label: 'Semua layanan', hint: 'Katalog layanan legalitas', href: servicesIndex().url, group: 'Halaman publik' },
            { label: 'Semua tools gratis', hint: 'Katalog kalkulator dan pemeriksaan usaha', href: publicToolsIndex().url, group: 'Halaman publik' },
            { label: 'Blog', hint: 'Panduan legalitas usaha', href: blogIndex().url, group: 'Halaman publik' },
            { label: 'Database KBLI', hint: 'Cari kode dan uraian lengkap', href: kbliIndex().url, group: 'Halaman publik' },
            { label: 'Tentang kami', hint: 'Profil LegalPartner.ID', href: aboutShow().url, group: 'Halaman publik' },
            { label: 'Kerja sama', hint: 'Daftar sebagai mitra', href: partnershipIndex().url, group: 'Halaman publik' },
            { label: 'Kontak kami', hint: 'WhatsApp, telepon, dan email', href: contactShow().url, group: 'Halaman publik' },
            { label: 'Konsultasi gratis', hint: 'Kirim kebutuhan untuk konsultasi', href: `${partnershipIndex().url}#form-pendaftaran`, group: 'Halaman publik' },
            ...(props.siteFooter?.legalPages ?? []).map((page) => ({
                label: page.title,
                hint: 'Informasi dan ketentuan situs',
                href: legalShow(page.slug).url,
                group: 'Halaman publik',
            })),
        ],
        [props.siteFooter, serviceMenu],
    );

    const searchResults = useMemo(() => {
        const term = query.trim().toLowerCase();

        if (!term) {
            return searchEntries;
        }

        return searchEntries
            .filter((entry) => `${entry.label} ${entry.hint} ${entry.group}`.toLowerCase().includes(term));
    }, [query, searchEntries]);

    const groupedSearchResults = useMemo(() => {
        const groups = new Map<string, SearchEntry[]>();

        for (const entry of searchResults) {
            const group = groups.get(entry.group) ?? [];
            group.push(entry);
            groups.set(entry.group, group);
        }

        return Array.from(groups.entries());
    }, [searchResults]);

    const spotlight = useMemo(() => {
        const services = serviceMenu.flatMap((category) =>
            category.services.map((service) => ({ ...service, category: category.name })),
        );

        return services.find((service) => service.isFeatured) ?? services[0] ?? null;
    }, [serviceMenu]);

    const isActive = (path: string) => url === path || url.startsWith(`${path}/`) || url.startsWith(`${path}?`);
    const blogHref = blogIndex().url;
    const consultHref = `${partnershipIndex().url}#form-pendaftaran`;

    return (
        <>
            <div aria-hidden="true" className={hasUtilityBar ? 'h-[72px] xl:h-[116px]' : 'h-[72px] xl:h-20'} />
            <header ref={headerRef} className={`fixed inset-x-0 top-0 z-50 ${className ?? ''}`}>
                {hasUtilityBar && (
                    <div
                        className={`hidden overflow-hidden bg-[#172F8A] text-xs text-white/75 transition-[height] duration-300 motion-reduce:transition-none xl:block ${
                            isScrolled ? 'h-0' : 'h-9'
                        }`}
                    >
                        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-8">
                            <div className="flex items-center gap-6">
                                {siteContact.whatsapp && (
                                    <a href={whatsappHref ?? undefined} target="_blank" rel="noreferrer" tabIndex={isScrolled ? -1 : 0} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                                        <MessageCircle aria-hidden="true" className="size-3.5" />
                                        {formatWhatsapp(siteContact.whatsapp)}
                                    </a>
                                )}
                                {siteContact.email && (
                                    <a href={`mailto:${siteContact.email}`} tabIndex={isScrolled ? -1 : 0} className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                                        <Mail aria-hidden="true" className="size-3.5" />
                                        {siteContact.email}
                                    </a>
                                )}
                            </div>
                            <div className="flex items-center gap-5">
                                {siteContact.hours && (
                                    <p className="flex items-center gap-1.5 text-white/60">
                                        <Clock3 aria-hidden="true" className="size-3.5" />
                                        {siteContact.hours}
                                    </p>
                                )}
                                {siteContact.socials.length > 0 && (
                                    <ul className="flex items-center gap-3">
                                        {siteContact.socials.map((social) => (
                                            <li key={social.key}>
                                                <a href={social.url} target="_blank" rel="noreferrer noopener" aria-label={social.label} tabIndex={isScrolled ? -1 : 0} className="block transition-colors hover:text-white">
                                                    <SocialIcon name={social.key} className="size-3.5" />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Link href={contactShow()} tabIndex={isScrolled ? -1 : 0} className="transition-colors hover:text-white">Kontak kami</Link>
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative isolate">
                    <div
                        aria-hidden="true"
                        className={`absolute inset-0 -z-10 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 motion-reduce:transition-none ${
                            isScrolled
                                ? `bg-white/70 ${glassBlur} border-slate-900/[0.07] shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)]`
                                : 'border-slate-200 bg-white'
                        }`}
                    />

                    <div
                        className={`mx-auto flex max-w-7xl items-center gap-4 px-4 transition-[height] duration-300 motion-reduce:transition-none sm:px-6 lg:px-8 xl:grid xl:grid-cols-[1fr_auto_1fr] ${
                            isScrolled ? 'h-[64px] xl:h-[68px]' : 'h-[72px] xl:h-20'
                        }`}
                    >
                        <Link href={home()} aria-label="LegalPartner.ID — Beranda" className="shrink-0 justify-self-start rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                            <img
                                src={siteBrand.logo}
                                alt={siteBrand.logoAltText}
                                className="h-9 w-36 object-contain object-left sm:h-10 sm:w-40"
                            />
                        </Link>

                        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 xl:flex">
                            <Link href={home()} aria-current={url === '/' ? 'page' : undefined} className={navItemClass}>
                                Beranda
                            </Link>

                            <div {...hoverProps('services')}>
                                <button
                                    type="button"
                                    aria-expanded={openMenu === 'services'}
                                    aria-controls="mega-services"
                                    onClick={() => toggle('services')}
                                    className={navItemClass}
                                >
                                    Layanan
                                    <ChevronDown aria-hidden="true" className={`size-3.5 text-slate-400 transition-transform duration-200 ${openMenu === 'services' ? 'rotate-180 text-[#2547F9]' : ''}`} />
                                </button>

                                {openMenu === 'services' && (
                                    <div
                                        id="mega-services"
                                        className={`absolute inset-x-0 top-full border-b border-slate-900/[0.08] bg-white/95 shadow-[0_32px_60px_-28px_rgba(15,23,42,0.35)] animate-in fade-in-0 slide-in-from-top-1 duration-200 ${glassBlur}`}
                                    >
                                        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_19rem] gap-10 px-8 pb-7 pt-8">
                                            <div className="columns-4 gap-x-6">
                                                {serviceMenu.map((category) => {
                                                    const CategoryIcon = categoryIcon(category.slug);

                                                    return (
                                                        <div key={category.slug} className="mb-7 break-inside-avoid">
                                                            <div className="flex items-center gap-2.5 px-2.5">
                                                                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2547F9]/[0.08] text-[#2547F9]">
                                                                    <CategoryIcon aria-hidden="true" className="size-4" />
                                                                </span>
                                                                <p className="text-[13px] font-semibold leading-tight text-slate-900">{category.name}</p>
                                                            </div>
                                                            <ul className="mt-3 space-y-0.5 border-t border-slate-900/[0.06] pt-3">
                                                                {category.services.length > 0 ? (
                                                                    category.services.map((service) => (
                                                                        <li key={service.slug}>
                                                                            <Link
                                                                                href={serviceShow(service.slug)}
                                                                                className="block rounded-lg px-2.5 py-2 transition-colors hover:bg-[#2547F9]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]"
                                                                            >
                                                                                <span className="flex items-start justify-between gap-2">
                                                                                    <span className="text-sm font-medium leading-snug text-slate-800">{service.name}</span>
                                                                                    {service.isFeatured && (
                                                                                        <span className="mt-0.5 shrink-0 rounded-full bg-[#2547F9]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#2547F9]">
                                                                                            Terlaris
                                                                                        </span>
                                                                                    )}
                                                                                </span>
                                                                            </Link>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li className="px-2.5 py-2 text-sm text-slate-400">Segera hadir</li>
                                                                )}
                                                            </ul>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <aside className="flex flex-col rounded-2xl bg-[#172F8A] p-6 text-white">
                                                {spotlight ? (
                                                    <>
                                                        <p className="text-xs font-medium text-white/50">{spotlight.isFeatured ? 'Layanan unggulan' : spotlight.category}</p>
                                                        <p className="mt-2 text-lg font-semibold leading-snug">{spotlight.name}</p>
                                                        {spotlight.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/65">{spotlight.excerpt}</p>}
                                                        {spotlight.startingPrice !== null && (
                                                            <p className="mt-4 text-sm text-white/65">
                                                                Mulai dari <span className="font-semibold text-white">{priceFormatter.format(spotlight.startingPrice)}</span>
                                                            </p>
                                                        )}
                                                        <Link
                                                            href={serviceShow(spotlight.slug)}
                                                            className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-slate-950 transition-colors hover:bg-[#EEF1FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#172F8A]"
                                                        >
                                                            Lihat layanan
                                                            <ArrowRight aria-hidden="true" className="size-4" />
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-xs font-medium text-white/50">Belum tahu mulai dari mana?</p>
                                                        <p className="mt-2 text-lg font-semibold leading-snug">Ceritakan rencana usaha Anda, kami petakan izinnya.</p>
                                                        <Link href={consultHref} className="mt-auto inline-flex h-10 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-950 transition-colors hover:bg-[#EEF1FF]">
                                                            Mulai konsultasi
                                                        </Link>
                                                    </>
                                                )}
                                            </aside>
                                        </div>

                                        <div className="border-t border-slate-900/[0.06] bg-slate-900/[0.025]">
                                            <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3.5 text-sm">
                                                <Link href={servicesIndex()} className="group inline-flex items-center gap-1.5 rounded-md font-semibold text-[#2547F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                                    Lihat semua layanan
                                                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                                                </Link>
                                                <p className="text-slate-500">
                                                    Belum yakin layanan mana yang cocok?{' '}
                                                    <Link href={consultHref} className="font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#2547F9] hover:decoration-[#2547F9]">
                                                        Konsultasi gratis
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative" {...hoverProps('tools')}>
                                <button
                                    type="button"
                                    aria-expanded={openMenu === 'tools'}
                                    aria-controls="menu-tools"
                                    onClick={() => toggle('tools')}
                                    className={navItemClass}
                                >
                                    Tools gratis
                                    <ChevronDown aria-hidden="true" className={`size-3.5 text-slate-400 transition-transform duration-200 ${openMenu === 'tools' ? 'rotate-180 text-[#2547F9]' : ''}`} />
                                </button>
                                {openMenu === 'tools' && (
                                    <div id="menu-tools" className="absolute left-1/2 top-full -translate-x-1/2 pt-3 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                                        <div className={`grid w-[min(960px,calc(100vw-2rem))] grid-cols-1 overflow-hidden ${popoverClass} lg:grid-cols-[minmax(0,1fr)_15rem]`}>
                                            <div className="grid gap-7 p-4 sm:grid-cols-2 sm:p-6">
                                                {freeToolGroups.map((group) => (
                                                    <section key={group.title} aria-labelledby={`tools-group-${group.title}`}>
                                                        <h2 id={`tools-group-${group.title}`} className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{group.title}</h2>
                                                        <div className="space-y-1">
                                                            {group.tools.map((tool) => {
                                                                const content = <><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#2547F9]"><tool.icon aria-hidden="true" className="size-4" /></span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-800">{tool.label}<ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-[#2547F9]" /></span><span className="mt-0.5 block text-xs leading-4 text-slate-500">{tool.hint}</span></span></>;

                                                                return tool.external ? <a key={tool.label} href={tool.href} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-900/[0.035]">{content}</a> : <Link key={tool.label} href={tool.href} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-900/[0.035]">{content}</Link>;
                                                            })}
                                                        </div>
                                                    </section>
                                                ))}
                                            </div>
                                            <aside className="flex flex-col justify-between gap-6 border-t border-slate-100 bg-[#F7F8FD] p-5 lg:border-l lg:border-t-0">
                                                <div><span className="flex size-10 items-center justify-center rounded-xl bg-white text-[#2547F9] shadow-sm"><Search aria-hidden="true" className="size-4" /></span><p className="mt-4 text-base font-semibold text-slate-900">Mulai dari kebutuhan Anda.</p><p className="mt-2 text-sm leading-6 text-slate-500">Semua kalkulator dan pemeriksaan usaha ada di satu tempat.</p></div>
                                                <Link href={publicToolsIndex()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2547F9] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1E3EDB]">Lihat semua tools <ArrowRight aria-hidden="true" className="size-4" /></Link>
                                            </aside>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href={aboutShow()} aria-current={isActive('/tentang-kami') ? 'page' : undefined} className={navItemClass}>
                                Tentang kami
                            </Link>

                            <Link href={partnershipIndex()} aria-current={isActive('/kerjasama') ? 'page' : undefined} className={navItemClass}>
                                Kerja sama
                            </Link>

                            <Link href={blogHref} aria-current={isActive('/blog') ? 'page' : undefined} className={navItemClass}>
                                Blog
                            </Link>
                        </nav>

                        <div className="ml-auto flex items-center gap-2 xl:justify-self-end">
                            <div className="relative hidden xl:block">
                                <button
                                    type="button"
                                    aria-label="Cari layanan"
                                    aria-expanded={openMenu === 'search'}
                                    onClick={() => toggle('search')}
                                    className="inline-flex size-10 items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-slate-900/[0.025] text-sm 2xl:w-44 2xl:justify-start 2xl:pl-3.5 2xl:pr-2 text-slate-500 transition-colors hover:border-slate-900/20 hover:bg-slate-900/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]"
                                >
                                    <Search aria-hidden="true" className="size-4 shrink-0" />
                                    <span className="hidden flex-1 text-left 2xl:block">Cari layanan</span>
                                    <kbd className="hidden rounded-md 2xl:block border border-slate-900/10 bg-white px-1.5 text-[11px] font-medium leading-5 text-slate-400">/</kbd>
                                </button>
                            </div>

                            <Link
                                href={consultHref}
                                className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[#2547F9] pl-5 pr-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_18px_-8px_rgba(37,71,249,0.7)] transition-[background-color,box-shadow] hover:bg-[#1E3EDB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 xl:inline-flex"
                            >
                                Konsultasi gratis
                                <ArrowRight aria-hidden="true" className="size-4" />
                            </Link>

                            <button
                                type="button"
                                aria-label="Buka menu"
                                aria-expanded={isMobileOpen}
                                onClick={() => setIsMobileOpen(true)}
                                className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-900/10 text-slate-700 transition-colors hover:bg-slate-900/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] xl:hidden"
                            >
                                <Menu aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <Dialog
                open={openMenu === 'search'}
                onOpenChange={(isOpen) => {
                    setOpenMenu(isOpen ? 'search' : null);
                    if (!isOpen) {
                        setQuery('');
                    }
                }}
            >
                <DialogContent
                    overlayClassName="bg-[#172F8A]/10 backdrop-blur-md"
                    className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-0 shadow-[0_28px_90px_-32px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:max-w-xl"
                >
                    <DialogTitle className="sr-only">Cari layanan dan informasi</DialogTitle>
                    <DialogDescription className="sr-only">Cari layanan, kalkulator, dan halaman LegalPartner.ID.</DialogDescription>
                    <label htmlFor="navbar-search" className="sr-only">Cari layanan</label>
                    <div className="flex items-center gap-3 border-b border-slate-200/80 px-5 py-4">
                        <Search aria-hidden="true" className="size-5 shrink-0 text-slate-400" />
                        <input
                            id="navbar-search"
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari layanan, tools, atau informasi..."
                            className="h-8 min-w-0 flex-1 bg-transparent pr-8 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <div className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
                        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                            {query.trim() ? 'Hasil pencarian' : 'Menu publik'}
                        </p>
                        {searchResults.length > 0 ? (
                            <div className="grid gap-4">
                                {groupedSearchResults.map(([group, entries]) => (
                                    <section key={group} aria-label={group}>
                                        <h2 className="px-3 pb-1 text-xs font-semibold text-slate-500">{group}</h2>
                                        <ul className="grid gap-0.5">
                                            {entries.map((entry) => (
                                                <li key={`${entry.href}-${entry.label}`}>
                                                    <Link
                                                        href={entry.href}
                                                        onClick={() => {
                                                            setOpenMenu(null);
                                                            setQuery('');
                                                        }}
                                                        className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm outline-none transition-colors hover:bg-[#2547F9]/[0.07] focus-visible:bg-[#2547F9]/[0.07]"
                                                    >
                                                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-[#2547F9]" />
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block font-medium text-slate-800">{entry.label}</span>
                                                            <span className="mt-0.5 block truncate text-xs text-slate-500">{entry.hint}</span>
                                                        </span>
                                                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 -translate-x-1 text-[#2547F9] opacity-0 transition-[transform,opacity] group-hover:translate-x-0 group-hover:opacity-100" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <p className="rounded-xl px-3 py-8 text-center text-sm text-slate-500">Tidak ada hasil untuk “{query}”.</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/70 px-4 py-2.5 text-[11px] text-slate-500">
                        <span>Temukan layanan dan tools dengan cepat</span>
                        <span>Esc untuk menutup</span>
                    </div>
                </DialogContent>
            </Dialog>

            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="right" onOpenAutoFocus={(event) => event.preventDefault()} className="w-[88%] max-w-sm gap-0 overflow-hidden bg-white p-0 xl:hidden">
                    <SheetHeader className="border-b border-slate-100 p-4 pr-14">
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <SheetDescription className="sr-only">Navigasi utama LegalPartner.ID</SheetDescription>
                        <img src={siteBrand.logo} alt={siteBrand.logoAltText} className="h-9 w-36 object-contain object-left" />
                    </SheetHeader>

                    <div className="flex-1 space-y-1 overflow-y-auto p-3">
                        <label htmlFor="navbar-search-mobile" className="sr-only">Cari layanan</label>
                        <div className="relative mb-2">
                            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                id="navbar-search-mobile"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Cari layanan"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-[#2547F9] focus:ring-2 focus:ring-[#2547F9]/15"
                            />
                        </div>

                        {query.trim() ? (
                            searchResults.length > 0 ? (
                                <div className="grid gap-3">
                                    {groupedSearchResults.map(([group, entries]) => (
                                        <section key={group} aria-label={group}>
                                            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{group}</p>
                                            <ul>
                                                {entries.map((entry) => (
                                                    <li key={`${entry.href}-${entry.label}`}>
                                                        <Link href={entry.href} className="block rounded-xl px-3 py-3 text-sm hover:bg-slate-50">
                                                            <span className="font-medium text-slate-800">{entry.label}</span>
                                                            <span className="block text-xs text-slate-400">{entry.hint}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    ))}
                                </div>
                            ) : <p className="px-3 py-3 text-sm text-slate-500">Tidak ada hasil untuk “{query}”.</p>
                        ) : (
                            <>
                                <Link href={home()} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">Beranda</Link>
                                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Layanan</p>
                                {serviceMenu.map((category) => {
                                    const isOpen = mobileCategory === category.slug;
                                    const CategoryIcon = categoryIcon(category.slug);

                                    return (
                                        <div key={category.slug}>
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                onClick={() => setMobileCategory(isOpen ? null : category.slug)}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
                                            >
                                                <span className="flex size-7 items-center justify-center rounded-lg bg-[#2547F9]/[0.08] text-[#2547F9]">
                                                    <CategoryIcon aria-hidden="true" className="size-4" />
                                                </span>
                                                <span className="flex-1">{category.name}</span>
                                                <ChevronDown aria-hidden="true" className={`size-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isOpen && (
                                                <ul className="mb-1 ml-6 border-l border-slate-200 pl-2">
                                                    {category.services.length > 0 ? category.services.map((service) => (
                                                        <li key={service.slug}>
                                                            <Link href={serviceShow(service.slug)} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                                                                {service.name}
                                                                {service.isFeatured && <span className="rounded-full bg-[#2547F9]/10 px-2 py-0.5 text-[10px] font-semibold text-[#2547F9]">Terlaris</span>}
                                                            </Link>
                                                        </li>
                                                    )) : <li className="px-3 py-2.5 text-sm text-slate-400">Segera hadir</li>}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                })}
                                <Link href={servicesIndex()} className="flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-[#2547F9]">
                                    Lihat semua layanan <ArrowRight aria-hidden="true" className="size-4" />
                                </Link>

                                <div className="my-2 border-t border-slate-100" />
                                <Link href={partnershipIndex()} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">Kerja sama</Link>
                                <Link href={blogHref} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">Blog</Link>
                                <Link href={kbliIndex()} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">Database KBLI</Link>
                                <Link href={aboutShow()} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">Tentang kami</Link>
                                <Link href={contactShow()} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50">Kontak kami</Link>
                                <div className="px-3 py-3 text-sm font-medium text-slate-800">
                                    Tools gratis
                                    <ul className="mt-2 space-y-1.5">
                                        {freeTools.map((tool) => (
                                            <li key={tool.label} className="flex items-center justify-between text-sm font-normal text-slate-500">
                                                {tool.external ? <a href={tool.href} target="_blank" rel="noreferrer noopener" className="font-medium text-[#2547F9]">{tool.label}</a> : <Link href={tool.href} className="font-medium text-[#2547F9]">{tool.label}</Link>}
                                                <ArrowRight aria-hidden="true" className="size-3.5 text-[#2547F9]" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid gap-2 border-t border-slate-100 p-4">
                        {whatsappHref && (
                            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">
                                <MessageCircle aria-hidden="true" className="size-4" />
                                Chat WhatsApp
                            </a>
                        )}
                        <Link href={consultHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2547F9] text-sm font-semibold text-white">
                            Konsultasi gratis
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
