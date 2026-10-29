import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    Check,
    ChevronDown,
    Clock3,
    Download,
    FileCheck2,
    Layers3,
    Plus,
} from 'lucide-react';
import { index as servicesIndex } from '@/actions/App/Http/Controllers/Site/ServiceController';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { createWhatsAppUrl } from '@/lib/whatsapp';

type ServiceDetail = {
    name: string;
    slug: string;
    excerpt: string | null;
    description: string;
    heroImage: string | null;
    heroImageAlt: string | null;
    durationLabel: string | null;
    requirements: string[];
    processSteps: string[];
    category: { name: string; slug: string };
    packages: {
        name: string;
        slug: string;
        description: string | null;
        price: number | null;
        priceLabel: string | null;
        features: string[];
        isPopular: boolean;
    }[];
    addons: { name: string; description: string | null; price: number }[];
    faqs: { question: string; answer: string }[];
};

const formatPrice = (price: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);

export default function ServiceShow({
    service,
    whatsappNumber,
}: {
    service: ServiceDetail;
    whatsappNumber: string | null;
}) {
    const generalWhatsAppUrl = createWhatsAppUrl({
        phone: whatsappNumber,
        serviceName: service.name,
    });
    const serviceFacts = [
        { label: 'Pilihan paket', value: service.packages.length, icon: Layers3 },
        { label: 'Layanan tambahan', value: service.addons.length, icon: Plus },
        { label: 'Tahapan pengerjaan', value: service.processSteps.length, icon: FileCheck2 },
    ].filter((fact) => fact.value > 0);

    return (
        <>
            <Head title={service.name}>
                {service.excerpt && (
                    <meta name="description" content={service.excerpt} />
                )}
            </Head>
            <PublicNavbar />
            <main className="min-h-screen bg-white text-slate-900">
                <div className="bg-[#F7F8FD]">
                    <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-14 lg:pb-20 lg:pt-16">
                        <div className="mb-8 sm:mb-10">
                            <Breadcrumbs
                                breadcrumbs={[
                                    { title: 'Beranda', href: '/' },
                                    { title: 'Layanan', href: servicesIndex() },
                                    { title: service.name, href: `/layanan/${service.slug}` },
                                ]}
                            />
                        </div>

                        <section className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-white via-white to-[#F5F7FF] shadow-[0_28px_72px_-52px_rgba(15,23,42,0.38)] sm:rounded-[2rem]">
                            <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-32 size-80 rounded-full bg-[#2547F9]/[0.045] blur-3xl" />
                            <div className="relative grid lg:grid-cols-7">
                                <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-11 lg:col-span-4 lg:px-12 lg:py-14">
                                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2547F9]/15 bg-[#F4F6FF] px-3 py-1.5 text-xs font-semibold text-[#2547F9]">
                                        <BadgeCheck aria-hidden="true" className="size-4" />
                                        {service.category.name}
                                    </span>
                                    <h1 className="mt-5 max-w-2xl text-balance text-3xl font-semibold leading-[1.12] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.5rem]">
                                        {service.name}
                                    </h1>
                                    {service.excerpt && (
                                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                                            {service.excerpt}
                                        </p>
                                    )}
                                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                                        {service.durationLabel && (
                                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                                                <Clock3 aria-hidden="true" className="size-4 text-[#2547F9]" />
                                                Estimasi {service.durationLabel}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                                            <Check aria-hidden="true" className="size-4 text-emerald-600" />
                                            Rincian biaya terbuka
                                        </span>
                                    </div>

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <a href="#paket" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_22px_-14px_rgba(19,69,173,0.72)] transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                            Lihat pilihan paket
                                            <ArrowRight aria-hidden="true" className="size-4" />
                                        </a>
                                        {generalWhatsAppUrl && (
                                            <a href={generalWhatsAppUrl} target="_blank" rel="noreferrer noopener" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-primary/30 hover:bg-[#F8FAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                                Konsultasi WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="relative p-3 sm:p-4 lg:col-span-3 lg:p-5">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.35rem] border border-white/70 bg-[#E8EDFF] shadow-[0_20px_48px_-30px_rgba(23,47,138,0.38)] sm:rounded-[1.6rem]">
                                    {service.heroImage ? (
                                        <img
                                            src={service.heroImage}
                                            alt={service.heroImageAlt ?? service.name}
                                            className="absolute inset-0 size-full object-cover"
                                            fetchPriority="high"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(ellipse_at_75%_22%,rgba(37,71,249,0.22),transparent_38%),linear-gradient(145deg,#F8FAFF_5%,#E6ECFF_55%,#D8E3FF)] p-7 sm:p-10">
                                            <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-primary/10">
                                                <FileCheck2 aria-hidden="true" className="size-6" />
                                            </span>
                                            <span className="max-w-xs text-2xl font-semibold leading-tight tracking-tight text-[#172F8A] sm:text-3xl">
                                                Legalitas usaha, dengan langkah yang jelas.
                                            </span>
                                        </div>
                                    )}
                                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0D1B49]/55 via-transparent to-white/5" />
                                    <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">Layanan legalitas</p>
                                            <p className="mt-1 truncate text-sm font-semibold text-slate-950 sm:text-base">{service.name}</p>
                                        </div>
                                        {service.durationLabel && (
                                            <span className="shrink-0 rounded-xl bg-[#F3F5FF] px-3 py-2 text-right">
                                                <span className="block text-[10px] text-slate-500">Estimasi</span>
                                                <span className="mt-0.5 block text-xs font-semibold text-[#172F8A]">{service.durationLabel}</span>
                                            </span>
                                        )}
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {serviceFacts.length > 0 && (
                            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                                {serviceFacts.map((fact) => (
                                    <div key={fact.label} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3.5">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-primary">
                                            <fact.icon aria-hidden="true" className="size-5" />
                                        </span>
                                        <span>
                                            <dd className="text-lg font-semibold leading-5 text-slate-950">{fact.value}</dd>
                                            <dt className="mt-1 text-xs text-slate-500">{fact.label}</dt>
                                        </span>
                                    </div>
                                ))}
                            </dl>
                        )}

                        <section className="mt-8 grid gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_16px_42px_-36px_rgba(15,23,42,0.34)] sm:mt-10 sm:gap-8 sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:p-10">
                            <div>
                                <span className="flex size-11 items-center justify-center rounded-xl bg-[#EEF1FF] text-primary">
                                    <FileCheck2 aria-hidden="true" className="size-5" />
                                </span>
                                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Mengenai layanan</p>
                                <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">Ruang lingkup {service.name}</h2>
                            </div>
                            <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">{service.description}</p>
                        </section>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <section id="paket" className="scroll-mt-28 py-14 sm:py-16 lg:py-20">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Pilihan paket</p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Pilih cakupan yang sesuai.</h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Bandingkan isi paket dan biaya sebelum menentukan langkah berikutnya.</p>
                            </div>
                            {service.packages.length > 0 && (
                                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600">
                                    <Layers3 aria-hidden="true" className="size-4 text-primary" />
                                    {service.packages.length} paket tersedia
                                </span>
                            )}
                        </div>

                        {service.packages.length > 0 ? (
                            <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                                {service.packages.map((servicePackage) => {
                                    const packagePriceLabel =
                                        servicePackage.priceLabel ??
                                        (servicePackage.price === null
                                            ? 'Konsultasikan'
                                            : formatPrice(servicePackage.price));
                                    const packageWhatsAppUrl = createWhatsAppUrl({
                                        phone: whatsappNumber,
                                        serviceName: service.name,
                                        packageName: servicePackage.name,
                                        priceLabel: packagePriceLabel,
                                    });

                                    return (
                                        <article
                                            key={servicePackage.slug}
                                            className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 sm:p-7 ${servicePackage.isPopular ? 'border-primary/45 shadow-[0_20px_48px_-34px_rgba(19,69,173,0.48)]' : 'border-slate-200 shadow-[0_12px_32px_-28px_rgba(15,23,42,0.3)] hover:border-primary/25'}`}
                                        >
                                            {servicePackage.isPopular && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-primary" />}
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-500">Paket layanan</p>
                                                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{servicePackage.name}</h3>
                                                </div>
                                                {servicePackage.isPopular && (
                                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#EEF1FF] px-2.5 py-1.5 text-[11px] font-semibold text-primary">
                                                        <BadgeCheck aria-hidden="true" className="size-3.5" />
                                                        Populer
                                                    </span>
                                                )}
                                            </div>
                                            {servicePackage.description && (
                                                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{servicePackage.description}</p>
                                            )}
                                            <div className="mt-6 border-y border-slate-100 py-5">
                                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Investasi layanan</p>
                                                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">
                                                    {packagePriceLabel}
                                                </p>
                                            </div>
                                            {servicePackage.features.length > 0 && (
                                                <ul className="mt-5 flex-1 space-y-3.5">
                                                    {servicePackage.features.map((feature) => (
                                                        <li key={feature} className="flex gap-3 text-sm leading-6 text-slate-600">
                                                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                                                <Check aria-hidden="true" className="size-3.5" />
                                                            </span>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {packageWhatsAppUrl && (
                                                <a href={packageWhatsAppUrl} target="_blank" rel="noreferrer noopener" className={`mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${servicePackage.isPopular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-slate-200 bg-white text-slate-800 hover:border-primary/30 hover:bg-[#F8FAFF]'}`}>
                                                    Konsultasikan paket
                                                    <ArrowRight aria-hidden="true" className="size-4" />
                                                </a>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-[#F7F8FD] px-6 py-10 text-center">
                                <p className="font-semibold text-slate-900">Paket sedang disiapkan</p>
                                <p className="mt-2 text-sm text-slate-600">Hubungi tim kami untuk membahas cakupan dan biaya layanan ini.</p>
                                {generalWhatsAppUrl && <a href={generalWhatsAppUrl} target="_blank" rel="noreferrer noopener" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Tanya biaya layanan <ArrowRight aria-hidden="true" className="size-4" /></a>}
                            </div>
                        )}
                    </section>

                    {service.addons.length > 0 && (
                        <section className="border-t border-slate-200 py-14 sm:py-16">
                            <div className="max-w-2xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Pelengkap layanan</p>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Tambahan sesuai kebutuhan.</h2>
                            </div>
                            <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
                                {service.addons.map((addon) => (
                                    <li key={addon.name} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF1FF] text-primary">
                                                <Plus aria-hidden="true" className="size-4" />
                                            </span>
                                            <div>
                                                <h3 className="font-semibold text-slate-900">{addon.name}</h3>
                                                {addon.description && <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{addon.description}</p>}
                                            </div>
                                        </div>
                                        <span className="pl-11 text-sm font-semibold text-slate-900 sm:shrink-0 sm:pl-0">{formatPrice(addon.price)}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {(service.requirements.length > 0 || service.processSteps.length > 0) && (
                        <section id="persyaratan" className="scroll-mt-28 grid gap-4 border-t border-slate-200 py-14 sm:gap-5 sm:py-16 lg:grid-cols-2">
                            {service.requirements.length > 0 && (
                                <div className="rounded-2xl border border-slate-200 bg-[#F7F8FD] p-6 sm:p-8">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-slate-200/80">
                                        <FileCheck2 aria-hidden="true" className="size-5" />
                                    </span>
                                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Sebelum memulai</p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Yang perlu disiapkan</h2>
                                    <ul className="mt-5 space-y-3.5">
                                        {service.requirements.map((requirement) => (
                                            <li key={requirement} className="flex gap-3 text-sm leading-6 text-slate-700">
                                                <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                                                {requirement}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {service.processSteps.length > 0 && (
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#EEF1FF] text-primary">
                                        <Layers3 aria-hidden="true" className="size-5" />
                                    </span>
                                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Alur layanan</p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Tahapan pengerjaan</h2>
                                    <ol className="mt-5 space-y-4">
                                        {service.processSteps.map((step, index) => (
                                            <li key={step} className="flex gap-3.5 text-sm leading-6 text-slate-700">
                                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EEF1FF] text-xs font-semibold text-primary">{String(index + 1).padStart(2, '0')}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </section>
                    )}

                    {service.slug === 'pendirian-pt-umum' && (
                        <section className="border-t border-slate-200 py-14 sm:py-16">
                            <div className="max-w-3xl">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Referensi hukum</p>
                                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Dasar hukum pendirian PT</h2>
                                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">Dokumen berikut memuat regulasi terkait perseroan terbatas. Klik PDF untuk mengunduh salinan dokumen.</p>
                            </div>

                            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                                        <thead className="bg-slate-900 text-white">
                                            <tr>
                                                <th scope="col" className="w-16 px-4 py-4 text-center font-semibold">#</th>
                                                <th scope="col" className="w-56 px-4 py-4 font-semibold">Peraturan</th>
                                                <th scope="col" className="px-4 py-4 font-semibold">Tentang</th>
                                                <th scope="col" className="w-28 px-4 py-4 text-center font-semibold">Download</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {[
                                                { title: 'UU No. 40/2007', description: 'Perseroan Terbatas — dasar hukum utama perseroan terbatas.', file: 'uu-40-tahun-2007.pdf' },
                                                { title: 'UU No. 11/2020', description: 'Cipta Kerja — dokumen historis; telah dicabut dan digantikan UU No. 6 Tahun 2023.', file: 'uu-11-tahun-2020.pdf', currentUrl: 'https://peraturan.bpk.go.id/Details/246523/uu-no-6-tahun-2023', currentLabel: 'Lihat UU No. 6/2023' },
                                                { title: 'PP No. 27/1998', description: 'Penggabungan, peleburan, dan pengambilalihan perseroan terbatas.', file: 'pp-27-tahun-1998.pdf' },
                                                { title: 'PP No. 43/2011', description: 'Tata cara pengajuan dan pemakaian nama perseroan terbatas.', file: 'pp-43-tahun-2011.pdf' },
                                                { title: 'PP No. 47/2012', description: 'Tanggung jawab sosial dan lingkungan perseroan terbatas.', file: 'pp-47-tahun-2012.pdf' },
                                                { title: 'PP No. 7/2016', description: 'Perubahan modal dasar perseroan terbatas.', file: 'pp-7-tahun-2016.pdf' },
                                                { title: 'Permenkumham No. 21/2021', description: 'Pendaftaran pendirian, perubahan, dan pembubaran PT — dokumen historis; telah dicabut.', file: 'permenkumham-21-2021.pdf', currentUrl: 'https://peraturan.go.id/files/permenkum-no-49-tahun-2025.pdf', currentLabel: 'Lihat Permenkum No. 49/2025' },
                                            ].map((regulation, index) => (
                                                <tr key={regulation.file} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-950">{index + 1}</span>
                                                    </td>
                                                    <th scope="row" className="px-4 py-4 font-semibold text-slate-900">{regulation.title}</th>
                                                    <td className="px-4 py-4 leading-6 text-slate-700">
                                                        {regulation.description}
                                                        {regulation.currentUrl && <a href={regulation.currentUrl} target="_blank" rel="noreferrer noopener" className="ml-1 inline-flex font-semibold text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">{regulation.currentLabel}</a>}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <a href={`/dokumen/${regulation.file}`} download aria-label={`Unduh ${regulation.title} PDF`} className="inline-flex size-10 items-center justify-center rounded-xl bg-white text-primary ring-1 ring-slate-200 transition hover:bg-[#EEF1FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                                            <Download aria-hidden="true" className="size-5" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl border-l-4 border-amber-400 bg-amber-50/70 p-5 sm:p-6">
                                <h3 className="font-semibold text-slate-900">Catatan status regulasi</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-700">UU No. 11 Tahun 2020 berstatus tidak berlaku dan digantikan UU No. 6 Tahun 2023. Permenkumham No. 21 Tahun 2021 juga telah dicabut oleh Permenkum No. 49 Tahun 2025. Tautan pada tabel mengarah ke dokumen pengganti.</p>
                            </div>

                            <div className="mt-8 rounded-2xl border border-slate-200 border-l-4 border-l-amber-400 bg-slate-50 p-5 sm:p-7">
                                <h3 className="flex items-center gap-2 font-semibold text-slate-900"><FileCheck2 aria-hidden="true" className="size-5 text-primary" />Apa itu AHU Online &amp; OSS RBA?</h3>
                                <p className="mt-4 text-sm leading-7 text-slate-700"><strong>AHU Online</strong> (<a href="https://ahu.go.id" target="_blank" rel="noreferrer noopener" className="font-medium text-primary underline underline-offset-2">ahu.go.id</a>) adalah sistem administrasi badan hukum Kementerian Hukum, termasuk untuk pendaftaran perseroan terbatas. Pengesahan badan hukum diterbitkan melalui sistem AHU sesuai ketentuan yang berlaku.</p>
                                <p className="mt-3 text-sm leading-7 text-slate-700"><strong>OSS Berbasis Risiko</strong> (<a href="https://oss.go.id" target="_blank" rel="noreferrer noopener" className="font-medium text-primary underline underline-offset-2">oss.go.id</a>) adalah sistem perizinan berusaha. Setelah perseroan terbentuk, pelaku usaha mengurus NIB dan perizinan sesuai KBLI serta tingkat risiko kegiatan usaha. Penyelenggaraan perizinan berbasis risiko saat ini diatur dalam <a href="https://peraturan.bpk.go.id/Details/319773/pp-no-28-tahun-2025" target="_blank" rel="noreferrer noopener" className="font-semibold text-primary underline underline-offset-2">PP No. 28 Tahun 2025</a>.</p>
                            </div>

                            <p className="mt-6 text-sm leading-7 text-slate-600">Tim LegalPartnerID membantu proses pendirian PT dari akta notaris, pendaftaran AHU, hingga pendampingan perizinan OSS dan administrasi pajak. Klien menyiapkan dokumen pendiri serta informasi perusahaan; tim kami mendampingi tahapan berikutnya. <a href="#persyaratan" className="font-medium text-primary underline underline-offset-2">Lihat persyaratan</a> atau konsultasikan kebutuhan Anda melalui WhatsApp.</p>
                        </section>
                    )}

                    {service.faqs.length > 0 && (
                        <section className="border-t border-slate-200 py-14 sm:py-16">
                            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Informasi layanan</p>
                                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Pertanyaan yang sering muncul.</h2>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">Jawaban singkat seputar {service.name}.</p>
                                </div>
                                <div className="space-y-3">
                                    {service.faqs.map((faq, index) => (
                                        <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white px-4 transition-colors open:border-primary/25 sm:px-5">
                                            <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                                                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F5FF] text-[11px] font-semibold text-primary">{String(index + 1).padStart(2, '0')}</span>
                                                <span className="flex-1 text-sm font-semibold leading-6 text-slate-900 sm:text-base">{faq.question}</span>
                                                <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                                            </summary>
                                            <p className="whitespace-pre-line pb-5 pl-11 pr-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="mb-14 overflow-hidden rounded-3xl bg-[#172F8A] px-6 py-8 text-white sm:mb-16 sm:px-9 sm:py-10 lg:mb-20 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">Langkah berikutnya</p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Perlu memastikan layanan ini cocok?</h2>
                            <p className="mt-3 text-sm leading-6 text-white/75 sm:text-base">Diskusikan kebutuhan {service.name} dengan tim kami sebelum memilih paket.</p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
                            {generalWhatsAppUrl && (
                                <a href={generalWhatsAppUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#172F8A] transition-colors hover:bg-[#EEF1FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#172F8A]">
                                    Konsultasi WhatsApp
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </a>
                            )}
                            <Link href={servicesIndex()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#172F8A]">
                                <ArrowLeft aria-hidden="true" className="size-4" />
                                Semua layanan
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
            <PublicFooter />
        </>
    );
}
