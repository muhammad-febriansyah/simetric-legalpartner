export const DEFAULT_SERVICE_MESSAGE = [
    'Halo tim LegalPartner.ID,',
    'Saya ingin konsultasi mengenai:',
    'Layanan: {layanan}',
    'Paket: {paket}',
    'Harga tertera: {harga}',
    'Boleh dibantu informasi persyaratan dan prosesnya?',
].join('\n');

export const DEFAULT_CONSULT_MESSAGE = [
    'Halo tim LegalPartner.ID,',
    'Saya ingin konsultasi gratis mengenai legalitas usaha saya.',
    'Boleh dibantu menjelaskan layanan yang sesuai?',
].join('\n');

type WhatsAppMessage = {
    phone: string | null;
    serviceName: string;
    packageName?: string;
    priceLabel?: string;
    template?: string | null;
};

function normalizePhone(phone: string | null): string | null {
    const normalizedPhone = phone?.replace(/\D/g, '');

    return normalizedPhone && /^[1-9]\d{7,14}$/.test(normalizedPhone) ? normalizedPhone : null;
}

function buildUrl(phone: string, message: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`;
}

export function createWhatsAppUrl({
    phone,
    serviceName,
    packageName = 'Belum memilih',
    priceLabel = 'Konsultasikan',
    template,
}: WhatsAppMessage): string | null {
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
        return null;
    }

    const message = (template?.trim() || DEFAULT_SERVICE_MESSAGE)
        .replaceAll('{layanan}', serviceName)
        .replaceAll('{paket}', packageName)
        .replaceAll('{harga}', priceLabel);

    return buildUrl(normalizedPhone, message);
}

export function createConsultationWhatsAppUrl(phone: string | null, template?: string | null): string | null {
    const normalizedPhone = normalizePhone(phone);

    return normalizedPhone ? buildUrl(normalizedPhone, template?.trim() || DEFAULT_CONSULT_MESSAGE) : null;
}
