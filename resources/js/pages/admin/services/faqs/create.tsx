import FaqForm from '@/pages/admin/services/faqs/faq-form';

type ServiceSummary = { id: number; name: string; slug: string };

export default function CreateFaq({ service }: { service: ServiceSummary }) {
    return <FaqForm service={service} faq={null} />;
}
