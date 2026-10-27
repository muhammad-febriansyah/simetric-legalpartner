type WhatsAppMessage = {
    phone: string | null;
    serviceName: string;
    packageName?: string;
    priceLabel?: string;
};

export function createWhatsAppUrl({
    phone,
    serviceName,
    packageName = 'Belum memilih',
    priceLabel = 'Konsultasikan',
}: WhatsAppMessage): string | null {
    const normalizedPhone = phone?.replace(/\D/g, '');

    if (!normalizedPhone || !/^[1-9]\d{7,14}$/.test(normalizedPhone)) {
        return null;
    }

    const message = [
        'Halo tim LegalPartner.ID,',
        'Saya ingin konsultasi mengenai:',
        `Layanan: ${serviceName}`,
        `Paket: ${packageName}`,
        `Harga tertera: ${priceLabel}`,
        'Boleh dibantu informasi persyaratan dan prosesnya?',
    ].join('\n');

    return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
