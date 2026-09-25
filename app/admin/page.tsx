import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { adminUser } from '@/lib/admin-access';
import { getDb } from '@/db';
import { inquiries } from '@/db/schema';
import { AdminInbox } from '@/components/admin-inbox';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await adminUser();
  if (!user) return <main className="mx-auto max-w-2xl px-6 py-24"><h1 className="text-3xl font-semibold">Akses admin tidak tersedia</h1><p className="mt-4">Akun ini tidak memiliki izin untuk melihat pesan pelanggan.</p><Link className="mt-6 inline-block text-blue-700 underline" href="/">Kembali ke beranda</Link></main>;
  try {
    const rows = await getDb().select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(100);
    return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8"><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">CV Mitra Chemical Indonesia</span><h1 className="mt-2 text-3xl font-semibold text-slate-900">Pesan pelanggan</h1><p className="mt-2 text-slate-600">100 pesan terbaru · Masuk sebagai {user.email}</p></div><Link className="rounded-full border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-50" href="/">Lihat website</Link></div><AdminInbox initialRows={rows} /></main>;
  } catch (error) {
    console.error('Admin inbox unavailable', error);
    return <main className="mx-auto max-w-2xl px-6 py-24"><h1 className="text-3xl font-semibold">Pesan belum bisa dimuat</h1><p className="mt-4">Silakan coba lagi beberapa saat.</p></main>;
  }
}
