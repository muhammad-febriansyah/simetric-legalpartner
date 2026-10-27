import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, FileText, Search, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { index as toolsIndex } from '@/actions/App/Http/Controllers/Site/PublicToolsController';
import { PublicFooter } from '@/components/public-footer';
import { PublicNavbar } from '@/components/public-navbar';
import { home } from '@/routes';

type Props = {
    slug: string;
    name: string;
    description: string;
    sourceSnapshot: { title: string | null; description: string | null; text: string | null };
    prices: { name: string; price: number }[];
};

const inputClass = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2547F9] focus:ring-2 focus:ring-[#2547F9]/15';
const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const ptkpOptions = [
    { label: 'TK/0 — Tidak kawin, tanpa tanggungan', value: 54_000_000 },
    { label: 'TK/1 — Tidak kawin, 1 tanggungan', value: 58_500_000 },
    { label: 'TK/2 — Tidak kawin, 2 tanggungan', value: 63_000_000 },
    { label: 'TK/3 — Tidak kawin, 3 tanggungan', value: 67_500_000 },
    { label: 'K/0 — Kawin, tanpa tanggungan', value: 58_500_000 },
    { label: 'K/1 — Kawin, 1 tanggungan', value: 63_000_000 },
    { label: 'K/2 — Kawin, 2 tanggungan', value: 67_500_000 },
    { label: 'K/3 — Kawin, 3 tanggungan', value: 72_000_000 },
];
const restrictedCompanyWords = ['republik', 'presiden', 'bank indonesia', 'perserikatan bangsa'];
const classRules = [
    { number: '03', keywords: ['skincare', 'kosmetik', 'sabun', 'parfum'], description: 'Kosmetik dan sediaan perawatan tubuh.' },
    { number: '09', keywords: ['aplikasi', 'software', 'perangkat lunak', 'mobile'], description: 'Perangkat lunak dan aplikasi yang dapat diunduh.' },
    { number: '25', keywords: ['pakaian', 'baju', 'sepatu', 'fashion', 'olahraga'], description: 'Pakaian, alas kaki, dan penutup kepala.' },
    { number: '35', keywords: ['toko', 'retail', 'perdagangan', 'iklan', 'marketing', 'marketplace'], description: 'Periklanan, pengelolaan bisnis, dan jasa perdagangan.' },
    { number: '39', keywords: ['antar', 'delivery', 'pengiriman', 'logistik', 'transportasi'], description: 'Transportasi, pengemasan, dan penyimpanan barang.' },
    { number: '41', keywords: ['pelatihan', 'kursus', 'pendidikan', 'edutech', 'kelas online'], description: 'Pendidikan, pelatihan, dan hiburan.' },
    { number: '42', keywords: ['aplikasi', 'software', 'perangkat lunak', 'teknologi', 'saas'], description: 'Pengembangan perangkat lunak dan layanan teknologi.' },
    { number: '43', keywords: ['makanan', 'restoran', 'kuliner', 'kafe', 'minuman'], description: 'Jasa penyediaan makanan dan minuman.' },
];

function calculateProgressiveTax(annualIncome: number): number {
    const bands = [
        { ceiling: 60_000_000, rate: 0.05 },
        { ceiling: 250_000_000, rate: 0.15 },
        { ceiling: 500_000_000, rate: 0.25 },
        { ceiling: 5_000_000_000, rate: 0.3 },
        { ceiling: Number.POSITIVE_INFINITY, rate: 0.35 },
    ];
    let previousCeiling = 0;
    let tax = 0;

    for (const band of bands) {
        const taxableInBand = Math.max(0, Math.min(annualIncome, band.ceiling) - previousCeiling);
        tax += taxableInBand * band.rate;
        previousCeiling = band.ceiling;
        if (annualIncome <= band.ceiling) break;
    }

    return tax;
}

export default function PublicToolShow({ slug, name, description, sourceSnapshot, prices }: Props) {
    const [amount, setAmount] = useState('');
    const [ptkp, setPtkp] = useState(54_000_000);
    const [taxRate, setTaxRate] = useState(12);
    const [ppnMode, setPpnMode] = useState<'exclude' | 'include'>('exclude');
    const [checkedPrices, setCheckedPrices] = useState<string[]>([]);
    const [classCount, setClassCount] = useState(1);
    const [isUmkm, setIsUmkm] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [companyCity, setCompanyCity] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [businessDescription, setBusinessDescription] = useState('');
    const [brandName, setBrandName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const numericAmount = Number(amount.replace(/[^\d]/g, '')) || 0;
    const taxResult = useMemo(() => {
        if (slug === 'kalkulator-ppn') {
            const dpp = ppnMode === 'exclude' ? numericAmount : numericAmount / (1 + taxRate / 100);
            const ppn = dpp * taxRate / 100;

            return { dpp, tax: ppn, total: dpp + ppn };
        }

        const annualIncome = Math.floor((numericAmount * 12) / 1000) * 1000;
        const taxableIncome = Math.max(0, annualIncome - ptkp);
        const annualTax = calculateProgressiveTax(taxableIncome);

        return { annualIncome, taxableIncome, tax: annualTax / 12, annualTax };
    }, [numericAmount, ptk, ppnMode, slug, taxRate]);

    const classSuggestions = useMemo(() => {
        const term = productDescription.toLocaleLowerCase('id');
        return classRules.filter((rule) => rule.keywords.some((keyword) => term.includes(keyword)));
    }, [productDescription]);

    const nameWarnings = useMemo(() => {
        const term = companyName.trim().toLocaleLowerCase('id');
        const words = term.split(/\s+/).filter(Boolean);
        return [
            ...(words.length < 3 ? ['Nama PT umumnya perlu sedikitnya tiga kata.'] : []),
            ...(restrictedCompanyWords.some((word) => term.includes(word)) ? ['Nama memuat istilah yang berpotensi dibatasi.'] : []),
            ...(term.length < 3 ? ['Masukkan nama yang ingin diperiksa.'] : []),
        ];
    }, [companyName]);

    const totalSelected = prices.filter((item) => checkedPrices.includes(item.name)).reduce((sum, item) => sum + item.price, 0);
    const brandStandardFee = prices.reduce((sum, item) => sum + item.price, 0);
    const umkmRate = sourceSnapshot.text?.match(/UMKM\s+Rp\s*([\d,.]+)\s*juta/i);
    const umkmPrice = umkmRate ? Math.round(Number(umkmRate[1].replace(',', '.')) * 1_000_000) : 0;
    const brandFeePerClass = isUmkm ? umkmPrice : brandStandardFee;

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <>
            <Head title={name}>
                <meta name="description" content={description} />
            </Head>
            <PublicNavbar />
            <main className="min-h-screen bg-[#F7F8FD] text-slate-900">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
                        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-xs text-slate-400"><Link href={home()} className="hover:text-slate-700">Beranda</Link><span>/</span><Link href={toolsIndex()} className="hover:text-slate-700">Tools gratis</Link><span>/</span><span className="text-slate-600">{name}</span></nav>
                        <p className="text-sm font-semibold text-[#2547F9]">Tools gratis</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{name}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
                    </div>
                </section>
                <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
                    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_19rem]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
                            {['kalkulator-pph', 'kalkulator-ppn'].includes(slug) && <form onSubmit={submit} className="space-y-5">
                                {slug === 'kalkulator-pph' ? <><label className="block text-sm font-semibold">Gaji bulanan (Rupiah)<input inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Contoh: 10.000.000" className={`${inputClass} mt-2`} /></label><label className="block text-sm font-semibold">Status PTKP<select value={ptkp} onChange={(event) => setPtkp(Number(event.target.value))} className={`${inputClass} mt-2`}>{ptkpOptions.map((option) => <option key={option.value} value={option.value}>{option.label} · {rupiah.format(option.value)}</option>)}</select></label></> : <><div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => setPpnMode('exclude')} className={`h-11 rounded-xl border text-sm font-semibold ${ppnMode === 'exclude' ? 'border-[#2547F9] bg-[#EEF1FF] text-[#2547F9]' : 'border-slate-200 text-slate-600'}`}>Belum termasuk PPN</button><button type="button" onClick={() => setPpnMode('include')} className={`h-11 rounded-xl border text-sm font-semibold ${ppnMode === 'include' ? 'border-[#2547F9] bg-[#EEF1FF] text-[#2547F9]' : 'border-slate-200 text-slate-600'}`}>Sudah termasuk PPN</button></div><label className="block text-sm font-semibold">{ppnMode === 'exclude' ? 'Harga sebelum PPN' : 'Harga termasuk PPN'}<input inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Contoh: 1.000.000" className={`${inputClass} mt-2`} /></label><label className="block text-sm font-semibold">Tarif PPN<select value={taxRate} onChange={(event) => setTaxRate(Number(event.target.value))} className={`${inputClass} mt-2`}><option value={12}>12%</option><option value={11}>11%</option></select></label></>}
                                <button className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2547F9] px-6 text-sm font-semibold text-white hover:bg-[#1E3EDB]">Hitung <ArrowRight className="size-4" /></button>
                                {submitted && <div className="rounded-2xl bg-[#F7F8FD] p-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimasi hasil</p>{slug === 'kalkulator-pph' ? <div className="mt-3 grid gap-3 sm:grid-cols-3"><Result label="PPh per bulan" value={rupiah.format(taxResult.tax)} /><Result label="PPh setahun" value={rupiah.format(taxResult.annualTax)} /><Result label="Penghasilan kena pajak" value={rupiah.format(taxResult.taxableIncome)} /></div> : <div className="mt-3 grid gap-3 sm:grid-cols-3"><Result label="DPP" value={rupiah.format(taxResult.dpp)} /><Result label={`PPN ${taxRate}%`} value={rupiah.format(taxResult.tax)} /><Result label="Total" value={rupiah.format(taxResult.total)} /></div>}</div>}
                            </form>}

                            {slug === 'kalkulator-biaya' && <div><p className="mb-4 text-sm text-slate-600">Pilih layanan untuk menjumlahkan estimasi biaya.</p>{prices.length ? <><div className="space-y-2">{prices.map((item) => <label key={item.name} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4"><input type="checkbox" checked={checkedPrices.includes(item.name)} onChange={(event) => setCheckedPrices((current) => event.target.checked ? [...current, item.name] : current.filter((name) => name !== item.name))} className="size-4 accent-[#2547F9]" /><span className="flex-1 text-sm font-medium">{item.name}</span><span className="text-sm font-semibold">{rupiah.format(item.price)}</span></label>)}</div><div className="mt-5 rounded-2xl bg-[#F7F8FD] p-5"><p className="text-sm text-slate-500">Total estimasi</p><p className="mt-1 text-2xl font-semibold">{rupiah.format(totalSelected)}</p></div></> : <SourceUnavailable />}</div>}

                            {slug === 'kalkulator-biaya-merek' && <div className="space-y-5"><label className="block text-sm font-semibold">Jumlah kelas<select value={classCount} onChange={(event) => setClassCount(Number(event.target.value))} className={`${inputClass} mt-2`}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} kelas</option>)}</select></label><label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={isUmkm} onChange={(event) => setIsUmkm(event.target.checked)} className="size-4 accent-[#2547F9]" />Pemohon UMKM</label><div className="rounded-2xl bg-[#F7F8FD] p-5"><p className="text-sm text-slate-500">Estimasi {classCount} kelas</p><p className="mt-1 text-2xl font-semibold">{rupiah.format(brandFeePerClass * classCount)}</p><p className="mt-2 text-xs text-slate-500">Estimasi biaya per kelas.</p></div>{prices.length > 0 && <ul className="space-y-2 text-sm text-slate-600">{prices.map((item) => <li key={item.name} className="flex justify-between gap-3"><span>{item.name}</span><span>{rupiah.format(item.price)}</span></li>)}</ul>}</div>}

                            {slug === 'simulasi-akta' && <form onSubmit={submit} className="space-y-4"><Field label="Nama perusahaan" value={companyName} onChange={setCompanyName} placeholder="Contoh: Solusi Digital Nusantara" /><Field label="Tempat kedudukan" value={companyCity} onChange={setCompanyCity} placeholder="Jakarta Selatan" /><Field label="Alamat lengkap" value={companyAddress} onChange={setCompanyAddress} placeholder="Jalan dan nomor" /><label className="block text-sm font-semibold">Maksud dan kegiatan usaha<textarea value={businessDescription} onChange={(event) => setBusinessDescription(event.target.value)} rows={4} placeholder="Jelaskan bidang dan kegiatan utama usaha" className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2547F9]" /></label><button className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2547F9] px-6 text-sm font-semibold text-white">Buat ringkasan <FileText className="size-4" /></button>{submitted && <div className="rounded-2xl border border-slate-200 bg-[#F7F8FD] p-5"><h2 className="font-semibold">Ringkasan data awal</h2><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><Result label="Nama perusahaan" value={companyName || 'Belum diisi'} /><Result label="Tempat kedudukan" value={companyCity || 'Belum diisi'} /><Result label="Alamat" value={companyAddress || 'Belum diisi'} /><Result label="Kegiatan usaha" value={businessDescription || 'Belum diisi'} /></dl><p className="mt-4 text-xs leading-5 text-slate-500">Ringkasan persiapan saja, bukan akta notaris atau dokumen resmi.</p></div>}</form>}

                            {slug === 'cek-nama-pt' && <form onSubmit={submit} className="space-y-4"><Field label="Nama PT yang ingin diperiksa" value={companyName} onChange={setCompanyName} placeholder="Contoh: Solusi Digital Indonesia" /><button className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2547F9] px-6 text-sm font-semibold text-white">Skrining nama <Search className="size-4" /></button>{submitted && <div className="rounded-2xl border border-slate-200 p-5"><h2 className="font-semibold">Pemeriksaan format awal</h2>{nameWarnings.length ? <ul className="mt-3 space-y-2 text-sm text-amber-800">{nameWarnings.map((warning) => <li key={warning} className="flex gap-2"><ShieldAlert className="mt-0.5 size-4 shrink-0" />{warning}</li>)}</ul> : <p className="mt-3 flex gap-2 text-sm text-emerald-700"><CheckCircle2 className="size-4" />Format dasar terlihat sesuai untuk ditinjau lebih lanjut.</p>}<p className="mt-3 text-xs leading-5 text-slate-500">Skrining ini tidak terhubung ke AHU dan tidak memeriksa ketersediaan nama.</p></div>}</form>}

                            {slug === 'cek-merek' && <form onSubmit={submit} className="space-y-4"><Field label="Nama merek" value={brandName} onChange={setBrandName} placeholder="Contoh: Kopi Hangat" /><button className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2547F9] px-6 text-sm font-semibold text-white">Skrining nama <Search className="size-4" /></button>{submitted && <div className="rounded-2xl bg-[#F7F8FD] p-5"><h2 className="font-semibold">Pemeriksaan awal</h2><p className="mt-2 text-sm leading-6 text-slate-600">{brandName.trim().length >= 4 ? `“${brandName.trim()}” siap dibawa ke pencarian resmi merek.` : 'Masukkan nama yang lebih lengkap untuk pemeriksaan awal.'}</p><p className="mt-3 text-xs leading-5 text-slate-500">Ketersediaan dan kemiripan resmi belum diperiksa.</p></div>}</form>}

                            {slug === 'cek-kelas-merek' && <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-semibold">Deskripsi produk atau jasa<textarea value={productDescription} onChange={(event) => setProductDescription(event.target.value)} rows={4} placeholder="Contoh: aplikasi pemesanan makanan dan jasa antar" className="mt-2 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#2547F9]" /></label><button className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2547F9] px-6 text-sm font-semibold text-white">Cari saran kelas <Search className="size-4" /></button>{submitted && <div className="space-y-3">{classSuggestions.length ? classSuggestions.map((item) => <div key={item.number} className="rounded-xl border border-slate-200 p-4"><p className="font-semibold text-[#2547F9]">Kelas {item.number}</p><p className="mt-1 text-sm text-slate-600">{item.description}</p></div>) : <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Belum ada istilah yang cocok pada skrining lokal ini.</p>}<p className="text-xs leading-5 text-slate-500">Saran kata kunci awal, bukan rekomendasi AI atau konfirmasi resmi Nice/DJKI.</p></div>}</form>}
                        </div>
                        <aside className="space-y-4"><div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><span className="flex size-10 items-center justify-center rounded-xl bg-white text-amber-700"><ShieldAlert className="size-5" /></span><h2 className="mt-4 font-semibold text-amber-900">Perlu konfirmasi resmi</h2><p className="mt-2 text-xs leading-5 text-amber-800">Kalkulasi dan skrining hanya estimasi awal. Pastikan aturan dan status terbaru melalui instansi berwenang.</p></div></aside>
                    </div>
                </section>
            </main>
            <PublicFooter />
        </>
    );
}

function Result({ label, value }: { label: string; value: string | number }) {
    return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd></div>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
    return <label className="block text-sm font-semibold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`${inputClass} mt-2`} /></label>;
}

function SourceUnavailable() {
    return <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">Harga layanan belum tersedia sementara. Coba lagi nanti.</div>;
}
