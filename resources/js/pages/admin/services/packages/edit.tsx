import ServicePackageForm, { type ServicePackageFormData } from '@/pages/admin/services/packages/package-form';

type ServiceSummary = { id: number; name: string; slug: string };

export default function EditServicePackage({
    service,
    package: servicePackage,
}: {
    service: ServiceSummary;
    package: ServicePackageFormData;
}) {
    return <ServicePackageForm service={service} package={servicePackage} />;
}

