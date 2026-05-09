"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function AdminVideosPage() {
  const supabase = createBrowserSupabase();
  const [chapters, setChapters] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [form, setForm] = useState({ chapter_id: "", title: "", description: "", youtube_video_id: "", video_order: 1, is_sample: true });

  async function load() {
    const { data: ch } = await supabase.from("chapters").select("*").order("chapter_order");
    const { data: vi } = await supabase.from("videos").select("*, chapters(title)").order("video_order");
    setChapters(ch || []); setVideos(vi || []);
    if (!form.chapter_id && ch?.[0]) setForm((f) => ({ ...f, chapter_id: ch[0].id }));
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("videos").insert(form);
    setForm({ ...form, title: "", description: "", youtube_video_id: "", video_order: form.video_order + 1 });
    load();
  }

  async function remove(id: string) {
    await supabase.from("videos").delete().eq("id", id);
    load();
  }

  return (
    <div className="grid gap-6 md:grid-cols-[420px_1fr]">
      <form onSubmit={add} className="card space-y-4">
        <h1 className="text-2xl font-black">Add Video</h1>
        <select className="input" value={form.chapter_id} onChange={(e) => setForm({ ...form, chapter_id: e.target.value })} required>
          {chapters.map((c) => <option key={c.id} value={c.id}>{c.chapter_order}. {c.title}</option>)}
        </select>
        <input className="input" placeholder="Video title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="input" placeholder="YouTube video ID" value={form.youtube_video_id} onChange={(e) => setForm({ ...form, youtube_video_id: e.target.value })} required />
        <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input" type="number" value={form.video_order} onChange={(e) => setForm({ ...form, video_order: Number(e.target.value) })} required />
        <label className="flex items-center gap-3"><input type="checkbox" checked={form.is_sample} onChange={(e) => setForm({ ...form, is_sample: e.target.checked })} /> Sample / Free video</label>
        <button className="btn w-full">Add Video</button>
      </form>
      <div className="card">
        <h2 className="mb-4 text-2xl font-black">Videos</h2>
        <div className="space-y-3">{videos.map((v) => <div key={v.id} className="flex justify-between rounded-xl border p-4"><div><p className="font-bold">{v.title}</p><p className="text-sm text-slate-500">{v.chapters?.title} • {v.is_sample ? "Sample" : "Paid"}</p></div><button onClick={() => remove(v.id)} className="text-red-700 underline">Delete</button></div>)}</div>
      </div>
    </div>
  );
}
