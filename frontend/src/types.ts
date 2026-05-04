import { z } from "zod";

// Post types
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: Date;
  featured: boolean;
  readingTime: number;
  categoryId: number;
  authorId: number;
  status?: string;
  updatedAt?: Date;
  category?: Category;
  tags?: Tag[];
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

// Tag types
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// Project types
export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  technologies: string[];
  categoryId: number;
  featured: boolean;
  url?: string;
}

// Contact message schema
export const insertContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Subscription schema
export const insertSubscriptionSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
