import { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Ellipsis, Handshake, Pencil, Plus, Trash2 } from "lucide-react";
import { index as partnersIndex } from "@/actions/App/Http/Controllers/Admin/PartnerController";
import { DataTable, dataTableFeatures } from "@/components/data-table";
import { DebouncedSearchInput } from "@/components/admin/debounced-search-input";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PartnerDeleteDialog } from "./partner-delete-dialog";
import { PartnerDialog, type PartnerData } from "./partner-dialog";

type PaginatedPartners = {
    data: PartnerData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

const columnHelper = createColumnHelper<typeof dataTableFeatures, PartnerData>();

export default function AdminPartnersIndex({
    partners,
    search,
}: {
    partners: PaginatedPartners;
    search: string;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<PartnerData | null>(null);
    const [deletingPartner, setDeletingPartner] = useState<PartnerData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor("name", {
                    header: "Partner",
                    cell: ({ row }) => (
                        <div className="flex min-w-0 items-center gap-4 whitespace-normal">
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-2">
                                <img
                                    src={row.original.imageUrl}
                                    alt={`Logo ${row.original.name}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                            <span className="font-medium text-foreground">{row.original.name}</span>
                        </div>
                    ),
                }),
                columnHelper.display({
                    id: "actions",
                    header: () => <span className="block text-right">Aksi</span>,
                    cell: ({ row }) => {
                        const partner = row.original;

                        return (
                            <div className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            aria-label={`Aksi partner ${partner.name}`}
                                        >
                                            <Ellipsis className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setEditingPartner(partner);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            <Pencil />
                                            Edit partner
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onSelect={() => {
                                                setDeletingPartner(partner);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 />
                                            Hapus partner
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        );
                    },
                }),
            ]),
        [],
    );

    function changePage(pageIndex: number): void {
        const link = partners.links.find((item) => item.label === String(pageIndex + 1));

        if (link?.url) {
            router.visit(link.url, { preserveScroll: true, preserveState: true });
        }
    }

    function openCreateDialog(): void {
        setEditingPartner(null);
        setDialogOpen(true);
    }

    return (
        <>
            <Head title="Partner" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: "Dashboard", href: "/dashboard" },
                            { title: "Partner", href: partnersIndex() },
                        ]}
                        title="Partner"
                        description="Kelola logo partner yang ditampilkan pada website."
                    />
                    <Button
                        type="button"
                        onClick={openCreateDialog}
                        className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                    >
                        <Plus className="size-4" />
                        Tambah partner
                    </Button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
                        <div>
                            <div className="flex items-center gap-2 font-semibold">
                                <Handshake className="size-4 text-[#2547F9]" />
                                Daftar partner
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {partners.total > 0
                                    ? `${partners.total} partner terdaftar.`
                                    : "Belum ada partner."}
                            </p>
                        </div>
                        <DebouncedSearchInput
                            action={partnersIndex.url()}
                            search={search}
                            placeholder="Cari nama partner"
                            ariaLabel="Cari partner"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={partners.data}
                        pageIndex={partners.current_page - 1}
                        pageCount={partners.last_page}
                        total={partners.total}
                        from={partners.from}
                        to={partners.to}
                        onPageChange={changePage}
                        emptyMessage="Belum ada partner yang cocok dengan pencarian."
                        itemLabel="partner"
                    />
                </section>
            </div>

            <PartnerDialog
                key={`${dialogOpen}-${editingPartner?.id ?? "new"}`}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                partner={editingPartner}
            />
            <PartnerDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                partner={deletingPartner}
            />
        </>
    );
}
