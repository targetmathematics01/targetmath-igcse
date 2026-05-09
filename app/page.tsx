"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal";

export default function HomePage() {
  const [modal, setModal] = useState<"login" | "register" | "forgot" | null>(null);

  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-black">TargetMath IGCSE</div>
        <div className="flex gap-3">
          <button onClick={() => setModal("login")} className="btn-light">Login</button>
          <button onClick={() => setModal("register")} className="btn">Register</button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="badge mb-4 inline-block">10 Chapters • Sample Videos • Premium Lessons</p>
          <h1 className="text-5xl font-black leading-tight">IGCSE Maths video course</h1>
          <p className="mt-5 text-lg text-slate-600">Chapter တစ်ခုစီမှာ sample videos 2 ခု free ကြည့်နိုင်ပြီး paid lessons တွေကို account activation ပြီးမှ unlock လုပ်နိုင်ပါတယ်။</p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => setModal("register")} className="btn">Start Free</button>
            <a href="/videos" className="btn-light">View Lessons</a>
          </div>
        </div>
        <div className="card">
          <h2 className="mb-4 text-2xl font-bold">What you get</h2>
          <ul className="space-y-3 text-slate-700">
            <li>✅ 10 structured chapters</li>
            <li>✅ 2 free sample videos per chapter</li>
            <li>✅ Paid videos after admin activation</li>
            <li>✅ One account one device protection</li>
            <li>✅ Forgot password and secure login</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Register", "Create your free account and watch samples."],
            ["Upload payment", "Submit payment screenshot for admin approval."],
            ["Unlock videos", "After activation, all premium videos open."],
          ].map(([title, text]) => (
            <div key={title} className="card">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} />}
    </main>
  );
}
