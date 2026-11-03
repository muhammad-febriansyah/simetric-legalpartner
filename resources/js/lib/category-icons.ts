import { Briefcase, Building2, FileCheck2, Home, Lightbulb, Receipt, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
    'legalitas-usaha': Building2,
    'perizinan-usaha': FileCheck2,
    'kekayaan-intelektual': Lightbulb,
    perpajakan: Receipt,
    'ketenagakerjaan-hr': Users,
    'properti-pertanahan': Home,
};

export function categoryIcon(slug: string): LucideIcon {
    return categoryIcons[slug] ?? Briefcase;
}
