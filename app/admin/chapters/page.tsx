"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const supabase = createBrowserSupabase();

  async function load() {
    const { data } = await supabase.from("chapters").select("*").order("chapter_order");
    setChapters(data || []);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("chapters").insert({ title, chapter_order: order });
    setTitle(""); setOrder(order + 1); load();
  }

  async function remove(id: string) {
    await supabase.from("chapters").delete().eq("id", id);
    load();
  }

  return (
    <div className="grid gap-6 md:grid-cols-[380px_1fr]">
      <form onSubmit={add} className="card space-y-4">
        <h1 className="text-2xl font-black">Add Chapter</h1>
        <input className="input" placeholder="Chapter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="input" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} required />
        <button className="btn w-full">Add Chapter</button>
      </form>
      <div className="card">
        <h2 className="mb-4 text-2xl font-black">Chapters</h2>
        <div className="space-y-3">{chapters.map((c) => <div key={c.id} className="flex justify-between rounded-xl border p-4"><span>{c.chapter_order}. {c.title}</span><button onClick={() => remove(c.id)} className="text-red-700 underline">Delete</button></div>)}</div>
      </div>
    </div>
  );
}
