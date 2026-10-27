import { useEffect, useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Ellipsis, Handshake, MessageCircle, Search } from "lucide-react";
import { index as applicationsIndex } from "@/actions/App/Http/Controllers/Admin/PartnershipApplicationController";
import { DataTable, dataTableFeatures } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PartnershipApplicationDialog } from "./partnership-application-dialog";

export type PartnershipApplicationData = {
    id: number;
    fullName: string;
    whatsapp: string;
    email: string | null;
    type: string;
    typeLabel: string;
    message: string | null;
    status: string;
    adminNotes: string | null;
    createdAt: string | null;
};

type PaginatedApplications = {
    data: PartnershipApplicationData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type ApplicationFilters = { search: string; status: string; type: string };

const STATUS_LABELS: Record<string, string> = {
    new: "Baru",
    contacted: "Sudah dihubungi",
    in_review: "Ditinjau",
    approved: "Disetujui",
    rejected: "Ditolak",
};

const columnHelper = createColumnHelper<typeof dataTableFeatures, PartnershipApplicationData>();

export default function PartnershipApplicationsIndex({
    applications,
    filters,
    statuses,
    types,
}: {
    applications: PaginatedApplications;
    filters: ApplicationFilters;
    statuses: string[];
    types: Record<string, string>;
}) {
    const [search, setSearch] = useState(filters.search);
    const [selectedApplication, setSelectedApplication] =
        useState<PartnershipApplicationData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => setSearch(filters.search), [filters.search]);

    useEffect(() => {
        const trimmedSearch = search.trim();
        if (trimmedSearch === filters.search.trim()) return;

        const timeout = window.setTimeout(() => {
            router.get(
                applicationsIndex.url(),
                {
                    search: trimmedSearch || undefined,
                    status: filters.status || undefined,
                    type: filters.type || undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [filters.status, filters.type, filters.search, search]);

    function updateFilter(key: "status" | "type", value: string): void {
        router.get(
            applicationsIndex.url(),
            {
                search: search.trim() || undefined,
                status: key === "status" ? value || undefined : filters.status || undefined,
                type: key === "type" ? value || undefined : filters.type || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    function changePage(pageIndex: number): void {
        const link = applications.links.find((item) => item.label === String(pageIndex + 1));
        if (link?.url) router.visit(link.url, { preserveScroll: true, preserveState: true });
    }

    function openApplication(application: PartnershipApplicationData): void {
        setSelectedApplication(application);
        setDialogOpen(true);
    }

    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor("fullName", {
                    header: "Pendaftar",
                    cell: ({ row }) => (
                        <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                                {row.original.fullName}
                            </p>
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                {row.original.whatsapp}
                                {row.original.email ? ` · ${row.original.email}` : ""}
                            </p>
                        </div>
                    ),
                }),
                columnHelper.accessor("typeLabel", {
                    header: "Kategori",
                    cell: ({ getValue }) => (
                        <span className="text-sm text-foreground">{getValue()}</span>
                    ),
                }),
                columnHelper.accessor("createdAt", {
                    header: "Tanggal masuk",
                    cell: ({ getValue }) => (
                        <span className="text-sm text-muted-foreground">
                            {formatDate(getValue())}
                        </span>
                    ),
                }),
                columnHelper.accessor("status", {
                    header: "Status",
                    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
                }),
                columnHelper.display({
                    id: "actions",
                    header: () => <span className="block text-right">Aksi</span>,
                    cell: ({ row }) => (
                        <div className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        aria-label={`Aksi pendaftar ${row.original.fullName}`}
                                    >
                                        <Ellipsis className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem
                                        onSelect={() => openApplication(row.original)}
                                    >
                                        <MessageCircle /> Tindak lanjuti
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ),
                }),
            ]),
        [],
    );

    return (
        <>
            <Head title="Pendaftar mitra" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <PageHeader
                    breadcrumbs={[
                        { title: "Dashboard", href: "/dashboard" },
                        { title: "Pendaftar Mitra", href: applicationsIndex() },
                    ]}
                    title="Pendaftar mitra"
                    description="Tinjau pengajuan kerja sama dan catat tindak lanjut tim partnership."
                />

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-5 border-b border-border px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                <Handshake className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-semibold">Daftar pengajuan</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {applications.total} pendaftar kemitraan.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <div className="relative w-full max-w-md">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Cari nama, WhatsApp, atau email"
                                    aria-label="Cari pendaftar mitra"
                                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                />
                            </div>
                            <select
                                aria-label="Filter status pendaftaran"
                                value={filters.status}
                                onChange={(event) => updateFilter("status", event.target.value)}
                                className="h-10 rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                                <option value="">Semua status</option>
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {STATUS_LABELS[status] ?? status}
                                    </option>
                                ))}
                            </select>
                            <select
                                aria-label="Filter kategori kemitraan"
                                value={filters.type}
                                onChange={(event) => updateFilter("type", event.target.value)}
                                className="h-10 rounded-md border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                                <option value="">Semua kategori</option>
                                {Object.entries(types).map(([slug, label]) => (
                                    <option key={slug} value={slug}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={applications.data}
                        pageIndex={applications.current_page - 1}
                        pageCount={applications.last_page}
                        total={applications.total}
                        from={applications.from}
                        to={applications.to}
                        onPageChange={changePage}
                        emptyMessage="Belum ada pengajuan yang cocok dengan pencarian."
                        itemLabel="pendaftar"
                    />
                </section>
            </div>

            <PartnershipApplicationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                application={selectedApplication}
                statuses={statuses}
                statusLabels={STATUS_LABELS}
            />
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        new: "bg-blue-50 text-blue-700",
        contacted: "bg-violet-50 text-violet-700",
        in_review: "bg-amber-50 text-amber-700",
        approved: "bg-emerald-50 text-emerald-700",
        rejected: "bg-rose-50 text-rose-700",
    };

    return (
        <Badge variant="secondary" className={styles[status] ?? "bg-slate-100 text-slate-600"}>
            {STATUS_LABELS[status] ?? status}
        </Badge>
    );
}

function formatDate(date: string | null): string {
    if (!date) return "—";
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(date),
    );
}
