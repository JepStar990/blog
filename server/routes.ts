import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertSubscriptionSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/posts/featured", async (req, res) => {
    try {
      const posts = await storage.getFeaturedPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      res.status(500).json({ error: "Failed to fetch featured posts" });
    }
  });

  app.get("/api/posts/latest", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const posts = await storage.getLatestPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching latest posts:", error);
      res.status(500).json({ error: "Failed to fetch latest posts" });
    }
  });

  app.get("/api/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Get category details
      const category = await storage.getCategory(post.categoryId);
      
      // Get tag details
      const tags = await storage.getTagsByPostId(post.id);
      
      res.json({
        ...post,
        category,
        tags
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.get("/api/categories/:slug/posts", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      const posts = await storage.getPostsByCategory(category.id);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching category posts:", error);
      res.status(500).json({ error: "Failed to fetch category posts" });
    }
  });

  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  app.get("/api/tags/:slug/posts", async (req, res) => {
    try {
      const tag = await storage.getTagBySlug(req.params.slug);
      
      if (!tag) {
        return res.status(404).json({ error: "Tag not found" });
      }
      
      const posts = await storage.getPostsByTag(tag.id);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching tag posts:", error);
      res.status(500).json({ error: "Failed to fetch tag posts" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching featured projects:", error);
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactMessageSchema.parse(req.body);
      
      const contactMessage = await storage.createContactMessage({
        ...contactData,
        createdAt: new Date()
      });

      // In a real-world scenario, you would send an email here
      // This is a placeholder for the email sending functionality
      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASS,
      //   },
      // });
      
      // await transporter.sendMail({
      //   from: process.env.EMAIL_USER,
      //   to: "admin@example.com",
      //   subject: `New Contact Message: ${contactData.subject}`,
      //   text: `
      //     Name: ${contactData.name}
      //     Email: ${contactData.email}
      //     Subject: ${contactData.subject}
      //     Message: ${contactData.message}
      //   `
      // });
      
      res.status(201).json({ 
        message: "Message sent successfully",
        contactMessage
      });
    } catch (error) {
      console.error("Error sending contact message:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      res.status(500).json({ error: "Failed to send contact message" });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriptionSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscription = await storage.getSubscriptionByEmail(data.email);
      
      if (existingSubscription) {
        return res.status(400).json({ error: "Email is already subscribed" });
      }
      
      const subscription = await storage.createSubscription({
        ...data,
        createdAt: new Date()
      });
      
      res.status(201).json({ 
        message: "Subscribed successfully",
        subscription
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  app.get("/api/search", async (req, res) => {
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

  const httpServer = createServer(app);

  return httpServer;
}
