import { Skeleton } from "@/components/ui/skeleton";
import { Facebook, Phone, UserCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useGetAllFriends } from "../hooks/useQueries";
import { toDirectImageUrl } from "../utils/imageUrl";

export default function FriendsPage() {
  const { data: friends, isLoading } = useGetAllFriends();
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Our Friends</h1>
        <p className="text-muted-foreground mt-2">
          Batch mates of SSC 2023 – Harishchar Union High School
        </p>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          data-ocid="friends.loading_state"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-4 flex flex-col items-center gap-3 shadow-card"
            >
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      ) : !friends || friends.length === 0 ? (
        <div className="text-center py-16" data-ocid="friends.empty_state">
          <UserCircle2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No friends added yet.</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          data-ocid="friends.list"
        >
          {friends.map((friend, i) => {
            const showFallback =
              !friend.photoUrl || brokenImages.has(friend.name);
            return (
              <motion.div
                key={friend.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card rounded-xl p-4 flex flex-col items-center gap-3 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                data-ocid={`friends.item.${i + 1}`}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20 bg-primary/10 flex items-center justify-center">
                  {showFallback ? (
                    <UserCircle2 className="w-10 h-10 text-primary/40" />
                  ) : (
                    <img
                      src={toDirectImageUrl(friend.photoUrl)}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                      onError={() => {
                        setBrokenImages((prev) =>
                          new Set(prev).add(friend.name),
                        );
                      }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground text-sm">
                    {friend.name}
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  {friend.mobile && (
                    <a
                      href={`tel:${friend.mobile}`}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="w-3 h-3 shrink-0" />
                      <span className="truncate">{friend.mobile}</span>
                    </a>
                  )}
                  {friend.facebookId && (
                    <a
                      href={
                        friend.facebookId.startsWith("http")
                          ? friend.facebookId
                          : `https://facebook.com/${friend.facebookId}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Facebook className="w-3 h-3 shrink-0" />
                      <span className="truncate">Facebook</span>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
