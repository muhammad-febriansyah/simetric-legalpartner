import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { show as articleShow } from '@/actions/App/Http/Controllers/Site/ArticleController';

export type ArticleSummary = {
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    author: string;
    publishedAt: string | null;
    readingMinutes: number;
    coverImage: string | null;
    coverAlt: string | null;
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export function formatArticleDate(value: string | null): string {
    return value ? dateFormatter.format(new Date(value)) : '';
}

export function ArticleMeta({ article, className = '' }: { article: ArticleSummary; className?: string }) {
    return (
        <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 ${className}`}>
            <span className="font-medium text-slate-700">{article.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt ?? undefined}>{formatArticleDate(article.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} menit baca</span>
        </p>
    );
}

export function ArticleCard({ article }: { article: ArticleSummary }) {
    return (
        <Link
            href={articleShow(article.slug)}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#2547F9]/30 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
            <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                {article.coverImage && (
                    <img
                        src={article.coverImage}
                        alt={article.coverAlt ?? ''}
                        loading="lazy"
                        className="size-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                )}
            </div>
            <div className="flex flex-1 flex-col p-5">
                {article.category && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2547F9]">{article.category}</span>
                )}
                <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-slate-950 group-hover:text-[#2547F9]">
                    {article.title}
                </h3>
                {article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>}
                <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <ArticleMeta article={article} />
                    <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-slate-300 transition group-hover:text-[#2547F9]" />
                </div>
            </div>
        </Link>
    );
}
