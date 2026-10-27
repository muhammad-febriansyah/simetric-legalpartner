import { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import {
    Building2,
    BriefcaseBusiness,
    Copyright,
    Ellipsis,
    FileCheck2,
    FolderTree,
    Landmark,
    Pencil,
    Plus,
    Scale,
    ShieldCheck,
    Trash2,
    type LucideIcon,
} from "lucide-react";
import { index as categoriesIndex } from "@/actions/App/Http/Controllers/Admin/ServiceCategoryController";
import { CategoryDeleteDialog } from "@/pages/admin/categories/category-delete-dialog";
import { CategoryDialog, type CategoryDialogData } from "@/pages/admin/categories/category-dialog";
import { DataTable, dataTableFeatures } from "@/components/data-table";
import { DebouncedSearchInput } from "@/components/admin/debounced-search-input";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PaginatedCategories = {
    data: CategoryDialogData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

const categoryIcons: Record<string, LucideIcon> = {
    building: Building2,
    briefcase: BriefcaseBusiness,
    scale: Scale,
    landmark: Landmark,
    shield: ShieldCheck,
    document: FileCheck2,
    copyright: Copyright,
};

const columnHelper = createColumnHelper<typeof dataTableFeatures, CategoryDialogData>();

export default function AdminCategoriesIndex({
    categories,
    search,
}: {
    categories: PaginatedCategories;
    search: string;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryDialogData | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryDialogData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor("name", {
                    header: "Kategori",
                    cell: ({ row }) => {
                        const Icon = categoryIcons[row.original.icon ?? ""] ?? FolderTree;

                        return (
                            <div className="flex min-w-0 items-start gap-3 whitespace-normal">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2547F9]/[0.08] text-[#2547F9]">
                                    <Icon className="size-4" />
                                </span>
                                <div className="grid min-w-0 gap-1">
                                    <span className="font-medium text-foreground">
                                        {row.original.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        /{row.original.slug}
                                    </span>
                                    {row.original.description && (
                                        <span className="line-clamp-1 text-sm text-muted-foreground">
                                            {row.original.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    },
                }),
                columnHelper.accessor("serviceCount", {
                    header: "Layanan",
                    cell: ({ getValue }) => (
                        <span className="text-sm text-muted-foreground">{getValue()} layanan</span>
                    ),
                }),
                columnHelper.accessor("sortOrder", {
                    header: "Urutan",
                    cell: ({ getValue }) => (
                        <span className="text-sm text-muted-foreground">{getValue()}</span>
                    ),
                }),
                columnHelper.accessor("isActive", {
                    header: "Status",
                    cell: ({ getValue }) => (
                        <Badge
                            variant={getValue() ? "secondary" : "outline"}
                            className={
                                getValue()
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-muted-foreground"
                            }
                        >
                            {getValue() ? "Aktif" : "Nonaktif"}
                        </Badge>
                    ),
                }),
                columnHelper.display({
                    id: "actions",
                    header: () => <span className="block text-right">Aksi</span>,
                    cell: ({ row }) => {
                        const category = row.original;

                        return (
                            <div className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            aria-label={`Aksi kategori ${category.name}`}
                                        >
                                            <Ellipsis className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setEditingCategory(category);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            <Pencil />
                                            Edit kategori
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            disabled={category.serviceCount > 0}
                                            onSelect={() => {
                                                setDeletingCategory(category);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 />
                                            Hapus kategori
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
        const link = categories.links.find((item) => item.label === String(pageIndex + 1));

        if (link?.url) {
            router.visit(link.url, { preserveScroll: true, preserveState: true });
        }
    }

    function openCreateDialog(): void {
        setEditingCategory(null);
        setDialogOpen(true);
    }

    return (
        <>
            <Head title="Kategori layanan" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: "Dashboard", href: "/dashboard" },
                            { title: "Kategori Layanan", href: categoriesIndex() },
                        ]}
                        title="Kategori layanan"
                        description="Atur pengelompokan layanan, urutan tampil, dan status kategori."
                    />
                    <Button
                        type="button"
                        onClick={openCreateDialog}
                        className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                    >
                        <Plus className="size-4" />
                        Tambah kategori
                    </Button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
                        <div>
                            <div className="flex items-center gap-2 font-semibold">
                                <FolderTree className="size-4 text-[#2547F9]" />
                                Daftar kategori
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {categories.total > 0
                                    ? `${categories.total} kategori untuk katalog layanan.`
                                    : "Belum ada kategori layanan."}
                            </p>
                        </div>
                        <DebouncedSearchInput
                            action={categoriesIndex.url()}
                            search={search}
                            placeholder="Cari nama, slug, atau deskripsi"
                            ariaLabel="Cari kategori layanan"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={categories.data}
                        pageIndex={categories.current_page - 1}
                        pageCount={categories.last_page}
                        total={categories.total}
                        from={categories.from}
                        to={categories.to}
                        onPageChange={changePage}
                        emptyMessage="Belum ada kategori. Tambahkan kategori pertama untuk mengelompokkan layanan."
                        itemLabel="kategori"
                    />
                </section>
            </div>

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={editingCategory}
            />
            <CategoryDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                category={deletingCategory}
            />
        </>
    );
}
