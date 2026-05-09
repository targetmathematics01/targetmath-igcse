"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function PaymentPage() {
  const [amount, setAmount] = useState("10000");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabase();

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setMessage("Please choose payment screenshot.");
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("Please login first.");
      setLoading(false);
      return;
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const uploadResult = await supabase.storage.from("payment-screenshots").upload(path, file, { upsert: false });
    if (uploadResult.error) {
      setMessage(uploadResult.error.message);
      setLoading(false);
      return;
    }
    const { data: publicUrl } = supabase.storage.from("payment-screenshots").getPublicUrl(path);

    await supabase.from("payment_requests").insert({
      user_id: user.id,
      amount: Number(amount),
      screenshot_url: publicUrl.publicUrl,
      status: "pending",
    });
    await supabase.from("profiles").update({ status: "pending_payment" }).eq("id", user.id);
    window.location.href = "/payment/pending";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-10">
      <form onSubmit={upload} className="card w-full space-y-5">
        <h1 className="text-3xl font-black">Payment Screenshot Upload</h1>
        <div className="rounded-xl bg-slate-100 p-4 text-slate-700">
          <p className="font-bold">Payment instruction</p>
          <p>ငွေလွှဲပြီး screenshot ကို upload လုပ်ပါ။ Admin approve ပြီးရင် paid videos unlock ဖြစ်ပါမယ်။</p>
        </div>
        <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {message && <p className="rounded-xl bg-slate-100 p-3 text-sm">{message}</p>}
        <button disabled={loading} className="btn w-full">{loading ? "Uploading..." : "Submit Payment"}</button>
      </form>
    </main>
  );
}
