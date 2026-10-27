import { Head, Link } from "@inertiajs/react";
import type { ComponentProps } from "react";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    BookOpenText,
    BriefcaseBusiness,
    CircleHelp,
    Clock3,
    FolderTree,
    Handshake,
    PackageCheck,
    UserRoundPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { index as articlesIndex } from "@/actions/App/Http/Controllers/Admin/ArticleController";
import { all as faqsIndex } from "@/actions/App/Http/Controllers/Admin/FaqController";
import { index as categoriesIndex } from "@/actions/App/Http/Controllers/Admin/ServiceCategoryController";
import { index as partnersIndex } from "@/actions/App/Http/Controllers/Admin/PartnerController";
import { index as partnershipApplicationsIndex } from "@/actions/App/Http/Controllers/Admin/PartnershipApplicationController";
import { all as packagesIndex } from "@/actions/App/Http/Controllers/Admin/ServicePackageController";
import { index as servicesIndex } from "@/actions/App/Http/Controllers/Admin/ServiceController";
import { ActivityChart, ContentCompositionChart } from "@/components/admin/dashboard-charts";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";

type DashboardStats = {
    activeServices: number;
    totalServices: number;
    activePackages: number;
    totalPackages: number;
    publishedArticles: number;
    draftArticles: number;
    totalArticles: number;
    totalCategories: number;
    totalFaqs: number;
    totalPartners: number;
    newPartnershipApplications: number;
};

type DashboardCharts = {
    activity: {
        labels: string[];
        series: { name: string; data: number[] }[];
    };
    content: { labels: string[]; series: number[] };
};

type RecentService = {
    id: number;
    name: string;
    isActive: boolean;
    updatedAt: string | null;
};

type DashboardProps = {
    stats: DashboardStats;
    charts: DashboardCharts;
    recentServices: RecentService[];
    generatedAt: string;
};

