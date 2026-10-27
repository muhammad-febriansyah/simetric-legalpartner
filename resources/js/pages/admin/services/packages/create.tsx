import ServicePackageForm from '@/pages/admin/services/packages/package-form';

type ServiceSummary = { id: number; name: string; slug: string };

export default function CreateServicePackage({ service }: { service: ServiceSummary }) {
    return <ServicePackageForm service={service} package={null} />;
}

