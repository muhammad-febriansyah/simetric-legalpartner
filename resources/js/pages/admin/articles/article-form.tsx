import { useState } from "react";
import { Form, Head, Link } from "@inertiajs/react";
import { ArrowLeft, FileText, Globe2, Image as ImageIcon, Save } from "lucide-react";
import { toast } from "sonner";
import {
    create as createArticle,
    index as articlesIndex,
    store as storeArticle,
    update as updateArticle,
} from "@/actions/App/Http/Controllers/Admin/ArticleController";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import InputError from "@/components/input-error";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ArticleFormData = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    categoryLabel: string | null;
    coverImage: string | null;
    coverAlt: string | null;
    authorName: string;
    status: "draft" | "published";
    metaTitle: string | null;
    metaDescription: string | null;
};

function slugify(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function ArticleForm({ article = null }: { article?: ArticleFormData | null }) {
    const isEditing = article !== null;
    const [title, setTitle] = useState(article?.title ?? "");
    const [slug, setSlug] = useState(article?.slug ?? "");
    const [content, setContent] = useState(article?.content ?? "");

    function updateTitle(value: string): void {
        setTitle(value);
        setSlug(slugify(value));
    }

    return (
        <>
            <Head title={isEditing ? `Edit ${article.title}` : "Tulis artikel"} />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: "Dashboard", href: "/dashboard" },
                            { title: "Artikel", href: articlesIndex() },
                            {
                                title: isEditing ? "Edit artikel" : "Tulis artikel",
                                href: isEditing
                                    ? updateArticle.url(article.id)
                                    : createArticle.url(),
                            },
                        ]}
                        title={isEditing ? "Edit artikel" : "Tulis artikel"}
                        description={
                            isEditing
                                ? "Perbarui artikel, informasi SEO, dan status publikasi."
                                : "Buat artikel blog dengan isi, gambar, dan metadata SEO."
                        }
                    />
                    <Button asChild variant="outline" className="shrink-0">
                        <Link href={articlesIndex()}>
                            <ArrowLeft className="size-4" />
                            Kembali ke artikel
                        </Link>
                    </Button>
                </div>

                <Form
                    action={isEditing ? updateArticle.url(article.id) : storeArticle.url()}
                    method="post"
                    options={{ preserveScroll: true }}
                    encType="multipart/form-data"
                    className="flex flex-col gap-6"
                    onSuccess={() =>
                        toast.success(
                            isEditing ? "Artikel berhasil diperbarui." : "Artikel berhasil dibuat.",
                        )
                    }
                    onError={(errors) =>
                        toast.error("Artikel belum tersimpan.", {
                            description: Object.values(errors)[0] ?? "Periksa kolom yang ditandai.",
                        })
                    }
                >
                    {({ processing, errors }) => (
                        <>
                            {isEditing && <input type="hidden" name="_method" value="put" />}
                            <section className="grid gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                        <Globe2 className="size-5" />
                                    </span>
                                    <div className="grid gap-1">
                                        <h2 className="font-semibold tracking-tight">
                                            Informasi artikel
                                        </h2>
                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Judul, alamat halaman, kategori, dan ringkasan.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="article_title">
                                            Judul artikel{" "}
                                            <span className="text-destructive" aria-hidden="true">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="article_title"
                                            name="title"
                                            value={title}
                                            onChange={(event) => updateTitle(event.target.value)}
                                            placeholder="Contoh: Panduan Memulai Legalitas Usaha"
                                            required
                                            aria-invalid={Boolean(errors.title)}
                                        />
                                        <InputError message={errors.title} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="article_slug">Slug URL</Label>
                                        <Input
                                            id="article_slug"
                                            name="slug"
                                            value={slug}
                                            onChange={(event) => setSlug(event.target.value)}
                                            placeholder="panduan-legalitas-usaha"
                                            aria-invalid={Boolean(errors.slug)}
                                        />
                                        <InputError message={errors.slug} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="article_category_label">Kategori</Label>
                                        <Input
                                            id="article_category_label"
                                            name="category_label"
                                            defaultValue={article?.categoryLabel ?? ""}
                                            placeholder="Contoh: Panduan Bisnis"
                                            aria-invalid={Boolean(errors.category_label)}
                                        />
                                        <InputError message={errors.category_label} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="article_author_name">
                                            Nama penulis{" "}
                                            <span className="text-destructive" aria-hidden="true">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="article_author_name"
                                            name="author_name"
                                            defaultValue={
                                                article?.authorName ?? "Admin LegalPartner"
                                            }
                                            placeholder="Nama penulis"
                                            required
                                            aria-invalid={Boolean(errors.author_name)}
                                        />
                                        <InputError message={errors.author_name} />
                                    </div>
                                    <div className="grid content-start gap-2 md:col-span-2">
                                        <Label htmlFor="article_excerpt">Ringkasan artikel</Label>
                                        <textarea
                                            id="article_excerpt"
                                            name="excerpt"
                                            defaultValue={article?.excerpt ?? ""}
                                            placeholder="Ringkasan singkat untuk kartu artikel dan hasil pencarian."
                                            rows={3}
                                            aria-invalid={Boolean(errors.excerpt)}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                        />
                                        <InputError message={errors.excerpt} />
                                    </div>
                                </div>
                            </section>

                            <section className="grid gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                        <FileText className="size-5" />
                                    </span>
                                    <div className="grid gap-1">
                                        <h2 className="font-semibold tracking-tight">
                                            Isi artikel
                                        </h2>
                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Gunakan toolbar untuk format teks dan preview hasil
                                            tulisan.
                                        </p>
                                    </div>
                                </div>
                                <MarkdownEditor
                                    id="article_content"
                                    name="content"
                                    label="Konten artikel"
                                    value={content}
                                    onChange={setContent}
                                    error={errors.content}
                                    required
                                />
                            </section>

                            <section className="grid gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                        <ImageIcon className="size-5" />
                                    </span>
                                    <div className="grid gap-1">
                                        <h2 className="font-semibold tracking-tight">
                                            Gambar sampul
                                        </h2>
                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Unggah gambar utama artikel dan teks alternatif.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <ImageUploadField
                                        id="cover_image_file"
                                        name="cover_image_file"
                                        label="Gambar sampul"
                                        hint="PNG, JPG, atau WebP · maks. 3 MB"
                                        currentImage={article?.coverImage ?? null}
                                        error={errors.cover_image_file}
                                    />
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="article_cover_alt">
                                            Teks alternatif gambar
                                        </Label>
                                        <Input
                                            id="article_cover_alt"
                                            name="cover_alt"
                                            defaultValue={article?.coverAlt ?? ""}
                                            placeholder="Jelaskan isi gambar sampul"
                                            aria-invalid={Boolean(errors.cover_alt)}
                                        />
                                        <InputError message={errors.cover_alt} />
                                    </div>
                                </div>
                            </section>

                            <section className="grid gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                        <Globe2 className="size-5" />
                                    </span>
                                    <div className="grid gap-1">
                                        <h2 className="font-semibold tracking-tight">
                                            SEO dan publikasi
                                        </h2>
                                        <p className="text-sm leading-5 text-muted-foreground">
                                            Atur metadata hasil pencarian dan status artikel.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid content-start gap-2 md:col-span-2">
                                        <Label htmlFor="article_meta_title">Judul SEO</Label>
                                        <Input
                                            id="article_meta_title"
                                            name="meta_title"
                                            defaultValue={article?.metaTitle ?? ""}
                                            placeholder="Judul artikel — LegalPartner.ID"
                                            aria-invalid={Boolean(errors.meta_title)}
                                        />
                                        <InputError message={errors.meta_title} />
                                    </div>
                                    <div className="grid content-start gap-2 md:col-span-2">
                                        <Label htmlFor="article_meta_description">
                                            Deskripsi SEO
                                        </Label>
                                        <textarea
                                            id="article_meta_description"
                                            name="meta_description"
                                            defaultValue={article?.metaDescription ?? ""}
                                            placeholder="Ringkasan halaman untuk hasil pencarian."
                                            rows={3}
                                            aria-invalid={Boolean(errors.meta_description)}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                        />
                                        <InputError message={errors.meta_description} />
                                    </div>
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="article_status">
                                            Status artikel{" "}
                                            <span className="text-destructive" aria-hidden="true">
                                                *
                                            </span>
                                        </Label>
                                        <select
                                            id="article_status"
                                            name="status"
                                            defaultValue={article?.status ?? "draft"}
                                            required
                                            aria-invalid={Boolean(errors.status)}
                                            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Terbitkan</option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={articlesIndex()}>Batal</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                                >
                                    <Save className="size-4" />
                                    {processing
                                        ? "Menyimpan…"
                                        : isEditing
                                          ? "Simpan perubahan"
                                          : "Simpan artikel"}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
