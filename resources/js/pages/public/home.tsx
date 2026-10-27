import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    ChevronDown,
    Clock3,
    FileText,
    Handshake,
    LayoutGrid,
    MessageCircle,
    Package,
    Sparkles,
    UsersRound,
    Workflow,
} from 'lucide-react';
import { show as aboutShow } from '@/actions/App/Http/Controllers/Site/AboutPageController';
import { index as blogIndex } from '@/actions/App/Http/Controllers/Site/ArticleController';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import { index as servicesIndex, show as serviceShow } from '@/actions/App/Http/Controllers/Site/ServiceController';
import { ArticleCard } from '@/components/article-card';
import type { ArticleSummary } from '@/components/article-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { categoryIcon } from '@/lib/category-icons';

type FeaturedService = {
    name: string;
    slug: string;
    excerpt: string | null;
    heroImage: string | null;
    heroImageAlt: string | null;
    durationLabel: string | null;
    isFeatured: boolean;
    category: string;
    startingPrice: number | null;
    popularPackage: { name: string; price: number | null } | null;
};

type Props = {
    featured: FeaturedService[];
    categories: { name: string; slug: string; description: string | null; servicesCount: number }[];
    partners: { name: string; logo: string }[];
    articles: ArticleSummary[];
    faqs: { question: string; answer: string; service: string }[];
    stats: { services: number; packages: number; articles: number };
};

const priceFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

const heroPoints = [
    { icon: Workflow, title: 'Proses transparan', text: 'Biaya jelas di awal' },
    { icon: Handshake, title: 'Didampingi penuh', text: 'Sampai tuntas' },
    { icon: BadgeCheck, title: 'Tim berpengalaman', text: 'Di bidang legalitas' },
];

const steps = [
    { title: 'Konsultasi awal', text: 'Ceritakan kebutuhan bisnis Anda' },
    { title: 'Penawaran & rencana', text: 'Kami berikan estimasi biaya dan waktu' },
    { title: 'Proses pengurusan', text: 'Tim kami mengurus seluruh dokumen dan perizinan' },
    { title: 'Selesai & serah dokumen', text: 'Anda menerima dokumen resmi sesuai kesepakatan' },
];

const cardShadow = 'shadow-[0_18px_40px_-26px_rgba(15,23,42,0.35)]';

const avatarColors = ['bg-[#2547F9]', 'bg-slate-900', 'bg-sky-500'];

