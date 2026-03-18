import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    batch : Text;
  };

  type Post = {
    title : Text;
    slug : Text;
    body : Text;
    categoryId : Text;
    tags : [Text];
    authorId : Text;
    likeCount : Nat;
    createdAt : Int;
  };

  type Comment = {
    id : Text;
    postId : Text;
    authorId : Text;
    body : Text;
    createdAt : Int;
  };

  type Category = {
    id : Text;
    name : Text;
  };

  type Friend = {
    name : Text;
    photoUrl : Text;
    mobile : Text;
    facebookId : Text;
  };

  type GalleryEvent = {
    eventName : Text;
    imageUrls : [Text];
  };

  type YouTubeVideo = {
    title : Text;
    youtubeUrl : Text;
    description : Text;
  };

  type PDFDocument = {
    title : Text;
    fileUrl : Text;
    description : Text;
  };

  type SocialLinks = {
    facebook : Text;
    youtube : Text;
    instagram : Text;
  };

  // ── Stable storage (survives upgrades) ──────────────────────────────
  // adminPrincipal is stable so admin assignment survives every redeploy
  stable var adminPrincipal : ?Principal = null;
  stable var postsStable : [(Text, Post)] = [];
  stable var commentsStable : [(Text, Comment)] = [];
  stable var categoriesStable : [(Text, Category)] = [];
  stable var friendsStable : [(Text, Friend)] = [];
  stable var galleryEventsStable : [(Text, GalleryEvent)] = [];
  stable var youtubeVideosStable : [(Text, YouTubeVideo)] = [];
  stable var pdfDocumentsStable : [(Text, PDFDocument)] = [];
  stable var postLikesStable : [(Text, [Principal])] = [];
  stable var userProfilesStable : [(Principal, UserProfile)] = [];
  stable var visitorCount : Nat = 0;
  stable var socialLinks : SocialLinks = { facebook = ""; youtube = ""; instagram = "" };

  // ── Working (non-stable) Maps ────────────────────────────────────────
  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<Text, Post>();
  let comments = Map.empty<Text, Comment>();
  let categories = Map.empty<Text, Category>();
  let friends = Map.empty<Text, Friend>();
  let galleryEvents = Map.empty<Text, GalleryEvent>();
  let youtubeVideos = Map.empty<Text, YouTubeVideo>();
  let pdfDocuments = Map.empty<Text, PDFDocument>();
  let postLikes = Map.empty<Text, [Principal]>();

  // Helper: sync stable adminPrincipal back into accessControlState
  func syncAdminToAccessControl(ap : Principal) {
    // Clear existing roles first
    let keysToRemove = accessControlState.userRoles.keys().toArray();
    for (principal in keysToRemove.vals()) {
      accessControlState.userRoles.remove(principal);
    };
    accessControlState.adminAssigned := false;
    AccessControl.initialize(accessControlState, ap, "first-admin", "first-admin");
  };

  // ── Upgrade hooks ────────────────────────────────────────────────────
  system func preupgrade() {
    postsStable := posts.entries().toArray();
    commentsStable := comments.entries().toArray();
    categoriesStable := categories.entries().toArray();
    friendsStable := friends.entries().toArray();
    galleryEventsStable := galleryEvents.entries().toArray();
    youtubeVideosStable := youtubeVideos.entries().toArray();
    pdfDocumentsStable := pdfDocuments.entries().toArray();
    postLikesStable := postLikes.entries().toArray();
    userProfilesStable := userProfiles.entries().toArray();
  };

  system func postupgrade() {
    for ((k, v) in postsStable.vals()) { posts.add(k, v) };
    for ((k, v) in commentsStable.vals()) { comments.add(k, v) };
    for ((k, v) in categoriesStable.vals()) { categories.add(k, v) };
    for ((k, v) in friendsStable.vals()) { friends.add(k, v) };
    for ((k, v) in galleryEventsStable.vals()) { galleryEvents.add(k, v) };
    for ((k, v) in youtubeVideosStable.vals()) { youtubeVideos.add(k, v) };
    for ((k, v) in pdfDocumentsStable.vals()) { pdfDocuments.add(k, v) };
    for ((k, v) in postLikesStable.vals()) { postLikes.add(k, v) };
    for ((k, v) in userProfilesStable.vals()) { userProfiles.add(k, v) };
    postsStable := [];
    commentsStable := [];
    categoriesStable := [];
    friendsStable := [];
    galleryEventsStable := [];
    youtubeVideosStable := [];
    pdfDocumentsStable := [];
    postLikesStable := [];
    userProfilesStable := [];
    // Restore admin from stable storage into accessControlState
    switch (adminPrincipal) {
      case (null) {};
      case (?ap) { syncAdminToAccessControl(ap) };
    };
  };

  // Admin check helper - uses stable adminPrincipal for reliability
  func checkAdmin(caller : Principal) {
    switch (adminPrincipal) {
      case (null) { Runtime.trap("Unauthorized: No admin assigned yet") };
      case (?ap) {
        if (caller != ap) {
          Runtime.trap("Unauthorized: Only admins can perform this action");
        };
      };
    };
  };

  // Override isCallerAdmin to use stable adminPrincipal directly (never traps)
  public query ({ caller }) func isCallerAdmin() : async Bool {
    switch (adminPrincipal) {
      case (?ap) { caller == ap };
      case (null) { false };
    };
  };

  // Claim admin role - first caller becomes admin (one-time only)
  public shared ({ caller }) func claimAdminRole(_userSecret : Text) : async Bool {
    if (adminPrincipal != null) {
      return false;
    };
    if (caller.isAnonymous()) {
      return false;
    };
    adminPrincipal := ?caller;
    syncAdminToAccessControl(caller);
    true;
  };

  // Reset admin and claim - use the secret reset code to take over as admin
  public shared ({ caller }) func resetAndClaimAdmin(resetCode : Text) : async Bool {
    if (resetCode != "HUHS-ADMIN-RESET-2023") {
      return false;
    };
    if (caller.isAnonymous()) {
      return false;
    };
    adminPrincipal := ?caller;
    syncAdminToAccessControl(caller);
    true;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user) {
      switch (adminPrincipal) {
        case (?ap) {
          if (caller != ap) {
            Runtime.trap("Unauthorized: Can only view your own profile");
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: Can only view your own profile");
        };
      };
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in to save profile");
    };
    userProfiles.add(caller, profile);
  };

  // Visitor Counter - Public access
  public func incrementVisitorCount() : async Nat {
    visitorCount += 1;
    visitorCount;
  };

  public query func getVisitorCount() : async Nat {
    visitorCount;
  };

  module Post {
    public func compareByCreatedAt(p1 : Post, p2 : Post) : Order.Order {
      if (p1.createdAt < p2.createdAt) { #less } else if (p1.createdAt > p2.createdAt) {
        #greater;
      } else { #equal };
    };
  };

  // Posts CRUD - Admin only
  public shared ({ caller }) func createPost(title : Text, slug : Text, body : Text, categoryId : Text, tags : [Text], authorId : Text) : async () {
    checkAdmin(caller);
    let post : Post = {
      title; slug; body; categoryId; tags; authorId;
      likeCount = 0;
      createdAt = Time.now();
    };
    posts.add(slug, post);
    postLikes.add(slug, []);
  };

  public shared ({ caller }) func updatePost(slug : Text, title : Text, body : Text, categoryId : Text, tags : [Text]) : async () {
    checkAdmin(caller);
    switch (posts.get(slug)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existingPost) {
        posts.add(slug, { existingPost with title; body; categoryId; tags });
      };
    };
  };

  public shared ({ caller }) func deletePost(slug : Text) : async () {
    checkAdmin(caller);
    posts.remove(slug);
    postLikes.remove(slug);
  };

  public query func getPostBySlug(slug : Text) : async ?Post {
    posts.get(slug);
  };

  public query func getAllPosts() : async [Post] {
    posts.values().toArray().sort(Post.compareByCreatedAt);
  };

  public query func searchPosts(searchTerm : Text) : async [Post] {
    posts.values().toArray().sort(Post.compareByCreatedAt).filter(
      func(post) {
        post.title.contains(#text(searchTerm)) or post.body.contains(#text(searchTerm));
      }
    );
  };

  // Comments - any logged-in user
  public shared ({ caller }) func addComment(postId : Text, authorId : Text, body : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in to comment");
    };
    let commentId = postId # "-" # Time.now().toText();
    comments.add(commentId, { id = commentId; postId; authorId; body; createdAt = Time.now() });
  };

  public shared ({ caller }) func deleteComment(commentId : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    switch (comments.get(commentId)) {
      case (null) { Runtime.trap("Comment not found") };
      case (?comment) {
        let isAdmin = switch (adminPrincipal) {
          case (?ap) { caller == ap };
          case (null) { false };
        };
        if (comment.authorId != caller.toText() and not isAdmin) {
          Runtime.trap("Unauthorized: Can only delete your own comments");
        };
        comments.remove(commentId);
      };
    };
  };

  public query func getCommentsByPost(postId : Text) : async [Comment] {
    comments.values().toArray().filter(func(c) { c.postId == postId });
  };

  // Likes - any logged-in user
  public shared ({ caller }) func toggleLike(postId : Text) : async Nat {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be logged in to like posts");
    };
    switch (postLikes.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?likers) {
        let alreadyLiked = likers.find(func(p : Principal) : Bool { p == caller });
        let newLikers = switch (alreadyLiked) {
          case (null) { likers.concat([caller]) };
          case (?_) { likers.filter(func(p : Principal) : Bool { p != caller }) };
        };
        let newLikeCount = newLikers.size();
        postLikes.add(postId, newLikers);
        switch (posts.get(postId)) {
          case (null) {};
          case (?post) { posts.add(postId, { post with likeCount = newLikeCount }) };
        };
        newLikeCount;
      };
    };
  };

  public query func getLikeCount(postId : Text) : async Nat {
    switch (postLikes.get(postId)) {
      case (null) { 0 };
      case (?likers) { likers.size() };
    };
  };

  // Categories - Admin only
  public shared ({ caller }) func createCategory(id : Text, name : Text) : async () {
    checkAdmin(caller);
    categories.add(id, { id; name });
  };

  public shared ({ caller }) func updateCategory(id : Text, name : Text) : async () {
    checkAdmin(caller);
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) { categories.add(id, { id; name }) };
    };
  };

  public shared ({ caller }) func deleteCategory(id : Text) : async () {
    checkAdmin(caller);
    categories.remove(id);
  };

  public query func getAllCategories() : async [Category] {
    categories.values().toArray();
  };

  // Friends - Admin only
  public shared ({ caller }) func createFriend(name : Text, photoUrl : Text, mobile : Text, facebookId : Text) : async () {
    checkAdmin(caller);
    friends.add(name, { name; photoUrl; mobile; facebookId });
  };

  public shared ({ caller }) func updateFriend(name : Text, photoUrl : Text, mobile : Text, facebookId : Text) : async () {
    checkAdmin(caller);
    switch (friends.get(name)) {
      case (null) { Runtime.trap("Friend not found") };
      case (?_) { friends.add(name, { name; photoUrl; mobile; facebookId }) };
    };
  };

  public shared ({ caller }) func deleteFriend(name : Text) : async () {
    checkAdmin(caller);
    friends.remove(name);
  };

  public query func getAllFriends() : async [Friend] {
    friends.values().toArray();
  };

  // Gallery Events - Admin only
  public shared ({ caller }) func createGalleryEvent(eventName : Text, imageUrls : [Text]) : async () {
    checkAdmin(caller);
    galleryEvents.add(eventName, { eventName; imageUrls });
  };

  public shared ({ caller }) func updateGalleryEvent(eventName : Text, imageUrls : [Text]) : async () {
    checkAdmin(caller);
    switch (galleryEvents.get(eventName)) {
      case (null) { Runtime.trap("Gallery Event not found") };
      case (?_) { galleryEvents.add(eventName, { eventName; imageUrls }) };
    };
  };

  public shared ({ caller }) func deleteGalleryEvent(eventName : Text) : async () {
    checkAdmin(caller);
    galleryEvents.remove(eventName);
  };

  public query func getAllGalleryEvents() : async [GalleryEvent] {
    galleryEvents.values().toArray();
  };

  // YouTube Videos - Admin only
  public shared ({ caller }) func createYouTubeVideo(title : Text, youtubeUrl : Text, description : Text) : async () {
    checkAdmin(caller);
    youtubeVideos.add(title, { title; youtubeUrl; description });
  };

  public shared ({ caller }) func updateYouTubeVideo(title : Text, youtubeUrl : Text, description : Text) : async () {
    checkAdmin(caller);
    switch (youtubeVideos.get(title)) {
      case (null) { Runtime.trap("Video not found") };
      case (?_) { youtubeVideos.add(title, { title; youtubeUrl; description }) };
    };
  };

  public shared ({ caller }) func deleteYouTubeVideo(title : Text) : async () {
    checkAdmin(caller);
    youtubeVideos.remove(title);
  };

  public query func getAllYouTubeVideos() : async [YouTubeVideo] {
    youtubeVideos.values().toArray();
  };

  // PDF Documents - Admin only
  public shared ({ caller }) func createPDFDocument(title : Text, fileUrl : Text, description : Text) : async () {
    checkAdmin(caller);
    pdfDocuments.add(title, { title; fileUrl; description });
  };

  public shared ({ caller }) func updatePDFDocument(title : Text, fileUrl : Text, description : Text) : async () {
    checkAdmin(caller);
    switch (pdfDocuments.get(title)) {
      case (null) { Runtime.trap("PDF not found") };
      case (?_) { pdfDocuments.add(title, { title; fileUrl; description }) };
    };
  };

  public shared ({ caller }) func deletePDFDocument(title : Text) : async () {
    checkAdmin(caller);
    pdfDocuments.remove(title);
  };

  public query func getAllPDFDocuments() : async [PDFDocument] {
    pdfDocuments.values().toArray();
  };

  // Social Links - Admin write, public read
  public query func getSocialLinks() : async SocialLinks {
    socialLinks;
  };

  public shared ({ caller }) func updateSocialLinks(facebook : Text, youtube : Text, instagram : Text) : async () {
    checkAdmin(caller);
    socialLinks := { facebook; youtube; instagram };
  };
};
