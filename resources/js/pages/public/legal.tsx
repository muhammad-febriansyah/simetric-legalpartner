import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { MarkdownContent } from '@/components/admin/markdown-editor';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { home } from '@/routes';

type Props = {
    page: { title: string; slug: string; content: string; updatedAt: string | null };
};

const dateFormatter = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });

export default function LegalPage({ page }: Props) {
    return (
        <>
            <Head title={page.title} />
            <PublicNavbar />
            <main className="min-h-[70vh] bg-[#F7F8FD] text-slate-900">
                <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 lg:py-16">
                    <Link href={home()} className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-500 transition-colors hover:text-[#2547F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                        <ArrowLeft aria-hidden="true" className="size-4" />
                        Beranda
                    </Link>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{page.title}</h1>
                    {page.updatedAt && <p className="mt-3 text-sm text-slate-500">Diperbarui {dateFormatter.format(new Date(page.updatedAt))}</p>}
                    <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.03] sm:p-10">
                        <MarkdownContent
                            value={page.content}
                            className="text-[15px] leading-8 text-slate-600 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-950 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:pl-1 [&_ol]:space-y-2 [&_ul]:space-y-2"
                        />
                    </article>
                </div>
            </main>
            <PublicFooter />
        </>
    );
}
