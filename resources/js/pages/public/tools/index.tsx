import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Calculator, FileSearch, FileText, ListChecks, MapPin, Search, Sparkles, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { home } from '@/routes';

type Tool = { name: string; description: string; icon: string; href: string; external: boolean };
type Props = { groups: { name: string; tools: Tool[] }[] };

const icons: Record<string, ReactNode> = {
    wallet: <Wallet className="size-5" />,
    calculator: <Calculator className="size-5" />,
    'file-text': <FileText className="size-5" />,
    search: <Search className="size-5" />,
    sparkles: <Sparkles className="size-5" />,
    'file-search': <FileSearch className="size-5" />,
    'list-check': <ListChecks className="size-5" />,
    'map-pin': <MapPin className="size-5" />,
};

export default function PublicTools({ groups }: Props) {
    return (
        <>
            <Head title="Tools Gratis untuk Usaha">
                <meta name="description" content="Kumpulan tools legalitas, kalkulator bisnis, dan pemeriksaan usaha." />
            </Head>
            <PublicNavbar />
            <main className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-slate-400"><Link href={home()} className="hover:text-slate-700">Beranda</Link><span>/</span><span className="text-slate-600">Tools gratis</span></nav>
                        <p className="text-sm font-semibold text-[#2547F9]">Untuk membantu langkah awal usaha</p>
                        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div><h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Tools praktis untuk bisnis yang siap tumbuh.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Pakai kalkulator dan pemeriksaan awal untuk memahami opsi legalitas usaha Anda.</p></div>
                            <span className="w-fit rounded-full border border-slate-200 bg-[#F7F8FD] px-4 py-2 text-sm font-medium text-slate-600">11 tools gratis</span>
                        </div>
                    </div>
                </section>
                <div className="mx-auto max-w-7xl space-y-12 px-5 py-9 sm:px-8 sm:py-12">
                    {groups.map((group) => <section key={group.name} aria-labelledby={`group-${group.name}`}><div className="mb-5 flex items-center justify-between"><h2 id={`group-${group.name}`} className="text-xl font-semibold tracking-tight text-slate-950">{group.name}</h2><span className="text-xs text-slate-400">{group.tools.length} tools</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{group.tools.map((tool) => {const content = <><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#2547F9]">{icons[tool.icon]}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="font-semibold text-slate-900">{tool.name}</span>{tool.external ? <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-slate-400" /> : <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">DI SINI</span>}</span><span className="mt-1.5 block text-sm leading-5 text-slate-500">{tool.description}</span></span></>;return tool.external ? <a key={tool.name} href={tool.href} target="_blank" rel="noreferrer noopener" className="flex min-h-28 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">{content}</a> : <Link key={tool.name} href={tool.href} className="flex min-h-28 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#2547F9]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">{content}</Link>;})}</div></section>)}
                    <p className="border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Semua tools tersedia langsung di website ini. Hasil pemeriksaan bersifat awal dan perlu dikonfirmasi melalui instansi resmi.</p>
                </div>
            </main>
            <PublicFooter />
        </>
    );
}
