import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { show as contactShow } from '@/actions/App/Http/Controllers/Site/ContactController';
import { createConsultationWhatsAppUrl } from '@/lib/whatsapp';

type ConsultLinkProps = {
    className?: string;
    children: ReactNode;
    tabIndex?: number;
};

/**
 * "Konsultasi gratis" call to action: opens WhatsApp with a prefilled consultation message,
 * or falls back to the contact page when no WhatsApp number is configured.
 */
export function ConsultLink({ className, children, tabIndex }: ConsultLinkProps) {
    const { props } = usePage<{ siteContact?: { whatsapp: string | null; consultMessage?: string | null } }>();
    const whatsappUrl = createConsultationWhatsAppUrl(props.siteContact?.whatsapp ?? null, props.siteContact?.consultMessage);

    if (whatsappUrl) {
        return (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={className} tabIndex={tabIndex}>
                {children}
            </a>
        );
    }

    return (
        <Link href={contactShow()} className={className} tabIndex={tabIndex}>
            {children}
        </Link>
    );
}
