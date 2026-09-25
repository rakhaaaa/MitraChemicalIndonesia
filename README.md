# CV Mitra Chemical Indonesia

Website katalog NAVILEX dengan form kontak, database D1, dan inbox admin. React, TypeScript, Tailwind, Next App Router melalui Vinext untuk Cloudflare Workers. Komponen UI berada di `components/ui`, stylesheet di `app/globals.css` dan `styles/`.

## Status

Kode migrasi dari prototype. Website lama tidak diubah. Deployment akun Cloudflare sendiri membutuhkan database D1 dan konfigurasi admin di bawah. Data pesan dari hosting lama tidak otomatis dipindahkan.

## Jalankan lokal

Gunakan Node.js 22.12+ (disarankan Node 22 LTS).

```sh
npm ci
npm run db:migrate:local
npm run dev
```

```sh
npm run typecheck
npm run build
```

## Cloudflare Workers dari GitHub

1. Buat D1 database bernama `mitra-chemical-indonesia` di akun Cloudflare sendiri. Salin **Database ID** ke `database_id` dalam `wrangler.jsonc`, menggantikan UUID nol. ID database bukan API token.
2. Jalankan SQL `drizzle/0000_faithful_molecule_man.sql` pada database tersebut melalui D1 Console. Alternatif dari komputer yang login Cloudflare: `npm run db:migrate`. Pilih satu cara saja untuk database baru.
3. Workers & Pages → Create → Connect GitHub → repository `rakhaaaa/MitraChemicalIndonesia`, branch `main`.
4. Nama Worker: `mitra-chemical-indonesia`. Root directory: `/`. Build command: `npm run build`. Deploy command: `npm run deploy`. Ini aplikasi Worker, bukan upload file statis atau Pages export.
5. Deploy. Buka URL workers.dev yang diberikan Cloudflare. Uji homepage dan kirim satu pesan uji sebelum dipakai pelanggan.

Panduan resmi: https://developers.cloudflare.com/workers/vite-plugin/get-started/

## Admin

Admin terkunci bila konfigurasi kosong/tidak valid. Header identitas ChatGPT lama tidak digunakan.

Pasang Cloudflare Access pada `/admin`, `/admin/*`, serta `/api/admin/*` dalam satu aplikasi Access dengan audience yang sama. Homepage dan `/api/inquiries` tetap publik. Bila akun/domain uji tidak mendukung cakupan path tersebut, gunakan domain yang mendukungnya; jangan membuka admin dengan menonaktifkan verifikasi.

Atur policy Allow hanya untuk email pemilik yang dipilih. Tambahkan runtime variables/secrets Worker:

- `ACCESS_TEAM_DOMAIN`: `https://NAMA-TIM.cloudflareaccess.com`
- `ACCESS_AUD`: Application Audience dari aplikasi Access
- `ADMIN_EMAILS`: email pemilik yang diizinkan; dipisahkan koma bila lebih dari satu

Jangan memilih email admin berdasarkan email kontak perusahaan secara otomatis. JWT diperiksa tanda tangan, issuer, audience, masa berlaku, dan allowlist email. Uji login admin serta akses tanpa login sebelum digunakan.

Panduan resmi: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/

## Email opsional

Pesan disimpan di D1. Notifikasi email belum aktif sampai `RESEND_API_KEY` (secret) dan `MAIL_FROM` dari domain pengirim terverifikasi diisi. `NOTIFICATION_EMAIL` sudah berisi `Ptmchemicalindonesia@gmail.com`. Jangan memasukkan token, `.env`, `.dev.vars`, database pelanggan, atau kredensial ke GitHub.

## Data produk

Ukuran kemasan masih referensi, bukan konfirmasi stok. Detail thinner menunggu pemilik. Swatch digital bukan jaminan kecocokan warna cetak/cat fisik.
