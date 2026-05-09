"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { getOrCreateDeviceId } from "@/lib/device";

type Mode = "login" | "register" | "forgot";

export default function AuthModal({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const [currentMode, setCurrentMode] = useState<Mode>(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabase();

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) setMessage(error.message);
    else {
      const userId = data.user?.id;
      if (userId) {
        await supabase.from("profiles").upsert({ id: userId, email, name, role: "user", status: "inactive", plan: "free" });
      }
      setMessage("Account created. Please login and watch sample videos.");
    }
    setLoading(false);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      const deviceId = getOrCreateDeviceId();
      if (deviceId && data.user) {
        await supabase.from("profiles").update({ active_device_id: deviceId, device_changed_at: new Date().toISOString() }).eq("id", data.user.id);
      }
      window.location.href = "/videos";
    }
    setLoading(false);
  }

  async function forgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${siteUrl}/reset-password` });
    setMessage(error ? error.message : "Reset password link has been sent to your email.");
    setLoading(false);
  }

  const title = currentMode === "register" ? "Create Account" : currentMode === "login" ? "Login" : "Forgot Password";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        <form onSubmit={currentMode === "register" ? register : currentMode === "login" ? login : forgot} className="space-y-4">
          {currentMode === "register" && <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {currentMode !== "forgot" && <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />}
          {message && <p className="rounded-xl bg-slate-100 p-3 text-sm">{message}</p>}
          <button disabled={loading} className="btn w-full">{loading ? "Please wait..." : title}</button>
        </form>

        <div className="mt-5 flex justify-between text-sm">
          {currentMode !== "login" && <button onClick={() => setCurrentMode("login")} className="underline">Login</button>}
          {currentMode !== "register" && <button onClick={() => setCurrentMode("register")} className="underline">Register</button>}
          {currentMode !== "forgot" && <button onClick={() => setCurrentMode("forgot")} className="underline">Forgot password?</button>}
        </div>
      </div>
    </div>
  );
}
