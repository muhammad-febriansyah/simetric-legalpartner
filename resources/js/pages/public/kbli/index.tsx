import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowRight, BookOpen, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, FileText, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { index as kbliIndex } from '@/actions/App/Http/Controllers/Site/KbliController';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { home } from '@/routes';

type KbliMapping = {
    version: number;
    code: string;
    title: string;
    relation: string | null;
    notes: string | null;
};

type KbliCode = {
    version: number;
    code: string;
    title: string;
    description: string | null;
    parentCode: string | null;
    parent: { code: string; title: string } | null;
    keywords: string | null;
    mappings: KbliMapping[];
};

type PaginatedCodes = {
    data: KbliCode[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    codes: PaginatedCodes;
    versions: number[];
    filters: { q: string; versi: number | null; tingkat: string };
    levels: { value: string; label: string }[];
};

const BPS_PUBLICATION = 'https://www.bps.go.id/id/publication/2025/12/24/a9b2f130776c7bea36008556/klasifikasi-baku-lapangan-usaha-indonesia-kbli-2025-.html';
const BPS_REGULATION = 'https://jdih.bps.go.id/public/dokumen-hukum/eyJpdiI6IjUzazhjTWk3MEFzRnAvR0c1NC9QZ2c9PSIsInZhbHVlIjoiSUJySUYzNWViK1FUWko5emE4ZloxUT09IiwibWFjIjoiMGY2MWRjNWMxNjNjYjZiNGQzMjcxMzQwMzY1MDE2Y2Y1ODk0MWUwZGNjZmU1YTQ1MDM0M2QzOWVhZmMwOTYyNCIsInRhZyI6IiJ9';

const levelDescriptions = [
    { number: '01', name: 'Kategori', detail: 'Kelompok aktivitas ekonomi paling luas.' },
    { number: '02', name: 'Golongan pokok', detail: 'Bidang usaha utama dalam satu kategori.' },
    { number: '03', name: 'Golongan', detail: 'Rincian aktivitas di dalam golongan pokok.' },
    { number: '04', name: 'Subgolongan', detail: 'Pengelompokan yang lebih spesifik.' },
    { number: '05', name: 'Kelompok usaha', detail: 'Kode paling rinci untuk jenis kegiatan usaha.' },
];

const inputClass = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2547F9] focus:ring-2 focus:ring-[#2547F9]/15';

export default function KbliIndex({ codes, versions, filters, levels }: Props) {
    const [query, setQuery] = useState(filters.q);
    const [version, setVersion] = useState(filters.versi?.toString() ?? '');
    const [level, setLevel] = useState(filters.tingkat);
    const hasFilters = filters.q !== '' || filters.tingkat !== '' || (filters.versi !== null && filters.versi !== versions[0]);
    const isDatabaseEmpty = versions.length === 0;

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        router.get(kbliIndex().url, {
            q: query.trim() || undefined,
            versi: version || undefined,
            tingkat: level || undefined,
        }, { preserveScroll: true, replace: true });
    };

    const resetHref = kbliIndex();

    return (
        <>
            <Head title="Cari Kode KBLI">
                <meta name="description" content="Cari kode dan uraian KBLI berdasarkan kode, nama kegiatan usaha, dan tingkat klasifikasi." />
            </Head>
            <PublicNavbar />
            <main className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-8 lg:pb-14 lg:pt-14">
                        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                            <div className="max-w-3xl">
                                <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-slate-400">
                                    <Link href={home()} className="hover:text-slate-700">Beranda</Link>
                                    <span aria-hidden="true">/</span>
                                    <span className="text-slate-600">Database KBLI</span>
                                </nav>
                                <p className="text-sm font-semibold text-[#2547F9]">Pencarian klasifikasi usaha</p>
                                <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
                                    Temukan kode yang sesuai dengan kegiatan usaha.
                                </h1>
                                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                                    Cari berdasarkan kode atau uraian kegiatan. Telusuri struktur klasifikasi dan padanan antarversi jika data tersedia.
                                </p>
                            </div>
                            <a href={BPS_PUBLICATION} target="_blank" rel="noreferrer noopener" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]">
                                <FileText aria-hidden="true" className="size-4" />
                                Referensi publikasi BPS
                                <ExternalLink aria-hidden="true" className="size-3.5 text-slate-400" />
                            </a>
                        </div>

                        <form onSubmit={submitSearch} role="search" className="mt-9 rounded-2xl border border-slate-200 bg-[#F7F8FD] p-3 sm:p-4">
                            <label htmlFor="kbli-search" className="sr-only">Cari kode atau kegiatan usaha</label>
                            <div className="flex flex-col gap-3 lg:flex-row">
                                <div className="relative min-w-0 flex-1">
                                    <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        id="kbli-search"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Masukkan kode atau kata kunci, mis. perdagangan kopi"
                                        className={`${inputClass} pl-12`}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 lg:w-[22rem]">
                                    <label className="sr-only" htmlFor="kbli-version">Versi KBLI</label>
                                    <select id="kbli-version" value={version} onChange={(event) => setVersion(event.target.value)} className={`${inputClass} px-3`}>
                                        <option value="">Pilih versi</option>
                                        {versions.map((item) => <option key={item} value={item}>KBLI {item}</option>)}
                                    </select>
                                    <label className="sr-only" htmlFor="kbli-level">Tingkat klasifikasi</label>
                                    <select id="kbli-level" value={level} onChange={(event) => setLevel(event.target.value)} className={`${inputClass} px-3`}>
                                        <option value="">Semua tingkat</option>
                                        {levels.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2547F9] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1E3EDB] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2">
                                    <Search aria-hidden="true" className="size-4" />
                                    Cari KBLI
                                </button>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1.5"><SlidersHorizontal aria-hidden="true" className="size-3.5" /> Hasil mencari kode, nama, uraian, dan kata kunci.</span>
                                {hasFilters && <Link href={resetHref} className="inline-flex items-center gap-1 font-medium text-[#2547F9] hover:underline"><X aria-hidden="true" className="size-3.5" /> Hapus filter</Link>}
                            </div>
                        </form>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12" aria-labelledby="results-heading">
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Database kode usaha</p>
                            <h2 id="results-heading" className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{hasFilters ? 'Hasil pencarian' : 'Daftar kode KBLI'}</h2>
                        </div>
                        {!isDatabaseEmpty && (
                            <p className="text-sm text-slate-500" aria-live="polite">
                                {codes.from ?? 0}–{codes.to ?? 0} dari <span className="font-semibold text-slate-900">{codes.total.toLocaleString('id-ID')}</span> kode
                                {filters.versi && <span> · Versi {filters.versi}</span>}
                            </p>
                        )}
                    </div>

                    {isDatabaseEmpty ? (
                        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div className="max-w-2xl">
                                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#2547F9]"><BookOpen aria-hidden="true" className="size-5" /></span>
                                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">Dataset KBLI belum tersedia di website.</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Halaman pencarian sudah siap, tetapi tabel kode masih kosong. Untuk menjaga ketepatan kode dan uraian, gunakan publikasi resmi BPS sampai dataset resmi dimasukkan ke sistem.
                                    </p>
                                </div>
                                <a href={BPS_PUBLICATION} target="_blank" rel="noreferrer noopener" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#172F8A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#12266F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172F8A] focus-visible:ring-offset-2">
                                    Buka publikasi BPS
                                    <ExternalLink aria-hidden="true" className="size-4" />
                                </a>
                            </div>
                            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-7 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                                <span>Rujukan: KBLI 2025, Publikasi Badan Pusat Statistik.</span>
                                <a href={BPS_REGULATION} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-[#2547F9]">Peraturan BPS No. 7 Tahun 2025 <ExternalLink aria-hidden="true" className="size-3" /></a>
                            </div>
                        </div>
                    ) : codes.data.length > 0 ? (
                        <>
                            <div className="mt-5 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
                                <table className="w-full border-collapse text-left">
                                    <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                                        <tr>
                                            <th scope="col" className="w-36 px-5 py-3.5">Kode</th>
                                            <th scope="col" className="px-5 py-3.5">Kegiatan usaha</th>
                                            <th scope="col" className="w-40 px-5 py-3.5">Versi</th>
                                            <th scope="col" className="w-28 px-5 py-3.5 text-right">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {codes.data.map((code) => (
                                            <tr key={`${code.version}-${code.code}`} className="group align-top transition-colors hover:bg-[#F7F8FD]/70">
                                                <td className="px-5 py-5"><span className="font-mono text-sm font-semibold tracking-wide text-[#2547F9]">{code.code}</span></td>
                                                <td className="px-5 py-5">
                                                    <p className="font-semibold leading-6 text-slate-900">{code.title}</p>
                                                    {code.description && <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">{code.description}</p>}
                                                    {code.parent && <p className="mt-2 text-xs text-slate-400">Bagian dari <span className="font-mono text-slate-500">{code.parent.code}</span> · {code.parent.title}</p>}
                                                </td>
                                                <td className="px-5 py-5"><span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">KBLI {code.version}</span></td>
                                                <td className="px-5 py-5 text-right">
                                                    <details className="group/details inline-block text-left">
                                                        <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] [&::-webkit-details-marker]:hidden">
                                                            Uraian <ChevronDown aria-hidden="true" className="size-3.5 transition-transform group-open/details:rotate-180" />
                                                        </summary>
                                                        <div className="mt-3 max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                                                            <p className="font-mono text-xs font-semibold text-[#2547F9]">{code.code} · KBLI {code.version}</p>
                                                            <h3 className="mt-1 font-semibold text-slate-950">{code.title}</h3>
                                                            {code.description && <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{code.description}</p>}
                                                            {code.keywords && <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">Kata kunci: {code.keywords}</p>}
                                                            {code.mappings.length > 0 && <div className="mt-3 border-t border-slate-100 pt-3"><p className="text-xs font-semibold text-slate-500">Padanan versi lain</p><ul className="mt-2 space-y-2">{code.mappings.map((mapping) => <li key={`${mapping.version}-${mapping.code}`} className="text-xs leading-5 text-slate-600"><span className="font-mono font-semibold text-slate-900">{mapping.code}</span> · KBLI {mapping.version} — {mapping.title}{mapping.relation && <span className="text-slate-400"> ({mapping.relation})</span>}{mapping.notes && <span className="block text-slate-400">{mapping.notes}</span>}</li>)}</ul></div>}
                                                        </div>
                                                    </details>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <ul className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white md:hidden">
                                {codes.data.map((code) => (
                                    <li key={`${code.version}-${code.code}`} className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="font-mono text-sm font-semibold tracking-wide text-[#2547F9]">{code.code}</span>
                                            <span className="shrink-0 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500">KBLI {code.version}</span>
                                        </div>
                                        <h3 className="mt-2 font-semibold leading-6 text-slate-950">{code.title}</h3>
                                        {code.description && <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">{code.description}</p>}
                                        {code.parent && <p className="mt-3 text-xs text-slate-400">Bagian dari {code.parent.code} · {code.parent.title}</p>}
                                        {code.mappings.length > 0 && <details className="mt-3 border-t border-slate-100 pt-3"><summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-slate-600">Lihat padanan kode <ChevronDown aria-hidden="true" className="size-4" /></summary><ul className="mt-2 space-y-2">{code.mappings.map((mapping) => <li key={`${mapping.version}-${mapping.code}`} className="text-xs leading-5 text-slate-600"><span className="font-mono font-semibold">{mapping.code}</span> · KBLI {mapping.version} — {mapping.title}</li>)}</ul></details>}
                                    </li>
                                ))}
                            </ul>

                            {codes.last_page > 1 && (
                                <nav aria-label="Halaman hasil KBLI" className="mt-7 flex flex-wrap items-center justify-between gap-4">
                                    <p className="text-sm text-slate-500">Halaman {codes.current_page} dari {codes.last_page}</p>
                                    <div className="flex gap-2">
                                        {codes.links.filter((item) => /previous|next/i.test(item.label)).map((item) => (
                                            item.url ? <Link key={item.label} href={item.url} className="inline-flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-300"><span className="sr-only">{item.label}</span>{/previous/i.test(item.label) ? <><ChevronLeft aria-hidden="true" className="size-4" /> Sebelumnya</> : <>Berikutnya <ChevronRight aria-hidden="true" className="size-4" /></>}</Link> : <span key={item.label} className="inline-flex h-10 items-center gap-1 rounded-full border border-slate-100 px-4 text-sm text-slate-300">{/previous/i.test(item.label) ? <><ChevronLeft aria-hidden="true" className="size-4" /> Sebelumnya</> : <>Berikutnya <ChevronRight aria-hidden="true" className="size-4" /> </>}</span>
                                        ))}
                                    </div>
                                </nav>
                            )}
                        </>
                    ) : (
                        <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center sm:py-20">
                            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><Search aria-hidden="true" className="size-5" /></span>
                            <h3 className="mt-5 text-lg font-semibold text-slate-950">Tidak ada kode yang cocok.</h3>
                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Ubah kata kunci atau filter, lalu coba lagi.</p>
                            <Link href={resetHref} className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-slate-300"><X aria-hidden="true" className="size-4" /> Hapus pencarian</Link>
                        </div>
                    )}
                </section>

                <section className="border-y border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:py-16">
                        <div>
                            <p className="text-sm font-semibold text-[#2547F9]">Mengenal KBLI</p>
                            <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-slate-950">Kode usaha punya struktur bertingkat.</h2>
                            <p className="mt-4 text-sm leading-6 text-slate-600">KBLI mengelompokkan kegiatan ekonomi berdasarkan karakteristik aktivitasnya. Gunakan uraian resmi untuk memastikan kode sesuai dengan kegiatan yang benar-benar dijalankan.</p>
                            <a href={BPS_REGULATION} target="_blank" rel="noreferrer noopener" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2547F9] hover:underline">Baca Peraturan BPS No. 7 Tahun 2025 <ExternalLink aria-hidden="true" className="size-3.5" /></a>
                        </div>
                        <ol className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                            {levelDescriptions.map((item) => (
                                <li key={item.number} className="flex gap-3 border-t border-slate-200 pt-4">
                                    <span className="font-mono text-xs font-semibold text-[#2547F9]">{item.number}</span>
                                    <div><h3 className="text-sm font-semibold text-slate-900">{item.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p></div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
                    <div className="flex flex-col gap-5 rounded-3xl bg-[#172F8A] px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
                        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">Perlu menentukan ruang lingkup?</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Tim kami bisa bantu memetakan kebutuhan legalitas usaha.</h2></div>
                        <Link href={`${partnershipIndex().url}#form-pendaftaran`} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-950 hover:bg-[#EEF1FF]">Konsultasi gratis <ArrowRight aria-hidden="true" className="size-4" /></Link>
                    </div>
                    <p className="mt-5 inline-flex items-start gap-2 text-xs leading-5 text-slate-400"><ArrowDown aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />Informasi pada halaman ini disediakan untuk pencarian awal. Pastikan pemilihan kode dan kewajiban perizinan dikonfirmasi melalui sumber resmi.</p>
                </section>
            </main>
            <PublicFooter />
        </>
    );
}
