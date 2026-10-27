import { Form, Head, Link } from '@inertiajs/react';
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Ellipsis, ExternalLink, ListTree, Pencil, Plus, Search } from 'lucide-react';
import { index as adminServicesIndex, create as createService, edit as editService } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { index as packagesIndex } from '@/actions/App/Http/Controllers/Admin/ServicePackageController';
import { show as publicServiceShow } from '@/actions/App/Http/Controllers/Site/ServiceController';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { paginationDirection } from '@/lib/pagination';

type AdminService = {
    id: number;
    name: string;
    slug: string;
    category: string;
    isActive: boolean;
    isFeatured: boolean;
};

type ServiceCategory = { id: number; name: string };

type PaginatedServices = {
    data: AdminService[];
    links: { url: string | null; label: string; active: boolean }[];
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type ServiceFilters = { search: string; categoryId: string; status: string };

export default function AdminServicesIndex({
    services,
    categories,
    filters,
}: {
    services: PaginatedServices;
    categories: ServiceCategory[];
    filters: ServiceFilters;
}) {
    return (
        <>
            <Head title="Kelola layanan" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: 'Dashboard', href: '/dashboard' },
                            { title: 'Layanan', href: adminServicesIndex() },
                        ]}
                        title="Kelola layanan"
                        description="Atur informasi dan publikasi layanan LegalPartner.ID."
                    />
                    <Button asChild className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]">
                        <Link href={createService()}>
                            <Plus className="size-4" />
                            Tambah layanan
                        </Link>
                    </Button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-5 border-b border-border px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-2 font-semibold">
                            <BriefcaseBusiness className="size-4 text-[#2547F9]" />
                            Daftar layanan
                        </div>
                        <Form action={adminServicesIndex.url()} method="get" className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_minmax(170px,0.55fr)_minmax(160px,0.5fr)_auto] md:items-end">
                            <div className="grid gap-2">
                                <Label htmlFor="search">Cari layanan</Label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="search" name="search" type="search" defaultValue={filters.search} placeholder="Nama layanan atau slug" className="pl-9" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Kategori</Label>
                                <select id="category_id" name="category_id" defaultValue={filters.categoryId} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
                                    <option value="">Semua kategori</option>
                                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status tayang</Label>
                                <select id="status" name="status" defaultValue={filters.status} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50">
                                    <option value="">Semua status</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                </select>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button type="submit" className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]">
                                    <Search className="size-4" />
                                    Cari
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={adminServicesIndex()}>Reset</Link>
                                </Button>
                            </div>
                        </Form>
                    </div>

                    {services.data.length > 0 ? (
                        <Table className="min-w-[760px]">
                            <TableHeader className="bg-[#F7F8FD] text-xs uppercase tracking-wide">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="px-5 sm:px-6">Layanan</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="px-5 text-right sm:px-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services.data.map((service) => (
                                        <TableRow key={service.id} className="hover:bg-[#F7F8FD]/70">
                                            <TableCell className="px-5 py-4 sm:px-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-foreground">{service.name}</span>
                                                    <span className="text-xs text-muted-foreground">/layanan/{service.slug}</span>
                                                    {service.isFeatured && <Badge variant="secondary" className="mt-1 w-fit bg-[#2547F9]/[0.08] text-[#2547F9]">Unggulan</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{service.category}</TableCell>
                                            <TableCell>
                                                <Badge variant={service.isActive ? 'secondary' : 'outline'} className={service.isActive ? 'bg-emerald-50 text-emerald-700' : 'text-muted-foreground'}>
                                                    {service.isActive ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-5 text-right sm:px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8" aria-label={`Aksi layanan ${service.name}`}>
                                                            <Ellipsis className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={editService(service.id)}><Pencil />Edit layanan</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={packagesIndex({ service: service.id })}><ListTree />Kelola paket</Link>
                                                        </DropdownMenuItem>
                                                        {service.isActive && (
                                                            <DropdownMenuItem asChild>
                                                                <a href={publicServiceShow.url(service.slug)} target="_blank" rel="noreferrer"><ExternalLink />Preview publik</a>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#2547F9]/[0.08] text-[#2547F9]"><BriefcaseBusiness className="size-5" /></span>
                            <div className="grid gap-1">
                                <p className="font-medium">Layanan tidak ditemukan</p>
                                <p className="text-sm text-muted-foreground">Ubah kata kunci atau filter, atau buat layanan baru.</p>
                            </div>
                            <Button asChild variant="outline"><Link href={createService()}>Tambah layanan</Link></Button>
                        </div>
                    )}

                    {services.total > 0 && (
                        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {services.from}–{services.to} dari {services.total} layanan
                            </p>
                            {services.last_page > 1 && (
                                <nav aria-label="Navigasi halaman layanan" className="flex items-center justify-end gap-2">
                                    {services.links.map((link, index) => {
                                        const direction = paginationDirection(link.label);
                                        const isPrevious = direction === 'previous';
                                        const isNext = direction === 'next';
                                        const isNumber = /^\d+$/.test(link.label);

                                        if (!isPrevious && !isNext && !isNumber) {
                                            return null;
                                        }

                                        return (
                                            <Link
                                                key={`${link.label}-${index}`}
                                                href={link.url ?? adminServicesIndex.url()}
                                                preserveScroll
                                                aria-current={link.active ? 'page' : undefined}
                                                aria-disabled={!link.url}
                                                aria-label={isPrevious ? 'Halaman sebelumnya' : isNext ? 'Halaman berikutnya' : `Halaman ${link.label}`}
                                                className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border px-3 py-2 text-sm transition ${link.active ? 'border-[#2547F9] bg-[#2547F9] text-white' : 'border-border hover:bg-[#F7F8FD]'} ${link.url ? '' : 'pointer-events-none opacity-40'}`}
                                            >
                                                {isPrevious ? <><ChevronLeft className="size-4" /><span className="sr-only">Sebelumnya</span></> : isNext ? <><span className="sr-only">Berikutnya</span><ChevronRight className="size-4" /></> : link.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
