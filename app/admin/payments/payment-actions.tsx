"use client";

import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function PaymentActions({ paymentId, userId }: { paymentId: string; userId: string }) {
  const supabase = createBrowserSupabase();

  async function approve() {
    await supabase.from("payment_requests").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", paymentId);
    await supabase.from("profiles").update({ status: "active", plan: "premium", activated_at: new Date().toISOString() }).eq("id", userId);
    window.location.reload();
  }

  async function reject() {
    await supabase.from("payment_requests").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", paymentId);
    await supabase.from("profiles").update({ status: "rejected" }).eq("id", userId);
    window.location.reload();
  }

  return (
    <div className="flex gap-2">
      <button onClick={approve} className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white">Approve</button>
      <button onClick={reject} className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white">Reject</button>
    </div>
  );
}
