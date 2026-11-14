import type { VideoSource } from "@/academy/types";
import { Icon } from "@/components/ui/Icon";

/**
 * Videoplayer für Lektionen: YouTube (datensparsam über youtube-nocookie), Vimeo (dnt) oder eigene Datei (z. B. aus R2).
 * Ohne Video wird ein klar beschrifteter Hinweis gezeigt – kein Fake-Player.
 */
export function VideoPlayer({ video, title, soonLabel }: { video?: VideoSource; title: string; soonLabel: string }) {
  const frame = "absolute inset-0 h-full w-full";
  return (
    <div className="bg-noir relative aspect-video overflow-hidden rounded-3xl border border-white/10">
      {video?.kind === "youtube" ? (
        <iframe className={frame} src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?rel=0`} title={title} allow="encrypted-media; picture-in-picture; fullscreen" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      ) : video?.kind === "vimeo" ? (
        <iframe className={frame} src={`https://player.vimeo.com/video/${encodeURIComponent(video.id)}?dnt=1`} title={title} allow="fullscreen; picture-in-picture" loading="lazy" />
      ) : video?.kind === "file" ? (
        <video className={frame} src={video.src} controls preload="metadata" controlsList="nodownload" />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold-400/40 text-gold-200"><Icon name="play" className="h-6 w-6" /></span>
            <p className="mx-auto mt-4 max-w-sm text-sm text-white/65">{soonLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}
