import { Router, type Request, type Response } from "express";
import { storage } from "../storage.js";
import { insertContactMessageSchema, insertSubscriptionSchema } from "../schema.js";
import { sendContactEmail } from "../services/mailer.js";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

// Health check
router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Posts
router.get("/posts", async (_req: Request, res: Response) => {
  try {
    const posts = await storage.getAllPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.get("/posts/featured", async (_req: Request, res: Response) => {
  try {
    const posts = await storage.getFeaturedPosts();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    res.status(500).json({ error: "Failed to fetch featured posts" });
  }
});

router.get("/posts/latest", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const posts = await storage.getLatestPosts(limit);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    res.status(500).json({ error: "Failed to fetch latest posts" });
  }
});

router.get("/posts/:slug", async (req: Request, res: Response) => {
  try {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const category = await storage.getCategory(post.categoryId);
    const tags = await storage.getTagsByPostId(post.id);

    res.json({ ...post, category, tags });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Categories
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await storage.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/categories/:slug", async (req: Request, res: Response) => {
  try {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

router.get("/categories/:slug/posts", async (req: Request, res: Response) => {
  try {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) return res.status(404).json({ error: "Category not found" });
    const posts = await storage.getPostsByCategory(category.id);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    res.status(500).json({ error: "Failed to fetch category posts" });
  }
});

// Tags
router.get("/tags", async (_req: Request, res: Response) => {
  try {
    const tags = await storage.getAllTags();
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

router.get("/tags/:slug/posts", async (req: Request, res: Response) => {
  try {
    const tag = await storage.getTagBySlug(req.params.slug);
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    const posts = await storage.getPostsByTag(tag.id);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching tag posts:", error);
    res.status(500).json({ error: "Failed to fetch tag posts" });
  }
});

// Projects
router.get("/projects", async (_req: Request, res: Response) => {
  try {
    const projects = await storage.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.get("/projects/featured", async (_req: Request, res: Response) => {
  try {
    const projects = await storage.getFeaturedProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    res.status(500).json({ error: "Failed to fetch featured projects" });
  }
});

// Contact
router.post("/contact", async (req: Request, res: Response) => {
  try {
    const contactData = insertContactMessageSchema.parse(req.body);
    const contactMessage = await storage.createContactMessage(contactData);

    // Send email notification (fire-and-forget, don't block response)
    sendContactEmail(contactData).catch((err) =>
      console.error("Failed to send contact email:", err)
    );

    res.status(201).json({ message: "Message sent successfully", contactMessage });
  } catch (error) {
    console.error("Error sending contact message:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ error: fromZodError(error).message });
    }
    res.status(500).json({ error: "Failed to send contact message" });
  }
});

// Subscribe
router.post("/subscribe", async (req: Request, res: Response) => {
  try {
    const data = insertSubscriptionSchema.parse(req.body);
    const existingSubscription = await storage.getSubscriptionByEmail(data.email);
    if (existingSubscription) {
      return res.status(400).json({ error: "Email is already subscribed" });
    }
    const subscription = await storage.createSubscription(data);
    res.status(201).json({ message: "Subscribed successfully", subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ error: fromZodError(error).message });
    }
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// Search
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const posts = await storage.searchPosts(query);
    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error);
    res.status(500).json({ error: "Failed to search posts" });
  }
});

export default router;
