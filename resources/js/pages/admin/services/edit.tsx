import ServiceForm, { type ServiceFormData } from '@/pages/admin/services/service-form';

type ServiceCategory = { id: number; name: string };

export default function EditService({
    service,
    categories,
    packageCount,
    faqCount,
}: {
    service: ServiceFormData;
    categories: ServiceCategory[];
    packageCount: number;
    faqCount: number;
}) {
    return <ServiceForm service={service} categories={categories} packageCount={packageCount} faqCount={faqCount} />;
}
