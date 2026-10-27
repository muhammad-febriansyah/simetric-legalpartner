import { useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import {
    BriefcaseBusiness,
    CircleHelp,
    Ellipsis,
    ExternalLink,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { index as faqIndex } from "@/actions/App/Http/Controllers/Admin/FaqController";
import {
    index as adminServicesIndex,
    edit as editService,
} from "@/actions/App/Http/Controllers/Admin/ServiceController";
import { show as publicServiceShow } from "@/actions/App/Http/Controllers/Site/ServiceController";
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
import { DebouncedSearchInput } from "@/components/admin/debounced-search-input";
import { FaqDialog, type FaqDialogData, type FaqServiceOption } from "../../faqs/faq-dialog";
import { FaqDeleteDialog } from "../../faqs/faq-delete-dialog";

type ServiceSummary = FaqServiceOption & { slug: string };
type FaqRow = FaqDialogData & { answerPreview: string };
type PaginatedFaqs = {
    data: FaqRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

const columnHelper = createColumnHelper<typeof dataTableFeatures, FaqRow>();

export default function ServiceFaqsIndex({
    service,
    faqs,
    search,
}: {
    service: ServiceSummary;
    faqs: PaginatedFaqs;
    search: string;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqDialogData | null>(null);
    const [deletingFaq, setDeletingFaq] = useState<FaqDialogData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor("question", {
                    header: "Pertanyaan",
                    cell: ({ row }) => (
                        <div className="grid gap-1 whitespace-normal">
                            <span className="font-medium text-foreground">
                                {row.original.question}
                            </span>
                            <span className="line-clamp-2 text-sm text-muted-foreground">
                                {row.original.answerPreview}
                            </span>
                        </div>
                    ),
                }),
                columnHelper.accessor("sortOrder", {
                    header: "Urutan",
                    cell: ({ getValue }) => getValue(),
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
                        const faq = row.original;

                        return (
                            <div className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            aria-label={`Aksi FAQ ${faq.question}`}
                                        >
                                            <Ellipsis className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        {faq.isActive && (
                                            <DropdownMenuItem asChild>
                                                <a
                                                    href={publicServiceShow.url(service.slug)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <ExternalLink />
                                                    Preview layanan
                                                </a>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setEditingFaq(faq);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            <Pencil />
                                            Edit FAQ
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onSelect={() => {
                                                setDeletingFaq(faq);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 />
                                            Hapus FAQ
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        );
                    },
                }),
            ]),
        [service.id, service.slug],
    );

    function changePage(pageIndex: number): void {
        const link = faqs.links.find((item) => item.label === String(pageIndex + 1));

        if (link?.url) {
            router.visit(link.url, { preserveScroll: true, preserveState: true });
        }
    }

    function openCreateDialog(): void {
        setEditingFaq(null);
        setDialogOpen(true);
    }

    return (
        <>
            <Head title={`FAQ ${service.name}`} />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: "Dashboard", href: "/dashboard" },
                            { title: "Layanan", href: adminServicesIndex() },
                            { title: service.name, href: editService(service.id) },
                            { title: "FAQ", href: faqIndex({ service: service.id }) },
                        ]}
                        title="FAQ layanan"
                        description={`Kelola pertanyaan dan jawaban untuk ${service.name}.`}
                    />
                    <Button
                        type="button"
                        onClick={openCreateDialog}
                        className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                    >
                        <Plus className="size-4" />
                        Tambah FAQ
                    </Button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
                        <div>
                            <div className="flex items-center gap-2 font-semibold">
                                <CircleHelp className="size-4 text-[#2547F9]" />
                                Daftar FAQ
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {faqs.total > 0
                                    ? `${faqs.total} pertanyaan untuk ${service.name}.`
                                    : "Belum ada FAQ pada layanan ini."}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <DebouncedSearchInput
                                action={faqIndex.url({ service: service.id })}
                                search={search}
                                placeholder="Cari pertanyaan atau jawaban"
                                ariaLabel="Cari FAQ"
                            />
                            <Button asChild variant="outline">
                                <Link href={adminServicesIndex()}>
                                    <BriefcaseBusiness className="size-4" />
                                    Kembali ke layanan
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={faqs.data}
                        pageIndex={faqs.current_page - 1}
                        pageCount={faqs.last_page}
                        total={faqs.total}
                        from={faqs.from}
                        to={faqs.to}
                        onPageChange={changePage}
                        emptyMessage="Belum ada FAQ. Tambahkan jawaban pertama untuk layanan ini."
                    />
                </section>
            </div>
            <FaqDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                services={[service]}
                serviceId={service.id}
                faq={editingFaq}
            />
            <FaqDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                faq={deletingFaq}
            />
        </>
    );
}
