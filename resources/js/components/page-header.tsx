import { Breadcrumbs } from '@/components/breadcrumbs';
import type { BreadcrumbItem } from '@/types';

type PageHeaderProps = {
    breadcrumbs: BreadcrumbItem[];
    title: string;
    description: string;
};

export function PageHeader({
    breadcrumbs,
    title,
    description,
}: PageHeaderProps) {
    return (
        <header className="space-y-3">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {title}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                    {description}
                </p>
            </div>
        </header>
    );
}
