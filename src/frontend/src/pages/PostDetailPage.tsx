import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MessageCircle,
  Send,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddComment,
  useGetAllCategories,
  useGetComments,
  useGetLikeCount,
  useGetPostBySlug,
  useToggleLike,
} from "../hooks/useQueries";
import { useRouter } from "../router";

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCommentDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostDetailPage() {
  const { navigate, getParam } = useRouter();
  const slug = getParam(/^\/posts\/(.+)$/) ?? "";
  const { identity } = useInternetIdentity();
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading: postLoading } = useGetPostBySlug(slug);
  const { data: categories = [] } = useGetAllCategories();
  const { data: comments = [], isLoading: commentsLoading } =
    useGetComments(slug);
  const { data: likeCount } = useGetLikeCount(slug);
  const toggleLike = useToggleLike();
  const addComment = useAddComment();

  const category = categories.find((c) => c.id === post?.categoryId);

  const handleLike = async () => {
    if (!identity) {
      toast.error("Please login to like posts.");
      return;
    }
    try {
      await toggleLike.mutateAsync(slug);
    } catch {
      toast.error("Failed to toggle like.");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login to comment.");
      return;
    }
    if (!commentText.trim()) return;
    try {
      await addComment.mutateAsync({
        postId: slug,
        authorId: `${identity.getPrincipal().toString().slice(0, 12)}...`,
        body: commentText.trim(),
      });
      setCommentText("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment.");
    }
  };

  if (postLoading) {
    return (
      <main
        className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
        data-ocid="post.loading_state"
      >
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/3 mb-6" />
        <Skeleton className="h-56 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </main>
    );
  }

  if (!post) {
    return (
      <main
        className="max-w-3xl mx-auto px-4 py-16 text-center"
        data-ocid="post.error_state"
      >
        <p className="text-muted-foreground text-lg">Post not found.</p>
        <Button
          className="mt-4"
          onClick={() => navigate("/")}
          variant="outline"
        >
          Go Home
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8" data-ocid="post.page">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        data-ocid="post.back.button"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          {category && (
            <Badge className="bg-primary text-primary-foreground mb-3">
              {category.name}
            </Badge>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {(likeCount ?? post.likeCount).toString()} likes
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {comments.length} comments
            </span>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden mb-6 h-64 sm:h-80">
          <img
            src="/assets/generated/hero-slide1.dim_1200x600.jpg"
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-sm max-w-none text-foreground leading-relaxed mb-6 whitespace-pre-line">
          {post.body}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-secondary/15 text-success px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 py-4 border-y border-border mb-8">
          <Button
            variant="outline"
            className="gap-2 hover:text-destructive hover:border-destructive transition-colors"
            onClick={handleLike}
            disabled={toggleLike.isPending}
            data-ocid="post.like.button"
          >
            <Heart className="w-4 h-4" />
            {(likeCount ?? post.likeCount).toString()} Likes
          </Button>
          <span className="text-sm text-muted-foreground">
            Click to like this post
          </span>
        </div>

        <section data-ocid="post.comments.section">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Comments ({comments.length})
          </h2>

          {identity ? (
            <form
              onSubmit={handleComment}
              className="mb-6"
              data-ocid="post.comment.form"
            >
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="mb-2 resize-none"
                rows={3}
                data-ocid="post.comment.textarea"
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 gap-2"
                disabled={addComment.isPending || !commentText.trim()}
                data-ocid="post.comment.submit_button"
              >
                <Send className="w-4 h-4" />
                {addComment.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          ) : (
            <div
              className="bg-muted/50 rounded-lg p-4 mb-6 text-sm text-muted-foreground"
              data-ocid="post.comment.login_prompt"
            >
              Please log in to leave a comment.
            </div>
          )}

          {commentsLoading ? (
            <div className="space-y-3" data-ocid="post.comments.loading_state">
              {["a", "b"].map((k) => (
                <div key={k} className="bg-card rounded-lg p-4">
                  <Skeleton className="h-3 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p
              className="text-muted-foreground text-sm py-4"
              data-ocid="post.comments.empty_state"
            >
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-3" data-ocid="post.comments.list">
              {comments.map((comment, i) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-muted/40 rounded-lg p-4"
                  data-ocid={`post.comments.item.${i + 1}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {comment.authorId[0]?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {comment.authorId}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatCommentDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.body}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </motion.article>
    </main>
  );
}
