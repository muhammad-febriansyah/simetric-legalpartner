import { useState, type FormEvent } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowDown,
    ArrowRight,
    BadgeCheck,
    Building2,
    Check,
    ChevronDown,
    Handshake,
    MapPin,
    MessageCircle,
    ShieldCheck,
    UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { store as submitPartnership } from "@/actions/App/Http/Controllers/Site/PartnershipApplicationController";
import InputError from "@/components/input-error";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { home } from "@/routes";

type PartnershipForm = {
    full_name: string;
    whatsapp: string;
    email: string;
    partnership_type: string;
    message: string;
};

const partnershipOptions = [
    {
        slug: "notaris-ppat",
        title: "Notaris & PPAT",
        description:
            "Perluas jangkauan layanan notaris dan PPAT kepada pelaku usaha yang membutuhkan pendampingan legalitas.",
        icon: Building2,
        benefits: [
            "Peluang kolaborasi sesuai kebutuhan klien",
            "Koordinasi dokumen dan proses lebih terarah",
            "Komunikasi langsung dengan tim LegalPartner.ID",
        ],
    },
    {
        slug: "virtual-office",
        title: "Virtual Office",
        description:
            "Tawarkan alamat usaha dan layanan kantor virtual kepada klien yang sedang memulai bisnis.",
        icon: MapPin,
        benefits: [
            "Profil lokasi dapat ditampilkan sebagai opsi layanan",
            "Jangkau calon penyewa dari kebutuhan legalitas",
            "Koordinasi kebutuhan dan ketersediaan lokasi",
        ],
    },
    {
        slug: "agen-reseller",
        title: "Agen & Referral",
        description:
            "Hubungkan jaringan bisnis Anda dengan layanan pendirian dan perizinan usaha LegalPartner.ID.",
        icon: UsersRound,
        benefits: [
            "Materi informasi layanan untuk dibagikan",
            "Proses rujukan tercatat dan mudah ditindaklanjuti",
            "Skema kerja sama dibahas saat onboarding",
        ],
    },
];

const frequentlyAskedQuestions = [
    {
        question: "Apakah ada biaya untuk mengajukan kerja sama?",
        answer: "Detail biaya, komisi, atau bentuk kerja sama dibicarakan setelah kebutuhan dan profil mitra ditinjau. Tim akan menjelaskan skema sebelum ada kesepakatan.",
    },
    {
        question: "Berapa lama tim akan menghubungi saya?",
        answer: "Tim partnership akan meninjau data yang dikirim dan menghubungi Anda melalui WhatsApp atau email pada hari kerja.",
    },
    {
        question: "Apakah bisa mendaftar lebih dari satu kategori?",
        answer: "Bisa. Kirim formulir untuk kategori utama, lalu jelaskan kategori lainnya pada kolom pesan.",
    },
];

