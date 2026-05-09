import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <div className="card">
        <h1 className="text-3xl font-black">My Account</h1>
        <p className="mt-4">Email: {profile?.email}</p>
        <p>Status: {profile?.status}</p>
        <p>Plan: {profile?.plan}</p>
      </div>
    </main>
  );
}
