import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, BriefcaseBusiness, Check, PackageCheck } from 'lucide-react';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import { show as contactShow } from '@/actions/App/Http/Controllers/Site/ContactController';
import { MarkdownContent } from '@/components/admin/markdown-editor';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';

type AboutPageData = {
    title: string;
    subtitle: string;
    content: string;
    bannerImageUrl: string | null;
    vision: string;
    mission: string;
    process: string;
    features: string;
};

type Props = {
    aboutPage: AboutPageData;
    stats: { services: number; packages: number; articles: number };
};

const proseClass =
    'text-base leading-8 text-slate-600 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_h2:first-child]:mt-0 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:pl-1 [&_ol]:space-y-2 [&_ul]:space-y-2 [&_strong]:text-slate-900';

/** Parses lines such as "1. **Judul** — uraian" into steps; returns an empty list when the format differs. */
function parseTitledList(markdown: string, ordered: boolean): { title: string; text: string }[] {
    const marker = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;

    return markdown
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => marker.test(line))
        .map((line) => line.replace(marker, ''))
        .map((line) => {
            const match = line.match(/^\*\*(.+?)\*\*\s*[—–-]?\s*(.*)$/);

            return match ? { title: match[1], text: match[2] } : null;
        })
        .filter((item): item is { title: string; text: string } => item !== null);
}

export default function About({ aboutPage, stats }: Props) {
    const steps = parseTitledList(aboutPage.process, true);
    const features = parseTitledList(aboutPage.features, false);
    const consultHref = `${partnershipIndex().url}#form-pendaftaran`;

    return (
        <>
            <Head title="Tentang Kami">
                <meta name="description" content={aboutPage.subtitle} />
            </Head>
            <PublicNavbar />
            <main className="bg-white text-slate-900">
                <section className="bg-[#F7F8FD]">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-20">
                        <div>
                            <p className="text-sm font-semibold text-[#2547F9]">Tentang LegalPartner.ID</p>
                            <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">{aboutPage.title}</h1>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{aboutPage.subtitle}</p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href={consultHref} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2547F9] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_22px_-10px_rgba(37,71,249,0.7)] transition-colors hover:bg-[#1E3EDB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2">
                                    Konsultasi gratis
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </Link>
                                <Link href={contactShow()} className="inline-flex h-12 items-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2">
                                    Hubungi kami
                                </Link>
                            </div>
                        </div>
                        {aboutPage.bannerImageUrl && (
                            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.5)]">
                                <img src={aboutPage.bannerImageUrl} alt="" className="size-full object-cover" />
                            </div>
                        )}
                    </div>
                </section>

                <section className="border-b border-slate-200">
                    <dl className="mx-auto grid max-w-7xl gap-3 px-5 py-5 sm:grid-cols-3 sm:px-8 sm:py-6">
                        {[
                            { value: stats.services, label: 'layanan legalitas', icon: BriefcaseBusiness },
                            { value: stats.packages, label: 'pilihan paket', icon: PackageCheck },
                            { value: stats.articles, label: 'panduan di blog', icon: BookOpen },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-[#F7F8FD] px-4 py-4 sm:px-5">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2547F9] shadow-sm ring-1 ring-slate-200/70">
                                    <item.icon aria-hidden="true" className="size-5" />
                                </span>
                                <span>
                                    <dd className="text-2xl font-semibold leading-7 tracking-tight text-slate-950">{item.value}</dd>
                                    <dt className="mt-0.5 text-sm text-slate-500">{item.label}</dt>
                                </span>
                            </div>
                        ))}
                    </dl>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
                    <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
                        <div className="max-w-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2547F9]">Siapa kami</p>
                            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">Mitra legalitas yang menjelaskan sebelum bekerja.</h2>
                            <p className="mt-4 text-sm leading-6 text-slate-600">Kenali pendekatan dan prinsip yang kami pegang saat mendampingi pelaku usaha.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200/80 bg-[#F7F8FD] p-6 sm:p-8 lg:p-10">
                            <MarkdownContent value={aboutPage.content} className={proseClass} />
                        </div>
                    </div>
                </section>

                <section className="bg-[#F7F8FD]">
                    <div className="mx-auto grid max-w-7xl gap-4 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-5 lg:py-20">
                        <div className="rounded-3xl bg-[#172F8A] p-7 text-white sm:p-9 lg:p-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">Visi</p>
                            <MarkdownContent
                                value={aboutPage.vision}
                                className="mt-5 [&_p]:text-2xl [&_p]:font-semibold [&_p]:leading-snug [&_p]:tracking-tight [&_p]:text-white sm:[&_p]:text-3xl"
                            />
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9 lg:p-10">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2547F9]">Misi</p>
                            <MarkdownContent
                                value={aboutPage.mission}
                                className="mt-4 text-base leading-7 text-slate-600 [&_li]:border-t [&_li]:border-slate-100 [&_li]:py-3 [&_li]:pl-0 [&_ul]:list-none [&_ul]:p-0 [&_strong]:text-slate-900"
                            />
                        </div>
                    </div>
                </section>

                <section id="proses" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 lg:py-24">
                    <div className="max-w-xl">
                        <p className="text-sm font-semibold text-[#2547F9]">Cara kami bekerja</p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Tahapan yang bisa Anda ikuti</h2>
                    </div>
                    {steps.length > 0 ? (
                        <ol className="mt-12 grid gap-8 md:grid-cols-5 md:gap-6">
                            {steps.map((step, index) => (
                                <li key={step.title}>
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#172F8A] text-sm font-semibold text-white">{index + 1}</span>
                                        {index < steps.length - 1 && <span aria-hidden="true" className="hidden h-px flex-1 bg-slate-200 md:block" />}
                                    </div>
                                    <h3 className="mt-5 text-base font-semibold text-slate-950">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <MarkdownContent value={aboutPage.process} className={`mt-10 max-w-3xl ${proseClass}`} />
                    )}
                </section>

                <section className="bg-[#F7F8FD]">
                    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
                        <div className="max-w-xl">
                            <p className="text-sm font-semibold text-[#2547F9]">Alasan memilih kami</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Yang bisa Anda harapkan</h2>
                        </div>
                        {features.length > 0 ? (
                            <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">
                                {features.map((feature) => (
                                    <li key={feature.title} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                            <Check aria-hidden="true" className="size-4" />
                                        </span>
                                        <span>
                                            <h3 className="text-base font-semibold text-slate-950">{feature.title}</h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <MarkdownContent value={aboutPage.features} className={`mt-10 max-w-3xl ${proseClass}`} />
                        )}
                    </div>
                </section>

            </main>
            <PublicFooter />
        </>
    );
}
