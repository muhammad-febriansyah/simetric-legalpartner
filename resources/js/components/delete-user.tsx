import { Form } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <section className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-rose-100 px-5 py-5 sm:px-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <AlertTriangle className="size-5" />
                </span>
                <div>
                    <h2 className="text-base font-semibold text-slate-900">Hapus akun</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Hapus akun admin dan seluruh data terkait secara permanen.</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    Tindakan ini tidak dapat dibatalkan. Masukkan password untuk mengonfirmasi penghapusan akun.
                </p>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="shrink-0 rounded-lg"
                            data-test="delete-user-button"
                        >
                            Hapus akun
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="border-slate-200 bg-white sm:max-w-lg">
                        <DialogTitle>
                            Yakin ingin menghapus akun?
                        </DialogTitle>
                        <DialogDescription>
                            Akun dan seluruh data terkait akan dihapus permanen. Masukkan password untuk melanjutkan.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                                placeholder="Masukkan password saat ini"
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Batal
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Hapus akun
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
