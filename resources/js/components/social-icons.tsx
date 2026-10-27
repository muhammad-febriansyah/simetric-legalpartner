import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <path d="M16.6 3c.3 2.4 1.7 3.9 4 4.1v3a7 7 0 0 1-4-1.3v6.2a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2 2.8V3h3Z" />
        </svg>
    );
}

export function SocialIcon({ name, className = 'size-4' }: { name: string; className?: string }) {
    switch (name) {
        case 'instagram':
            return <Instagram aria-hidden="true" className={className} />;
        case 'facebook':
            return <Facebook aria-hidden="true" className={className} />;
        case 'linkedin':
            return <Linkedin aria-hidden="true" className={className} />;
        case 'youtube':
            return <Youtube aria-hidden="true" className={className} />;
        case 'x':
            return <Twitter aria-hidden="true" className={className} />;
        case 'tiktok':
            return <TikTokIcon className={className} />;
        default:
            return null;
    }
}
