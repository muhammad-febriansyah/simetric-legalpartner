import { Form, Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Ellipsis, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { create as createAddon, destroy as destroyAddon, edit as editAddon, index as addonsIndex } from '@/actions/App/Http/Controllers/Admin/ServiceAddonController';
import { index as adminServicesIndex } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Service = { id: number; name: string; slug: string };
type Addon = { id: number; name: string; description: string | null; price: number; isActive: boolean; sortOrder: number };
type PaginatedAddons = { data: Addon[]; links: { url: string | null; label: string; active: boolean }[]; last_page: number; from: number | null; to: number | null; total: number };
const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

export default function ServiceAddonsIndex({ service, addons, search }: { service: Service; addons: PaginatedAddons; search: string }) {
    function deleteAddon(addon: Addon) {
        if (window.confirm(`Hapus add-on “${addon.name}”?`)) {
            router.delete(destroyAddon.url({ service: service.id, addon: addon.id }), { preserveScroll: true });
        }
    }

    return <>
        <Head title={`Paket Add-on ${service.name}`} />
        <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <PageHeader breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Layanan', href: adminServicesIndex() }, { title: service.name, href: adminServicesIndex() }, { title: 'Paket Add-on', href: addonsIndex({ service: service.id }) }]} title="Paket Add-on" description={`Kelola add-on untuk layanan ${service.name}.`} />
                <Button asChild className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]"><Link href={createAddon({ service: service.id })}><Plus className="size-4" />Tambah add-on</Link></Button>
            </div>
            <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
                    <div><div className="font-semibold">Daftar Paket Add-on</div><p className="mt-1 text-sm text-muted-foreground">{addons.total} add-on untuk {service.name}.</p></div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Form action={addonsIndex.url({ service: service.id })} method="get" className="flex w-full max-w-md gap-2"><div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input name="search" type="search" defaultValue={search} placeholder="Cari nama add-on" className="pl-9" aria-label="Cari add-on" /></div><Button type="submit" variant="outline">Cari</Button>{search && <Button asChild variant="ghost"><Link href={addonsIndex({ service: service.id })}>Reset</Link></Button>}</Form>
                        <Button asChild variant="outline"><Link href={adminServicesIndex()}><ArrowLeft className="size-4" />Kembali ke layanan</Link></Button>
                    </div>
                </div>
                {addons.data.length ? <Table className="min-w-[680px]"><TableHeader className="bg-[#F7F8FD] text-xs uppercase tracking-wide"><TableRow className="hover:bg-transparent"><TableHead className="px-5 sm:px-6">Nama add-on</TableHead><TableHead>Harga</TableHead><TableHead>Status</TableHead><TableHead className="px-5 text-right sm:px-6">Aksi</TableHead></TableRow></TableHeader><TableBody>{addons.data.map((addon) => <TableRow key={addon.id}><TableCell className="px-5 py-4 sm:px-6"><div className="font-medium">{addon.name}</div>{addon.description && <div className="mt-1 max-w-xl text-sm text-muted-foreground">{addon.description}</div>}</TableCell><TableCell className="font-medium">{formatPrice(addon.price)}</TableCell><TableCell><Badge variant={addon.isActive ? 'secondary' : 'outline'} className={addon.isActive ? 'bg-emerald-50 text-emerald-700' : 'text-muted-foreground'}>{addon.isActive ? 'Aktif' : 'Nonaktif'}</Badge></TableCell><TableCell className="px-5 text-right sm:px-6"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Aksi ${addon.name}`}><Ellipsis className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href={editAddon({ service: service.id, addon: addon.id })}><Pencil />Edit add-on</Link></DropdownMenuItem><DropdownMenuItem variant="destructive" onSelect={() => deleteAddon(addon)}><Trash2 />Hapus add-on</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table> : <div className="px-6 py-12 text-center text-sm text-muted-foreground">{search ? 'Add-on tidak ditemukan.' : 'Belum ada add-on. Tambahkan add-on pertama untuk layanan ini.'}</div>}
                {addons.last_page > 1 && <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 text-sm"><span className="text-muted-foreground">Menampilkan {addons.from}–{addons.to} dari {addons.total}</span><div className="flex gap-2">{addons.links.filter((link) => link.label.includes('Previous') || link.label.includes('Next') || link.label.includes('Sebelumnya') || link.label.includes('Berikutnya')).map((link) => <Button key={link.label} asChild variant="outline" size="sm" disabled={!link.url}><Link href={link.url ?? '#'}>{link.label.replace('&laquo; ', '').replace(' &raquo;', '')}</Link></Button>)}</div></div>}
            </section>
        </div>
    </>;
}
