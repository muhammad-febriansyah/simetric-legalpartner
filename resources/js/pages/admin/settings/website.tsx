import { Form, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    Check,
    Globe2,
    Image as ImageIcon,
    Lightbulb,
    MapPin,
    Palette,
    Phone,
    Save,
    Search,
    Share2,
} from 'lucide-react';
import { update as updateWebsiteSettings } from '@/actions/App/Http/Controllers/Admin/WebsiteSettingsController';
import { ImageUploadField } from '@/components/admin/image-upload-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type WebsiteSettings = Record<string, string>;
type WebsiteAssets = { logo: string | null; favicon: string | null; og_image: string | null };

const settingsTabs = [
    { id: 'identity', label: 'Identitas & Umum' },
    { id: 'assets', label: 'Logo & Gambar' },
    { id: 'contact', label: 'Kontak' },
    { id: 'seo', label: 'SEO' },
    { id: 'social', label: 'Sosial Media' },
    { id: 'location', label: 'Peta & Lokasi' },
    { id: 'appearance', label: 'Tampilan' },
] as const;

const socialFields = [
    ['social_instagram', 'Instagram', 'https://instagram.com/akun-anda'],
    ['social_facebook', 'Facebook', 'https://facebook.com/halaman-anda'],
    ['social_linkedin', 'LinkedIn', 'https://linkedin.com/company/perusahaan-anda'],
    ['social_tiktok', 'TikTok', 'https://tiktok.com/@akun-anda'],
    ['social_youtube', 'YouTube', 'https://youtube.com/@channel-anda'],
    ['social_x', 'X', 'https://x.com/akun-anda'],
] as const;

