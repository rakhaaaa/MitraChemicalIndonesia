'use client';

import { useState } from 'react';
import type { inquiries } from '@/db/schema';

type Inquiry = typeof inquiries.$inferSelect;

export function AdminInbox({initialRows}:{initialRows:Inquiry[]}) {
  const [rows,setRows]=useState(initialRows);
  const [selected,setSelected]=useState<string|null>(rows[0]?.id??null);
  const [filter,setFilter]=useState('semua');
  const [error,setError]=useState('');
  const [saving,setSaving]=useState(false);
  const active=rows.find(row=>row.id===selected);
  const visible=rows.filter(row=>filter==='semua'||row.status===filter);
  async function save(status:string,note:string) {
    if (!active) return;
    setSaving(true);setError('');
    try {
      const response=await fetch(`/api/admin/inquiries/${encodeURIComponent(active.id)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,note})});
      const result=await response.json() as Inquiry & {error?:string};
      if (!response.ok) throw new Error(result.error||'Gagal menyimpan perubahan.');
      setRows(current=>current.map(row=>row.id===result.id?result:row));
    } catch (cause) {setError(cause instanceof Error?cause.message:'Gagal menyimpan perubahan.');}
    finally {setSaving(false);}
  }
  async function remove() {
    if (!active || !window.confirm('Hapus pesan ini secara permanen?')) return;
    setSaving(true);setError('');
    try {
      const response=await fetch(`/api/admin/inquiries/${encodeURIComponent(active.id)}`,{method:'DELETE'});
      if (!response.ok) throw new Error('Pesan belum bisa dihapus.');
      setRows(current=>current.filter(row=>row.id!==active.id));
      setSelected(null);
    } catch (cause) {setError(cause instanceof Error?cause.message:'Pesan belum bisa dihapus.');}
    finally {setSaving(false);}
  }
  return <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_1fr]">
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Daftar pesan">
      <label className="text-sm font-medium text-slate-700">Filter status<select value={filter} onChange={e=>setFilter(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3"><option value="semua">Semua</option><option value="baru">Baru</option><option value="diproses">Diproses</option><option value="selesai">Selesai</option></select></label>
      <div className="mt-4 max-h-[75vh] space-y-2 overflow-y-auto">{visible.length?visible.map(row=><button type="button" key={row.id} onClick={()=>{setSelected(row.id);setError('')}} aria-pressed={selected===row.id} className={`w-full rounded-xl border p-4 text-left transition ${selected===row.id?'border-blue-600 bg-blue-50':'border-slate-200 hover:bg-slate-50'}`}><span className="flex justify-between gap-2 text-sm"><strong className="truncate text-slate-900">{row.firstName} {row.lastName}</strong><span className="shrink-0 capitalize text-blue-700">{row.status}</span></span><span className="mt-1 block truncate text-sm text-slate-600">{row.productName||'Pertanyaan umum'} · {row.message}</span><time className="mt-2 block text-xs text-slate-500" dateTime={new Date(row.createdAt).toISOString()}>{new Date(row.createdAt).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Jakarta'})} WIB</time></button>):<p className="py-8 text-center text-slate-500">Belum ada pesan untuk filter ini.</p>}</div>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Detail pesan">{active?<InquiryDetail key={active.id} row={active} saving={saving} error={error} onSave={save} onDelete={remove}/>:<p className="text-slate-500">Pilih pesan untuk melihat detailnya.</p>}</section>
  </div>;
}

function InquiryDetail({row,saving,error,onSave,onDelete}:{row:Inquiry;saving:boolean;error:string;onSave:(status:string,note:string)=>Promise<void>;onDelete:()=>Promise<void>}) {
  const [status,setStatus]=useState(row.status);
  const [note,setNote]=useState(row.note);
  return <div className="space-y-6 text-slate-800"><div><span className="text-xs font-semibold uppercase tracking-widest text-blue-700">{row.productName||'Pertanyaan umum'}</span><h2 className="mt-2 text-2xl font-semibold">{row.firstName} {row.lastName}</h2><p className="mt-1 text-sm text-slate-600">Diterima {new Date(row.createdAt).toLocaleString('id-ID',{dateStyle:'long',timeStyle:'short',timeZone:'Asia/Jakarta'})} WIB</p></div><div className="flex flex-wrap gap-4 text-sm"><a href={`mailto:${row.email}`} className="break-all text-blue-700 underline">{row.email}</a>{row.phone&&<a href={`tel:${row.phone.replace(/[^+\d]/g,'')}`} className="text-blue-700 underline">{row.phone}</a>}</div><div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-5 leading-relaxed">{row.message}</div><p className="text-sm text-slate-600">Notifikasi email: <strong>{row.notificationStatus==='terkirim'?'terkirim':row.notificationStatus==='gagal'?'gagal':'belum diaktifkan'}</strong></p><form onSubmit={e=>{e.preventDefault();void onSave(status,note)}} className="space-y-4 border-t border-slate-200 pt-5"><label className="block text-sm font-medium">Status<select className="mt-2 w-full rounded-lg border border-slate-300 p-3" value={status} onChange={e=>setStatus(e.target.value)}><option value="baru">Baru</option><option value="diproses">Diproses</option><option value="selesai">Selesai</option></select></label><label className="block text-sm font-medium">Catatan internal<textarea className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 p-3" maxLength={2000} value={note} onChange={e=>setNote(e.target.value)} /></label>{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<div className="flex flex-wrap items-center gap-4"><button disabled={saving} className="rounded-full bg-blue-700 px-6 py-3 font-medium text-white disabled:opacity-50">{saving?'Menyimpan…':'Simpan perubahan'}</button><button type="button" disabled={saving} onClick={()=>void onDelete()} className="rounded-full border border-red-300 px-5 py-3 text-red-700 hover:bg-red-50 disabled:opacity-50">Hapus pesan</button></div></form></div>;
}
