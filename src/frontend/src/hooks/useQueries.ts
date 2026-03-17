import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  Comment,
  Friend,
  GalleryEvent,
  PDFDocument,
  Post,
  UserProfile,
  YouTubeVideo,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchPosts(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts", "search", term],
    queryFn: async () => {
      if (!actor || !term.trim()) return [];
      return actor.searchPosts(term);
    },
    enabled: !!actor && !isFetching && term.trim().length > 1,
  });
}

export function useGetPostBySlug(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Post | null>({
    queryKey: ["post", slug],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getPostBySlug(slug);
      return result ?? null;
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllFriends() {
  const { actor, isFetching } = useActor();
  return useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFriends();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllGalleryEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryEvent[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<YouTubeVideo[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllYouTubeVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPDFs() {
  const { actor, isFetching } = useActor();
  return useQuery<PDFDocument[]>({
    queryKey: ["pdfs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPDFDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetComments(postId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommentsByPost(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useGetVisitorCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["visitorCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getVisitorCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin() as Promise<boolean>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLikeCount(postId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["likeCount", postId],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getLikeCount(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      title: string;
      slug: string;
      body: string;
      categoryId: string;
      tags: string[];
      authorId: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(
        p.title,
        p.slug,
        p.body,
        p.categoryId,
        p.tags,
        p.authorId,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      slug: string;
      title: string;
      body: string;
      categoryId: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePost(p.slug, p.title, p.body, p.categoryId, p.tags);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePost(slug);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useCreateFriend() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: {
      name: string;
      photoUrl: string;
      mobile: string;
      facebookId: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFriend(f.name, f.photoUrl, f.mobile, f.facebookId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}

export function useDeleteFriend() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFriend(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}

export function useCreateGalleryEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: { eventName: string; imageUrls: string[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createGalleryEvent(e.eventName, e.imageUrls);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useDeleteGalleryEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (eventName: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteGalleryEvent(eventName);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useCreateVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      title: string;
      youtubeUrl: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createYouTubeVideo(v.title, v.youtubeUrl, v.description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteYouTubeVideo(title);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useCreatePDF() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      title: string;
      fileUrl: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPDFDocument(p.title, p.fileUrl, p.description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pdfs"] }),
  });
}

export function useDeletePDF() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePDFDocument(title);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pdfs"] }),
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: {
      postId: string;
      authorId: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addComment(c.postId, c.authorId, c.body);
    },
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({ queryKey: ["comments", variables.postId] }),
  });
}

export function useToggleLike() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleLike(postId);
    },
    onSuccess: (_data, postId) => {
      qc.invalidateQueries({ queryKey: ["likeCount", postId] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useIncrementVisitorCount() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return BigInt(0);
      return actor.incrementVisitorCount();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visitorCount"] }),
  });
}

export function useInitAuth() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!actor) throw new Error("Not connected");
      return actor._initializeAccessControlWithSecret(secret);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
      qc.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerUserProfile"] }),
  });
}

export function useClaimAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).claimAdminRole(secret) as Promise<boolean>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useResetAndClaimAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (resetCode: string) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).resetAndClaimAdmin(resetCode) as Promise<boolean>;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useUpdateFriend() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: {
      name: string;
      photoUrl: string;
      mobile: string;
      facebookId: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateFriend(
        f.name,
        f.photoUrl,
        f.mobile,
        f.facebookId,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}

export function useUpdateGalleryEvent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: { eventName: string; imageUrls: string[] }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateGalleryEvent(e.eventName, e.imageUrls);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useUpdateVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: {
      title: string;
      youtubeUrl: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateYouTubeVideo(
        v.title,
        v.youtubeUrl,
        v.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useUpdatePDF() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      title: string;
      fileUrl: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updatePDFDocument(
        p.title,
        p.fileUrl,
        p.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pdfs"] }),
  });
}

export function useGetSocialLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<{ facebook: string; youtube: string; instagram: string }>({
    queryKey: ["socialLinks"],
    queryFn: async () => {
      if (!actor) return { facebook: "", youtube: "", instagram: "" };
      return (actor as any).getSocialLinks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSocialLinks() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (links: {
      facebook: string;
      youtube: string;
      instagram: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateSocialLinks(
        links.facebook,
        links.youtube,
        links.instagram,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}
