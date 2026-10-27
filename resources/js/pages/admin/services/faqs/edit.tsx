import FaqForm, { type FaqFormData } from '@/pages/admin/services/faqs/faq-form';

type ServiceSummary = { id: number; name: string; slug: string };

export default function EditFaq({ service, faq }: { service: ServiceSummary; faq: FaqFormData }) {
    return <FaqForm service={service} faq={faq} />;
}