export default function Dashboard({ stats, charts, recentServices, generatedAt }: DashboardProps) {
    const cards = [
        {
            title: "Layanan aktif",
            value: stats.activeServices,
            detail: `${stats.totalServices} layanan terdaftar`,
            icon: BriefcaseBusiness,
            href: servicesIndex(),
            tone: "blue",
        },
        {
            title: "Paket harga aktif",
            value: stats.activePackages,
            detail: `${stats.totalPackages} paket tersedia`,
            icon: PackageCheck,
            href: packagesIndex(),
            tone: "violet",
        },
        {
            title: "Artikel terbit",
            value: stats.publishedArticles,
            detail:
                stats.draftArticles > 0
                    ? `${stats.draftArticles} masih berupa draft`
                    : `${stats.totalArticles} artikel dikelola`,
            icon: BookOpenText,
            href: articlesIndex(),
            tone: "emerald",
        },
        {
            title: "Partner",
            value: stats.totalPartners,
            detail: "Partner terdaftar",
            icon: Handshake,
            href: partnersIndex(),
            tone: "amber",
        },
        {
            title: "Pendaftar mitra baru",
            value: stats.newPartnershipApplications,
            detail: "Perlu ditindaklanjuti",
            icon: UserRoundPlus,
            href: partnershipApplicationsIndex(),
            tone: "rose",
        },
        {
            title: "FAQ dikelola",
            value: stats.totalFaqs,
            detail: `${stats.totalFaqs} pertanyaan tersimpan`,
            icon: CircleHelp,
            href: faqsIndex(),
            tone: "cyan",
        },
    ] as const;

    const updatedLabel = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(generatedAt));

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <PageHeader
                    breadcrumbs={[{ title: "Dashboard", href: dashboard() }]}
                    title="Dashboard"
                    description="Pantau katalog layanan, konten, dan aktivitas website LegalPartner.ID."
                />

                <section
                    aria-label="Ringkasan dashboard"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
                >
                    {cards.map(({ title, value, detail, icon: Icon, href, tone }) => (
                        <Link
                            key={title}
                            href={href}
                            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:border-[#2547F9]/30 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span
                                    className={`flex size-11 items-center justify-center rounded-xl ${toneClasses[tone]}`}
                                >
                                    <Icon className="size-5" />
                                </span>
                                <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-[#2547F9]" />
                            </div>
                            <div className="mt-5 flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{title}</p>
                                    <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                                        {value}
                                    </p>
                                </div>
                                <p className="pb-1 text-right text-xs leading-5 text-slate-500">
                                    {detail}
                                </p>
                            </div>
                        </Link>
                    ))}
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
                    <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 className="font-semibold text-slate-900">Aktivitas katalog</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Data baru ditambahkan dalam enam bulan terakhir.
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="w-fit border-slate-200 bg-[#F7F8FD] font-normal text-slate-600"
                            >
                                6 bulan terakhir
                            </Badge>
                        </div>
                        <ActivityChart
                            labels={charts.activity.labels}
                            series={charts.activity.series}
                        />
                    </div>

                    <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                        <div>
                            <h2 className="font-semibold text-slate-900">Komposisi katalog</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Jumlah data yang sudah dikelola di admin.
                            </p>
                        </div>
                        <ContentCompositionChart
                            labels={charts.content.labels}
                            series={charts.content.series}
                        />
                    </div>
                </section>

                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.02]">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Layanan terakhir diperbarui
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Perubahan terbaru pada katalog layanan.
                                </p>
                            </div>
                            <Button asChild variant="outline" size="sm" className="w-fit">
                                <Link href={servicesIndex()}>
                                    Semua layanan <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                        {recentServices.length > 0 ? (
                            <ul className="divide-y divide-slate-100">
                                {recentServices.map((service) => (
                                    <li
                                        key={service.id}
                                        className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9]">
                                                <BriefcaseBusiness className="size-4" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-800">
                                                    {service.name}
                                                </p>
                                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                    <Clock3 className="size-3" />
                                                    {service.updatedAt
                                                        ? formatDate(service.updatedAt)
                                                        : "Waktu tidak tersedia"}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                service.isActive
                                                    ? "shrink-0 bg-emerald-50 text-emerald-700"
                                                    : "shrink-0 bg-slate-100 text-slate-600"
                                            }
                                        >
                                            {service.isActive ? "Aktif" : "Nonaktif"}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                                <span className="flex size-11 items-center justify-center rounded-xl bg-[#F7F8FD] text-slate-500">
                                    <BriefcaseBusiness className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        Belum ada layanan
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Layanan yang dibuat akan muncul di sini.
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                                >
                                    <Link href={servicesIndex()}>Kelola layanan</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.02] sm:p-6">
                        <h2 className="font-semibold text-slate-900">Ringkasan konten</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Data pendukung halaman website.
                        </p>
                        <div className="mt-5 space-y-1">
                            <SummaryRow
                                icon={FolderTree}
                                label="Kategori layanan"
                                value={stats.totalCategories}
                                href={categoriesIndex()}
                            />
                            <SummaryRow
                                icon={CircleHelp}
                                label="FAQ"
                                value={stats.totalFaqs}
                                href={faqsIndex()}
                            />
                            <SummaryRow
                                icon={BookOpenText}
                                label="Artikel draft"
                                value={stats.draftArticles}
                                href={articlesIndex()}
                                trend={stats.draftArticles > 0}
                            />
                        </div>
                        <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F7F8FD] px-3.5 py-3 text-xs leading-5 text-slate-500">
                            <Clock3 className="mt-0.5 size-3.5 shrink-0" />
                            Data diperbarui {updatedLabel}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

const toneClasses = {
    blue: "bg-blue-50 text-[#2547F9]",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    cyan: "bg-cyan-50 text-cyan-600",
};

function SummaryRow({
    icon: Icon,
    label,
    value,
    href,
    trend = false,
}: {
    icon: LucideIcon;
    label: string;
    value: number;
    href: ComponentProps<typeof Link>["href"];
    trend?: boolean;
}) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-[#F7F8FD]"
        >
            <span className="flex min-w-0 items-center gap-3">
                <Icon className="size-4 shrink-0 text-slate-500" />
                <span className="truncate text-sm text-slate-600">{label}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 font-semibold text-slate-900">
                {trend && value > 0 ? <ArrowDownRight className="size-3.5 text-amber-600" /> : null}
                {value}
            </span>
        </Link>
    );
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(date));
}

Dashboard.layout = {
    breadcrumbs: [{ title: "Dashboard", href: dashboard() }],
};
