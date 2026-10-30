import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, BriefcaseBusiness, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { create as createAddon, edit as editAddon, index as addonsIndex, store as storeAddon, update as updateAddon } from '@/actions/App/Http/Controllers/Admin/ServiceAddonController';
import { edit as editService } from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { PageHeader } from '@/components/page-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Service = { id: number; name: string; slug: string };
export type AddonFormData = { id: number; name: string; description: string | null; price: number; isActive: boolean; sortOrder: number };

export default function AddonForm({ service, addon }: { service: Service; addon: AddonFormData | null }) {
    const editing = addon !== null;
    const action = editing ? updateAddon.url({ service: service.id, addon: addon.id }) : storeAddon.url({ service: service.id });
    return <>
        <Head title={editing ? 'Edit Paket Add-on' : 'Tambah Paket Add-on'} />
        <div className="flex flex-col gap-6 px-4 py-6 pb-8 md:px-6 md:py-8 xl:px-8">
            <PageHeader breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Layanan', href: '/admin/services' }, { title: service.name, href: editService(service.id) }, { title: 'Paket Add-on', href: addonsIndex({ service: service.id }) }, { title: editing ? 'Edit add-on' : 'Tambah add-on', href: editing ? editAddon({ service: service.id, addon: addon.id }) : createAddon({ service: service.id }) }]} title={editing ? 'Edit Paket Add-on' : 'Tambah Paket Add-on'} description="Atur nama, keterangan, dan harga add-on layanan." />
            <div className="flex items-center gap-3 rounded-xl border border-[#2547F9]/15 bg-[#2547F9]/[0.04] p-4"><BriefcaseBusiness className="size-5 text-[#2547F9]" /><div><p className="text-xs text-muted-foreground">Layanan</p><p className="text-sm font-semibold">{service.name}</p></div></div>
            <Form action={action} method={editing ? 'put' : 'post'} options={{ preserveScroll: true }} className="flex flex-col gap-6" onSuccess={() => toast.success(editing ? 'Add-on berhasil diperbarui.' : 'Add-on berhasil dibuat.')} onError={() => toast.error('Add-on belum tersimpan. Periksa kolom yang ditandai.')}>
                {({ processing, errors }) => <>
                    <section className="grid gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
                        <div className="grid content-start gap-2"><Label htmlFor="name">Nama add-on *</Label><Input id="name" name="name" defaultValue={addon?.name ?? ''} maxLength={150} required placeholder="Contoh: Percepatan proses" /><InputError message={errors.name} /></div>
                        <div className="grid content-start gap-2"><Label htmlFor="price">Harga (Rp) *</Label><Input id="price" name="price" type="number" min="0" step="1000" defaultValue={addon?.price ?? ''} required placeholder="750000" /><InputError message={errors.price} /></div>
                        <div className="grid content-start gap-2 sm:col-span-2"><Label htmlFor="description">Deskripsi</Label><textarea id="description" name="description" defaultValue={addon?.description ?? ''} maxLength={1000} rows={3} placeholder="Jelaskan manfaat add-on" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50" /><InputError message={errors.description} /></div>
                        <div className="grid content-start gap-2"><Label htmlFor="sort_order">Urutan tampil *</Label><Input id="sort_order" name="sort_order" type="number" min="0" defaultValue={addon?.sortOrder ?? 0} required /><InputError message={errors.sort_order} /></div>
                        <div className="grid content-start gap-2"><Label htmlFor="is_active">Status *</Label><select id="is_active" name="is_active" defaultValue={addon?.isActive === false ? '0' : '1'} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="1">Aktif dan tampil publik</option><option value="0">Nonaktif</option></select><InputError message={errors.is_active} /></div>
                    </section>
                    <div className="flex items-center justify-between"><Button variant="outline" asChild><Link href={addonsIndex({ service: service.id })}><ArrowLeft className="size-4" />Kembali ke add-on</Link></Button><Button type="submit" disabled={processing} className="bg-[#2547F9] text-white hover:bg-[#1E3EDB]"><Save className="size-4" />{processing ? 'Menyimpan…' : editing ? 'Simpan perubahan' : <><Plus className="size-4" />Simpan add-on</>}</Button></div>
                </>}
            </Form>
        </div>
    </>;
}
