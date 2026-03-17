import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Images, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useGetAllGalleryEvents } from "../hooks/useQueries";
import { toDirectImageUrl } from "../utils/imageUrl";

export default function PhotosPage() {
  const { data: events, isLoading } = useGetAllGalleryEvents();
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Photo Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Memories captured at every event
        </p>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          data-ocid="photos.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <div className="text-center py-16" data-ocid="photos.empty_state">
          <Images className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No photos available yet.</p>
        </div>
      ) : (
        <Tabs defaultValue={events[0]?.eventName} data-ocid="photos.tabs">
          <TabsList className="flex-wrap h-auto gap-1 mb-6">
            {events.map((ev) => (
              <TabsTrigger
                key={ev.eventName}
                value={ev.eventName}
                data-ocid={`photos.${ev.eventName.toLowerCase().replace(/\s+/g, "_")}.tab`}
              >
                {ev.eventName}
              </TabsTrigger>
            ))}
          </TabsList>

          {events.map((ev) => (
            <TabsContent key={ev.eventName} value={ev.eventName}>
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-foreground">
                  {ev.eventName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {ev.imageUrls.length} images
                </p>
              </div>
              {ev.imageUrls.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">
                  No images in this event.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ev.imageUrls.map((url, i) => (
                    <motion.button
                      type="button"
                      key={url}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setLightbox(toDirectImageUrl(url))}
                      className="aspect-square overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200"
                      data-ocid={`photos.item.${i + 1}`}
                    >
                      <img
                        src={toDirectImageUrl(url)}
                        alt={`${ev.eventName} ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
            data-ocid="photos.lightbox.modal"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition-colors"
              onClick={() => setLightbox(null)}
              data-ocid="photos.lightbox.close_button"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={lightbox}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
