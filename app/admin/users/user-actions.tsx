"use client";

import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function UserActions({ userId }: { userId: string }) {
  const supabase = createBrowserSupabase();
  async function setStatus(status: string) {
    const update: any = { status };
    if (status === "active") { update.plan = "premium"; update.activated_at = new Date().toISOString(); }
    await supabase.from("profiles").update(update).eq("id", userId);
    window.location.reload();
  }
  async function resetDevice() {
    await supabase.from("profiles").update({ active_device_id: null }).eq("id", userId);
    window.location.reload();
  }
  return <div className="flex flex-wrap gap-2"><button className="btn-light text-sm" onClick={() => setStatus("active")}>Activate</button><button className="btn-light text-sm" onClick={() => setStatus("inactive")}>Deactivate</button><button className="btn-light text-sm" onClick={() => setStatus("blocked")}>Block</button><button className="btn-light text-sm" onClick={resetDevice}>Reset Device</button></div>;
}
