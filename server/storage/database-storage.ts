import { eq, like, desc, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { IStorage } from './storage-interface';
import {
  users,
  posts,
  categories,
  tags,
  postsTags,
  projects,
  contactMessages,
  subscriptions,
  type User,
  type InsertUser,
  type Post,
  type InsertPost,
  type Category,
  type InsertCategory,
  type Tag,
  type InsertTag,
  type PostTag,
  type InsertPostTag,
  type Project,
  type InsertProject,
  type ContactMessage,
  type InsertContactMessage,
  type Subscription,
  type InsertSubscription
} from '@shared/schema';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  // Post operations
  async getAllPosts(): Promise<Post[]> {
    return db.select().from(posts).orderBy(desc(posts.publishedAt));
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [createdPost] = await db.insert(posts).values(post).returning();
    return createdPost;
  }

  async getFeaturedPosts(): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.featured, true))
      .orderBy(desc(posts.publishedAt));
  }

  async getLatestPosts(limit: number = 10): Promise<Post[]> {
    return db.select()
      .from(posts)
      .orderBy(desc(posts.publishedAt))
      .limit(limit);
  }

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.categoryId, categoryId))
      .orderBy(desc(posts.publishedAt));
  }

  async getPostsByTag(tagId: number): Promise<Post[]> {
    const postTagsResult = await db.select()
      .from(postsTags)
      .where(eq(postsTags.tagId, tagId));
    
    if (postTagsResult.length === 0) return [];
    
    const postIds = postTagsResult.map(pt => pt.postId);
    
    return db.select()
      .from(posts)
      .where(
        postIds.map(id => eq(posts.id, id)).reduce((acc, curr) => or(acc, curr))
      )
      .orderBy(desc(posts.publishedAt));
  }

  async searchPosts(query: string): Promise<Post[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return db.select()
      .from(posts)
      .where(
        or(
          like(posts.title, lowerQuery),
          like(posts.excerpt, lowerQuery),
          like(posts.content, lowerQuery)
        )
      )
      .orderBy(desc(posts.publishedAt));
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [createdCategory] = await db.insert(categories).values(category).returning();
    return createdCategory;
  }

  // Tag operations
  async getAllTags(): Promise<Tag[]> {
    return db.select().from(tags);
  }

  async getTag(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
    return tag;
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [createdTag] = await db.insert(tags).values(tag).returning();
    return createdTag;
  }

  // Post-Tag operations
  async createPostTag(postTag: InsertPostTag): Promise<PostTag> {
    const [createdPostTag] = await db.insert(postsTags).values(postTag).returning();
    return createdPostTag;
  }

  async getTagsByPostId(postId: number): Promise<Tag[]> {
    const postTagsResult = await db.select()
      .from(postsTags)
      .where(eq(postsTags.postId, postId));
    
    if (postTagsResult.length === 0) return [];
    
    const tagIds = postTagsResult.map(pt => pt.tagId);
    
    return db.select()
      .from(tags)
      .where(
        tagIds.map(id => eq(tags.id, id)).reduce((acc, curr) => or(acc, curr))
      );
  }

  // Project operations
  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [createdProject] = await db.insert(projects).values(project).returning();
    return createdProject;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return db.select()
      .from(projects)
      .where(eq(projects.featured, true));
  }

  // Contact message operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [createdMessage] = await db.insert(contactMessages)
      .values({
        ...message,
        createdAt: new Date()
      })
      .returning();
    return createdMessage;
  }

  // Newsletter subscription operations
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [createdSubscription] = await db.insert(subscriptions)
      .values({
        ...subscription,
        createdAt: new Date()
      })
      .returning();
    return createdSubscription;
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email));
    return subscription;
  }
}