import Link from "next/link";
import { redirect } from "next/navigation";
import DeviceGuard from "@/components/DeviceGuard";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function VideosPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("status,plan").eq("id", user.id).single();
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id,title,chapter_order,videos(id,title,is_sample,video_order)")
    .order("chapter_order")
    .order("video_order", { referencedTable: "videos" });

  const isActive = profile?.status === "active";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8">
      <DeviceGuard />
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Lessons</h1>
          <p className="text-slate-600">Status: {profile?.status || "inactive"}</p>
        </div>
        {!isActive && <Link href="/payment" className="btn">Upload Payment</Link>}
      </div>

      <div className="space-y-6">
        {chapters?.map((chapter: any) => (
          <section key={chapter.id} className="card">
            <h2 className="mb-4 text-2xl font-bold">Chapter {chapter.chapter_order}: {chapter.title}</h2>
            <div className="space-y-3">
              {chapter.videos?.map((video: any) => {
                const canWatch = video.is_sample || isActive;
                return (
                  <div key={video.id} className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="font-semibold">{video.title}</p>
                      <p className="text-sm text-slate-500">{video.is_sample ? "Sample / Free" : "Paid only"}</p>
                    </div>
                    {canWatch ? <Link href={`/videos/${video.id}`} className="btn-light">Watch</Link> : <Link href="/payment" className="btn-light">🔒 Unlock</Link>}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
