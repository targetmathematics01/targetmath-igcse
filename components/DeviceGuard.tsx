"use client";

import { useEffect } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function DeviceGuard() {
  useEffect(() => {
    const supabase = createBrowserSupabase();
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const localDeviceId = localStorage.getItem("device_id");
      const { data: profile } = await supabase.from("profiles").select("active_device_id").eq("id", user.id).single();
      if (profile?.active_device_id && localDeviceId && profile.active_device_id !== localDeviceId) {
        await supabase.auth.signOut();
        window.location.href = "/?reason=device_changed";
      }
    }
    check();
    const timer = setInterval(check, 30000);
    return () => clearInterval(timer);
  }, []);
  return null;
}
