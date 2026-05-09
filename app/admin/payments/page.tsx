import { createServerSupabase } from "@/lib/supabase-server";
import PaymentActions from "./payment-actions";

export default async function AdminPaymentsPage() {
  const supabase = createServerSupabase();
  const { data: payments } = await supabase
    .from("payment_requests")
    .select("id,user_id,amount,screenshot_url,status,created_at,profiles(name,email)")
    .order("created_at", { ascending: false });

  return (
    <div className="card overflow-x-auto">
      <h1 className="mb-5 text-3xl font-black">Payment Requests</h1>
      <table className="w-full min-w-[900px] text-left">
        <thead>
          <tr className="border-b">
            <th className="p-3">User</th>
            <th className="p-3">Email</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Screenshot</th>
            <th className="p-3">Status</th>
            <th className="p-3">Submitted</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments?.map((p: any) => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.profiles?.name || "-"}</td>
              <td className="p-3">{p.profiles?.email || "-"}</td>
              <td className="p-3">{p.amount}</td>
              <td className="p-3"><a className="underline" href={p.screenshot_url} target="_blank">View image</a></td>
              <td className="p-3">{p.status}</td>
              <td className="p-3">{new Date(p.created_at).toLocaleDateString()}</td>
              <td className="p-3"><PaymentActions paymentId={p.id} userId={p.user_id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