export default function Partnership({
    partnershipTypes,
}: {
    partnershipTypes: Record<string, string>;
}) {
    const [selectedType, setSelectedType] = useState(partnershipOptions[0].slug);
    const form = useForm<PartnershipForm>({
        full_name: "",
        whatsapp: "",
        email: "",
        partnership_type: partnershipOptions[0].slug,
        message: "",
    });

    function choosePartnership(slug: string): void {
        setSelectedType(slug);
        form.setData("partnership_type", slug);
        document
            .getElementById("form-pendaftaran")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        form.post(submitPartnership.url(), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setSelectedType(partnershipOptions[0].slug);
                toast.success("Pendaftaran terkirim", {
                    description: "Tim partnership akan meninjau dan menghubungi Anda.",
                });
            },
            onError: () =>
                toast.error("Pendaftaran belum terkirim", {
                    description: "Periksa kembali data yang ditandai.",
                }),
        });
    }

    return (
        <>
            <Head title="Kerja Sama Mitra">
                <meta
                    name="description"
                    content="Bergabung sebagai mitra LegalPartner.ID. Ajukan kerja sama sebagai notaris, penyedia virtual office, atau mitra referral."
                />
            </Head>
            <div className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <PublicNavbar />

                <main>
                    <section className="relative isolate overflow-hidden bg-[#F8F9FE]">
                        <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 hidden w-[46%] bg-gradient-to-br from-[#EEF2FF] via-[#F5F7FF] to-[#F8F9FE] lg:block" />
                        <div aria-hidden="true" className="absolute -right-24 top-20 -z-10 hidden size-80 rounded-full bg-[#2547F9]/[0.045] blur-3xl lg:block" />
                        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-20">
                            <div className="lg:py-6">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#2547F9]/15 bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#2547F9] shadow-sm shadow-blue-950/[0.03] sm:text-sm">
                                    <Handshake aria-hidden="true" className="size-4" />
                                    Program kemitraan
                                </div>
                                <h1 className="mt-6 max-w-2xl text-[2.65rem] font-semibold leading-[1.06] tracking-[-0.045em] text-slate-950 [text-wrap:balance] sm:text-5xl lg:mt-7 lg:text-[3.8rem]">
                                    Bangun kolaborasi legal yang{" "}
                                    <span className="text-[#2547F9]">berdampak.</span>
                                </h1>
                                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                                    Kami bermitra dengan profesional dan pelaku usaha untuk membantu
                                    bisnis mendapatkan layanan legalitas yang tepat.
                                </p>
                                <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center sm:mt-8">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 w-full bg-[#2547F9] px-5 text-sm text-white shadow-[0_8px_20px_-10px_rgba(37,71,249,0.65)] hover:bg-[#1E3EDB] min-[420px]:w-auto"
                                    >
                                        <a href="#form-pendaftaran">
                                            Mulai ajukan kerja sama{" "}
                                            <ArrowRight aria-hidden="true" data-icon="inline-end" />
                                        </a>
                                    </Button>
                                    <a
                                        href="#kategori"
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 min-[420px]:justify-start"
                                    >
                                        Lihat kategori <ArrowDown aria-hidden="true" className="size-4" />
                                    </a>
                                </div>
                                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200/80 pt-5 text-xs font-medium text-slate-600 sm:mt-10 sm:gap-x-7 sm:pt-6 sm:text-sm">
                                    <span className="inline-flex items-center gap-2.5">
                                        <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-emerald-600" />
                                        Ditinjau tim partnership
                                    </span>
                                    <span className="inline-flex items-center gap-2.5">
                                        <MessageCircle aria-hidden="true" className="size-4 shrink-0 text-emerald-600" />
                                        Tindak lanjut personal
                                    </span>
                                </div>
                            </div>

                            <div className="relative rounded-[1.75rem] border border-white bg-white p-5 shadow-[0_22px_55px_-38px_rgba(15,23,42,0.35)] ring-1 ring-slate-200/70 sm:p-7 lg:p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2547F9]">
                                            Alur kemitraan
                                        </p>
                                        <h2 className="mt-2 max-w-sm text-xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-2xl">
                                            Dari perkenalan hingga kerja sama
                                        </h2>
                                    </div>
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#2547F9] sm:size-12">
                                        <Handshake aria-hidden="true" className="size-5 sm:size-6" />
                                    </span>
                                </div>
                                <div className="relative mt-6 grid gap-1 sm:mt-7">
                                    <div aria-hidden="true" className="absolute bottom-8 left-[1.125rem] top-8 w-px bg-gradient-to-b from-[#2547F9]/30 via-[#2547F9]/15 to-transparent" />
                                    {[
                                        [
                                            "01",
                                            "Ceritakan profil Anda",
                                            "Isi formulir singkat sesuai kategori mitra.",
                                        ],
                                        [
                                            "02",
                                            "Tim meninjau kebutuhan",
                                            "Kami pelajari kesesuaian layanan dan wilayah.",
                                        ],
                                        [
                                            "03",
                                            "Diskusikan skema kerja sama",
                                            "Ruang lingkup dan langkah berikutnya disepakati bersama.",
                                        ],
                                    ].map(([number, title, description]) => (
                                        <div
                                            key={number}
                                            className="relative flex gap-3.5 rounded-2xl px-2.5 py-3.5 transition-colors hover:bg-[#F8F9FE] sm:gap-4 sm:px-3 sm:py-4"
                                        >
                                            <span className="z-10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#2547F9]/15 bg-white text-xs font-semibold tabular-nums text-[#2547F9] shadow-[0_2px_6px_-3px_rgba(15,23,42,0.2)]">
                                                {number}
                                            </span>
                                            <div className="min-w-0 pt-0.5">
                                                <p className="text-sm font-semibold leading-5 text-slate-900">{title}</p>
                                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-start gap-2.5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 sm:mt-5 sm:pt-5">
                                    <BadgeCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                    <span>Setiap pengajuan ditinjau tim sebelum skema kerja sama dibahas.</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="kategori"
                        className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20"
                    >
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold text-[#2547F9]">
                                Pilih jalur kolaborasi
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Kategori kemitraan
                            </h2>
                            <p className="mt-3 leading-7 text-slate-600">
                                Temukan bentuk kerja sama yang sesuai dengan layanan dan jaringan
                                Anda.
                            </p>
                        </div>
                        <div className="mt-10 grid gap-5 lg:grid-cols-3">
                            {partnershipOptions.map(
                                ({ slug, title, description, icon: Icon, benefits }) => (
                                    <article
                                        key={slug}
                                        className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2547F9]/25 hover:shadow-md sm:p-7"
                                    >
                                        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                            <Icon className="size-5" />
                                        </span>
                                        <h3 className="mt-5 text-xl font-semibold tracking-tight">
                                            {title}
                                        </h3>
                                        <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600">
                                            {description}
                                        </p>
                                        <ul className="mt-5 grid gap-3 border-t border-slate-100 pt-5">
                                            {benefits.map((benefit) => (
                                                <li
                                                    key={benefit}
                                                    className="flex gap-2.5 text-sm leading-5 text-slate-600"
                                                >
                                                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-7 w-full border-slate-200 hover:border-[#2547F9]/40 hover:text-[#2547F9]"
                                            onClick={() => choosePartnership(slug)}
                                        >
                                            Pilih kategori <ArrowRight data-icon="inline-end" />
                                        </Button>
                                    </article>
                                ),
                            )}
                        </div>
                    </section>

                    <section
                        id="form-pendaftaran"
                        className="scroll-mt-8 border-y border-slate-200/80 bg-white"
                    >
                        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                            <div className="lg:pt-4">
                                <p className="text-sm font-semibold text-[#2547F9]">
                                    Formulir pendaftaran
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Mari mulai percakapan.
                                </h2>
                                <p className="mt-4 max-w-lg leading-7 text-slate-600">
                                    Ceritakan sedikit tentang diri dan bentuk kerja sama yang Anda
                                    minati. Tim kami akan menghubungi Anda untuk membahas langkah
                                    selanjutnya.
                                </p>
                                <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#F7F8FD] p-4 text-sm leading-6 text-slate-600">
                                    <MessageCircle className="mt-0.5 size-5 shrink-0 text-[#2547F9]" />
                                    <p>
                                        Pastikan nomor WhatsApp aktif agar tim dapat menghubungi
                                        Anda dengan mudah.
                                    </p>
                                </div>
                            </div>
                            <form
                                onSubmit={submit}
                                className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="full_name">
                                            Nama lengkap <Required />
                                        </Label>
                                        <Input
                                            id="full_name"
                                            value={form.data.full_name}
                                            onChange={(event) =>
                                                form.setData("full_name", event.target.value)
                                            }
                                            placeholder="Contoh: Budi Santoso"
                                            maxLength={160}
                                            required
                                            aria-invalid={Boolean(form.errors.full_name)}
                                        />
                                        <InputError message={form.errors.full_name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="whatsapp">
                                            Nomor WhatsApp <Required />
                                        </Label>
                                        <Input
                                            id="whatsapp"
                                            type="tel"
                                            value={form.data.whatsapp}
                                            onChange={(event) =>
                                                form.setData("whatsapp", event.target.value)
                                            }
                                            placeholder="Contoh: 081234567890"
                                            maxLength={32}
                                            required
                                            aria-invalid={Boolean(form.errors.whatsapp)}
                                        />
                                        <InputError message={form.errors.whatsapp} />
                                    </div>
                                </div>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email{" "}
                                            <span className="font-normal text-slate-400">
                                                (opsional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.data.email}
                                            onChange={(event) =>
                                                form.setData("email", event.target.value)
                                            }
                                            placeholder="nama@perusahaan.com"
                                            maxLength={255}
                                            aria-invalid={Boolean(form.errors.email)}
                                        />
                                        <InputError message={form.errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="partnership_type">
                                            Kategori kemitraan <Required />
                                        </Label>
                                        <select
                                            id="partnership_type"
                                            value={selectedType}
                                            onChange={(event) => {
                                                setSelectedType(event.target.value);
                                                form.setData(
                                                    "partnership_type",
                                                    event.target.value,
                                                );
                                            }}
                                            required
                                            aria-invalid={Boolean(form.errors.partnership_type)}
                                            className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                        >
                                            {Object.entries(partnershipTypes).map(
                                                ([slug, title]) => (
                                                    <option key={slug} value={slug}>
                                                        {title}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <InputError message={form.errors.partnership_type} />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="message">
                                        Pesan atau profil singkat{" "}
                                        <span className="font-normal text-slate-400">
                                            (opsional)
                                        </span>
                                    </Label>
                                    <textarea
                                        id="message"
                                        value={form.data.message}
                                        onChange={(event) =>
                                            form.setData("message", event.target.value)
                                        }
                                        placeholder="Ceritakan layanan, wilayah, atau bentuk kerja sama yang Anda minati."
                                        rows={5}
                                        maxLength={3000}
                                        aria-invalid={Boolean(form.errors.message)}
                                        className="w-full resize-y rounded-md border border-input bg-white px-3 py-2.5 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                                    />
                                    <div className="flex items-center justify-between gap-3">
                                        <InputError message={form.errors.message} />
                                        <span className="text-xs text-slate-400">
                                            {form.data.message.length}/3000
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs leading-5 text-slate-500">
                                        Data Anda digunakan untuk menindaklanjuti pengajuan kerja
                                        sama.
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                        className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                                    >
                                        {form.processing ? "Mengirim…" : "Kirim pendaftaran"}{" "}
                                        <ArrowRight data-icon="inline-end" />
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <section
                        id="faq"
                        className="mx-auto max-w-4xl scroll-mt-8 px-5 py-16 sm:px-8 sm:py-20"
                    >
                        <div className="text-center">
                            <p className="text-sm font-semibold text-[#2547F9]">
                                Punya pertanyaan?
                            </p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                                Pertanyaan umum
                            </h2>
                        </div>
                        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
                            {frequentlyAskedQuestions.map(({ question, answer }) => (
                                <details key={question} className="group py-5">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
                                        {question}
                                        <ChevronDown className="size-4 shrink-0 text-slate-500 transition group-open:rotate-180" />
                                    </summary>
                                    <p className="max-w-3xl pt-3 text-sm leading-6 text-slate-600">
                                        {answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>
                </main>
                <PublicFooter />
            </div>
        </>
    );
}

function Required() {
    return (
        <span className="text-destructive" aria-hidden="true">
            *
        </span>
    );
}
