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

  let userProfiles = Map.empty<Principal, UserProfile>();
  let posts = Map.empty<Text, Post>();
  let comments = Map.empty<Text, Comment>();
  let categories = Map.empty<Text, Category>();
  let friends = Map.empty<Text, Friend>();
  let galleryEvents = Map.empty<Text, GalleryEvent>();
  let youtubeVideos = Map.empty<Text, YouTubeVideo>();
  let pdfDocuments = Map.empty<Text, PDFDocument>();
  let postLikes = Map.empty<Text, [Principal]>();
  var visitorCount = 0;

  // Admin check helper
  func checkAdmin(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // Claim admin role - first caller becomes admin (one-time only)
  public shared ({ caller }) func claimAdminRole(_userSecret : Text) : async Bool {
    if (accessControlState.adminAssigned) {
      return false;
    };
    AccessControl.initialize(accessControlState, caller, "first-admin", "first-admin");
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
    // Clear all existing role assignments
    for ((principal, _role) in accessControlState.userRoles.entries()) {
      accessControlState.userRoles.remove(principal);
    };
    // Reset the adminAssigned flag
    accessControlState.adminAssigned := false;
    // Assign caller as admin
    AccessControl.initialize(accessControlState, caller, "first-admin", "first-admin");
    true;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
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

  // Comments
  public shared ({ caller }) func addComment(postId : Text, authorId : Text, body : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    let commentId = postId # "-" # Time.now().toText();
    comments.add(commentId, { id = commentId; postId; authorId; body; createdAt = Time.now() });
  };

  public shared ({ caller }) func deleteComment(commentId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete comments");
    };
    switch (comments.get(commentId)) {
      case (null) { Runtime.trap("Comment not found") };
      case (?comment) {
        if (comment.authorId != caller.toText() and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own comments");
        };
        comments.remove(commentId);
      };
    };
  };

  public query func getCommentsByPost(postId : Text) : async [Comment] {
    comments.values().toArray().filter(func(c) { c.postId == postId });
  };

  // Likes
  public shared ({ caller }) func toggleLike(postId : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can like posts");
    };
    switch (postLikes.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?likers) {
        let newLikers = switch (likers.find(func(p) { p == caller })) {
          case (null) { likers.concat([caller]) };
          case (?_) { likers.filter(func(p) { p != caller }) };
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
};
