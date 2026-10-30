import AddonForm, { type AddonFormData } from '@/pages/admin/services/addons/addon-form';

type Service = { id: number; name: string; slug: string };
export default function EditAddon({ service, addon }: { service: Service; addon: AddonFormData }) { return <AddonForm service={service} addon={addon} />; }
