import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { index as blogIndex, show as articleShow } from '@/actions/App/Http/Controllers/Site/ArticleController';
import { ArticleCard, ArticleMeta } from '@/components/article-card';
import type { ArticleSummary } from '@/components/article-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { paginationLabel } from '@/lib/pagination';

type PaginatedArticles = {
    data: ArticleSummary[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    articles: PaginatedArticles;
    categories: { name: string; total: number }[];
    filters: { q: string; kategori: string };
};

const chipClass = (isActive: boolean) =>
    `inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 ${
        isActive
            ? 'border-[#172F8A] bg-[#172F8A] text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950'
    }`;

export default function BlogIndex({ articles, categories, filters }: Props) {
    const [query, setQuery] = useState(filters.q);
    const hasFilters = filters.q !== '' || filters.kategori !== '';
    const showFeatured = !hasFilters && articles.current_page === 1 && articles.data.length > 0;
    const featured = showFeatured ? articles.data[0] : null;
    const gridArticles = showFeatured ? articles.data.slice(1) : articles.data;

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get(blogIndex().url, { q: query.trim() || undefined, kategori: filters.kategori || undefined }, { preserveScroll: false });
    };

    const categoryUrl = (name?: string) => blogIndex({ query: { kategori: name, q: filters.q || undefined } }).url;

    return (
        <>
            <Head title="Blog">
                <meta name="description" content="Panduan dan wawasan seputar pendirian usaha, perizinan, merek, dan perpajakan dari tim LegalPartner.ID." />
            </Head>
            <PublicNavbar />
            <main className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 lg:pb-10 lg:pt-16">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-sm font-semibold text-[#2547F9]">Blog LegalPartner.ID</p>
                                <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
                                    Wawasan legalitas untuk pelaku usaha.
                                </h1>
                                <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                                    Panduan praktis seputar pendirian badan usaha, perizinan, merek, dan pajak, ditulis agar mudah diikuti.
                                </p>
                            </div>

                            <form onSubmit={submitSearch} role="search" className="relative w-full lg:w-80">
                                <label htmlFor="blog-search" className="sr-only">Cari artikel</label>
                                <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="blog-search"
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Cari artikel"
                                    className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2547F9] focus:bg-white focus:ring-2 focus:ring-[#2547F9]/15"
                                />
                            </form>
                        </div>

                        <nav aria-label="Kategori artikel" className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                            <Link href={categoryUrl()} className={chipClass(filters.kategori === '')} aria-current={filters.kategori === '' ? 'true' : undefined}>
                                Semua
                            </Link>
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={categoryUrl(category.name)}
                                    className={chipClass(filters.kategori === category.name)}
                                    aria-current={filters.kategori === category.name ? 'true' : undefined}
                                >
                                    {category.name}
                                    <span className={filters.kategori === category.name ? 'text-white/60' : 'text-slate-400'}>{category.total}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
                    {hasFilters && (
                        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                            <p>
                                {articles.total} artikel
                                {filters.kategori && <> di <strong className="font-semibold text-slate-900">{filters.kategori}</strong></>}
                                {filters.q && <> untuk “<strong className="font-semibold text-slate-900">{filters.q}</strong>”</>}
                            </p>
                            <Link href={blogIndex()} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-300">
                                <X aria-hidden="true" className="size-3" />
                                Hapus filter
                            </Link>
                        </div>
                    )}

                    {featured && (
                        <Link
                            href={articleShow(featured.slug)}
                            className="group mb-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-[#2547F9]/30 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 lg:grid-cols-[1.25fr_1fr]"
                        >
                            <div className="aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[360px]">
                                {featured.coverImage && (
                                    <img src={featured.coverImage} alt={featured.coverAlt ?? ''} className="size-full object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                                )}
                            </div>
                            <div className="flex flex-col justify-center p-6 sm:p-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2547F9]">
                                    Terbaru{featured.category && <span className="text-slate-400"> · {featured.category}</span>}
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{featured.title}</h2>
                                {featured.excerpt && <p className="mt-4 text-base leading-7 text-slate-600">{featured.excerpt}</p>}
                                <ArticleMeta article={featured} className="mt-6" />
                                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2547F9]">
                                    Baca artikel
                                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </div>
                        </Link>
                    )}

                    {gridArticles.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {gridArticles.map((article) => (
                                <ArticleCard key={article.slug} article={article} />
                            ))}
                        </div>
                    ) : (
                        !featured && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                                <p className="text-base font-semibold text-slate-900">Belum ada artikel yang cocok</p>
                                <p className="mt-1 text-sm text-slate-500">Coba kata kunci lain atau lihat semua kategori.</p>
                                <Link href={blogIndex()} className="mt-5 inline-flex h-10 items-center rounded-full bg-[#2547F9] px-5 text-sm font-semibold text-white hover:bg-[#1E3EDB]">
                                    Lihat semua artikel
                                </Link>
                            </div>
                        )
                    )}

                    {articles.last_page > 1 && (
                        <nav aria-label="Halaman artikel" className="mt-12 flex flex-wrap justify-center gap-1.5">
                            {articles.links.map((link, index) => {
                                const label = paginationLabel(link.label);

                                return link.url ? (
                                    <Link
                                        key={`${index}-${label}`}
                                        href={link.url}
                                        aria-current={link.active ? 'page' : undefined}
                                        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors ${
                                            link.active ? 'bg-[#172F8A] text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span key={`${index}-${label}`} className="inline-flex h-10 min-w-10 items-center justify-center rounded-full px-4 text-sm text-slate-300">
                                        {label}
                                    </span>
                                );
                            })}
                        </nav>
                    )}
                </div>
            </main>
            <PublicFooter />
        </>
    );
}
