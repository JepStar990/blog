import { Router, type Request, type Response } from "express";
import { storage } from "../storage.js";
import { requireApiKey } from "../middleware/auth.js";
import { editWithAI } from "../services/ai-editor.js";

const router = Router();

// All admin routes require API key
router.use(requireApiKey);

// List all posts (including drafts)
router.get("/posts", async (_req: Request, res: Response) => {
  try {
    const status = _req.query.status as string | undefined;
    const posts = status
      ? await storage.getPostsByStatus(status)
      : await storage.getAllPostsAdmin();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get single post by ID
router.get("/posts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid post ID" });

    const post = await storage.getPostAdmin(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Create new post
router.post("/posts", async (req: Request, res: Response) => {
  try {
    const post = await storage.createPost({
      ...req.body,
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
      status: req.body.status || "draft",
    });
    res.status(201).json(post);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error creating post:", msg);
    res.status(500).json({ error: msg });
  }
});

// Update post
router.put("/posts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid post ID" });

    const data = { ...req.body };
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt);
    }

    const post = await storage.updatePost(id, data);
    res.json(post);
  } catch (error: any) {
    console.error("Error updating post:", error);
    if (error.message === "Post not found") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Delete post
router.delete("/posts/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid post ID" });

    await storage.deletePost(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// AI edit endpoint
router.post("/posts/:id/ai-edit", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid post ID" });

    const { instruction, content } = req.body;
    if (!instruction || !content) {
      return res.status(400).json({ error: "Instruction and content are required" });
    }

    const deepseekKey = req.headers["x-deepseek-key"] as string;
    if (!deepseekKey) {
      return res.status(400).json({ error: "DeepSeek API key is required in X-DeepSeek-Key header" });
    }

    const result = await editWithAI({ instruction, content, apiKey: deepseekKey });
    res.json(result);
  } catch (error: any) {
    console.error("AI edit error:", error);
    if (error.message?.includes("DeepSeek")) {
      return res.status(502).json({ error: error.message });
    }
    res.status(500).json({ error: "AI editing failed" });
  }
});

export default router;
