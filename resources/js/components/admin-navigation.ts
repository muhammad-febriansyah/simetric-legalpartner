import {
    BriefcaseBusiness,
    Building2,
    CircleHelp,
    FileText,
    FolderTree,
    Globe2,
    Handshake,
    LayoutGrid,
    PackageCheck,
    ScrollText,
    UserRoundPlus,
    Users,
} from 'lucide-react';
import { index as adminServicesIndex } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { index as adminCategoriesIndex } from '@/actions/App/Http/Controllers/Admin/ServiceCategoryController';
import { all as adminServicePackagesIndex } from '@/actions/App/Http/Controllers/Admin/ServicePackageController';
import { all as adminFaqsIndex } from '@/actions/App/Http/Controllers/Admin/FaqController';
import { index as adminArticlesIndex } from '@/actions/App/Http/Controllers/Admin/ArticleController';
import { index as adminUsersIndex } from '@/actions/App/Http/Controllers/Admin/UserController';
import { index as adminPartnersIndex } from '@/actions/App/Http/Controllers/Admin/PartnerController';
import { index as partnershipApplicationsIndex } from '@/actions/App/Http/Controllers/Admin/PartnershipApplicationController';
import { edit as websiteSettingsEdit } from '@/actions/App/Http/Controllers/Admin/WebsiteSettingsController';
import { edit as aboutPageEdit } from '@/actions/App/Http/Controllers/Admin/AboutPageController';
import { index as legalPagesIndex } from '@/actions/App/Http/Controllers/Admin/LegalPageController';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

type AdminNavigationGroup = {
    title: string;
    items: (NavItem & { description: string })[];
};

export const mainNavGroups: AdminNavigationGroup[] = [
    {
        title: 'Ringkasan',
        items: [
            {
                title: 'Dashboard',
                description: 'Ringkasan panel admin',
                href: dashboard(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        title: 'Katalog layanan',
        items: [
            {
                title: 'Kategori Layanan',
                description: 'Kelola kelompok layanan',
                href: adminCategoriesIndex(),
                icon: FolderTree,
            },
            {
                title: 'Layanan',
                description: 'Kelola katalog layanan',
                href: adminServicesIndex(),
                icon: BriefcaseBusiness,
            },
            {
                title: 'Paket Harga',
                description: 'Kelola paket dan harga layanan',
                href: adminServicePackagesIndex(),
                icon: PackageCheck,
            },
            {
                title: 'FAQ',
                description: 'Kelola pertanyaan umum layanan',
                href: adminFaqsIndex(),
                icon: CircleHelp,
            },
        ],
    },
    {
        title: 'Konten website',
        items: [
            {
                title: 'Artikel',
                description: 'Kelola artikel dan publikasi',
                href: adminArticlesIndex(),
                icon: FileText,
            },
            {
                title: 'Tentang Kami',
                description: 'Kelola profil dan informasi perusahaan',
                href: aboutPageEdit(),
                icon: Building2,
            },
            {
                title: 'Halaman Legal',
                description: 'Kelola kebijakan dan syarat layanan',
                href: legalPagesIndex(),
                icon: ScrollText,
            },
            {
                title: 'Pengaturan Website',
                description: 'Identitas, SEO, kontak, dan media sosial',
                href: websiteSettingsEdit(),
                icon: Globe2,
            },
        ],
    },
    {
        title: 'Kemitraan',
        items: [
            {
                title: 'Partner',
                description: 'Kelola daftar partner website',
                href: adminPartnersIndex(),
                icon: Handshake,
            },
            {
                title: 'Pendaftar Mitra',
                description: 'Tinjau pengajuan kerja sama',
                href: partnershipApplicationsIndex(),
                icon: UserRoundPlus,
            },
        ],
    },
    {
        title: 'Akses',
        items: [
            {
                title: 'Pengguna',
                description: 'Kelola akun administrator',
                href: adminUsersIndex(),
                icon: Users,
            },
        ],
    },
];
