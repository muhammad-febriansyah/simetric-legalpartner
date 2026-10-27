import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Clock3, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { index as servicesIndex, show as serviceShow } from '@/actions/App/Http/Controllers/Site/ServiceController';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { paginationLabel } from '@/lib/pagination';

type ServiceSummary = {
    name: string;
    slug: string;
    excerpt: string | null;
    heroImage: string | null;
    heroImageAlt: string | null;
    durationLabel: string | null;
    isFeatured: boolean;
    category: { name: string; slug: string };
    startingPrice: number | null;
};

type PaginatedServices = {
    data: ServiceSummary[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);

export default function ServicesIndex({
    services,
    filters,
}: {
    services: PaginatedServices;
    filters: { q: string };
}) {
    const [query, setQuery] = useState(filters.q);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    useEffect(() => {
        const normalizedQuery = query.trim();

        if (normalizedQuery === filters.q) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(
                servicesIndex().url,
                { q: normalizedQuery || undefined, page: 1 },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters.q, query]);

    const hasSearch = filters.q !== '';

    return (
        <>
            <Head title="Layanan" />
            <PublicNavbar />
            <main className="min-h-screen bg-background text-foreground">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
                    <PageHeader
                        breadcrumbs={[
                            { title: 'Beranda', href: '/' },
                            { title: 'Layanan', href: servicesIndex() },
                        ]}
                        title="Layanan legal untuk bisnis Anda"
                        description="Pilih layanan pendirian dan legalitas usaha. Harga serta cakupan layanan tersedia secara transparan."
                    />

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="relative block w-full sm:max-w-md">
                            <span className="sr-only">Cari layanan</span>
                            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Cari nama layanan atau kategori..."
                                className="h-12 w-full rounded-xl border border-border/80 bg-white pr-11 pl-11 text-sm shadow-sm outline-none transition placeholder:text-muted-foreground/80 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                            />
                            {query !== '' && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    aria-label="Hapus pencarian"
                                    className="absolute top-1/2 right-3 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                                >
                                    <X aria-hidden="true" className="size-4" />
                                </button>
                            )}
                        </label>
                        <p className="text-sm text-muted-foreground" aria-live="polite">
                            {hasSearch
                                ? `${services.total} layanan ditemukan untuk “${filters.q}”`
                                : `${services.total} layanan tersedia`}
                        </p>
                    </div>

                    {services.data.length > 0 ? (
                        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {services.data.map((service) => (
                                <Link
                                    key={service.slug}
                                    href={serviceShow({ slug: service.slug })}
                                    className="group rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                                >
                                    <Card className="h-full overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                                        {service.heroImage ? (
                                            <img
                                                src={service.heroImage}
                                                alt={service.heroImageAlt ?? service.name}
                                                className="aspect-[16/9] w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex aspect-[16/9] items-end bg-gradient-to-br from-primary/10 via-primary/5 to-muted px-6 pb-5">
                                                <span className="text-sm font-medium text-primary">
                                                    {service.category.name}
                                                </span>
                                            </div>
                                        )}
                                        <CardContent className="flex h-full flex-col p-6">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                                                    {service.category.name}
                                                </span>
                                                {service.isFeatured && (
                                                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                                                        Unggulan
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="mt-3 text-xl font-semibold tracking-tight">
                                                {service.name}
                                            </h2>
                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                                {service.excerpt}
                                            </p>
                                            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Mulai dari
                                                    </p>
                                                    <p className="mt-1 font-semibold">
                                                        {service.startingPrice === null
                                                            ? 'Hubungi kami'
                                                            : formatPrice(service.startingPrice)}
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                                    Lihat detail
                                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                                </span>
                                            </div>
                                            {service.durationLabel && (
                                                <p className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                                                    <Clock3 className="size-3.5" />
                                                    Estimasi {service.durationLabel}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
                            <h2 className="text-lg font-semibold">
                                {hasSearch ? 'Layanan tidak ditemukan' : 'Layanan sedang disiapkan'}
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {hasSearch
                                    ? 'Coba kata kunci lain atau hapus pencarian untuk melihat semua layanan.'
                                    : 'Silakan kembali lagi nanti untuk melihat layanan kami.'}
                            </p>
                            {hasSearch && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="mt-5 text-sm font-semibold text-primary hover:underline"
                                >
                                    Tampilkan semua layanan
                                </button>
                            )}
                        </div>
                    )}

                    {services.last_page > 1 && (
                        <nav
                            aria-label="Navigasi halaman layanan"
                            className="mt-8 flex flex-wrap justify-center gap-2"
                        >
                            {services.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url ?? servicesIndex()}
                                    preserveScroll
                                    aria-current={link.active ? 'page' : undefined}
                                    className={`rounded-lg border px-3 py-2 text-sm ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-muted'} ${link.url ? '' : 'pointer-events-none opacity-40'}`}
                                >
                                    {paginationLabel(link.label)}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </main>
            <PublicFooter />
        </>
    );
}
