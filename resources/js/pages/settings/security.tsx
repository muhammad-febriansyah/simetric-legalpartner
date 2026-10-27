import { Form, Head } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { edit as editSecurity } from '@/routes/security';

type Props = {
    passwordRules: string;
};

export default function Security({ passwordRules }: Props) {
    return (
        <>
            <Head title="Ganti Password" />

            <div className="max-w-5xl space-y-6">
                <PageHeader
                    breadcrumbs={[
                        { title: 'Dashboard', href: dashboard() },
                        { title: 'Ganti Password', href: editSecurity() },
                    ]}
                    title="Ganti Password"
                    description="Perbarui password akun admin untuk menjaga akses panel tetap aman."
                />

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#2547F9]">
                            <KeyRound className="size-5" />
                        </span>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Ubah password</h2>
                            <p className="mt-0.5 text-sm text-slate-500">Masukkan password saat ini, lalu buat password baru.</p>
                        </div>
                    </div>

                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onSuccess={() => toast.success('Password berhasil diperbarui.')}
                        onError={() => toast.error('Password belum diperbarui. Periksa kolom yang ditandai.')}
                        className="space-y-6 p-5 sm:p-6"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="current_password">Password saat ini <span className="text-rose-500">*</span></Label>
                                        <PasswordInput
                                            id="current_password"
                                            name="current_password"
                                            autoComplete="current-password"
                                            placeholder="Masukkan password saat ini"
                                            required
                                            className="h-11 rounded-xl border-slate-200 bg-white shadow-none focus-visible:border-[#2547F9]/40 focus-visible:ring-[#2547F9]/15"
                                        />
                                        <InputError message={errors.current_password} />
                                    </div>

                                    <div className="grid content-start gap-2">
                                        <Label htmlFor="password">Password baru <span className="text-rose-500">*</span></Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            autoComplete="new-password"
                                            placeholder="Buat password baru"
                                            passwordrules={passwordRules}
                                            required
                                            className="h-11 rounded-xl border-slate-200 bg-white shadow-none focus-visible:border-[#2547F9]/40 focus-visible:ring-[#2547F9]/15"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid content-start gap-2 md:col-span-2">
                                        <Label htmlFor="password_confirmation">Konfirmasi password baru <span className="text-rose-500">*</span></Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            placeholder="Ulangi password baru"
                                            passwordrules={passwordRules}
                                            required
                                            className="h-11 rounded-xl border-slate-200 bg-white shadow-none focus-visible:border-[#2547F9]/40 focus-visible:ring-[#2547F9]/15"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-slate-100 pt-5">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-10 rounded-lg bg-[#2547F9] px-5 text-white shadow-sm hover:bg-[#1E3FE0]"
                                    >
                                        {processing ? 'Menyimpan…' : 'Simpan password'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </section>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Ganti Password',
            href: editSecurity(),
        },
    ],
};
