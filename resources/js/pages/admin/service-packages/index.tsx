import { Form, Head, Link } from '@inertiajs/react';
import { BriefcaseBusiness, ChevronLeft, ChevronRight, Ellipsis, ListTree, PackageCheck, Pencil, Search, Trash2 } from 'lucide-react';
import { index as adminServicesIndex, edit as editService } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { all as allPackages, destroy as destroyPackage, edit as editPackage, index as packagesForService } from '@/actions/App/Http/Controllers/Admin/ServicePackageController';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { paginationDirection } from '@/lib/pagination';

type ServiceSummary = { id: number; name: string; slug: string };
type ServicePackageRow = {
    id: number;
    name: string;
    slug: string;
    price: number | null;
    priceLabel: string | null;
    isPopular: boolean;
    isActive: boolean;
    service: ServiceSummary;
};
type PaginatedPackages = {
    data: ServicePackageRow[];
    links: { url: string | null; label: string; active: boolean }[];
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

export default function ServicePackagesIndex({ packages, search }: { packages: PaginatedPackages; search: string }) {
    return (
        <>
            <Head title="Paket harga" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: 'Dashboard', href: '/dashboard' },
                            { title: 'Layanan', href: adminServicesIndex() },
                            { title: 'Paket harga', href: allPackages() },
                        ]}
                        title="Paket harga"
                        description="Lihat paket dari semua layanan dan buka layanan terkait untuk mengelolanya."
                    />
                    <Button asChild className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]">
                        <Link href={adminServicesIndex()}><BriefcaseBusiness className="size-4" />Pilih layanan</Link>
                    </Button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
                        <div>
                            <div className="flex items-center gap-2 font-semibold"><PackageCheck className="size-4 text-[#2547F9]" />Semua paket</div>
                            <p className="mt-1 text-sm text-muted-foreground">{packages.total > 0 ? `${packages.total} paket dari seluruh layanan.` : 'Belum ada paket harga.'}</p>
                        </div>
                        <Form action={allPackages.url()} method="get" className="flex w-full max-w-md gap-2">
                            <div className="relative min-w-0 flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input name="search" type="search" defaultValue={search} placeholder="Cari paket atau layanan" className="pl-9" aria-label="Cari paket atau layanan" />
                            </div>
                            <Button type="submit" variant="outline">Cari</Button>
                            {search && <Button asChild variant="ghost"><Link href={allPackages()}>Reset</Link></Button>}
                        </Form>
                    </div>

                    {packages.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table className="min-w-[760px]">
                                <TableHeader className="bg-[#F7F8FD] text-xs uppercase tracking-wide">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="px-5 sm:px-6">Nama paket</TableHead>
                                        <TableHead>Layanan</TableHead>
                                        <TableHead>Harga</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="px-5 text-right sm:px-6">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {packages.data.map((servicePackage) => (
                                        <TableRow key={servicePackage.id} className="hover:bg-[#F7F8FD]/70">
                                            <TableCell className="px-5 py-4 sm:px-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-foreground">{servicePackage.name}</span>
                                                    <span className="text-xs text-muted-foreground">{servicePackage.slug}</span>
                                                    {servicePackage.isPopular && <Badge variant="secondary" className="mt-1 w-fit bg-[#2547F9]/[0.08] text-[#2547F9]">Populer</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={editService(servicePackage.service.id)} className="font-medium text-foreground hover:text-[#2547F9]">{servicePackage.service.name}</Link>
                                            </TableCell>
                                            <TableCell className="font-medium">{servicePackage.priceLabel ?? (servicePackage.price === null ? 'Konsultasikan' : formatPrice(servicePackage.price))}</TableCell>
                                            <TableCell><Badge variant={servicePackage.isActive ? 'secondary' : 'outline'} className={servicePackage.isActive ? 'bg-emerald-50 text-emerald-700' : 'text-muted-foreground'}>{servicePackage.isActive ? 'Aktif' : 'Nonaktif'}</Badge></TableCell>
                                            <TableCell className="px-5 text-right sm:px-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="size-8" aria-label={`Aksi paket ${servicePackage.name}`}>
                                                            <Ellipsis className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={packagesForService({ service: servicePackage.service.id })}><ListTree />Kelola paket layanan</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={editPackage({ service: servicePackage.service.id, package: servicePackage.slug })}><Pencil />Edit paket</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem asChild variant="destructive">
                                                            <Link
                                                                href={destroyPackage({ service: servicePackage.service.id, package: servicePackage.slug })}
                                                                method="delete"
                                                                as="button"
                                                                onClick={(event) => {
                                                                    if (!window.confirm(`Hapus paket “${servicePackage.name}”?`)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            ><Trash2 />Hapus paket</Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#2547F9]/[0.08] text-[#2547F9]"><PackageCheck className="size-5" /></span>
                            <div className="grid gap-1"><p className="font-medium">Paket belum tersedia</p><p className="text-sm text-muted-foreground">Buka layanan untuk mulai membuat paket harga.</p></div>
                            <Button asChild variant="outline"><Link href={adminServicesIndex()}>Lihat layanan</Link></Button>
                        </div>
                    )}

                    {packages.total > 0 && (
                        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-sm text-muted-foreground">Menampilkan {packages.from}–{packages.to} dari {packages.total} paket</p>
                            {packages.last_page > 1 && (
                                <nav aria-label="Navigasi halaman paket" className="flex items-center justify-end gap-2">
                                    {packages.links.map((link, index) => {
                                        const direction = paginationDirection(link.label);
                                        const isPrevious = direction === 'previous';
                                        const isNext = direction === 'next';
                                        const isNumber = /^\d+$/.test(link.label);
                                        if (!isPrevious && !isNext && !isNumber) return null;

                                        return (
                                            <Link
                                                key={`${link.label}-${index}`}
                                                href={link.url ?? allPackages.url()}
                                                preserveScroll
                                                aria-current={link.active ? 'page' : undefined}
                                                aria-disabled={!link.url}
                                                aria-label={isPrevious ? 'Halaman sebelumnya' : isNext ? 'Halaman berikutnya' : `Halaman ${link.label}`}
                                                className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border px-3 py-2 text-sm transition ${link.active ? 'border-[#2547F9] bg-[#2547F9] text-white' : 'border-border hover:bg-[#F7F8FD]'} ${link.url ? '' : 'pointer-events-none opacity-40'}`}
                                            >
                                                {isPrevious ? <ChevronLeft className="size-4" /> : isNext ? <ChevronRight className="size-4" /> : link.label}
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
