import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, MessageCircle, Tag } from "lucide-react";
import { motion } from "motion/react";
import type { Category, Post } from "../backend.d";
import { useRouter } from "../router";

interface PostCardProps {
  post: Post;
  categories: Category[];
  index: number;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CARD_IMAGES = [
  "/assets/generated/hero-slide1.dim_1200x600.jpg",
  "/assets/generated/hero-slide2.dim_1200x600.jpg",
  "/assets/generated/hero-slide3.dim_1200x600.jpg",
  "/assets/generated/gallery-farewell.dim_800x500.jpg",
  "/assets/generated/gallery-science.dim_800x500.jpg",
];

export default function PostCard({ post, categories, index }: PostCardProps) {
  const { navigate } = useRouter();
  const category = categories.find((c) => c.id === post.categoryId);
  const image = CARD_IMAGES[index % CARD_IMAGES.length];
  const excerpt = `${post.body.slice(0, 120).replace(/<[^>]*>/g, "")}...`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl shadow-card overflow-hidden card-hover cursor-pointer"
      onClick={() => navigate(`/posts/${post.slug}`)}
      data-ocid={`posts.item.${index + 1}`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {category && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold">
            {category.name}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-base leading-snug mb-2 line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {post.likeCount.toString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {excerpt}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-xs bg-secondary/15 text-success px-2 py-0.5 rounded-full"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="px-4 pb-4 flex items-center gap-2 border-t border-border pt-3">
        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">
            {post.authorId[0]?.toUpperCase() ?? "A"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{post.authorId}</span>
        <span className="ml-auto text-xs text-primary font-medium flex items-center gap-1">
          <MessageCircle className="w-3 h-3" /> Read more
        </span>
      </div>
    </motion.article>
  );
}
