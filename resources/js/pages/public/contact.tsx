import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { index as partnershipIndex } from '@/actions/App/Http/Controllers/Site/PartnershipApplicationController';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';

type Props = {
    contact: {
        email: string | null;
        phone: string | null;
        whatsapp: string | null;
        address: string | null;
        mapsEmbedUrl: string | null;
    };
};

const topics = ['Pendirian badan usaha', 'Perizinan usaha', 'Merek dan hak cipta', 'Perpajakan', 'Lainnya'];

const fieldClass =
    'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#2547F9] focus:ring-2 focus:ring-[#2547F9]/15';

function formatWhatsapp(number: string): string {
    if (!number.startsWith('62') || number.length < 10) {
        return `+${number}`;
    }

    const local = number.slice(2);

    return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`;
}

export default function Contact({ contact }: Props) {
    const [name, setName] = useState('');
    const [topic, setTopic] = useState(topics[0]);
    const [message, setMessage] = useState('');

    const composeMessage = () => `Halo LegalPartner.ID, saya ${name.trim()}.\nTopik: ${topic}\n\n${message.trim()}`;

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (contact.whatsapp) {
            window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(composeMessage())}`, '_blank', 'noopener,noreferrer');
            toast.success('Membuka WhatsApp', { description: 'Pesan Anda sudah disiapkan, tinggal kirim.' });

            return;
        }

        if (contact.email) {
            window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(composeMessage())}`;
        }
    };

    const channels = [
        contact.whatsapp && {
            key: 'whatsapp',
            icon: MessageCircle,
            label: 'WhatsApp',
            value: formatWhatsapp(contact.whatsapp),
            action: 'Chat sekarang',
            href: `https://wa.me/${contact.whatsapp}`,
            external: true,
        },
        contact.phone && {
            key: 'phone',
            icon: Phone,
            label: 'Telepon',
            value: contact.phone,
            action: 'Hubungi',
            href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
            external: false,
        },
        contact.email && {
            key: 'email',
            icon: Mail,
            label: 'Email',
            value: contact.email,
            action: 'Kirim email',
            href: `mailto:${contact.email}`,
            external: false,
        },
    ].filter(Boolean) as { key: string; icon: typeof Mail; label: string; value: string; action: string; href: string; external: boolean }[];

    return (
        <>
            <Head title="Kontak Kami">
                <meta name="description" content="Hubungi tim LegalPartner.ID lewat WhatsApp, telepon, atau email untuk konsultasi legalitas usaha." />
            </Head>
            <PublicNavbar />
            <main className="bg-white text-slate-900">
                <section className="bg-[#F7F8FD]">
                    <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 lg:pb-20 lg:pt-20">
                        <p className="text-sm font-semibold text-[#2547F9]">Kontak kami</p>
                        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl">
                            Ada pertanyaan soal legalitas usaha? Tanyakan langsung.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                            Pilih saluran yang paling nyaman. Konsultasi awal gratis dan tanpa kewajiban memesan.
                        </p>

                        <ul className="mt-12 grid gap-4 md:grid-cols-3">
                            {channels.map((channel) => (
                                <li key={channel.key}>
                                    <a
                                        href={channel.href}
                                        {...(channel.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                                        className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-[#2547F9]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9]"
                                    >
                                        <span className="flex size-11 items-center justify-center rounded-xl bg-[#2547F9]/[0.08] text-[#2547F9] transition-colors group-hover:bg-[#2547F9] group-hover:text-white">
                                            <channel.icon aria-hidden="true" className="size-5" />
                                        </span>
                                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">{channel.label}</p>
                                        <p className="mt-1 break-words text-lg font-semibold text-slate-950">{channel.value}</p>
                                        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-[#2547F9]">
                                            {channel.action}
                                            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Kirim pesan</h2>
                            <p className="mt-3 text-base leading-7 text-slate-600">
                                Isi singkat kebutuhan Anda. Pesan akan terbuka di {contact.whatsapp ? 'WhatsApp' : 'aplikasi email'} dan siap Anda kirim ke tim kami.
                            </p>
                            <form onSubmit={submit} className="mt-8 grid gap-5">
                                <div className="grid gap-2">
                                    <label htmlFor="contact-name" className="text-sm font-medium text-slate-800">Nama</label>
                                    <input id="contact-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama lengkap Anda" autoComplete="name" className={fieldClass} />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="contact-topic" className="text-sm font-medium text-slate-800">Topik</label>
                                    <select id="contact-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className={fieldClass}>
                                        {topics.map((item) => (
                                            <option key={item}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="contact-message" className="text-sm font-medium text-slate-800">Pesan</label>
                                    <textarea id="contact-message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ceritakan rencana usaha atau pertanyaan Anda" className={`${fieldClass} h-auto py-3 leading-6`} />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!contact.whatsapp && !contact.email}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2547F9] px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_22px_-10px_rgba(37,71,249,0.7)] transition-colors hover:bg-[#1E3EDB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2547F9] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                                >
                                    {contact.whatsapp ? 'Lanjut ke WhatsApp' : 'Buka email'}
                                    <ArrowRight aria-hidden="true" className="size-4" />
                                </button>
                            </form>
                        </div>

                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Kantor kami</h2>
                            {contact.address && (
                                <p className="mt-4 flex gap-3 text-base leading-7 text-slate-600">
                                    <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#2547F9]" />
                                    {contact.address}
                                </p>
                            )}
                            {contact.mapsEmbedUrl ? (
                                <iframe
                                    title="Lokasi kantor LegalPartner.ID"
                                    src={contact.mapsEmbedUrl}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="mt-6 aspect-[4/3] w-full rounded-2xl border border-slate-200 bg-slate-100"
                                />
                            ) : (
                                <div className="mt-6 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">Peta belum tersedia</div>
                            )}
                            <p className="mt-6 text-sm text-slate-500">
                                Ingin bergabung sebagai mitra?{' '}
                                <Link href={partnershipIndex()} className="font-semibold text-[#2547F9] underline-offset-4 hover:underline">Lihat program kerja sama</Link>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <PublicFooter />
        </>
    );
}
