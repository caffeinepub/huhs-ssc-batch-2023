import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  KeyRound,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Friend,
  GalleryEvent,
  PDFDocument,
  Post,
  YouTubeVideo,
} from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useClaimAdmin,
  useCreateFriend,
  useCreateGalleryEvent,
  useCreatePDF,
  useCreatePost,
  useCreateVideo,
  useDeleteFriend,
  useDeleteGalleryEvent,
  useDeletePDF,
  useDeletePost,
  useDeleteVideo,
  useGetAllCategories,
  useGetAllFriends,
  useGetAllGalleryEvents,
  useGetAllPDFs,
  useGetAllPosts,
  useGetAllVideos,
  useGetSocialLinks,
  useIsAdmin,
  useResetAndClaimAdmin,
  useUpdateFriend,
  useUpdateGalleryEvent,
  useUpdatePDF,
  useUpdatePost,
  useUpdateSocialLinks,
  useUpdateVideo,
} from "../hooks/useQueries";
import { useRouter } from "../router";

function PostsTab() {
  const { data: posts = [] } = useGetAllPosts();
  const { data: categories = [] } = useGetAllCategories();
  const { identity } = useInternetIdentity();
  const createPost = useCreatePost();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();
  const [open, setOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    body: "",
    categoryId: "",
    tags: "",
  });

  const openNew = () => {
    setEditPost(null);
    setForm({ title: "", slug: "", body: "", categoryId: "", tags: "" });
    setOpen(true);
  };

  const openEdit = (p: Post) => {
    setEditPost(p);
    setForm({
      title: p.title,
      slug: p.slug,
      body: p.body,
      categoryId: p.categoryId,
      tags: p.tags.join(", "),
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required.");
      return;
    }
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      if (editPost) {
        await updatePost.mutateAsync({
          slug: editPost.slug,
          title: form.title,
          body: form.body,
          categoryId: form.categoryId,
          tags,
        });
        toast.success("Post updated!");
      } else {
        await createPost.mutateAsync({
          title: form.title,
          slug: form.slug,
          body: form.body,
          categoryId: form.categoryId,
          tags,
          authorId: identity?.getPrincipal().toString().slice(0, 8) ?? "admin",
        });
        toast.success("Post created!");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Operation failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Posts ({posts.length})</h2>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 gap-1"
          onClick={openNew}
          data-ocid="admin.posts.open_modal_button"
        >
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table data-ocid="admin.posts.table">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p, i) => (
              <TableRow key={p.slug} data-ocid={`admin.posts.row.${i + 1}`}>
                <TableCell className="font-medium max-w-xs truncate">
                  {p.title}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {categories.find((c) => c.id === p.categoryId)?.name ??
                      p.categoryId}
                  </Badge>
                </TableCell>
                <TableCell>{p.likeCount.toString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7"
                      onClick={() => openEdit(p)}
                      data-ocid={`admin.posts.edit_button.${i + 1}`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (confirm("Delete this post?")) {
                          await deletePost.mutateAsync(p.slug);
                          toast.success("Deleted.");
                        }
                      }}
                      data-ocid={`admin.posts.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.posts.dialog">
          <DialogHeader>
            <DialogTitle>{editPost ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Post title"
                data-ocid="admin.posts.title.input"
              />
            </div>
            {!editPost && (
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="post-slug-url"
                  data-ocid="admin.posts.slug.input"
                />
              </div>
            )}
            <div>
              <Label>Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              >
                <SelectTrigger data-ocid="admin.posts.category.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                rows={5}
                placeholder="Post content..."
                data-ocid="admin.posts.body.textarea"
              />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="tag1, tag2, tag3"
                data-ocid="admin.posts.tags.input"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.posts.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createPost.isPending || updatePost.isPending}
                data-ocid="admin.posts.submit_button"
              >
                {createPost.isPending || updatePost.isPending
                  ? "Saving..."
                  : editPost
                    ? "Update"
                    : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FriendsTab() {
  const { data: friends = [] } = useGetAllFriends();
  const createFriend = useCreateFriend();
  const deleteFriend = useDeleteFriend();
  const updateFriend = useUpdateFriend();
  const [open, setOpen] = useState(false);
  const [editFriend, setEditFriend] = useState<Friend | null>(null);
  const [form, setForm] = useState({
    name: "",
    photoUrl: "",
    mobile: "",
    facebookId: "",
  });

  const openNew = () => {
    setEditFriend(null);
    setForm({ name: "", photoUrl: "", mobile: "", facebookId: "" });
    setOpen(true);
  };

  const openEdit = (f: Friend) => {
    setEditFriend(f);
    setForm({
      name: f.name,
      photoUrl: f.photoUrl,
      mobile: f.mobile,
      facebookId: f.facebookId,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Name is required.");
      return;
    }
    try {
      if (editFriend) {
        await updateFriend.mutateAsync(form);
        toast.success("Friend updated!");
      } else {
        await createFriend.mutateAsync(form);
        toast.success("Friend added!");
      }
      setForm({ name: "", photoUrl: "", mobile: "", facebookId: "" });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Friends ({friends.length})</h2>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 gap-1"
          onClick={openNew}
          data-ocid="admin.friends.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Friend
        </Button>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table data-ocid="admin.friends.table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Facebook</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {friends.map((f, i) => (
              <TableRow key={f.name} data-ocid={`admin.friends.row.${i + 1}`}>
                <TableCell className="font-medium">{f.name}</TableCell>
                <TableCell>{f.mobile}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {f.facebookId}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7"
                      onClick={() => openEdit(f)}
                      data-ocid={`admin.friends.edit_button.${i + 1}`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-destructive"
                      onClick={async () => {
                        if (confirm("Delete?")) {
                          await deleteFriend.mutateAsync(f.name);
                          toast.success("Deleted.");
                        }
                      }}
                      data-ocid={`admin.friends.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.friends.dialog">
          <DialogHeader>
            <DialogTitle>
              {editFriend ? "Edit Friend" : "Add Friend"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Full name"
                readOnly={!!editFriend}
                disabled={!!editFriend}
                data-ocid="admin.friends.name.input"
              />
            </div>
            <div>
              <Label>Photo URL</Label>
              <Input
                value={form.photoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, photoUrl: e.target.value }))
                }
                placeholder="https://..."
                data-ocid="admin.friends.photo.input"
              />
            </div>
            <div>
              <Label>Mobile</Label>
              <Input
                value={form.mobile}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mobile: e.target.value }))
                }
                placeholder="+880 17XX-XXXXXX"
                data-ocid="admin.friends.mobile.input"
              />
            </div>
            <div>
              <Label>Facebook ID / URL</Label>
              <Input
                value={form.facebookId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, facebookId: e.target.value }))
                }
                placeholder="https://facebook.com/..."
                data-ocid="admin.friends.facebook.input"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.friends.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createFriend.isPending || updateFriend.isPending}
                data-ocid="admin.friends.submit_button"
              >
                {createFriend.isPending || updateFriend.isPending
                  ? "Saving..."
                  : editFriend
                    ? "Update"
                    : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GalleryTab() {
  const { data: events = [] } = useGetAllGalleryEvents();
  const createEvent = useCreateGalleryEvent();
  const deleteEvent = useDeleteGalleryEvent();
  const updateEvent = useUpdateGalleryEvent();
  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<GalleryEvent | null>(null);
  const [form, setForm] = useState({ eventName: "", imageUrls: "" });

  const openNew = () => {
    setEditEvent(null);
    setForm({ eventName: "", imageUrls: "" });
    setOpen(true);
  };

  const openEdit = (ev: GalleryEvent) => {
    setEditEvent(ev);
    setForm({ eventName: ev.eventName, imageUrls: ev.imageUrls.join("\n") });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventName) {
      toast.error("Event name is required.");
      return;
    }
    const imageUrls = form.imageUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    try {
      if (editEvent) {
        await updateEvent.mutateAsync({ eventName: form.eventName, imageUrls });
        toast.success("Event updated!");
      } else {
        await createEvent.mutateAsync({ eventName: form.eventName, imageUrls });
        toast.success("Event created!");
      }
      setForm({ eventName: "", imageUrls: "" });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Gallery Events ({events.length})
        </h2>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 gap-1"
          onClick={openNew}
          data-ocid="admin.gallery.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>
      <div className="space-y-3" data-ocid="admin.gallery.list">
        {events.map((ev, i) => (
          <div
            key={ev.eventName}
            className="bg-card rounded-lg p-4 border border-border flex items-center justify-between"
            data-ocid={`admin.gallery.item.${i + 1}`}
          >
            <div>
              <p className="font-medium">{ev.eventName}</p>
              <p className="text-sm text-muted-foreground">
                {ev.imageUrls.length} images
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => openEdit(ev)}
                data-ocid={`admin.gallery.edit_button.${i + 1}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={async () => {
                  if (confirm("Delete?")) {
                    await deleteEvent.mutateAsync(ev.eventName);
                    toast.success("Deleted.");
                  }
                }}
                data-ocid={`admin.gallery.delete_button.${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.gallery.dialog">
          <DialogHeader>
            <DialogTitle>
              {editEvent ? "Edit Gallery Event" : "Add Gallery Event"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Event Name *</Label>
              <Input
                value={form.eventName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, eventName: e.target.value }))
                }
                placeholder="e.g. Farewell 2023"
                readOnly={!!editEvent}
                disabled={!!editEvent}
                data-ocid="admin.gallery.name.input"
              />
            </div>
            <div>
              <Label>Image URLs (one per line)</Label>
              <Textarea
                value={form.imageUrls}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrls: e.target.value }))
                }
                rows={4}
                placeholder="https://image1.jpg"
                data-ocid="admin.gallery.urls.textarea"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.gallery.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createEvent.isPending || updateEvent.isPending}
                data-ocid="admin.gallery.submit_button"
              >
                {createEvent.isPending || updateEvent.isPending
                  ? "Saving..."
                  : editEvent
                    ? "Update"
                    : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VideosTab() {
  const { data: videos = [] } = useGetAllVideos();
  const createVideo = useCreateVideo();
  const deleteVideo = useDeleteVideo();
  const updateVideo = useUpdateVideo();
  const [open, setOpen] = useState(false);
  const [editVideo, setEditVideo] = useState<YouTubeVideo | null>(null);
  const [form, setForm] = useState({
    title: "",
    youtubeUrl: "",
    description: "",
  });

  const openNew = () => {
    setEditVideo(null);
    setForm({ title: "", youtubeUrl: "", description: "" });
    setOpen(true);
  };

  const openEdit = (v: YouTubeVideo) => {
    setEditVideo(v);
    setForm({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      description: v.description,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.youtubeUrl) {
      toast.error("Title and URL required.");
      return;
    }
    try {
      if (editVideo) {
        await updateVideo.mutateAsync(form);
        toast.success("Video updated!");
      } else {
        await createVideo.mutateAsync(form);
        toast.success("Video added!");
      }
      setForm({ title: "", youtubeUrl: "", description: "" });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Videos ({videos.length})</h2>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 gap-1"
          onClick={openNew}
          data-ocid="admin.videos.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>
      <div className="space-y-3" data-ocid="admin.videos.list">
        {videos.map((v, i) => (
          <div
            key={v.title}
            className="bg-card rounded-lg p-4 border border-border flex items-center justify-between"
            data-ocid={`admin.videos.item.${i + 1}`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{v.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {v.youtubeUrl}
              </p>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => openEdit(v)}
                data-ocid={`admin.videos.edit_button.${i + 1}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={async () => {
                  if (confirm("Delete?")) {
                    await deleteVideo.mutateAsync(v.title);
                    toast.success("Deleted.");
                  }
                }}
                data-ocid={`admin.videos.delete_button.${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.videos.dialog">
          <DialogHeader>
            <DialogTitle>
              {editVideo ? "Edit YouTube Video" : "Add YouTube Video"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Video title"
                readOnly={!!editVideo}
                disabled={!!editVideo}
                data-ocid="admin.videos.title.input"
              />
            </div>
            <div>
              <Label>YouTube URL *</Label>
              <Input
                value={form.youtubeUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, youtubeUrl: e.target.value }))
                }
                placeholder="https://youtube.com/watch?v=..."
                data-ocid="admin.videos.url.input"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                placeholder="Short description..."
                data-ocid="admin.videos.desc.textarea"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.videos.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createVideo.isPending || updateVideo.isPending}
                data-ocid="admin.videos.submit_button"
              >
                {createVideo.isPending || updateVideo.isPending
                  ? "Saving..."
                  : editVideo
                    ? "Update"
                    : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PDFsTab() {
  const { data: pdfs = [] } = useGetAllPDFs();
  const createPDF = useCreatePDF();
  const deletePDF = useDeletePDF();
  const updatePDF = useUpdatePDF();
  const [open, setOpen] = useState(false);
  const [editPDF, setEditPDF] = useState<PDFDocument | null>(null);
  const [form, setForm] = useState({ title: "", fileUrl: "", description: "" });

  const openNew = () => {
    setEditPDF(null);
    setForm({ title: "", fileUrl: "", description: "" });
    setOpen(true);
  };

  const openEdit = (p: PDFDocument) => {
    setEditPDF(p);
    setForm({ title: p.title, fileUrl: p.fileUrl, description: p.description });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.fileUrl) {
      toast.error("Title and URL required.");
      return;
    }
    try {
      if (editPDF) {
        await updatePDF.mutateAsync(form);
        toast.success("PDF updated!");
      } else {
        await createPDF.mutateAsync(form);
        toast.success("PDF added!");
      }
      setForm({ title: "", fileUrl: "", description: "" });
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">PDF Documents ({pdfs.length})</h2>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 gap-1"
          onClick={openNew}
          data-ocid="admin.pdfs.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add PDF
        </Button>
      </div>
      <div className="space-y-3" data-ocid="admin.pdfs.list">
        {pdfs.map((p, i) => (
          <div
            key={p.title}
            className="bg-card rounded-lg p-4 border border-border flex items-center justify-between"
            data-ocid={`admin.pdfs.item.${i + 1}`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{p.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {p.description}
              </p>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => openEdit(p)}
                data-ocid={`admin.pdfs.edit_button.${i + 1}`}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={async () => {
                  if (confirm("Delete?")) {
                    await deletePDF.mutateAsync(p.title);
                    toast.success("Deleted.");
                  }
                }}
                data-ocid={`admin.pdfs.delete_button.${i + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="admin.pdfs.dialog">
          <DialogHeader>
            <DialogTitle>
              {editPDF ? "Edit PDF Document" : "Add PDF Document"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Document title"
                readOnly={!!editPDF}
                disabled={!!editPDF}
                data-ocid="admin.pdfs.title.input"
              />
            </div>
            <div>
              <Label>File URL *</Label>
              <Input
                value={form.fileUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileUrl: e.target.value }))
                }
                placeholder="https://..."
                data-ocid="admin.pdfs.url.input"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={2}
                placeholder="Brief description..."
                data-ocid="admin.pdfs.desc.textarea"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="admin.pdfs.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={createPDF.isPending || updatePDF.isPending}
                data-ocid="admin.pdfs.submit_button"
              >
                {createPDF.isPending || updatePDF.isPending
                  ? "Saving..."
                  : editPDF
                    ? "Update"
                    : "Add"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SocialLinksTab() {
  const { data: links } = useGetSocialLinks();
  const updateLinks = useUpdateSocialLinks();
  const [form, setForm] = useState({
    facebook: "",
    youtube: "",
    instagram: "",
  });

  useEffect(() => {
    if (links)
      setForm({
        facebook: links.facebook,
        youtube: links.youtube,
        instagram: links.instagram,
      });
  }, [links]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateLinks.mutateAsync(form);
      toast.success("Social links updated!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update.");
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Set the URLs for social media icons in the site footer and social page.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label>Facebook URL</Label>
          <Input
            value={form.facebook}
            onChange={(e) =>
              setForm((f) => ({ ...f, facebook: e.target.value }))
            }
            placeholder="https://facebook.com/groups/..."
            data-ocid="admin.social.facebook.input"
          />
        </div>
        <div>
          <Label>YouTube URL</Label>
          <Input
            value={form.youtube}
            onChange={(e) =>
              setForm((f) => ({ ...f, youtube: e.target.value }))
            }
            placeholder="https://youtube.com/@..."
            data-ocid="admin.social.youtube.input"
          />
        </div>
        <div>
          <Label>Instagram URL</Label>
          <Input
            value={form.instagram}
            onChange={(e) =>
              setForm((f) => ({ ...f, instagram: e.target.value }))
            }
            placeholder="https://instagram.com/..."
            data-ocid="admin.social.instagram.input"
          />
        </div>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90"
          disabled={updateLinks.isPending}
          data-ocid="admin.social.submit_button"
        >
          {updateLinks.isPending ? "Saving..." : "Save Links"}
        </Button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const { navigate } = useRouter();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const claimAdmin = useClaimAdmin();
  const resetAndClaim = useResetAndClaimAdmin();
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetCode, setResetCode] = useState("");

  if (!identity) {
    return (
      <main
        className="max-w-2xl mx-auto px-4 py-16 text-center"
        data-ocid="admin.auth.error_state"
      >
        <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Authentication Required
        </h1>
        <p className="text-muted-foreground mb-6">
          Please login to access the admin dashboard.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90"
        >
          Go to Home
        </Button>
      </main>
    );
  }

  if (adminLoading) {
    return (
      <main
        className="max-w-5xl mx-auto px-4 py-16 text-center"
        data-ocid="admin.loading_state"
      >
        <p className="text-muted-foreground">Checking permissions...</p>
      </main>
    );
  }

  const handleClaimAdmin = async () => {
    try {
      const result = await claimAdmin.mutateAsync("");
      if (result) {
        toast.success("Admin access granted! Refreshing...");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setShowResetForm(true);
      }
    } catch {
      setShowResetForm(true);
    }
  };

  const handleResetAndClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim()) {
      toast.error("Please enter the reset code.");
      return;
    }
    try {
      const result = await resetAndClaim.mutateAsync(resetCode.trim());
      if (result) {
        toast.success("Admin reset successful! You are now the admin.");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Incorrect reset code. Please check and try again.");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Reset failed.");
    }
  };

  if (!isAdmin) {
    return (
      <main
        className="max-w-2xl mx-auto px-4 py-16 text-center"
        data-ocid="admin.access.error_state"
      >
        <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Admin Access Required
        </h1>

        {!showResetForm ? (
          <div>
            <p className="text-muted-foreground mb-6">
              You need admin privileges to access this page.
            </p>
            <Button
              onClick={handleClaimAdmin}
              className="bg-primary hover:bg-primary/90"
              disabled={claimAdmin.isPending}
              data-ocid="admin.claim.button"
            >
              {claimAdmin.isPending ? "Claiming..." : "Claim Admin Access"}
            </Button>
            <button
              type="button"
              className="mt-3 block mx-auto text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
              onClick={() => setShowResetForm(true)}
            >
              Admin may already be assigned? Reset here
            </button>
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <p className="text-muted-foreground mb-4">
              Enter the reset code to reclaim admin access.
            </p>
            <form onSubmit={handleResetAndClaim} className="space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Input
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="HUHS-ADMIN-RESET-XXXX"
                  data-ocid="admin.reset.input"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={resetAndClaim.isPending}
                data-ocid="admin.reset.submit_button"
              >
                {resetAndClaim.isPending
                  ? "Resetting..."
                  : "Reset & Claim Admin"}
              </Button>
            </form>
            <button
              type="button"
              className="mt-3 text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
              onClick={() => setShowResetForm(false)}
            >
              Back
            </button>
          </div>
        )}

        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mt-6"
          data-ocid="admin.home.button"
        >
          Go to Home
        </Button>
      </main>
    );
  }

  return (
    <main
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="admin.page"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
          data-ocid="admin.back.button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all content for SSC Batch 2023 Portal
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6">
        <Tabs defaultValue="posts">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="posts" data-ocid="admin.posts.tab">
              Posts
            </TabsTrigger>
            <TabsTrigger value="friends" data-ocid="admin.friends.tab">
              Friends
            </TabsTrigger>
            <TabsTrigger value="gallery" data-ocid="admin.gallery.tab">
              Gallery
            </TabsTrigger>
            <TabsTrigger value="videos" data-ocid="admin.videos.tab">
              Videos
            </TabsTrigger>
            <TabsTrigger value="pdfs" data-ocid="admin.pdfs.tab">
              PDFs
            </TabsTrigger>
            <TabsTrigger value="social" data-ocid="admin.social.tab">
              Social Links
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <PostsTab />
          </TabsContent>
          <TabsContent value="friends">
            <FriendsTab />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="videos">
            <VideosTab />
          </TabsContent>
          <TabsContent value="pdfs">
            <PDFsTab />
          </TabsContent>
          <TabsContent value="social">
            <SocialLinksTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
