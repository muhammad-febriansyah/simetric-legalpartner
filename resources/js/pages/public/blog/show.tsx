import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { index as blogIndex } from '@/actions/App/Http/Controllers/Site/ArticleController';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import { index as servicesIndex } from '@/actions/App/Http/Controllers/Site/ServiceController';
import { MarkdownContent } from '@/components/admin/markdown-editor';
import { ArticleCard, ArticleMeta } from '@/components/article-card';
import type { ArticleSummary } from '@/components/article-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';

type Props = {
    article: ArticleSummary & { content: string; metaTitle: string; metaDescription: string | null };
    related: ArticleSummary[];
};

export default function BlogShow({ article, related }: Props) {
    return (
        <>
            <Head title={article.metaTitle}>
                {article.metaDescription && <meta name="description" content={article.metaDescription} />}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={article.metaTitle} />
                {article.metaDescription && <meta property="og:description" content={article.metaDescription} />}
                {article.coverImage && <meta property="og:image" content={article.coverImage} />}
            </Head>
            <PublicNavbar />
            <main className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <article>
                    <header className="border-b border-slate-200 bg-white">
                        <div className="mx-auto max-w-3xl px-5 pb-10 pt-10 sm:px-8 lg:pb-12 lg:pt-14">
                            <Link href={blogIndex()} className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-500 transition-colors hover:text-[#2547F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                <ArrowLeft aria-hidden="true" className="size-4" />
                                Semua artikel
                            </Link>
                            {article.category && (
                                <Link
                                    href={blogIndex({ query: { kategori: article.category } })}
                                    className="mt-8 block w-fit rounded-full bg-[#EEF1FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#2547F9] hover:bg-[#E2E8FF]"
                                >
                                    {article.category}
                                </Link>
                            )}
                            <h1 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">{article.title}</h1>
                            {article.excerpt && <p className="mt-5 text-lg leading-8 text-slate-600">{article.excerpt}</p>}
                            <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
                                <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#172F8A] text-sm font-semibold text-white">
                                    {article.author.replace(/[^A-Za-z ]/g, '').trim().split(' ').slice(0, 2).map((part) => part[0]).join('')}
                                </span>
                                <ArticleMeta article={article} className="text-sm" />
                            </div>
                        </div>
                    </header>

                    {article.coverImage && (
                        <div className="mx-auto -mt-px max-w-5xl px-5 sm:px-8">
                            <img
                                src={article.coverImage}
                                alt={article.coverAlt ?? ''}
                                className="mt-8 aspect-[16/9] w-full rounded-3xl border border-slate-200 object-cover shadow-[0_24px_50px_-30px_rgba(15,23,42,0.35)]"
                            />
                        </div>
                    )}

                    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
                        <MarkdownContent
                            value={article.content}
                            className="text-[17px] leading-8 text-slate-700 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:pl-1 [&_ol]:space-y-2 [&_ul]:space-y-2 [&_strong]:text-slate-950 [&_blockquote]:text-slate-500 [&_a]:text-[#2547F9]"
                        />

                        <aside className="mt-14 rounded-3xl bg-[#172F8A] p-7 text-white sm:p-9">
                            <p className="text-xs font-medium text-white/50">Butuh pendampingan?</p>
                            <p className="mt-2 text-2xl font-semibold leading-snug tracking-tight">Ceritakan kebutuhan usaha Anda, kami bantu petakan langkahnya.</p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link href={`${partnershipIndex().url}#form-pendaftaran`} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#EEF1FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#172F8A]">
                                    <MessageCircle aria-hidden="true" className="size-4" />
                                    Konsultasi gratis
                                </Link>
                                <Link href={servicesIndex()} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                                    Lihat layanan
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </article>

                {related.length > 0 && (
                    <section className="border-t border-slate-200 bg-white" aria-labelledby="related-heading">
                        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
                            <div className="flex items-end justify-between gap-4">
                                <h2 id="related-heading" className="text-2xl font-semibold tracking-tight text-slate-950">Artikel lainnya</h2>
                                <Link href={blogIndex()} className="text-sm font-semibold text-[#2547F9] hover:underline">Lihat semua</Link>
                            </div>
                            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {related.map((item) => (
                                    <ArticleCard key={item.slug} article={item} />
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