function SectionHeading({ icon: Icon, title, description }: { icon: typeof Globe2; title: string; description: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                <Icon className="size-5" />
            </span>
            <div className="space-y-1">
                <h2 className="font-semibold tracking-tight">{title}</h2>
                <p className="text-sm leading-5 text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}

function TextField({
    id,
    label,
    value,
    error,
    placeholder,
    type = 'text',
    maxLength,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    error?: string;
    placeholder?: string;
    type?: string;
    maxLength?: number;
    onChange?: (value: string) => void;
}) {
    return (
        <div className="grid content-start gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} name={id} type={type} defaultValue={value} placeholder={placeholder} maxLength={maxLength} onChange={(event) => onChange?.(event.currentTarget.value)} />
            <InputError message={error} />
        </div>
    );
}

function isGoogleMapsEmbedUrl(value: string): boolean {
    try {
        const url = new URL(value);
        const allowedHosts = ['google.com', 'www.google.com', 'maps.google.com'];

        return url.protocol === 'https:' && allowedHosts.includes(url.hostname) && url.pathname.startsWith('/maps');
    } catch {
        return false;
    }
}

function TextAreaField({
    id,
    label,
    value,
    error,
    placeholder,
    rows = 3,
    maxLength,
}: {
    id: string;
    label: string;
    value: string;
    error?: string;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
}) {
    return (
        <div className="grid content-start gap-2">
            <Label htmlFor={id}>{label}</Label>
            <textarea
                id={id}
                name={id}
                defaultValue={value}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <InputError message={error} />
        </div>
    );
}

function SettingsPreview({ settings, logo, favicon }: { settings: WebsiteSettings; logo: string; favicon: string | null }) {
    const siteName = settings.site_name || 'LegalPartner.ID';
    const byline = settings.brand_byline || 'by Simetric Consulting Group';

    return (
        <div className="flex flex-col gap-5 xl:sticky xl:top-5">
            <section className="rounded-2xl border border-[#DCE7FF] bg-gradient-to-br from-[#EFF4FF] to-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-white text-[#2547F9] shadow-sm"><ImageIcon className="size-5" /></span>
                    <div>
                        <h2 className="text-sm font-semibold">Preview identitas</h2>
                        <p className="text-xs text-muted-foreground">Contoh tampilan header website.</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex h-9 items-center gap-1.5 border-b bg-slate-50 px-3">
                        <span className="size-2 rounded-full bg-red-400" />
                        <span className="size-2 rounded-full bg-amber-400" />
                        <span className="size-2 rounded-full bg-emerald-400" />
                        <div className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
                            <Globe2 className="size-3 shrink-0" />
                            <span className="truncate">{settings.site_url || 'https://domain-anda.id'}</span>
                        </div>
                    </div>
                    <div className="flex min-h-24 items-center justify-between gap-3 p-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <img src={logo} alt="Pratinjau logo website" className="size-10 shrink-0 rounded-lg object-cover object-left" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-900">{siteName}</p>
                                <p className="truncate text-[10px] text-slate-500">{byline}</p>
                            </div>
                        </div>
                        <div className="hidden gap-3 text-[10px] font-medium text-slate-500 sm:flex">
                            <span>Beranda</span><span>Layanan</span><span>Kontak</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-700">Tampilan favicon</p>
                    <div className="flex items-center gap-2 rounded-t-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                        <span className="flex size-6 items-center justify-center overflow-hidden rounded-md bg-[#F7F8FD]">
                            {favicon ? <img src={favicon} alt="Favicon website" className="size-full object-contain" /> : <Globe2 className="size-4 text-[#2547F9]" />}
                        </span>
                        <span className="truncate">{siteName}</span>
                        <span className="ml-auto text-slate-400">×</span>
                    </div>
                    <div className="h-2 rounded-b-xl bg-white/80" />
                </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-white text-emerald-600"><Lightbulb className="size-5" /></span>
                    <div>
                        <h2 className="text-sm font-semibold">Tips logo & gambar</h2>
                        <p className="text-xs text-muted-foreground">Agar brand terlihat tajam.</p>
                    </div>
                </div>
                <ul className="space-y-3 text-xs leading-5 text-muted-foreground">
                    {[
                        'Gunakan PNG atau WebP transparan untuk logo.',
                        'Pastikan logo tetap jelas saat ukuran kecil.',
                        'Gunakan rasio 1200 × 630 px untuk gambar OG.',
                        'Ukuran favicon persegi, minimal 64 × 64 px.',
                    ].map((tip) => (
                        <li key={tip} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-emerald-500" /><span>{tip}</span></li>
                    ))}
                </ul>
            </section>

            <section className="rounded-2xl border border-border bg-white p-4 sm:p-5">
                <h2 className="mb-3 text-sm font-semibold">Identitas brand</h2>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F7F8FD] p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-3 rounded-full bg-[#2547F9]" />Warna utama</div>
                    <code className="rounded bg-white px-2 py-1 text-xs font-medium text-slate-700">#2547F9</code>
                </div>
            </section>
        </div>
    );
}

export default function WebsiteSettingsPage({ settings, assets }: { settings: WebsiteSettings; assets: WebsiteAssets }) {
    const [activeTab, setActiveTab] = useState(() => typeof window !== 'undefined' && settingsTabs.some(({ id }) => id === window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'identity');
    const [mapsEmbedUrl, setMapsEmbedUrl] = useState(settings.google_maps_embed_url ?? '');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!logoFile) {
            setLogoPreview(null);
            return;
        }

        const url = URL.createObjectURL(logoFile);
        setLogoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [logoFile]);

    useEffect(() => {
        if (!faviconFile) {
            setFaviconPreview(null);
            return;
        }

        const url = URL.createObjectURL(faviconFile);
        setFaviconPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [faviconFile]);

    useEffect(() => {
        const updateActiveTab = () => {
            const hash = window.location.hash.slice(1);
            if (settingsTabs.some(({ id }) => id === hash)) {
                setActiveTab(hash);
            }
        };

        window.addEventListener('hashchange', updateActiveTab);
        return () => window.removeEventListener('hashchange', updateActiveTab);
    }, []);

    return (
        <>
            <Head title="Pengaturan Website" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Dashboard <span className="px-1.5 text-slate-300">›</span> <span className="text-foreground">Pengaturan Website</span></p>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Pengaturan Website</h1>
                    <p className="text-sm text-muted-foreground">Kelola identitas brand, SEO, kontak, peta, dan kanal sosial dalam satu halaman.</p>
                </div>

                <Form
                    action={updateWebsiteSettings.url()}
                    method="put"
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                    onSuccess={() => toast.success('Pengaturan website tersimpan', { description: 'Perubahan berhasil disimpan.' })}
                    onError={() => toast.error('Pengaturan belum tersimpan', { description: 'Periksa kembali kolom yang ditandai.' })}
                >
                    {({ processing, errors }) => (
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) => {
                                setActiveTab(value);
                                window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${value}`);
                            }}
                            className="gap-6"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="-mx-1 min-w-0 flex-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    <TabsList aria-label="Bagian pengaturan website">
                                        {settingsTabs.map(({ id, label }) => (
                                            <TabsTrigger key={id} value={id}>
                                                {label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>
                                <Button type="submit" disabled={processing} className="h-10 shrink-0 bg-[#2547F9] px-3 text-white hover:bg-[#1E3EDB] sm:min-w-40 sm:px-4">
                                    <Save className="size-4" />
                                    <span className="hidden sm:inline">{processing ? 'Menyimpan…' : 'Simpan pengaturan'}</span>
                                    <span className="sm:hidden">{processing ? 'Simpan…' : 'Simpan'}</span>
                                </Button>
                            </div>

                            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.85fr)]">
                            <div className="flex min-w-0 flex-col gap-6">
                                <TabsContent value="identity">
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <SectionHeading icon={Globe2} title="Identitas website" description="Nama dan informasi brand yang digunakan di website." />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <TextField id="site_name" label="Nama website *" value={settings.site_name ?? ''} error={errors.site_name} placeholder="LegalPartner.ID" />
                                        <TextField id="brand_byline" label="Nama perusahaan" value={settings.brand_byline ?? ''} error={errors.brand_byline} placeholder="by Simetric Consulting Group" />
                                        <TextField id="site_tagline" label="Tagline" value={settings.site_tagline ?? ''} error={errors.site_tagline} placeholder="Partner legalitas dan perizinan usaha Anda" />
                                        <TextField id="site_url" label="URL website" value={settings.site_url ?? ''} error={errors.site_url} placeholder="https://domain-anda.id" type="url" />
                                        <div className="md:col-span-2">
                                            <TextField id="logo_alt_text" label="Teks alternatif logo" value={settings.logo_alt_text ?? ''} error={errors.logo_alt_text} placeholder="LegalPartner.ID by Simetric Consulting Group" />
                                        </div>
                                    </div>
                                </section>
                                </TabsContent>

                                <TabsContent value="assets">
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <SectionHeading icon={ImageIcon} title="Logo dan gambar" description="Pratinjau langsung, detail file, serta validasi format dan ukuran." />
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <ImageUploadField id="logo_file" name="logo_file" label="Logo website" hint="Horizontal · min. 320 × 80 px · maks. 2 MB" currentImage={assets.logo} error={errors.logo_file} onFileChange={setLogoFile} />
                                        <ImageUploadField id="favicon_file" name="favicon_file" label="Favicon" hint="Persegi · 64–1024 px · maks. 1 MB" currentImage={assets.favicon} error={errors.favicon_file} onFileChange={setFaviconFile} />
                                        <ImageUploadField id="og_image_file" name="og_image_file" label="Gambar share / OG" hint="Rasio 1.91:1 · maks. 3 MB" currentImage={assets.og_image} error={errors.og_image_file} />
                                    </div>
                                </section>
                                </TabsContent>

                                <TabsContent value="contact">
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <SectionHeading icon={Phone} title="Kontak" description="Informasi yang dapat digunakan pengunjung untuk menghubungi tim." />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <TextField id="contact_email" label="Email kontak" value={settings.contact_email ?? ''} error={errors.contact_email} placeholder="halo@domain-anda.id" type="email" />
                                        <TextField id="contact_phone" label="Nomor telepon" value={settings.contact_phone ?? ''} error={errors.contact_phone} placeholder="+62 21 ..." />
                                        <TextField id="whatsapp_number" label="Nomor WhatsApp" value={settings.whatsapp_number ?? ''} error={errors.whatsapp_number} placeholder="62812... (format internasional)" />
                                        <TextField id="business_hours" label="Jam operasional" value={settings.business_hours ?? ''} error={errors.business_hours} placeholder="Senin - Jumat, 08.00 - 17.00 WIB" />
                                        <TextAreaField id="contact_address" label="Alamat" value={settings.contact_address ?? ''} error={errors.contact_address} placeholder="Alamat kantor" rows={2} />
                                    </div>
                                </section>
                                </TabsContent>

                                <TabsContent value="seo">
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <SectionHeading icon={Search} title="SEO dan mesin pencari" description="Metadata default untuk hasil pencarian dan verifikasi Google." />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="md:col-span-2"><TextField id="default_meta_title" label="Judul SEO default" value={settings.default_meta_title ?? ''} error={errors.default_meta_title} placeholder="Nama website — layanan utama" maxLength={70} /></div>
                                        <div className="md:col-span-2"><TextAreaField id="default_meta_description" label="Deskripsi SEO default" value={settings.default_meta_description ?? ''} error={errors.default_meta_description} placeholder="Ringkasan website untuk hasil pencarian" maxLength={320} /></div>
                                        <div className="md:col-span-2"><TextAreaField id="meta_keywords" label="Kata kunci SEO" value={settings.meta_keywords ?? ''} error={errors.meta_keywords} placeholder="Pisahkan kata kunci dengan koma" rows={2} maxLength={500} /></div>
                                        <TextField id="google_site_verification" label="Google Search Console verification" value={settings.google_site_verification ?? ''} error={errors.google_site_verification} placeholder="Kode verifikasi Google" />
                                    </div>
                                </section>
                                </TabsContent>

                                <TabsContent value="social">
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <SectionHeading icon={Share2} title="Media sosial" description="Masukkan URL profil resmi. Kosongkan kanal yang belum digunakan." />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {socialFields.map(([id, label, placeholder]) => <TextField key={id} id={id} label={label} value={settings[id] ?? ''} error={errors[id]} placeholder={placeholder} type="url" />)}
                                    </div>
                                </section>
                                </TabsContent>

                                <TabsContent value="location">
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <SectionHeading icon={MapPin} title="Peta dan lokasi" description="Atur kata kunci lokasi dan URL embed resmi Google Maps." />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <TextField id="google_maps_keyword" label="Kata kunci lokasi Maps" value={settings.google_maps_keyword ?? ''} error={errors.google_maps_keyword} placeholder="Nama kantor, kota" />
                                        <div><TextField id="google_maps_embed_url" label="URL embed Google Maps" value={settings.google_maps_embed_url ?? ''} error={errors.google_maps_embed_url} placeholder="https://www.google.com/maps?q=...&output=embed" type="url" onChange={setMapsEmbedUrl} /><p className="mt-1.5 text-xs text-muted-foreground">URL aman dari Google Maps dengan path /maps.</p></div>
                                    </div>
                                    <div className="flex flex-col gap-3 rounded-xl border border-border bg-[#F7F8FD] p-3 sm:p-4">
                                        <div>
                                            <h3 className="text-sm font-semibold">Preview peta</h3>
                                            <p className="text-xs text-muted-foreground">Pratinjau embed Google Maps sebelum disimpan.</p>
                                        </div>
                                        <div className="relative aspect-[16/7] min-h-48 overflow-hidden rounded-lg border border-border bg-white sm:min-h-56">
                                            {isGoogleMapsEmbedUrl(mapsEmbedUrl) ? (
                                                <iframe
                                                    title="Preview lokasi Google Maps"
                                                    src={mapsEmbedUrl}
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    allowFullScreen
                                                    className="absolute inset-0 size-full border-0"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                                                    <span className="flex size-11 items-center justify-center rounded-full bg-[#2547F9]/[0.08] text-[#2547F9]"><MapPin className="size-5" /></span>
                                                    <p className="max-w-sm text-sm text-muted-foreground">Masukkan URL embed Google Maps yang valid untuk menampilkan pratinjau di sini.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                                </TabsContent>

                                <TabsContent value="appearance">
                                <section className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                                    <SectionHeading icon={Palette} title="Tampilan brand" description="Warna identitas website yang sedang digunakan." />
                                    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F8FD] p-4">
                                        <div><p className="text-sm font-medium">Warna utama</p><p className="text-xs text-muted-foreground">Primary color LegalPartner.ID</p></div>
                                        <div className="flex items-center gap-2"><span className="size-8 rounded-lg bg-[#2547F9] shadow-sm" /><code className="text-sm font-semibold">#2547F9</code></div>
                                    </div>
                                </section>
                                </TabsContent>
                            </div>

                            <aside className="min-w-0 xl:col-start-2 xl:row-start-1">
                                <SettingsPreview settings={settings} logo={logoPreview ?? assets.logo ?? '/images/legalpartner-logo.png'} favicon={faviconPreview ?? assets.favicon} />
                            </aside>

                            </div>
                        </Tabs>
                    )}
                </Form>
            </div>
        </>
    );
}
