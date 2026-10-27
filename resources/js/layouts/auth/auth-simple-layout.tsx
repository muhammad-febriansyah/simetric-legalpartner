import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { siteBrand } = usePage().props;

    return (
        <main className="flex min-h-svh flex-col items-center justify-center bg-background px-5 py-10">
            <div className="w-full max-w-md">
                <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_20px_70px_rgba(19,69,173,0.09)] sm:p-10">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-7">
                            <Link
                                href={home()}
                                aria-label="Kembali ke beranda LegalPartner.ID"
                                className="flex w-full justify-center"
                            >
                                <img
                                    src={siteBrand.logo}
                                    alt={siteBrand.logoAltText}
                                    className="h-auto w-full max-w-[260px]"
                                />
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                    {title}
                                </h1>
                                <p className="text-center text-sm leading-6 text-slate-500">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}
