import { redirect } from "next/navigation";
import DeviceGuard from "@/components/DeviceGuard";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function VideoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("status").eq("id", user.id).single();
  const { data: video } = await supabase.from("videos").select("*").eq("id", params.id).single();
  if (!video) redirect("/videos");

  const canWatch = video.is_sample || profile?.status === "active";
  if (!canWatch) redirect("/payment");

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8">
      <DeviceGuard />
      <a href="/videos" className="underline">← Back to lessons</a>
      <h1 className="my-5 text-3xl font-black">{video.title}</h1>
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.youtube_video_id}?rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {video.description && <p className="mt-5 text-slate-700">{video.description}</p>}
    </main>
  );
}
