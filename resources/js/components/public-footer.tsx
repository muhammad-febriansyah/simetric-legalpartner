import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { show as aboutShow } from '@/actions/App/Http/Controllers/Site/AboutPageController';
import { index as blogIndex } from '@/actions/App/Http/Controllers/Site/ArticleController';
import { show as legalShow } from '@/actions/App/Http/Controllers/Site/LegalPageController';
import { show as contactShow } from '@/actions/App/Http/Controllers/Site/ContactController';
import { index as kbliIndex } from '@/actions/App/Http/Controllers/Site/KbliController';
import { index as kbliCheckerIndex } from '@/actions/App/Http/Controllers/Site/KbliCheckerController';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import { index as servicesIndex, show as serviceShow } from '@/actions/App/Http/Controllers/Site/ServiceController';
import { SocialIcon } from '@/components/social-icons';
import { home } from '@/routes';

type SiteFooter = {
    name: string;
    byline: string | null;
    tagline: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    socials: { key: string; label: string; url: string }[];
    legalPages: { title: string; slug: string }[];
    topServices: { name: string; slug: string }[];
};

type SharedProps = {
    siteBrand: { logo: string; logoAltText: string };
    siteFooter: SiteFooter | Record<string, never>;
};

const linkClass =
    'rounded-sm text-sm text-slate-600 transition-colors hover:text-[#2547F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]/60';

function FooterNavLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="group inline-flex w-fit items-center gap-2 rounded-sm text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]/60">
            <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[#2547F9] after:transition-transform after:duration-200 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100">
                {children}
            </span>
            <ArrowRight aria-hidden="true" className="size-3.5 -translate-x-1 text-[#2547F9] opacity-0 transition-[transform,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
        </Link>
    );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{title}</h2>
            <ul className="mt-5 space-y-3">{children}</ul>
        </div>
    );
}

export function PublicFooter() {
    const { props } = usePage<SharedProps>();
    const footer = props.siteFooter as Partial<SiteFooter>;
    const year = new Date().getFullYear();
    const whatsappHref = footer.whatsapp ? `https://wa.me/${footer.whatsapp}` : null;
    const legalPages = footer.legalPages ?? [];

    return (
        <footer className="relative isolate overflow-hidden bg-white text-slate-900">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 size-[30rem] rounded-full bg-[#2547F9]/[0.09] blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-[28%] size-[26rem] rounded-full bg-[#2547F9]/[0.06] blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex flex-col gap-6 border-b border-slate-200 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-14">
                    <div className="max-w-2xl">
                        <p className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Siap merapikan legalitas usaha Anda?</p>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                            Ceritakan rencana usaha Anda. Tim kami bantu petakan izin, dokumen, dan biayanya sebelum Anda memutuskan.
                        </p>
                    </div>
                    <Link
                        href={`${partnershipIndex().url}#form-pendaftaran`}
                        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#2547F9] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1E3EDB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2"
                    >
                        Konsultasi gratis
                        <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                </div>

                <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
                    <div className="sm:col-span-2 lg:col-span-1">
                            <Link href={home()} aria-label={`${footer.name ?? 'LegalPartner.ID'} — Beranda`} className="inline-block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]/60">
                            <img src={props.siteBrand.logo} alt={props.siteBrand.logoAltText} className="h-10 w-40 object-contain object-left" />
                        </Link>
                        {footer.tagline && <p className="mt-5 max-w-xs text-sm leading-6 text-slate-600">{footer.tagline}</p>}
                        {(footer.socials ?? []).length > 0 && (
                            <ul className="mt-6 flex flex-wrap gap-2">
                                {(footer.socials ?? []).map((social) => (
                                    <li key={social.key}>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            aria-label={social.label}
                                            className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[#2547F9]/40 hover:text-[#2547F9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]/60"
                                        >
                                            <SocialIcon name={social.key} className="size-[18px]" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <FooterColumn title="Layanan">
                        {(footer.topServices ?? []).map((service) => (
                            <li key={service.slug}>
                                <FooterNavLink href={serviceShow(service.slug).url}>{service.name}</FooterNavLink>
                            </li>
                        ))}
                        <li>
                            <FooterNavLink href={servicesIndex().url}>
                                Semua layanan
                            </FooterNavLink>
                        </li>
                    </FooterColumn>

                    <FooterColumn title="Perusahaan">
                        <li><FooterNavLink href={aboutShow().url}>Tentang kami</FooterNavLink></li>
                        <li><FooterNavLink href={blogIndex().url}>Blog</FooterNavLink></li>
                        <li><FooterNavLink href={kbliCheckerIndex().url}>Cek KBLI</FooterNavLink></li>
                        <li><FooterNavLink href={kbliIndex().url}>Database KBLI</FooterNavLink></li>
                        <li><FooterNavLink href={partnershipIndex().url}>Kerja sama</FooterNavLink></li>
                        <li><FooterNavLink href={contactShow().url}>Kontak kami</FooterNavLink></li>
                    </FooterColumn>

                    <FooterColumn title="Hubungi kami">
                        {footer.address && (
                            <li className="flex gap-3 text-sm leading-6 text-slate-600">
                                <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-[#2547F9]/70" />
                                <span>{footer.address}</span>
                            </li>
                        )}
                        {whatsappHref && (
                            <li>
                                <a href={whatsappHref} target="_blank" rel="noreferrer noopener" className={`${linkClass} flex gap-3`}>
                                    <MessageCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#2547F9]/70" />
                                    WhatsApp
                                </a>
                            </li>
                        )}
                        {footer.phone && (
                            <li>
                                <a href={`tel:${footer.phone.replace(/[^\d+]/g, '')}`} className={`${linkClass} flex gap-3`}>
                                    <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#2547F9]/70" />
                                    {footer.phone}
                                </a>
                            </li>
                        )}
                        {footer.email && (
                            <li>
                                <a href={`mailto:${footer.email}`} className={`${linkClass} flex gap-3`}>
                                    <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#2547F9]/70" />
                                    {footer.email}
                                </a>
                            </li>
                        )}
                    </FooterColumn>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-200 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {year} {footer.name ?? 'LegalPartner.ID'}
                        {footer.byline && <span> · {footer.byline}</span>}. Hak cipta dilindungi.
                    </p>
                    {legalPages.length > 0 && (
                        <ul className="flex flex-wrap gap-x-5 gap-y-2">
                            {legalPages.map((page) => (
                                <li key={page.slug}>
                                    <FooterNavLink href={legalShow(page.slug).url}>
                                        {page.title}
                                    </FooterNavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </footer>
    );
}
