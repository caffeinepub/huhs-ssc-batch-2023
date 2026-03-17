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

export const SAMPLE_POSTS: Post[] = [
  {
    categoryId: "announcements",
    title: "Farewell 2023: A Bittersweet Goodbye",
    likeCount: BigInt(24),
    authorId: "admin",
    body: "The farewell ceremony of SSC Batch 2023 was held on March 15th at the school auditorium. It was an emotional and joyful occasion as students, teachers, and parents gathered to celebrate the end of a remarkable journey. The event featured cultural performances, speeches, and heartfelt moments that will be cherished forever.\n\nStudents shared their memories and expressed gratitude to their teachers for guiding them through their academic journey. The principal delivered an inspiring speech about the bright futures awaiting each student.",
    createdAt: BigInt(Date.now() - 7 * 86400000) * BigInt(1000000),
    slug: "farewell-2023",
    tags: ["farewell", "ceremony", "batch-2023"],
  },
  {
    categoryId: "events",
    title: "Annual Sports Day 2023 – Champions Rise!",
    likeCount: BigInt(18),
    authorId: "admin",
    body: "The Annual Sports Day was a grand success with over 200 students participating in various athletic events. From the 100m sprint to relay races and tug-of-war, the spirit of competition was at an all-time high.\n\nClass 10A clinched the overall championship trophy, while individual gold medals were distributed across different categories. The event reinforced the importance of physical fitness and teamwork among students.",
    createdAt: BigInt(Date.now() - 14 * 86400000) * BigInt(1000000),
    slug: "sports-day-2023",
    tags: ["sports", "athletics", "competition"],
  },
  {
    categoryId: "academics",
    title: "SSC Exam Results 2023 – Record Pass Rate!",
    likeCount: BigInt(42),
    authorId: "admin",
    body: "We are proud to announce that Harishchar Union High School and College achieved a record 98.5% pass rate in the SSC examinations of 2023. Out of 120 students who appeared for the exam, 118 passed with flying colors.\n\nThree students achieved perfect GPA 5.00, and 45 students achieved GPA above 4.5. This outstanding result is a testament to the dedication of our students and the tireless efforts of our teaching staff.",
    createdAt: BigInt(Date.now() - 21 * 86400000) * BigInt(1000000),
    slug: "ssc-results-2023",
    tags: ["results", "exam", "achievement"],
  },
];

export const SAMPLE_FRIENDS: Friend[] = [
  {
    name: "Rakibul Hasan",
    photoUrl: "/assets/generated/friend-male1.dim_200x200.jpg",
    mobile: "+880 1711-234567",
    facebookId: "https://facebook.com/rakibul.hasan",
  },
  {
    name: "Sumaiya Akter",
    photoUrl: "/assets/generated/friend-female1.dim_200x200.jpg",
    mobile: "+880 1812-345678",
    facebookId: "https://facebook.com/sumaiya.akter",
  },
  {
    name: "Mehedi Hasan",
    photoUrl: "/assets/generated/friend-male2.dim_200x200.jpg",
    mobile: "+880 1913-456789",
    facebookId: "https://facebook.com/mehedi.hasan",
  },
  {
    name: "Nusrat Jahan",
    photoUrl: "/assets/generated/friend-female2.dim_200x200.jpg",
    mobile: "+880 1614-567890",
    facebookId: "https://facebook.com/nusrat.jahan",
  },
  {
    name: "Fahim Ahmed",
    photoUrl: "/assets/generated/friend-male1.dim_200x200.jpg",
    mobile: "+880 1715-678901",
    facebookId: "https://facebook.com/fahim.ahmed",
  },
];

export const SAMPLE_GALLERY: GalleryEvent[] = [
  {
    eventName: "Farewell Ceremony 2023",
    imageUrls: [
      "/assets/generated/gallery-farewell.dim_800x500.jpg",
      "/assets/generated/hero-slide1.dim_1200x600.jpg",
      "/assets/generated/hero-slide2.dim_1200x600.jpg",
    ],
  },
  {
    eventName: "Annual Science Fair 2023",
    imageUrls: [
      "/assets/generated/gallery-science.dim_800x500.jpg",
      "/assets/generated/hero-slide3.dim_1200x600.jpg",
    ],
  },
];

export const SAMPLE_VIDEOS: YouTubeVideo[] = [
  {
    title: "SSC Batch 2023 Farewell Highlights",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description:
      "Highlights from the emotional farewell ceremony of SSC Batch 2023.",
  },
  {
    title: "Sports Day 2023 – Best Moments",
    youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    description:
      "Best moments captured during the Annual Sports Day competition.",
  },
  {
    title: "School Annual Cultural Program 2023",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    description:
      "Cultural performances and prize distribution ceremony highlights.",
  },
];

export const SAMPLE_PDFS: PDFDocument[] = [
  {
    title: "SSC Batch 2023 – Study Guide",
    fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    description:
      "Complete study guide prepared by teachers for SSC examinations.",
  },
  {
    title: "School Rules & Regulations 2023",
    fileUrl: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1.pdf",
    description: "Official rules and code of conduct for students and staff.",
  },
];

export const SAMPLE_CATEGORIES: Category[] = [
  { id: "announcements", name: "Announcements" },
  { id: "events", name: "Events" },
  { id: "academics", name: "Academics" },
  { id: "sports", name: "Sports" },
];

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return SAMPLE_POSTS;
      const result = await actor.getAllPosts();
      return result.length > 0 ? result : SAMPLE_POSTS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SAMPLE_POSTS,
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
      if (!actor) return SAMPLE_POSTS.find((p) => p.slug === slug) ?? null;
      const result = await actor.getPostBySlug(slug);
      return result ?? SAMPLE_POSTS.find((p) => p.slug === slug) ?? null;
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return SAMPLE_CATEGORIES;
      const result = await actor.getAllCategories();
      return result.length > 0 ? result : SAMPLE_CATEGORIES;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SAMPLE_CATEGORIES,
  });
}

export function useGetAllFriends() {
  const { actor, isFetching } = useActor();
  return useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!actor) return SAMPLE_FRIENDS;
      const result = await actor.getAllFriends();
      return result.length > 0 ? result : SAMPLE_FRIENDS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SAMPLE_FRIENDS,
  });
}

export function useGetAllGalleryEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryEvent[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return SAMPLE_GALLERY;
      const result = await actor.getAllGalleryEvents();
      return result.length > 0 ? result : SAMPLE_GALLERY;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SAMPLE_GALLERY,
  });
}

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<YouTubeVideo[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return SAMPLE_VIDEOS;
      const result = await actor.getAllYouTubeVideos();
      return result.length > 0 ? result : SAMPLE_VIDEOS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SAMPLE_VIDEOS,
  });
}

export function useGetAllPDFs() {
  const { actor, isFetching } = useActor();
  return useQuery<PDFDocument[]>({
    queryKey: ["pdfs"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PDFS;
      const result = await actor.getAllPDFDocuments();
      return result.length > 0 ? result : SAMPLE_PDFS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SAMPLE_PDFS,
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

export function useGetLikeCount(postId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["likes", postId],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getLikeCount(postId);
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

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useToggleLike() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleLike(postId);
    },
    onSuccess: (_, postId) => {
      qc.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      authorId,
      body,
    }: { postId: string; authorId: string; body: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addComment(postId, authorId, body);
    },
    onSuccess: (_, { postId }) => {
      qc.invalidateQueries({ queryKey: ["comments", postId] });
    },
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

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
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
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
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
