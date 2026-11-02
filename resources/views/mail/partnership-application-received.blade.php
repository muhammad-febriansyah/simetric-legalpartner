<h1>Pendaftaran Kerja Sama Baru</h1>

<p>Ada pengajuan kemitraan baru dari formulir LegalPartner.ID.</p>

<dl>
    <dt><strong>Nama lengkap</strong></dt>
    <dd>{{ $application->full_name }}</dd>

    <dt><strong>Nomor WhatsApp</strong></dt>
    <dd>{{ $application->whatsapp }}</dd>

    <dt><strong>Email pendaftar</strong></dt>
    <dd>{{ $application->email ?: 'Tidak diisi' }}</dd>

    <dt><strong>Kategori kemitraan</strong></dt>
    <dd>{{ \App\Models\PartnershipApplication::TYPES[$application->partnership_type] ?? $application->partnership_type }}</dd>

    <dt><strong>Pesan atau profil singkat</strong></dt>
    <dd>{{ $application->message ?: 'Tidak diisi' }}</dd>
</dl>
