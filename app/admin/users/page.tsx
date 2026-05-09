import { createServerSupabase } from "@/lib/supabase-server";
import UserActions from "./user-actions";

export default async function AdminUsersPage() {
  const supabase = createServerSupabase();
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <div className="card overflow-x-auto">
      <h1 className="mb-5 text-3xl font-black">Users</h1>
      <table className="w-full min-w-[800px] text-left">
        <thead><tr className="border-b"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Plan</th><th className="p-3">Action</th></tr></thead>
        <tbody>{users?.map((u: any) => <tr key={u.id} className="border-b"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{u.role}</td><td className="p-3">{u.status}</td><td className="p-3">{u.plan}</td><td className="p-3"><UserActions userId={u.id} /></td></tr>)}</tbody>
      </table>
    </div>
  );
}