export default function Home({ featured, categories, partners, articles, faqs, stats }: Props) {
    const { props } = usePage<{ siteContact: { whatsapp: string | null } }>();
    const spotlight = featured.find((service) => service.slug === 'pt-perorangan') ?? featured[1] ?? featured[0];
    const teamInitials = [...new Set(articles.map((article) => article.author.replace(/,.*$/, '').trim()))]
        .slice(0, 3)
        .map((name) => name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase());
    const whatsappHref = props.siteContact.whatsapp ? `https://wa.me/${props.siteContact.whatsapp}` : null;
    const consultHref = `${partnershipIndex().url}#form-pendaftaran`;
    const shownCategories = categories.slice(0, 4);
    const otherServices = categories.slice(4).reduce((total, category) => total + category.servicesCount, 0);
    const preferredPartners = ['Tokopedia', 'Gojek', 'Bank Rakyat Indonesia', 'Telkom Indonesia', 'Indofood'];
    const trustedLogos = [
        ...preferredPartners.map((name) => partners.find((partner) => partner.name === name)).filter((partner) => partner !== undefined),
        ...partners.filter((partner) => !preferredPartners.includes(partner.name)),
    ].slice(0, 5);

    const statItems = [
        { icon: FileText, value: stats.services, label: 'Layanan legalitas' },
        { icon: Package, value: stats.packages, label: 'Pilihan paket' },
        { icon: LayoutGrid, value: categories.length, label: 'Kategori layanan' },
        { icon: Handshake, value: partners.length, label: 'Jaringan mitra' },
        { icon: BookOpen, value: stats.articles, label: 'Panduan di blog' },
    ];

    return (
        <>
            <Head title="Layanan Legalitas Usaha">
                <meta name="description" content="Pendirian PT dan CV, perizinan usaha, pendaftaran merek, dan perpajakan dengan biaya dan tahapan yang jelas dari LegalPartner.ID." />
            </Head>
            <PublicNavbar />
            <main className="bg-white text-slate-900">
                <div className="bg-[#F7F8FD]">
                    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-12 lg:pt-14">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full border border-[#2547F9]/15 bg-white px-3.5 py-1.5 text-xs font-medium text-[#2547F9]">
                                <Sparkles aria-hidden="true" className="size-3.5" />
                                Solusi legalitas bisnis, cepat dan terpercaya
                            </p>
                            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
                                Urus legalitas usaha, <span className="text-[#2547F9]">tanpa bolak‑balik.</span>
                            </h1>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                                Pendirian PT dan CV, perizinan, merek, sampai pajak. Biaya dan tahapan kami jelaskan sebelum Anda memutuskan.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={servicesIndex()} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2547F9] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_22px_-10px_rgba(37,71,249,0.7)] transition-colors hover:bg-[#1E3EDB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2">
                                    Lihat layanan
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </Link>
                                <Link href={consultHref} className="inline-flex h-12 items-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2">
                                    Konsultasi gratis
                                </Link>
                            </div>
                            <ul className="mt-10 grid gap-4 border-t border-slate-200/80 pt-8 sm:grid-cols-3">
                                {heroPoints.map((point) => (
                                    <li key={point.title} className="flex items-center gap-3">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2547F9] ring-1 ring-[#2547F9]/15">
                                            <point.icon aria-hidden="true" className="size-5" />
                                        </span>
                                        <p className="text-[13px] leading-5 text-slate-500">
                                            <span className="block font-semibold text-slate-900">{point.title}</span>
                                            {point.text}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                            <span aria-hidden="true" className="absolute inset-x-[6%] bottom-[6%] top-[12%] rounded-[3rem] bg-gradient-to-br from-[#E2E9FF] via-[#EDF1FF] to-white" />
                            <img
                                src="/images/hero-legalitas-digital.png"
                                alt="Konsultan legal mengurus dokumen usaha melalui laptop"
                                width={1448}
                                height={1086}
                                className="relative w-full select-none"
                                draggable={false}
                            />

                            {spotlight && (
                                <Link
                                    href={serviceShow(spotlight.slug)}
                                    className={`absolute bottom-[14%] left-0 hidden w-80 items-center gap-3 rounded-2xl border border-white bg-white/95 p-3.5 backdrop-blur-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] sm:flex lg:-left-6 ${cardShadow}`}
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9] text-white">
                                        <FileText aria-hidden="true" className="size-5" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-slate-950">{spotlight.name}</span>
                                        {spotlight.durationLabel && (
                                            <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                                                <Clock3 aria-hidden="true" className="size-3" />
                                                {spotlight.durationLabel}
                                            </span>
                                        )}
                                    </span>
                                    {spotlight.startingPrice !== null && (
                                        <span className="shrink-0 text-right">
                                            <span className="block text-[10px] text-slate-400">Mulai</span>
                                            <span className="block text-xs font-semibold text-slate-950">{priceFormatter.format(spotlight.startingPrice)}</span>
                                        </span>
                                    )}
                                </Link>
                            )}

                            <Link
                                href={consultHref}
                                className={`absolute -bottom-2 right-0 flex items-center gap-3 rounded-2xl border border-white bg-white/95 py-3 pl-3 pr-4 backdrop-blur-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] lg:-right-4 ${cardShadow}`}
                            >
                                <span className="flex -space-x-2">
                                    {teamInitials.map((initials, index) => (
                                        <span key={initials} className={`flex size-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white ${avatarColors[index % avatarColors.length]}`}>
                                            {initials}
                                        </span>
                                    ))}
                                </span>
                                <span>
                                    <span className="block text-sm font-semibold text-slate-950">Konsultasi gratis</span>
                                    <span className="block text-xs text-slate-500">Dengan tim ahli kami</span>
                                </span>
                            </Link>
                        </div>
                    </section>

                    <section aria-label="Ringkasan layanan" className="mx-auto max-w-7xl px-5 sm:px-8">
                        <dl className="grid grid-cols-2 gap-y-5 rounded-2xl border border-slate-200/80 bg-white px-4 py-5 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.28)] sm:px-6 md:grid-cols-5 md:divide-x md:divide-slate-100">
                            {statItems.map((item) => (
                                <div key={item.label} className="flex items-center gap-3 md:justify-center md:px-4">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#2547F9]/[0.08] text-[#2547F9]">
                                        <item.icon aria-hidden="true" className="size-5" />
                                    </span>
                                    <span>
                                        <dd className="text-xl font-semibold leading-6 tracking-tight text-slate-950">{item.value}</dd>
                                        <dt className="text-xs text-slate-500">{item.label}</dt>
                                    </span>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section aria-labelledby="solusi-heading" className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 lg:pb-20 lg:pt-16">
                        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-2xl">
                                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#2547F9]">
                                    <LayoutGrid aria-hidden="true" className="size-4" />
                                    Layanan kami
                                </p>
                                <h2 id="solusi-heading" className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">Solusi legalitas lengkap untuk bisnis Anda</h2>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Pilih bidang yang Anda butuhkan. Kami jelaskan dokumen, proses, dan biayanya sejak awal.</p>
                            </div>
                            <Link href={servicesIndex()} className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-[#2547F9] transition-colors hover:text-[#1E3EDB]">
                                Lihat semua layanan
                                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {shownCategories.map((category) => {
                                const Icon = categoryIcon(category.slug);

                                return (
                                    <Link key={category.slug} href={servicesIndex()} className="group flex min-h-56 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#2547F9]/35 hover:shadow-[0_16px_34px_-28px_rgba(37,71,249,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] sm:p-6">
                                        <span className="flex size-11 items-center justify-center rounded-xl bg-[#2547F9]/[0.07] text-[#2547F9] transition-colors group-hover:bg-[#2547F9] group-hover:text-white">
                                            <Icon aria-hidden="true" className="size-5" />
                                        </span>
                                        <h3 className="mt-5 text-base font-semibold leading-snug text-slate-950">{category.name}</h3>
                                        {category.description && <p className="mt-2 text-sm leading-6 text-slate-500">{category.description}</p>}
                                        <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs font-medium text-slate-400">
                                            <span>{category.servicesCount} layanan</span>
                                            <ArrowRight aria-hidden="true" className="size-4 text-[#2547F9] transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {categories.length > 4 && (
                            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#DCE5FF] bg-[#F7F9FF] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2547F9] ring-1 ring-[#2547F9]/10">
                                        <UsersRound aria-hidden="true" className="size-5" />
                                    </span>
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">Perlu layanan di bidang lain?</h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">{categories.slice(4).map((category) => category.name).join(' · ')}</p>
                                    </div>
                                </div>
                                <Link href={servicesIndex()} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-[#2547F9]/30 hover:text-[#2547F9]">
                                    Lihat {otherServices} layanan lainnya
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </Link>
                            </div>
                        )}

                        <div className={`mt-4 grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 lg:grid-cols-[1.45fr_5fr] lg:items-center ${cardShadow}`}>
                            <div>
                                <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#2547F9]/[0.08] px-3 py-1 text-xs font-medium text-[#2547F9]">
                                    <Workflow aria-hidden="true" className="size-3.5" />
                                    Alur proses
                                </p>
                                <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-slate-950">Mudah, cepat, dan transparan hanya 4 langkah</h2>
                                <p className="mt-2 text-xs leading-5 text-slate-500">Kami pastikan setiap proses jelas dan dapat dipantau.</p>
                                <Link href={`${aboutShow().url}#proses`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2547F9] hover:underline">
                                    Lihat detail proses
                                    <ArrowRight aria-hidden="true" className="size-3.5" />
                                </Link>
                            </div>
                            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {steps.map((step, index) => (
                                    <li key={step.title} className="relative flex gap-3 lg:pr-6">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2547F9]/[0.08] text-sm font-semibold text-[#2547F9]">{String(index + 1).padStart(2, '0')}</span>
                                        <span>
                                            <span className="block text-sm font-semibold text-slate-950">{step.title}</span>
                                            <span className="mt-1 block text-xs leading-5 text-slate-500">{step.text}</span>
                                        </span>
                                        {index < steps.length - 1 && <ArrowRight aria-hidden="true" className="absolute right-0 top-2 hidden size-4 text-slate-300 lg:block" />}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
                            <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-[#2547F9] p-7 text-white sm:flex-row sm:items-center">
                                <img src="/images/home-team.jpg" alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover object-[center_30%]" />
                                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#1E3EDB] via-[#2547F9]/95 to-[#2547F9]/55" />
                                <div className="relative max-w-sm">
                                    <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                                        <MessageCircle aria-hidden="true" className="size-3.5" />
                                        Konsultasi gratis
                                    </p>
                                    <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight">Mulai langkah legalitas bisnis Anda dengan konsultasi gratis.</h2>
                                </div>
                                <Link href={consultHref} className="relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#2547F9] transition-colors hover:bg-[#EEF1FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2547F9]">
                                    Konsultasi sekarang
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </Link>
                            </div>

                            <div className={`rounded-2xl border border-slate-200 bg-white p-6 ${cardShadow}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-sm font-semibold text-slate-950">Jaringan mitra kami</h2>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">Bekerja bersama institusi dan perusahaan di berbagai industri.</p>
                                    </div>
                                    <Link href={partnershipIndex()} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2547F9] hover:underline">
                                        Lihat kerja sama
                                        <ArrowRight aria-hidden="true" className="size-3.5" />
                                    </Link>
                                </div>
                                <ul className="mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-4 sm:grid-cols-5">
                                    {trustedLogos.map((partner) => (
                                        <li key={partner.name} className="flex h-8 items-center justify-center">
                                            <img src={partner.logo} alt={partner.name} loading="lazy" className="max-h-full max-w-full object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <section aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-xl">
                            <p className="text-sm font-semibold text-[#2547F9]">Layanan</p>
                            <h2 id="featured-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Yang paling sering dipilih</h2>
                        </div>
                        <Link href={servicesIndex()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2547F9] hover:underline">
                            Semua {stats.services} layanan
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </Link>
                    </div>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map((service) => (
                            <Link key={service.slug} href={serviceShow(service.slug)} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#2547F9]/30 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                                    {service.heroImage && <img src={service.heroImage} alt={service.heroImageAlt ?? service.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" />}
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2547F9]">{service.category}</span>
                                    <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-slate-950">{service.name}</h3>
                                    {service.excerpt && <p className="mt-2 mb-5 line-clamp-2 text-sm leading-6 text-slate-600">{service.excerpt}</p>}
                                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                                        <div>
                                            {service.startingPrice !== null && (
                                                <>
                                                    <p className="text-[11px] text-slate-400">Mulai dari</p>
                                                    <p className="text-base font-semibold text-slate-950">{priceFormatter.format(service.startingPrice)}</p>
                                                </>
                                            )}
                                        </div>
                                        {service.durationLabel && (
                                            <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Clock3 aria-hidden="true" className="size-3.5" />
                                                {service.durationLabel}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {articles.length > 0 && (
                    <section aria-labelledby="articles-heading" className="bg-[#F7F8FD]">
                        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-xl">
                                    <p className="text-sm font-semibold text-[#2547F9]">Blog</p>
                                    <h2 id="articles-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Panduan terbaru</h2>
                                </div>
                                <Link href={blogIndex()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2547F9] hover:underline">
                                    Semua artikel
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </Link>
                            </div>
                            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {articles.map((article) => (
                                    <ArticleCard key={article.slug} article={article} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {faqs.length > 0 && (
                    <section aria-labelledby="faq-heading" className="border-y border-slate-200/70 bg-[#F7F8FD]">
                        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16 lg:py-20">
                            <div className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.35)] sm:p-8">
                                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#2547F9]">
                                    <MessageCircle aria-hidden="true" className="size-5" />
                                </div>
                                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#2547F9]">Pusat informasi</p>
                                <h2 id="faq-heading" className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">Jawaban untuk hal yang sering ditanyakan.</h2>
                                <p className="mt-4 text-sm leading-6 text-slate-600">Temukan informasi awal tentang pendirian badan usaha dan layanan legalitas.</p>
                                <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
                                    <span className="font-semibold text-slate-900">{faqs.length}</span>
                                    pertanyaan umum
                                </div>
                                {whatsappHref && (
                                    <a href={whatsappHref} target="_blank" rel="noreferrer noopener" className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#172F8A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#12266F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172F8A] focus-visible:ring-offset-2">
                                        Tanya tim kami
                                        <ArrowRight aria-hidden="true" className="size-4" />
                                    </a>
                                )}
                            </div>

                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <details key={faq.question} className="group rounded-2xl border border-slate-200/80 bg-white px-5 transition-[border-color,box-shadow] open:border-[#172F8A]/20 open:shadow-[0_12px_28px_-24px_rgba(23,47,138,0.45)] hover:border-slate-300 sm:px-6">
                                        <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                                            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F5FF] text-xs font-semibold text-[#2547F9]">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold leading-6 text-slate-950 sm:text-base">{faq.question}</span>
                                                <span className="mt-1 block text-xs text-slate-500">{faq.service}</span>
                                            </span>
                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-open:border-[#172F8A] group-open:bg-[#172F8A] group-open:text-white">
                                                <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
                                            </span>
                                        </summary>
                                        <p className="pb-5 pl-[3.25rem] pr-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <PublicFooter />
        </>
    );
}
