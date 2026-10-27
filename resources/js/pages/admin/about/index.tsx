import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Building2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    edit as editAboutPage,
    update as updateAboutPage,
} from "@/actions/App/Http/Controllers/Admin/AboutPageController";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import InputError from "@/components/input-error";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboard } from "@/routes";

type AboutPageData = {
    title: string;
    subtitle: string;
    content: string;
    bannerImageUrl: string | null;
    vision: string;
    mission: string;
    process: string;
    features: string;
    status: "draft" | "published";
    publishedAt: string | null;
};

export default function AboutPageEditor({ aboutPage }: { aboutPage: AboutPageData }) {
    const [activeTab, setActiveTab] = useState("general");
    const form = useForm({
        title: aboutPage.title,
        subtitle: aboutPage.subtitle,
        content: aboutPage.content,
        banner_image: null as File | null,
        vision: aboutPage.vision,
        mission: aboutPage.mission,
        process: aboutPage.process,
        features: aboutPage.features,
        status: aboutPage.status,
    });

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        form.transform((data) => ({ ...data, _method: "put" }));
        form.post(updateAboutPage().url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => toast.success("Halaman Tentang Kami berhasil disimpan."),
            onError: (errors) => {
                const fieldNames = Object.keys(errors);
                const firstInvalidTab = [
                    { value: "general", fields: ["title", "subtitle", "content", "banner_image", "status"] },
                    { value: "vision-mission", fields: ["vision", "mission"] },
                    { value: "process", fields: ["process"] },
                    { value: "features", fields: ["features"] },
                ].find((tab) => tab.fields.some((field) => fieldNames.includes(field)));

                if (firstInvalidTab) {
                    setActiveTab(firstInvalidTab.value);
                }

                toast.error("Perubahan belum tersimpan. Periksa kolom yang ditandai.");
            },
        });
    }

    return (
        <>
            <Head title="Tentang Kami" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <PageHeader
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Tentang Kami", href: editAboutPage() },
                    ]}
                    title="Tentang Kami"
                    description="Kelola profil LegalPartner.ID yang ditampilkan kepada pengunjung website."
                />

                <form onSubmit={submit} className="grid gap-5">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value ?? "general")} className="gap-5">
                        <TabsList aria-label="Bagian Tentang Kami" className="h-11 max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                            <TabsTrigger value="general">Umum</TabsTrigger>
                            <TabsTrigger value="vision-mission">Visi &amp; Misi</TabsTrigger>
                            <TabsTrigger value="process">Bagaimana Kami Bekerja</TabsTrigger>
                            <TabsTrigger value="features">Fitur Unggulan</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" keepMounted={false}>
                            <section className="grid gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                            <Building2 className="size-5" />
                                        </span>
                                        <div className="grid gap-1">
                                            <h2 className="font-semibold tracking-tight text-foreground">Konten halaman</h2>
                                            <p className="text-sm leading-5 text-muted-foreground">Banner, judul, ringkasan, dan profil LegalPartner.ID.</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={form.data.status === "published" ? "w-fit bg-emerald-50 text-emerald-700" : "w-fit bg-slate-100 text-slate-600"}
                                    >
                                        {form.data.status === "published" ? "Terbit" : "Draft"}
                                    </Badge>
                                </div>

                                <div className="max-w-xl">
                                    <ImageUploadField
                                        id="about-banner-image"
                                        name="banner_image"
                                        label="Gambar banner"
                                        hint="JPG, PNG, atau WebP · maks. 5 MB. Gambar lebar disarankan."
                                        currentImage={aboutPage.bannerImageUrl}
                                        error={form.errors.banner_image}
                                        onFileChange={(file) => form.setData("banner_image", file)}
                                    />
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="about-title">Judul halaman <span className="text-rose-500">*</span></Label>
                                        <Input
                                            id="about-title"
                                            value={form.data.title}
                                            onChange={(event) => form.setData("title", event.currentTarget.value)}
                                            placeholder="Contoh: Partner Legalitas untuk Pertumbuhan Usaha"
                                            required
                                            className="h-11 rounded-xl border-slate-200 bg-white shadow-none focus-visible:border-[#2547F9]/40 focus-visible:ring-[#2547F9]/15"
                                        />
                                        <InputError message={form.errors.title} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="about-status">Status halaman <span className="text-rose-500">*</span></Label>
                                        <select
                                            id="about-status"
                                            value={form.data.status}
                                            onChange={(event) => form.setData("status", event.currentTarget.value as AboutPageData["status"])}
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-foreground outline-none transition focus-visible:border-[#2547F9]/40 focus-visible:ring-2 focus-visible:ring-[#2547F9]/15"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Terbit</option>
                                        </select>
                                        {form.errors.status ? <InputError message={form.errors.status} /> : null}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="about-subtitle">Ringkasan <span className="text-rose-500">*</span></Label>
                                    <textarea
                                        id="about-subtitle"
                                        value={form.data.subtitle}
                                        onChange={(event) => form.setData("subtitle", event.currentTarget.value)}
                                        placeholder="Tulis pengenalan singkat perusahaan untuk bagian atas halaman."
                                        required
                                        rows={3}
                                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus-visible:border-[#2547F9]/40 focus-visible:ring-2 focus-visible:ring-[#2547F9]/15"
                                    />
                                    <InputError message={form.errors.subtitle} />
                                </div>

                                <MarkdownEditor
                                    id="about-content"
                                    name="content"
                                    label="Deskripsi Tentang Kami"
                                    value={form.data.content}
                                    onChange={(value) => form.setData("content", value)}
                                    error={form.errors.content}
                                    required
                                    placeholder="Tulis profil LegalPartner.ID."
                                />
                            </section>
                        </TabsContent>

                        <TabsContent value="vision-mission" keepMounted={false}>
                            <section className="grid gap-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <MarkdownEditor
                                    id="about-vision"
                                    name="vision"
                                    label="Visi"
                                    value={form.data.vision}
                                    onChange={(value) => form.setData("vision", value)}
                                    error={form.errors.vision}
                                    required
                                    placeholder="Tulis visi LegalPartner.ID."
                                />
                                <MarkdownEditor
                                    id="about-mission"
                                    name="mission"
                                    label="Misi"
                                    value={form.data.mission}
                                    onChange={(value) => form.setData("mission", value)}
                                    error={form.errors.mission}
                                    required
                                    placeholder="Tulis misi LegalPartner.ID."
                                />
                            </section>
                        </TabsContent>

                        <TabsContent value="process" keepMounted={false}>
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <MarkdownEditor
                                    id="about-process"
                                    name="process"
                                    label="Bagaimana Kami Bekerja"
                                    value={form.data.process}
                                    onChange={(value) => form.setData("process", value)}
                                    error={form.errors.process}
                                    required
                                    placeholder="Tulis tahapan pendampingan dari konsultasi sampai serah terima."
                                />
                            </section>
                        </TabsContent>

                        <TabsContent value="features" keepMounted={false}>
                            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                <MarkdownEditor
                                    id="about-features"
                                    name="features"
                                    label="Fitur Unggulan"
                                    value={form.data.features}
                                    onChange={(value) => form.setData("features", value)}
                                    error={form.errors.features}
                                    required
                                    placeholder="Tulis keunggulan dan manfaat layanan LegalPartner.ID."
                                />
                            </section>
                        </TabsContent>
                    </Tabs>

                    <div className="grid gap-4 rounded-xl border border-[#2547F9]/10 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Tautan halaman publik</p>
                            <p className="mt-1 text-sm text-slate-500">/tentang-kami</p>
                        </div>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-10 rounded-lg bg-[#2547F9] px-5 text-white shadow-sm hover:bg-[#1E3EDB]"
                        >
                            <Save className="size-4" />
                            {form.processing ? "Menyimpan…" : "Simpan perubahan"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
