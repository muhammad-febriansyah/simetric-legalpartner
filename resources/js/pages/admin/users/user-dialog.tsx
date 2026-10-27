import { useEffect, type FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import {
    store as storeUser,
    update as updateUser,
} from "@/actions/App/Http/Controllers/Admin/UserController";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AdminUserData = {
    id: number;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: string | null;
    isCurrentUser: boolean;
};

type UserValues = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type UserDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: AdminUserData | null;
};

export function UserDialog({ open, onOpenChange, user }: UserDialogProps) {
    const isEditing = user !== null;
    const form = useForm<UserValues>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData({
            name: user?.name ?? "",
            email: user?.email ?? "",
            password: "",
            password_confirmation: "",
        });
        form.clearErrors();
    }, [open, user]);

    function submit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditing ? "Pengguna berhasil diperbarui." : "Pengguna berhasil dibuat.",
                );
                onOpenChange(false);
            },
            onError: () => toast.error("Pengguna belum tersimpan. Periksa kolom yang ditandai."),
        };

        if (user) {
            form.put(updateUser.url(user.id), options);
            return;
        }

        form.post(storeUser.url(), options);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit pengguna" : "Tambah pengguna"}</DialogTitle>
                    <DialogDescription>
                        Kelola akun administrator yang dapat mengakses panel LegalPartner.ID.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="admin_user_name">
                            Nama lengkap{" "}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                        </Label>
                        <Input
                            id="admin_user_name"
                            value={form.data.name}
                            onChange={(event) => form.setData("name", event.target.value)}
                            placeholder="Contoh: Nama Admin"
                            maxLength={255}
                            required
                            autoComplete="name"
                            aria-invalid={Boolean(form.errors.name)}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="admin_user_email">
                            Email{" "}
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                        </Label>
                        <Input
                            id="admin_user_email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) => form.setData("email", event.target.value)}
                            placeholder="admin@legalpartner.id"
                            maxLength={255}
                            required
                            autoComplete="email"
                            aria-invalid={Boolean(form.errors.email)}
                        />
                        <InputError message={form.errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="admin_user_password">
                            Password{" "}
                            {!isEditing && (
                                <span className="text-destructive" aria-hidden="true">
                                    *
                                </span>
                            )}
                        </Label>
                        <PasswordInput
                            id="admin_user_password"
                            value={form.data.password}
                            onChange={(event) => form.setData("password", event.target.value)}
                            placeholder={
                                isEditing
                                    ? "Kosongkan jika tidak diganti"
                                    : "Buat password untuk akun admin"
                            }
                            autoComplete="new-password"
                            required={!isEditing}
                            aria-invalid={Boolean(form.errors.password)}
                        />
                        <InputError message={form.errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="admin_user_password_confirmation">
                            Konfirmasi password{" "}
                            {!isEditing && (
                                <span className="text-destructive" aria-hidden="true">
                                    *
                                </span>
                            )}
                        </Label>
                        <PasswordInput
                            id="admin_user_password_confirmation"
                            value={form.data.password_confirmation}
                            onChange={(event) =>
                                form.setData("password_confirmation", event.target.value)
                            }
                            placeholder="Ulangi password"
                            autoComplete="new-password"
                            required={!isEditing && form.data.password.length > 0}
                            aria-invalid={Boolean(form.errors.password)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Password baru mengikuti ketentuan keamanan aplikasi.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                        >
                            {form.processing
                                ? "Menyimpan…"
                                : isEditing
                                  ? "Simpan perubahan"
                                  : "Simpan pengguna"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
