import { Head, Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { index as toolsIndex } from '@/actions/App/Http/Controllers/Site/PublicToolsController';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { home } from '@/routes';

type Zone = { code: string; name: string; hex: string; allowed: string; restricted: string };
type Area = { slug: string; name: string; kota: string; kecamatan: string; primary_zone: string; secondary_zones: string[]; klb: string; kdb: string; notes: string };
type Props = { zones: Zone[]; areas: Area[]; query: string; sourceAvailable: boolean };
type SortColumn = 'location' | 'zone' | 'klb' | 'kdb';

const PAGE_SIZE = 10;

export default function Zoning({ zones, areas, query, sourceAvailable }: Props) {
    const [search, setSearch] = useState(query);
    const [selectedZone, setSelectedZone] = useState('all');
    const [sortColumn, setSortColumn] = useState<SortColumn>('location');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(0);

    const zoneByCode = useMemo(() => new Map(zones.map((zone) => [zone.code, zone])), [zones]);
    const filteredAreas = useMemo(() => {
        const term = search.trim().toLocaleLowerCase('id');

        return areas
            .filter((area) => {
                const matchesSearch = term === '' || [
                    area.name,
                    area.kota,
                    area.kecamatan,
                    area.primary_zone,
                    zoneByCode.get(area.primary_zone)?.name ?? '',
                    area.notes,
                    ...area.secondary_zones,
                ].join(' ').toLocaleLowerCase('id').includes(term);

                return matchesSearch && (selectedZone === 'all' || area.primary_zone === selectedZone);
            })
            .sort((first, second) => {
                const sortValue = {
                    location: `${first.name} ${first.kecamatan} ${first.kota}`.toLocaleLowerCase('id').localeCompare(`${second.name} ${second.kecamatan} ${second.kota}`.toLocaleLowerCase('id'), 'id'),
                    zone: first.primary_zone.localeCompare(second.primary_zone, 'id'),
                    klb: first.klb.localeCompare(second.klb, 'id', { numeric: true }),
                    kdb: first.kdb.localeCompare(second.kdb, 'id', { numeric: true }),
                }[sortColumn];

                return sortDirection === 'asc' ? sortValue : -sortValue;
            });
    }, [areas, search, selectedZone, sortColumn, sortDirection, zoneByCode]);

    const pageCount = Math.ceil(filteredAreas.length / PAGE_SIZE);
    const visibleAreas = filteredAreas.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    function changeSort(column: SortColumn) {
        if (sortColumn === column) {
            setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }

        setPage(0);
    }

    function sortIcon(column: SortColumn) {
        if (sortColumn !== column) return <ArrowUpDown aria-hidden="true" className="size-3.5" />;
        return sortDirection === 'asc'
            ? <ArrowUp aria-hidden="true" className="size-3.5" />
            : <ArrowDown aria-hidden="true" className="size-3.5" />;
    }

    return (
        <>
            <Head title="Cek Zonasi RDTR" />
            <PublicNavbar />
            <main className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
                        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-slate-400">
                            <Link href={home()} className="transition-colors hover:text-slate-700">Beranda</Link>
                            <span aria-hidden="true">/</span>
                            <Link href={toolsIndex()} className="transition-colors hover:text-slate-700">Tools gratis</Link>
                            <span aria-hidden="true">/</span>
                            <span className="text-slate-600">Cek zonasi</span>
                        </nav>
                        <div className="max-w-3xl">
                            <p className="text-sm font-semibold text-[#2547F9]">Informasi kawasan usaha</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Temukan ringkasan zonasi area usaha</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">Telusuri area berdasarkan nama lokasi, wilayah, atau kode zona. Bandingkan KLB dan KDB sebagai referensi awal.</p>
                        </div>
                        <div className="mt-7 grid max-w-4xl gap-3 sm:grid-cols-3">
                            <label className="relative block sm:col-span-2">
                                <span className="sr-only">Cari area</span>
                                <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} placeholder="Cari area, kota, kecamatan, atau kode zona" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#2547F9] focus:ring-2 focus:ring-[#2547F9]/15" />
                            </label>
                            <label className="relative flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-600 focus-within:border-[#2547F9] focus-within:ring-2 focus-within:ring-[#2547F9]/15">
                                <SlidersHorizontal aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
                                <span className="sr-only">Filter kode zona</span>
                                <select value={selectedZone} onChange={(event) => { setSelectedZone(event.target.value); setPage(0); }} className="h-full min-w-0 flex-1 appearance-none bg-transparent pr-4 outline-none">
                                    <option value="all">Semua kode zona</option>
                                    {zones.map((zone) => <option key={zone.code} value={zone.code}>{zone.code} · {zone.name}</option>)}
                                </select>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
                    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
                        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="font-semibold text-slate-900">Area dalam referensi</h2>
                                <p className="mt-1 text-xs text-slate-500">Ringkasan kode dan intensitas pemanfaatan ruang</p>
                            </div>
                            <span className="text-sm tabular-nums text-slate-500">{filteredAreas.length} area</span>
                        </div>

                        {!sourceAvailable ? (
                            <div className="px-6 py-14 text-center">
                                <p className="font-medium text-slate-800">Data zonasi belum tersedia</p>
                                <p className="mt-2 text-sm text-slate-500">Coba muat ulang beberapa saat lagi.</p>
                            </div>
                        ) : filteredAreas.length > 0 ? (
                            <>
                                <Table className="min-w-[760px]">
                                    <TableHeader className="bg-slate-50/80">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="h-11 pl-5 sm:pl-6"><button type="button" onClick={() => changeSort('location')} className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-950">Lokasi {sortIcon('location')}</button></TableHead>
                                            <TableHead><button type="button" onClick={() => changeSort('zone')} className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-950">Zona utama {sortIcon('zone')}</button></TableHead>
                                            <TableHead><button type="button" onClick={() => changeSort('klb')} className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-950">KLB {sortIcon('klb')}</button></TableHead>
                                            <TableHead><button type="button" onClick={() => changeSort('kdb')} className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-950">KDB {sortIcon('kdb')}</button></TableHead>
                                            <TableHead className="pr-5 sm:pr-6">Keterangan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visibleAreas.map((area) => {
                                            const zone = zoneByCode.get(area.primary_zone);

                                            return (
                                                <TableRow key={area.slug} className="align-top hover:bg-slate-50/70">
                                                    <TableCell className="min-w-52 py-4 pl-5 whitespace-normal sm:pl-6">
                                                        <p className="font-semibold text-slate-900">{area.name}</p>
                                                        <p className="mt-1 text-xs leading-5 text-slate-500">{area.kecamatan}, {area.kota}</p>
                                                    </TableCell>
                                                    <TableCell className="min-w-48 py-4 whitespace-normal">
                                                        <span className="inline-flex rounded-md px-2 py-1 font-mono text-xs font-semibold" style={{ backgroundColor: `${zone?.hex ?? '#2547F9'}18`, color: zone?.hex ?? '#2547F9' }}>{area.primary_zone}</span>
                                                        <p className="mt-1.5 text-xs leading-5 text-slate-600">{zone?.name ?? 'Zona'}</p>
                                                    </TableCell>
                                                    <TableCell className="py-4 font-medium tabular-nums text-slate-800">{area.klb}</TableCell>
                                                    <TableCell className="py-4 font-medium tabular-nums text-slate-800">{area.kdb}</TableCell>
                                                    <TableCell className="min-w-56 py-4 pr-5 whitespace-normal sm:pr-6">
                                                        <p className="max-w-sm text-xs leading-5 text-slate-600">{area.notes || 'Tidak ada catatan tambahan.'}</p>
                                                        {area.secondary_zones.length > 0 && <p className="mt-1.5 text-[11px] leading-4 text-slate-400">Zona sekitar: {area.secondary_zones.join(', ')}</p>}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                    <p className="text-xs text-slate-500">Menampilkan <span className="font-medium text-slate-700">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredAreas.length)}</span> dari {filteredAreas.length} area</p>
                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                        <span className="text-xs tabular-nums text-slate-500">Halaman {page + 1} dari {pageCount}</span>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} aria-label="Halaman sebelumnya"><ChevronLeft aria-hidden="true" />Sebelumnya</Button>
                                            <Button type="button" variant="outline" size="sm" disabled={page + 1 >= pageCount} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} aria-label="Halaman berikutnya">Berikutnya<ChevronRight aria-hidden="true" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="px-6 py-14 text-center">
                                <p className="font-medium text-slate-800">Area tidak ditemukan</p>
                                <p className="mt-2 text-sm text-slate-500">Ubah kata kunci atau pilih kode zona lain.</p>
                            </div>
                        )}
                    </div>

                    <aside className="rounded-2xl border border-slate-200 bg-white px-5 py-5">
                        <div className="border-b border-slate-100 pb-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2547F9]">Panduan singkat</p>
                            <h2 className="mt-2 font-semibold text-slate-900">Arti kode zona</h2>
                        </div>
                        <ul className="divide-y divide-slate-100">
                            {zones.map((zone) => (
                                <li key={zone.code} className="py-4 last:pb-0">
                                    <p className="text-sm font-semibold" style={{ color: zone.hex }}>{zone.code}<span className="px-1.5 text-slate-300">/</span><span className="text-slate-800">{zone.name}</span></p>
                                    <p className="mt-2 text-xs leading-5 text-slate-500">Umumnya: {zone.allowed}</p>
                                    <p className="mt-1 text-xs leading-5 text-slate-400">Terbatas: {zone.restricted}</p>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </section>

                <p className="mx-auto max-w-7xl px-5 pb-10 text-xs leading-5 text-slate-500 sm:px-8">Informasi ini bukan konfirmasi resmi per persil. Cek RDTR/KKPR pada pemerintah daerah sebelum mengambil keputusan lokasi.</p>
            </main>
            <PublicFooter />
        </>
    );
}
