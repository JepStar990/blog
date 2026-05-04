import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, getQueryFn } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, Save, ArrowLeft } from "lucide-react";
import Markdown from "@/lib/markdown";
import type { Post, Category } from "@/types";

interface Props {
  id?: string;
}

export default function PostEditor({ id }: Props) {
  const [, navigate] = useLocation();
  const { deepseekKey } = useAuth();
  const isEditing = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [readingTime, setReadingTime] = useState(5);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState("draft");
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: post, isLoading: loadingPost } = useQuery<Post>({
    queryKey: [`/api/admin/posts/${id}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: isEditing,
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setSlug(post.slug || "");
      setExcerpt(post.excerpt || "");
      setContent(post.content || "");
      setCoverImage(post.coverImage || "");
      setFeatured(post.featured || false);
      setReadingTime(post.readingTime || 5);
      setCategoryId(post.categoryId || null);
      setStatus(post.status || "draft");
    }
  }, [post]);

  // Check for accepted AI edit
  useEffect(() => {
    const accepted = sessionStorage.getItem("accept_ai_edit");
    if (accepted) {
      setContent(accepted);
      sessionStorage.removeItem("accept_ai_edit");
    }
  }, []);

  const saveMutation = useMutation({
    mutationFn: (data: any) =>
      isEditing
        ? apiRequest("PUT", `/api/admin/posts/${id}`, data)
        : apiRequest("POST", "/api/admin/posts", data),
    onSuccess: () => {
      navigate("/admin/posts");
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      excerpt,
      content,
      coverImage,
      featured,
      readingTime,
      categoryId,
      status,
      authorId: 1,
    });
  };

  const handleSlugFromTitle = () => {
    if (!slug) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleAIEdit = async () => {
    setAiError("");
    setAiLoading(true);
    try {
      let postId = id;

      // If creating a new post, save it as draft first so it has a real ID
      if (!postId) {
        const saveRes = await apiRequest("POST", "/api/admin/posts", {
          title: title || "Untitled Draft",
          slug:
            slug ||
            title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") ||
            "untitled-draft",
          excerpt: excerpt || "Draft in progress...",
          content,
          coverImage:
            coverImage ||
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
          featured,
          readingTime,
          categoryId: categoryId ?? categories?.[0]?.id ?? 1,
          status: "draft",
          authorId: 1,
          publishedAt: new Date().toISOString(),
        });

        if (!saveRes.ok) {
          const errBody = await saveRes.json().catch(() => ({}));
          throw new Error((errBody as any).error || "Failed to save draft");
        }

        const saved = await saveRes.json();
        postId = String(saved.id);
      }

      const res = await apiRequest(
        "POST",
        `/api/admin/posts/${postId}/ai-edit`,
        { instruction: aiInstruction, content },
        { headers: { "X-DeepSeek-Key": deepseekKey || "" } }
      );
      const data = await res.json();
      sessionStorage.setItem("ai_original", data.original);
      sessionStorage.setItem("ai_edited", data.edited);
      setAiDialogOpen(false);
      navigate(`/admin/posts/${postId}/diff`);
    } catch (err: any) {
      setAiError(err.message || "AI editing failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (isEditing && loadingPost) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/posts")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-2xl font-bold">{isEditing ? "Edit Post" : "New Post"}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>AI Edit</DialogTitle>
                <DialogDescription>
                  The AI acts as an expert blog editor — it preserves your markdown formatting and only changes what you ask.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Fix grammar and spelling",
                    "Make tone more professional",
                    "Improve clarity and flow",
                    "Add more detail and depth",
                    "Make more concise",
                    "Strengthen the introduction",
                    "Add a compelling conclusion",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAiInstruction(preset)}
                      className="px-3 py-1 text-xs rounded-full border border-border bg-muted/50 hover:bg-muted hover:border-primary/50 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Or write a custom instruction..."
                  value={aiInstruction}
                  onChange={(e) => setAiInstruction(e.target.value)}
                  rows={3}
                />
              </div>
              {aiError && <p className="text-sm text-destructive">{aiError}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAIEdit} disabled={!aiInstruction || aiLoading || !deepseekKey}>
                  {aiLoading ? "Editing..." : "Run AI Edit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="published">Publish</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSlugFromTitle}
              placeholder="Post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-url-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Your markdown here..."
                  rows={20}
                  className="font-mono text-sm"
                />
              </TabsContent>
              <TabsContent value="preview" className="border rounded-md p-6 min-h-[400px]">
                {content ? (
                  <Markdown>{content}</Markdown>
                ) : (
                  <p className="text-muted-foreground text-center py-16">
                    Nothing to preview yet. Start writing in the Write tab.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-40 object-cover rounded-md mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryId?.toString() || ""}
              onValueChange={(v) => setCategoryId(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="readingTime">Reading Time (min)</Label>
            <Input
              id="readingTime"
              type="number"
              value={readingTime}
              onChange={(e) => setReadingTime(parseInt(e.target.value) || 5)}
              min={1}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(!!checked)}
            />
            <Label htmlFor="featured">Featured Post</Label>
          </div>

          {!deepseekKey && (
            <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/50">
              Add your DeepSeek API key on the login page to enable AI editing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
