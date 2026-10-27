import { Briefcase, Building2, FileCheck2, HeartPulse, Home, Lightbulb, Receipt, Scale, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
    'pendirian-badan-usaha': Building2,
    'perizinan-usaha': FileCheck2,
    'kekayaan-intelektual': Lightbulb,
    perpajakan: Receipt,
    'legal-korporasi': Scale,
    'ketenagakerjaan-hr': Users,
    'properti-pertanahan': Home,
    'perizinan-sektor-khusus': HeartPulse,
};

export function categoryIcon(slug: string): LucideIcon {
    return categoryIcons[slug] ?? Briefcase;
}
