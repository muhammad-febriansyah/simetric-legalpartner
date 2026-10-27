import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, ArrowUpRight, Check, FileSearch, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { index as checkerIndex } from '@/actions/App/Http/Controllers/Site/KbliCheckerController';
import { index as kbliIndex } from '@/actions/App/Http/Controllers/Site/KbliController';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { home } from '@/routes';

type KbliResult = {
    code: string;
    title: string;
    description: string | null;
    category: string | null;
    section: string | null;
    matchedTerms: string[];
    previousCodes: { code: string; title: string }[];
};

type Props = {
    query: string;
    oldCode: string;
    category: string;
    categories: { value: string; label: string }[];
    hasData: boolean;
    results: KbliResult[];
    conversion: {
        source: { code: string; title: string };
        targets: { code: string; title: string; relation: string | null; notes: string | null }[];
    } | null;
    hasSearched: boolean;
};

const inputClass = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2547F9] focus:ring-2 focus:ring-[#2547F9]/15';

export default function KbliChecker({ query, oldCode, category, categories, hasData, results, conversion, hasSearched }: Props) {
    const [activity, setActivity] = useState(query);
    const [legacyCode, setLegacyCode] = useState(oldCode);
    const [selectedCategory, setSelectedCategory] = useState(category);

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get(checkerIndex().url, {
            q: activity.trim() || undefined,
            kode: legacyCode.trim() || undefined,
            kategori: selectedCategory || undefined,
        }, { preserveScroll: true, preserveState: true });
    };

    return (
        <>
            <Head title="Cek Kode KBLI 2025">
                <meta name="description" content="Cari kode KBLI berdasarkan kegiatan usaha dan lihat padanan KBLI 2020 ke KBLI 2025." />
            </Head>
            <PublicNavbar />
            <main className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-44 size-[34rem] rounded-full bg-[#EEF1FF] blur-3xl" />
                    <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-9 sm:px-8 sm:pb-16 sm:pt-12">
                        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-slate-400">
                            <Link href={home()} className="hover:text-slate-700">Beranda</Link><span aria-hidden="true">/</span>
                            <span>Tools gratis</span><span aria-hidden="true">/</span><span className="text-slate-600">Cek KBLI</span>
                        </nav>
                        <div className="grid gap-10 lg:grid-cols-[1fr_19rem] lg:items-end">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#2547F9]/15 bg-[#F4F6FF] px-3 py-1.5 text-xs font-semibold text-[#2547F9]">
                                    <span className="size-1.5 rounded-full bg-[#2547F9]" /> REFERENSI KBLI 2025
                                </div>
                                <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
                                    Kegiatan usaha Anda masuk kode yang mana?
                                </h1>
                                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                                    Ceritakan aktivitas utama bisnis Anda. Temukan kelompok KBLI yang relevan dan cek padanan kode lama.
                                </p>
                            </div>
                            <div className="hidden rounded-2xl border border-slate-200 bg-[#F9FAFF] p-5 lg:block">
                                <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-white text-[#2547F9] shadow-sm"><ShieldCheck className="size-5" /></span><div><p className="text-sm font-semibold text-slate-900">Rujukan tepercaya</p><p className="mt-0.5 text-xs text-slate-500">BPS · KBLI 2025</p></div></div>
                                <p className="mt-4 text-xs leading-5 text-slate-500">Gunakan hasil sebagai titik awal. Penetapan kegiatan tetap merujuk pada uraian resmi dan sistem OSS.</p>
                            </div>
                        </div>

                        <form onSubmit={submitSearch} className="mt-9 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.3)] sm:p-6">
                            <label htmlFor="business-activity" className="text-sm font-semibold text-slate-900">Apa yang bisnis Anda kerjakan?</label>
                            <p className="mt-1 text-xs leading-5 text-slate-500">Tulis aktivitas yang menghasilkan pendapatan. Contoh: menjual kopi kemasan secara online.</p>
                            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_14rem_auto]">
                                <div className="relative"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input id="business-activity" value={activity} onChange={(event) => setActivity(event.target.value)} maxLength={160} placeholder="Jelaskan kegiatan usaha utama Anda" className={`${inputClass} pl-11`} /></div>
                                <label className="sr-only" htmlFor="business-category">Kategori KBLI</label>
                                <select id="business-category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className={`${inputClass} px-3`}><option value="">Semua kategori</option>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
                                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2547F9] px-6 text-sm font-semibold text-white transition hover:bg-[#1E3EDB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2"><Search aria-hidden="true" className="size-4" />Cari kode KBLI</button>
                            </div>
                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <label htmlFor="old-kbli" className="text-xs font-semibold text-slate-700">Punya kode KBLI 2020? Cek padanannya</label>
                                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                                    <input id="old-kbli" value={legacyCode} onChange={(event) => setLegacyCode(event.target.value)} maxLength={10} placeholder="Contoh: 47771" className={`${inputClass} sm:max-w-xs`} />
                                    <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950">Cek konversi <ArrowRight aria-hidden="true" className="size-4" /></button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" />Pencarian gratis</span><span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" />Tanpa perlu daftar</span><span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" />Mengacu KBLI 2025</span></div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12" aria-live="polite">
                    {conversion && <div className="mb-6 rounded-2xl border border-[#2547F9]/20 bg-white p-5 sm:p-6"><p className="text-xs font-semibold uppercase tracking-wider text-[#2547F9]">Hasil konversi KBLI 2020 → 2025</p><h2 className="mt-2 text-lg font-semibold">{conversion.source.code} · {conversion.source.title}</h2>{conversion.targets.length ? <ul className="mt-4 divide-y divide-slate-100">{conversion.targets.map((target) => <li key={target.code} className="py-3"><span className="font-mono font-semibold text-[#2547F9]">{target.code}</span><span className="ml-3 font-medium">{target.title}</span>{target.relation && <span className="ml-2 text-xs text-slate-500">{target.relation}</span>}{target.notes && <p className="mt-1 text-sm text-slate-500">{target.notes}</p>}</li>)}</ul> : <p className="mt-2 text-sm text-slate-600">Endpoint sumber belum mengembalikan kode tujuan untuk kode ini.</p>}</div>}

                    {hasSearched && results.length > 0 && <div><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Hasil pencarian</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Pilihan kode yang relevan</h2></div><span className="text-sm text-slate-500">{results.length} hasil</span></div><div className="grid gap-3">{results.map((result) => <article key={result.code} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><span className="font-mono text-sm font-semibold tracking-wide text-[#2547F9]">{result.code}</span><h3 className="mt-1 text-base font-semibold text-slate-950">{result.title}</h3>{result.category && <p className="mt-2 text-sm text-slate-500">{result.category}{result.section ? ` · Seksi ${result.section}` : ''}</p>}{result.description && <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{result.description}</p>}</div><span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"><Sparkles className="size-3.5" />Kecocokan kata</span></div>{result.previousCodes.length > 0 && <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">Padanan KBLI 2020: {result.previousCodes.map((previous) => `${previous.code} · ${previous.title}`).join('; ')}</p>}</article>)}</div></div>}

                    {hasSearched && results.length === 0 && !conversion && <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#2547F9]"><FileSearch className="size-5" /></div><h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">{hasData ? 'Belum ada kecocokan untuk pencarian ini.' : 'Database kode KBLI sedang disiapkan.'}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{hasData ? 'Coba gunakan istilah yang lebih umum atau pilih kategori lain. Uraian aktivitas utama biasanya membantu mempersempit hasil.' : 'Pencarian dan konversi akan memakai data resmi setelah dataset KBLI dimasukkan. Untuk saat ini, buka referensi resmi BPS agar kode usaha tetap akurat.'}</p><div className="mt-5 flex flex-wrap gap-3"><a href="https://www.bps.go.id/id/publication/2025/12/24/a9b2f130776c7bea36008556/klasifikasi-baku-lapangan-usaha-indonesia-kbli-2025-.html" target="_blank" rel="noreferrer noopener" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#172F8A] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#12266F]">Buka publikasi BPS <ArrowUpRight className="size-4" /></a><Link href={kbliIndex()} className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300">Lihat halaman database <ArrowRight className="size-4" /></Link></div></div>}

                    {!hasSearched && <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-xs font-semibold text-[#2547F9]">01 · CERITAKAN</span><h2 className="mt-3 font-semibold">Uraikan aktivitas utama</h2><p className="mt-2 text-sm leading-6 text-slate-500">Sebutkan produk atau jasa dan bagaimana bisnis menghasilkan pendapatan.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-xs font-semibold text-[#2547F9]">02 · TELUSURI</span><h2 className="mt-3 font-semibold">Periksa kode dan uraian</h2><p className="mt-2 text-sm leading-6 text-slate-500">Cocokkan kegiatan nyata dengan deskripsi kelompok usaha yang tersedia.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><span className="text-xs font-semibold text-[#2547F9]">03 · KONFIRMASI</span><h2 className="mt-3 font-semibold">Pastikan sebelum mengurus izin</h2><p className="mt-2 text-sm leading-6 text-slate-500">Validasi pilihan dengan uraian BPS dan klasifikasi di OSS.</p></div></div>}

                    <p className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Hasil merupakan bantuan awal, bukan penetapan resmi atau nasihat hukum. Pastikan kembali pada publikasi BPS dan sistem OSS.</p>
                </section>
            </main>
            <PublicFooter />
        </>
    );
}
