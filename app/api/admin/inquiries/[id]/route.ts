import { getDb } from '@/db';
import { inquiries } from '@/db/schema';
import { adminUser } from '@/lib/admin-access';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const runtime = 'edge';

const schema = z.object({status:z.enum(['baru','diproses','selesai']),note:z.string().max(2000)});

export async function PATCH(request: Request, { params }: { params: Promise<{id:string}> }) {
  if (!await adminUser()) return Response.json({error:'Akses ditolak.'},{status:403});
  if (request.headers.get('origin') && new URL(request.headers.get('origin')!).host !== new URL(request.url).host) return Response.json({error:'Permintaan ditolak.'},{status:403});
  const {id}=await params;
  let body:unknown;
  try { body=await request.json(); } catch { return Response.json({error:'Data tidak valid.'},{status:400}); }
  const parsed=schema.safeParse(body);
  if (!parsed.success) return Response.json({error:'Status atau catatan tidak valid.'},{status:400});
  try {
    const result=await getDb().update(inquiries).set({...parsed.data,updatedAt:Date.now()}).where(eq(inquiries.id,id)).returning();
    if (!result.length) return Response.json({error:'Pesan tidak ditemukan.'},{status:404});
    return Response.json(result[0],{headers:{'Cache-Control':'no-store'}});
  } catch(error) { console.error('Failed to update inquiry',error); return Response.json({error:'Perubahan belum tersimpan.'},{status:503}); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{id:string}> }) {
  if (!await adminUser()) return Response.json({error:'Akses ditolak.'},{status:403});
  if (request.headers.get('origin') && new URL(request.headers.get('origin')!).host !== new URL(request.url).host) return Response.json({error:'Permintaan ditolak.'},{status:403});
  const {id}=await params;
  try {
    const removed=await getDb().delete(inquiries).where(eq(inquiries.id,id)).returning({id:inquiries.id});
    if (!removed.length) return Response.json({error:'Pesan tidak ditemukan.'},{status:404});
    return Response.json({id},{headers:{'Cache-Control':'no-store'}});
  } catch(error) { console.error('Failed to delete inquiry',error); return Response.json({error:'Pesan belum bisa dihapus.'},{status:503}); }
}
