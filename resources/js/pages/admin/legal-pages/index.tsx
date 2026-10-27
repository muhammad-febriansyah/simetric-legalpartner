import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { toast } from "sonner";
import { FileText, Save, ShieldCheck } from "lucide-react";
import { update as updateLegalPage } from "@/actions/App/Http/Controllers/Admin/LegalPageController";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboard } from "@/routes";

type LegalPage = {
    id: number;
    title: string;
    slug: string;
    content: string;
    status: "draft" | "published";
    publishedAt: string | null;
};

export default function LegalPagesIndex({ pages }: { pages: LegalPage[] }) {
    return (
        <>
            <Head title="Halaman Legal" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <PageHeader
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Halaman Legal", href: "/admin/legal-pages" },
                    ]}
                    title="Halaman Legal"
                    description="Kelola kebijakan dan ketentuan yang menjelaskan penggunaan layanan LegalPartner.ID."
                />

                {pages.length > 0 ? (
                    <Tabs defaultValue={pages[0].slug} className="gap-5">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <TabsList aria-label="Dokumen legal" className="max-w-full overflow-x-auto">
                                {pages.map((page) => (
                                    <TabsTrigger key={page.id} value={page.slug}>
                                        {page.title}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {pages.map((page) => (
                            <TabsContent key={page.id} value={page.slug}>
                                <LegalPageEditor page={page} />
                            </TabsContent>
                        ))}
                    </Tabs>
                ) : (
                    <section className="grid justify-items-center gap-3 rounded-2xl border border-border bg-white px-6 py-14 text-center">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                            <FileText className="size-5" />
                        </span>
                        <div>
                            <h2 className="font-semibold text-foreground">Dokumen belum tersedia</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Jalankan seeder LegalPageDemoSeeder untuk mengisi dokumen awal.
                            </p>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

function LegalPageEditor({ page }: { page: LegalPage }) {
    const form = useForm({
        content: page.content,
        status: page.status,
    });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        form.put(updateLegalPage(page.slug).url, {
            preserveScroll: true,
            onSuccess: () => toast.success(`${page.title} berhasil disimpan.`),
            onError: () => toast.error("Dokumen belum tersimpan. Periksa kolom yang ditandai."),
        });
    }

    return (
        <form onSubmit={submit} className="grid gap-5">
            <section className="grid gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                            <ShieldCheck className="size-5" />
                        </span>
                        <div className="grid gap-1">
                            <h2 className="font-semibold tracking-tight text-foreground">{page.title}</h2>
                            <p className="text-sm leading-5 text-muted-foreground">
                                /{page.slug} · Isi dokumen ditulis dalam format Markdown.
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant="secondary"
                        className={
                            form.data.status === "published"
                                ? "w-fit bg-emerald-50 text-emerald-700"
                                : "w-fit bg-slate-100 text-slate-600"
                        }
                    >
                        {form.data.status === "published" ? "Terbit" : "Draft"}
                    </Badge>
                </div>

                <div className="grid gap-2 sm:max-w-xs">
                    <label htmlFor={`status-${page.id}`} className="text-sm font-medium text-foreground">
                        Status dokumen
                    </label>
                    <select
                        id={`status-${page.id}`}
                        value={form.data.status}
                        onChange={(event) =>
                            form.setData("status", event.currentTarget.value as LegalPage["status"])
                        }
                        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Terbit</option>
                    </select>
                    {form.errors.status ? (
                        <p className="text-sm text-destructive">{form.errors.status}</p>
                    ) : null}
                </div>

                <MarkdownEditor
                    id={`content-${page.id}`}
                    name="content"
                    label="Isi dokumen"
                    value={form.data.content}
                    onChange={(value) => form.setData("content", value)}
                    error={form.errors.content}
                    required
                />

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-muted-foreground">
                        {page.publishedAt
                            ? `Terakhir diterbitkan ${formatDate(page.publishedAt)}.`
                            : "Belum pernah diterbitkan."}
                    </p>
                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                    >
                        <Save className="size-4" />
                        {form.processing ? "Menyimpan..." : "Simpan dokumen"}
                    </Button>
                </div>
            </section>
        </form>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(value));
}

LegalPagesIndex.layout = {
    breadcrumbs: [{ title: "Halaman Legal", href: "/admin/legal-pages" }],
};
