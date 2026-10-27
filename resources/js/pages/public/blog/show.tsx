import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Check, Copy, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { index as blogIndex } from '@/actions/App/Http/Controllers/Site/ArticleController';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import { index as servicesIndex } from '@/actions/App/Http/Controllers/Site/ServiceController';
import { MarkdownContent } from '@/components/admin/markdown-editor';
import { ArticleCard, ArticleMeta } from '@/components/article-card';
import type { ArticleSummary } from '@/components/article-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { SocialIcon } from '@/components/social-icons';

type Props = {
    article: ArticleSummary & {
        content: string;
        metaTitle: string;
        metaDescription: string;
        canonicalUrl: string;
        updatedAt: string | null;
    };
    related: ArticleSummary[];
};

export default function BlogShow({ article, related }: Props) {
    const [isCopied, setIsCopied] = useState(false);
    const encodedUrl = encodeURIComponent(article.canonicalUrl);
    const encodedTitle = encodeURIComponent(article.metaTitle);
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.metaTitle,
        description: article.metaDescription,
        url: article.canonicalUrl,
        image: article.coverImage ? [article.coverImage] : undefined,
        datePublished: article.publishedAt ?? undefined,
        dateModified: article.updatedAt ?? article.publishedAt ?? undefined,
        articleSection: article.category ?? undefined,
        author: { '@type': 'Person', name: article.author },
        publisher: { '@type': 'Organization', name: 'LegalPartner.ID' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': article.canonicalUrl },
    };

    async function copyArticleLink(): Promise<void> {
        try {
            await navigator.clipboard.writeText(article.canonicalUrl);
            setIsCopied(true);
            toast.success('Tautan artikel disalin');
            window.setTimeout(() => setIsCopied(false), 1800);
        } catch {
            toast.error('Tautan belum dapat disalin', {
                description: 'Salin alamat halaman dari bilah alamat browser.',
            });
        }
    }

    async function shareToSocialApps(): Promise<void> {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: article.metaTitle,
                    text: article.metaDescription,
                    url: article.canonicalUrl,
                });

                return;
            }

            await navigator.clipboard.writeText(article.canonicalUrl);
            toast.success('Tautan artikel disalin', {
                description: 'Tempel tautan ke Instagram atau TikTok.',
            });
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }

            toast.error('Tautan belum dapat dibagikan', {
                description: 'Salin alamat halaman dari bilah alamat browser.',
            });
        }
    }

    return (
        <>
            <Head title={article.metaTitle}>
                <meta name="description" content={article.metaDescription} />
                <link rel="canonical" href={article.canonicalUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="LegalPartner.ID" />
                <meta property="og:title" content={article.metaTitle} />
                <meta property="og:description" content={article.metaDescription} />
                <meta property="og:url" content={article.canonicalUrl} />
                {article.coverImage && <>
                    <meta property="og:image" content={article.coverImage} />
                    <meta property="og:image:alt" content={article.coverAlt || article.metaTitle} />
                    <meta name="twitter:image" content={article.coverImage} />
                </>}
                {article.publishedAt && <meta property="article:published_time" content={article.publishedAt} />}
                {article.updatedAt && <meta property="article:modified_time" content={article.updatedAt} />}
                {article.author && <meta property="article:author" content={article.author} />}
                {article.category && <meta property="article:section" content={article.category} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.metaTitle} />
                <meta name="twitter:description" content={article.metaDescription} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
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
                            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5" aria-label="Bagikan artikel">
                                <span className="mr-1 text-xs font-semibold text-slate-500">Bagikan</span>
                                <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer noopener" aria-label="Bagikan lewat WhatsApp" title="WhatsApp" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                    <MessageCircle aria-hidden="true" className="size-4" />
                                </a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer noopener" aria-label="Bagikan lewat Facebook" title="Facebook" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                    <Facebook aria-hidden="true" className="size-4" />
                                </a>
                                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer noopener" aria-label="Bagikan lewat LinkedIn" title="LinkedIn" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                    <Linkedin aria-hidden="true" className="size-4" />
                                </a>
                                <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noreferrer noopener" aria-label="Bagikan lewat X" title="X" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                    <span aria-hidden="true" className="text-sm font-semibold">𝕏</span>
                                </a>
                                <button type="button" onClick={shareToSocialApps} aria-label="Bagikan artikel ke Instagram melalui menu berbagi" title="Instagram" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-pink-200 hover:bg-pink-50 hover:text-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                    <Instagram aria-hidden="true" className="size-4" />
                                </button>
                                <button type="button" onClick={shareToSocialApps} aria-label="Bagikan artikel ke TikTok melalui menu berbagi" title="TikTok" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                    <SocialIcon name="tiktok" className="size-4" />
                                </button>
                                <button type="button" onClick={copyArticleLink} aria-label={isCopied ? 'Tautan disalin' : 'Salin tautan artikel'} title="Salin tautan" className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#2547F9]/30 hover:bg-[#2547F9]/[0.05] hover:text-[#2547F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                    {isCopied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
                                </button>
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
