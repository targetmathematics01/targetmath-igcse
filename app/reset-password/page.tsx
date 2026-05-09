"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createBrowserSupabase();

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Password updated. You can login now.");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <form onSubmit={updatePassword} className="card w-full space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <input className="input" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {message && <p className="rounded-xl bg-slate-100 p-3 text-sm">{message}</p>}
        <button className="btn w-full">Update Password</button>
      </form>
    </main>
  );
}
