import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { inquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'edge';

const inputSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  countryCode: z.string().regex(/^\+\d{1,4}$/),
  phoneNumber: z.string().max(25),
  message: z.string().trim().min(10).max(5000),
  privacyAgreed: z.literal(true),
  product: z.object({ id: z.string(), name: z.string() }).optional(),
});

const knownProducts: Record<string, string> = {
  navilex: 'Navilex',
  'cat-kendaraan': 'Cat Kendaraan',
  thinner: 'Thinner',
};

async function sendNotification(data: z.infer<typeof inputSchema>, id: string) {
  if (!env.NOTIFICATION_EMAIL || !env.RESEND_API_KEY || !env.MAIL_FROM) return 'menunggu-konfigurasi';
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: env.MAIL_FROM,
        to: [env.NOTIFICATION_EMAIL],
        subject: `Pesan baru dari ${data.firstName} ${data.lastName}`,
        text: `ID: ${id}\nNama: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nTelepon: ${data.phoneNumber ? `${data.countryCode} ${data.phoneNumber}` : '-'}\nProduk: ${data.product?.id && knownProducts[data.product.id] || '-'}\n\nPesan:\n${data.message}`,
      }),
    });
    if (!response.ok) {
      console.error('Notification provider rejected request', response.status);
      return 'gagal';
    }
    return 'terkirim';
  } catch (error) {
    console.error('Notification request failed', error);
    return 'gagal';
  }
}

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ error: 'Format tidak didukung.' }, { status: 415 });
  if (Number(request.headers.get('content-length') || 0) > 12000) return Response.json({ error: 'Pesan terlalu panjang.' }, { status: 413 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Data tidak valid.' }, { status: 400 }); }
  const result = inputSchema.safeParse(body);
  if (!result.success) return Response.json({ error: 'Periksa kembali data formulir.' }, { status: 400 });
  const data = result.data;
  const digits = data.phoneNumber.replace(/\D/g, '').replace(/^0+/, '');
  if (data.phoneNumber && (!/^[\d\s().-]+$/.test(data.phoneNumber) || (data.countryCode + digits).replace(/\D/g, '').length > 15 || digits.length < 7)) return Response.json({ error: 'Nomor telepon tidak valid.' }, { status: 400 });
  const id = crypto.randomUUID();
  const now = Date.now();
  try {
    const db = getDb();
    await db.insert(inquiries).values({ id, firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phoneNumber ? `${data.countryCode} ${data.phoneNumber}` : null, productId: data.product?.id && knownProducts[data.product.id] ? data.product.id : null, productName: data.product?.id && knownProducts[data.product.id] || null, message: data.message, createdAt: now, updatedAt: now });
    const notificationStatus = await sendNotification(data, id);
    if (notificationStatus !== 'menunggu-konfigurasi') {
      try { await db.update(inquiries).set({ notificationStatus }).where(eq(inquiries.id, id)); }
      catch (error) { console.error('Failed to save notification status', error); }
    }
    return Response.json({ id, message: 'Pesan diterima.' }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to save inquiry', error);
    return Response.json({ error: 'Pesan belum tersimpan. Silakan coba lagi.' }, { status: 503 });
  }
}
