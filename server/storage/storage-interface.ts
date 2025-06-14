import {
  User,
  InsertUser,
  Post,
  InsertPost,
  Category,
  InsertCategory,
  Tag,
  InsertTag,
  PostTag,
  InsertPostTag,
  Project,
  InsertProject,
  ContactMessage,
  InsertContactMessage,
  Subscription,
  InsertSubscription
} from '@shared/schema';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Post operations
  getAllPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  getFeaturedPosts(): Promise<Post[]>;
  getLatestPosts(limit?: number): Promise<Post[]>;
  getPostsByCategory(categoryId: number): Promise<Post[]>;
  getPostsByTag(tagId: number): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Tag operations
  getAllTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;

  // Post-Tag operations
  createPostTag(postTag: InsertPostTag): Promise<PostTag>;
  getTagsByPostId(postId: number): Promise<Tag[]>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  getFeaturedProjects(): Promise<Project[]>;

  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  // Newsletter subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByEmail(email: string): Promise<Subscription | undefined>;
}