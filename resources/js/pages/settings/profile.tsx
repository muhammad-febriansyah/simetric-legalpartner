import { Form, Head, usePage } from '@inertiajs/react';
import { UserRoundPen } from 'lucide-react';
import { toast } from 'sonner';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Edit Profil" />

            <div className="max-w-5xl space-y-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Dashboard', href: dashboard() },
                        { title: 'Edit Profil', href: edit() },
                    ]}
                    title="Edit Profil"
                    description="Perbarui informasi akun yang digunakan untuk mengakses panel LegalPartner.ID."
                />

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#2547F9]">
                            <UserRoundPen className="size-5" />
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Informasi akun</h2>
                            <p className="mt-0.5 text-sm text-slate-500">Nama dan email admin yang tampil pada panel.</p>
                        </div>
                    </div>

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        onSuccess={() => toast.success('Profil berhasil diperbarui.')}
                        onError={() => toast.error('Profil belum tersimpan. Periksa kolom yang ditandai.')}
                        className="space-y-6 p-5 sm:p-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama lengkap <span className="text-rose-500">*</span></Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={auth.user.name}
                                            autoComplete="name"
                                            placeholder="Contoh: Admin LegalPartner"
                                            required
                                            className="h-11 rounded-xl border-slate-200 bg-white shadow-none focus-visible:border-[#2547F9]/40 focus-visible:ring-[#2547F9]/15"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email <span className="text-rose-500">*</span></Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={auth.user.email}
                                            autoComplete="username"
                                            placeholder="admin@legalpartner.id"
                                            required
                                            className="h-11 rounded-xl border-slate-200 bg-white shadow-none focus-visible:border-[#2547F9]/40 focus-visible:ring-[#2547F9]/15"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-slate-100 pt-5">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="h-10 rounded-lg bg-[#2547F9] px-5 text-white shadow-sm hover:bg-[#1E3FE0]"
                                    >
                                        {processing ? 'Menyimpan…' : 'Simpan profil'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>

                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Edit Profil',
            href: edit(),
        },
    ],
};
