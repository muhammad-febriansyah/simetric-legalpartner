import AddonForm from '@/pages/admin/services/addons/addon-form';

type Service = { id: number; name: string; slug: string };
export default function CreateAddon({ service }: { service: Service }) { return <AddonForm service={service} addon={null} />; }
