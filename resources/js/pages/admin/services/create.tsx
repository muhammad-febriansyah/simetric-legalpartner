import ServiceForm from '@/pages/admin/services/service-form';

type ServiceCategory = { id: number; name: string };

export default function CreateService({ categories }: { categories: ServiceCategory[] }) {
    return <ServiceForm service={null} categories={categories} />;
}
