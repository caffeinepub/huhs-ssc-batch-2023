import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "lucide-react";
import { motion } from "motion/react";
import { useGetAllVideos } from "../hooks/useQueries";

function getYouTubeId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return url;
}

export default function VideosPage() {
  const { data: videos, isLoading } = useGetAllVideos();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Videos</h1>
        <p className="text-muted-foreground mt-2">
          Watch event highlights and memories
        </p>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="videos.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl overflow-hidden shadow-card"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !videos || videos.length === 0 ? (
        <div className="text-center py-16" data-ocid="videos.empty_state">
          <Video className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No videos available yet.</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="videos.list"
        >
          {videos.map((video, i) => {
            const videoId = getYouTubeId(video.youtubeUrl);
            return (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                data-ocid={`videos.item.${i + 1}`}
              >
                <div className="aspect-video w-full overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
