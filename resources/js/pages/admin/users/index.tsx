import { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Ellipsis, Pencil, ShieldCheck, Trash2, Users } from "lucide-react";
import { index as usersIndex } from "@/actions/App/Http/Controllers/Admin/UserController";
import { DebouncedSearchInput } from "@/components/admin/debounced-search-input";
import { DataTable, dataTableFeatures } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDeleteDialog } from "./user-delete-dialog";
import { UserDialog, type AdminUserData } from "./user-dialog";

type PaginatedUsers = {
    data: AdminUserData[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

const columnHelper = createColumnHelper<typeof dataTableFeatures, AdminUserData>();

function formatDate(value: string | null): string {
    if (!value) {
        return "Belum tercatat";
    }

    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminUsersIndex({
    users,
    search,
}: {
    users: PaginatedUsers;
    search: string;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
    const [deletingUser, setDeletingUser] = useState<AdminUserData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.accessor("name", {
                    header: "Pengguna",
                    cell: ({ row }) => (
                        <div className="grid gap-1 whitespace-normal">
                            <span className="flex flex-wrap items-center gap-2 font-medium text-foreground">
                                {row.original.name}
                                {row.original.isCurrentUser && (
                                    <Badge variant="outline">Anda</Badge>
                                )}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {row.original.email}
                            </span>
                        </div>
                    ),
                }),
                columnHelper.display({
                    id: "role",
                    header: "Akses",
                    cell: () => (
                        <Badge
                            variant="secondary"
                            className="gap-1 bg-[#2547F9]/[0.08] text-[#2547F9]"
                        >
                            <ShieldCheck className="size-3.5" />
                            Administrator
                        </Badge>
                    ),
                }),
                columnHelper.accessor("isVerified", {
                    header: "Status",
                    cell: ({ getValue }) => (
                        <Badge
                            variant={getValue() ? "secondary" : "outline"}
                            className={
                                getValue()
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-muted-foreground"
                            }
                        >
                            {getValue() ? "Terverifikasi" : "Belum diverifikasi"}
                        </Badge>
                    ),
                }),
                columnHelper.accessor("createdAt", {
                    header: "Terdaftar",
                    cell: ({ getValue }) => (
                        <span className="text-sm text-muted-foreground">
                            {formatDate(getValue())}
                        </span>
                    ),
                }),
                columnHelper.display({
                    id: "actions",
                    header: () => <span className="block text-right">Aksi</span>,
                    cell: ({ row }) => {
                        const user = row.original;

                        return (
                            <div className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            aria-label={`Aksi pengguna ${user.name}`}
                                        >
                                            <Ellipsis className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setEditingUser(user);
                                                setDialogOpen(true);
                                            }}
                                        >
                                            <Pencil />
                                            Edit pengguna
                                        </DropdownMenuItem>
                                        {!user.isCurrentUser && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onSelect={() => {
                                                        setDeletingUser(user);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <Trash2 />
                                                    Hapus pengguna
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        );
                    },
                }),
            ]),
        [],
    );

    function changePage(pageIndex: number): void {
        const link = users.links.find((item) => item.label === String(pageIndex + 1));

        if (link?.url) {
            router.visit(link.url, { preserveScroll: true, preserveState: true });
        }
    }

    function openCreateDialog(): void {
        setEditingUser(null);
        setDialogOpen(true);
    }

    return (
        <>
            <Head title="Pengguna" />
            <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PageHeader
                        breadcrumbs={[
                            { title: "Dashboard", href: "/dashboard" },
                            { title: "Pengguna", href: usersIndex() },
                        ]}
                        title="Pengguna"
                        description="Kelola akun administrator yang memiliki akses ke panel."
                    />
                    <Button
                        type="button"
                        onClick={openCreateDialog}
                        className="shrink-0 bg-[#2547F9] text-white hover:bg-[#1E3EDB]"
                    >
                        <Users className="size-4" />
                        Tambah pengguna
                    </Button>
                </div>

                <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm shadow-slate-900/[0.02]">
                    <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:px-6">
                        <div>
                            <div className="flex items-center gap-2 font-semibold">
                                <Users className="size-4 text-[#2547F9]" />
                                Daftar pengguna
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {users.total > 0
                                    ? `${users.total} akun administrator.`
                                    : "Belum ada akun administrator."}
                            </p>
                        </div>
                        <DebouncedSearchInput
                            action={usersIndex.url()}
                            search={search}
                            placeholder="Cari nama atau email"
                            ariaLabel="Cari pengguna"
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={users.data}
                        pageIndex={users.current_page - 1}
                        pageCount={users.last_page}
                        total={users.total}
                        from={users.from}
                        to={users.to}
                        onPageChange={changePage}
                        emptyMessage="Belum ada pengguna yang cocok dengan pencarian."
                        itemLabel="pengguna"
                    />
                </section>
            </div>

            <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={editingUser} />
            <UserDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={deletingUser}
            />
        </>
    );
}
