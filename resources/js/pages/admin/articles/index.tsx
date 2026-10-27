import { useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Ellipsis, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import {
    create as createArticle,
    edit as editArticle,
    index as articlesIndex,
} from "@/actions/App/Http/Controllers/Admin/ArticleController";
import { DebouncedSearchInput } from "@/components/admin/debounced-search-input";
import { DataTable, dataTableFeatures } from "@/components/data-table";
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
import { ArticleDeleteDialog } from "./article-delete-dialog";

type ArticleRow = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    categoryLabel: string | null;
    authorName: string;
    status: "draft" | "published";
    publishedAt: string | null;
    updatedAt: string;
    coverImage: string | null;
};
type PaginatedArticles = {
    data: ArticleRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

const columnHelper = createColumnHelper<typeof dataTableFeatures, ArticleRow>();

function formatDate(date: string | null): string {
    if (!date) {
        return "—";
    }

    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(date));
}

export default function AdminArticlesIndex({
    articles,
    search,
}: {
    articles: PaginatedArticles;
    search: string;
}) {
    const [deletingArticle, setDeletingArticle] = useState<ArticleRow | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor("title", {
                    header: "Artikel",
                    cell: ({ row }) => (
                        <div className="grid min-w-52 gap-1 whitespace-normal">
                            <Link
                                href={editArticle(row.original.id)}
                                className="font-medium text-foreground hover:text-[#2547F9]"
                            >
                                {row.original.title}
                            </Link>
                            <span className="line-clamp-2 text-sm text-muted-foreground">
                                {row.original.excerpt || `/${row.original.slug}`}
                            </span>
                        </div>
                    ),
                }),
                columnHelper.accessor((row) => row.categoryLabel ?? "Tanpa kategori", {
                    id: "category",
                    header: "Kategori",
                    cell: ({ getValue }) => (
                        <span className="text-sm text-muted-foreground">{getValue()}</span>
                    ),
                }),
                columnHelper.accessor("authorName", {
                    header: "Penulis",
                    cell: ({ getValue }) => (
                        <span className="whitespace-nowrap text-sm">{getValue()}</span>
                    ),
                }),
                columnHelper.accessor("status", {
                    header: "Status",
                    cell: ({ getValue, row }) => (
                        <div className="grid justify-items-start gap-1">
                            <Badge
                                variant="secondary"
                                className={
                                    getValue() === "published"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-600"
                                }
                            >
                                {getValue() === "published" ? "Terbit" : "Draft"}
                            </Badge>
                            {getValue() === "published" && (
                                <span className="whitespace-nowrap text-xs text-muted-foreground">
                                    {formatDate(row.original.publishedAt)}
                                </span>
                            )}
                        </div>
                    ),
                }),
                columnHelper.display({
                    id: "actions",
                    header: () => <span className="block text-right">Aksi</span>,
                    cell: ({ row }) => {
                        const article = row.original;

                        return (
                            <div className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            aria-label={`Aksi artikel ${article.title}`}
                                        >
                                            <Ellipsis className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem asChild>
                                            <Link href={editArticle(article.id)}>
                                                <Pencil />
                                                Edit artikel
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onSelect={() => {
                                                setDeletingArticle(article);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 />
                                            Hapus artikel
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
        const link = articles.links.find((item) => item.label === String(pageIndex + 1));

        if (link?.url) {
            router.visit(link.url, { preserveScroll: true, preserveState: true });
        }
    }

    return (
        <>
            <Head title="Artikel" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: "Dashboard", href: "/dashboard" },
                            { title: "Artikel", href: articlesIndex() },
                        ]}
                        title="Manajemen artikel"
                        description="Kelola konten blog, gambar sampul, metadata SEO, dan publikasi."
                    />
                    <Button asChild className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]">
                        <Link href={createArticle()}>
                            <Plus className="size-4" />
                            Tulis artikel
                        </Link>
                    </Button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
                        <div>
                            <div className="flex items-center gap-2 font-semibold">
                                <FileText className="size-4 text-[#2547F9]" />
                                Semua artikel
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {articles.total > 0
                                    ? `${articles.total} artikel tersimpan.`
                                    : "Belum ada artikel. Tulis artikel pertama untuk mulai mengisi blog."}
                            </p>
                        </div>
                        <DebouncedSearchInput
                            action={articlesIndex.url()}
                            search={search}
                            placeholder="Cari judul, ringkasan, atau kategori"
                            ariaLabel="Cari artikel"
                        />
                    </div>
                    <DataTable
                        columns={columns}
                        data={articles.data}
                        pageIndex={articles.current_page - 1}
                        pageCount={articles.last_page}
                        total={articles.total}
                        from={articles.from}
                        to={articles.to}
                        onPageChange={changePage}
                        itemLabel="artikel"
                        emptyMessage="Artikel tidak ditemukan. Ubah kata kunci atau tulis artikel baru."
                    />
                </section>
            </div>
            <ArticleDeleteDialog
                article={deletingArticle}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            />
        </>
    );
}
