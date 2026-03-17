import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Globe, Images, Users, Video } from "lucide-react";
import { motion } from "motion/react";
import HeroCarousel from "../components/HeroCarousel";
import PostCard from "../components/PostCard";
import {
  useGetAllCategories,
  useGetAllGalleryEvents,
  useGetAllPosts,
} from "../hooks/useQueries";
import { useRouter } from "../router";

const QUICK_NAV = [
  {
    label: "Friends",
    path: "/friends",
    icon: Users,
    color:
      "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
  },
  {
    label: "Photos",
    path: "/photos",
    icon: Images,
    color:
      "bg-secondary/10 text-success hover:bg-secondary hover:text-secondary-foreground",
  },
  {
    label: "Videos",
    path: "/videos",
    icon: Video,
    color:
      "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
  },
  {
    label: "PDFs",
    path: "/pdfs",
    icon: FileText,
    color:
      "bg-secondary/10 text-success hover:bg-secondary hover:text-secondary-foreground",
  },
  {
    label: "Social",
    path: "/social",
    icon: Globe,
    color:
      "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
  },
];

interface HomePageProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

export default function HomePage({
  searchTerm,
  onSearchChange,
}: HomePageProps) {
  const { navigate } = useRouter();
  const { data: posts, isLoading: postsLoading } = useGetAllPosts();
  const { data: categories = [] } = useGetAllCategories();
  const { data: galleryEvents } = useGetAllGalleryEvents();

  const displayPosts = posts ?? [];
  const filteredPosts = searchTerm
    ? displayPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.body.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : displayPosts;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <section className="mb-6" data-ocid="home.hero.section">
        <HeroCarousel galleryEvents={galleryEvents} />
      </section>

      {/* Quick Nav */}
      <section className="mb-10" data-ocid="home.quicknav.section">
        <div className="flex flex-wrap gap-3 justify-center">
          {QUICK_NAV.map(({ label, path, icon: Icon, color }) => (
            <button
              type="button"
              key={path}
              onClick={() => navigate(path)}
              data-ocid={`home.${label.toLowerCase()}.button`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-border font-medium text-sm transition-all duration-200 ${color}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Posts */}
      <section data-ocid="home.posts.section">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Latest Updates &amp; Memories
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Stay connected with your batch
            </p>
          </div>
          {searchTerm && (
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} result(s) for &quot;{searchTerm}&quot;
              <button
                type="button"
                className="ml-2 text-primary hover:underline"
                onClick={() => onSearchChange("")}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {postsLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="posts.loading_state"
          >
            {["a", "b", "c"].map((k) => (
              <div
                key={k}
                className="bg-card rounded-xl overflow-hidden shadow-card"
              >
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16" data-ocid="posts.empty_state">
            <p className="text-muted-foreground text-lg">No posts found.</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="posts.list"
          >
            {filteredPosts.map((post, i) => (
              <PostCard
                key={post.slug}
                post={post}
                categories={categories}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
