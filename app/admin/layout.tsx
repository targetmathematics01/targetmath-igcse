import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/videos");

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <nav className="mb-8 flex flex-wrap gap-3">
        <Link className="btn-light" href="/admin">Dashboard</Link>
        <Link className="btn-light" href="/admin/payments">Payments</Link>
        <Link className="btn-light" href="/admin/users">Users</Link>
        <Link className="btn-light" href="/admin/chapters">Chapters</Link>
        <Link className="btn-light" href="/admin/videos">Videos</Link>
        <Link className="btn-light" href="/videos">View Site</Link>
      </nav>
      {children}
    </main>
  );
}
