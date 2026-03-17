import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Friend {
    name: string;
    photoUrl: string;
    facebookId: string;
    mobile: string;
}
export interface Category {
    id: string;
    name: string;
}
export interface Comment {
    id: string;
    authorId: string;
    body: string;
    createdAt: bigint;
    postId: string;
}
export interface Post {
    categoryId: string;
    title: string;
    likeCount: bigint;
    authorId: string;
    body: string;
    createdAt: bigint;
    slug: string;
    tags: Array<string>;
}
export interface PDFDocument {
    title: string;
    description: string;
    fileUrl: string;
}
export interface GalleryEvent {
    imageUrls: Array<string>;
    eventName: string;
}
export interface YouTubeVideo {
    title: string;
    description: string;
    youtubeUrl: string;
}
export interface UserProfile {
    name: string;
    batch: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: string, authorId: string, body: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCategory(id: string, name: string): Promise<void>;
    createFriend(name: string, photoUrl: string, mobile: string, facebookId: string): Promise<void>;
    createGalleryEvent(eventName: string, imageUrls: Array<string>): Promise<void>;
    createPDFDocument(title: string, fileUrl: string, description: string): Promise<void>;
    createPost(title: string, slug: string, body: string, categoryId: string, tags: Array<string>, authorId: string): Promise<void>;
    createYouTubeVideo(title: string, youtubeUrl: string, description: string): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    deleteComment(commentId: string): Promise<void>;
    deleteFriend(name: string): Promise<void>;
    deleteGalleryEvent(eventName: string): Promise<void>;
    deletePDFDocument(title: string): Promise<void>;
    deletePost(slug: string): Promise<void>;
    deleteYouTubeVideo(title: string): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllFriends(): Promise<Array<Friend>>;
    getAllGalleryEvents(): Promise<Array<GalleryEvent>>;
    getAllPDFDocuments(): Promise<Array<PDFDocument>>;
    getAllPosts(): Promise<Array<Post>>;
    getAllYouTubeVideos(): Promise<Array<YouTubeVideo>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsByPost(postId: string): Promise<Array<Comment>>;
    getLikeCount(postId: string): Promise<bigint>;
    getPostBySlug(slug: string): Promise<Post | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitorCount(): Promise<bigint>;
    incrementVisitorCount(): Promise<bigint>;
    _initializeAccessControlWithSecret(token: string): Promise<boolean>;
    claimAdminRole(userSecret: string): Promise<boolean>;
    resetAndClaimAdmin(resetCode: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPosts(searchTerm: string): Promise<Array<Post>>;
    toggleLike(postId: string): Promise<bigint>;
    updateCategory(id: string, name: string): Promise<void>;
    updateFriend(name: string, photoUrl: string, mobile: string, facebookId: string): Promise<void>;
    updateGalleryEvent(eventName: string, imageUrls: Array<string>): Promise<void>;
    updatePDFDocument(title: string, fileUrl: string, description: string): Promise<void>;
    updatePost(slug: string, title: string, body: string, categoryId: string, tags: Array<string>): Promise<void>;
    updateYouTubeVideo(title: string, youtubeUrl: string, description: string): Promise<void>;
}
