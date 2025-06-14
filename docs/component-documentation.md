# Component Documentation

This document provides an overview of the key components used in the Data Engineering Blog Platform, their props, and usage examples.

## Table of Contents

1. [Layout Components](#layout-components)
   - [MainLayout](#mainlayout)
   - [Header](#header)
   - [Footer](#footer)
2. [Blog Components](#blog-components)
   - [BlogCard](#blogcard)
   - [BlogList](#bloglist)
   - [BlogPost](#blogpost)
   - [CategoryBadge](#categorybadge)
   - [TagBadge](#tagbadge)
3. [Project Components](#project-components)
   - [ProjectCard](#projectcard)
   - [ProjectList](#projectlist)
4. [Form Components](#form-components)
   - [ContactForm](#contactform)
   - [SubscribeForm](#subscribeform)
5. [UI Components](#ui-components)
   - [Button](#button)
   - [ThemeToggle](#themetoggle)
   - [Card](#card)

## Layout Components

### MainLayout

The main layout wrapper for all pages, including the header and footer.

**Location**: `client/src/components/layout/MainLayout.tsx`

**Props**:
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}
```

**Usage**:
```tsx
<MainLayout>
  <div>Page content goes here</div>
</MainLayout>
```

### Header

The site header with navigation and theme toggle.

**Location**: `client/src/components/layout/Header.tsx`

**Props**: None

**Usage**:
```tsx
<Header />
```

### Footer

The site footer with links and copyright information.

**Location**: `client/src/components/layout/Footer.tsx`

**Props**: None

**Usage**:
```tsx
<Footer />
```

## Blog Components

### BlogCard

A card component for displaying blog post previews.

**Location**: `client/src/components/blog/BlogCard.tsx`

**Props**:
```typescript
interface BlogCardProps {
  post: Post;
  category: Category;
}
```

**Usage**:
```tsx
<BlogCard post={post} category={category} />
```

### BlogList

A container for displaying multiple blog cards.

**Location**: `client/src/components/blog/BlogList.tsx`

**Props**:
```typescript
interface BlogListProps {
  posts: PostWithCategory[];
  title?: string;
  showFeatured?: boolean;
}

interface PostWithCategory {
  post: Post;
  category: Category;
}
```

**Usage**:
```tsx
<BlogList 
  posts={posts} 
  title="Latest Articles" 
  showFeatured={false} 
/>
```

### BlogPost

Component for displaying a full blog post with markdown content.

**Location**: `client/src/components/blog/BlogPost.tsx`

**Props**:
```typescript
interface BlogPostProps {
  post: Post;
  category: Category;
  tags: Tag[];
}
```

**Usage**:
```tsx
<BlogPost post={post} category={category} tags={tags} />
```

### CategoryBadge

Badge component for displaying a post category.

**Location**: `client/src/components/blog/CategoryBadge.tsx`

**Props**:
```typescript
interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md" | "lg";
}
```

**Usage**:
```tsx
<CategoryBadge category={category} size="md" />
```

### TagBadge

Badge component for displaying a post tag.

**Location**: `client/src/components/blog/TagBadge.tsx`

**Props**:
```typescript
interface TagBadgeProps {
  tag: Tag;
  size?: "sm" | "md" | "lg";
}
```

**Usage**:
```tsx
<TagBadge tag={tag} size="sm" />
```

## Project Components

### ProjectCard

A card component for displaying project previews.

**Location**: `client/src/components/projects/ProjectCard.tsx`

**Props**:
```typescript
interface ProjectCardProps {
  project: Project;
  category: Category;
}
```

**Usage**:
```tsx
<ProjectCard project={project} category={category} />
```

### ProjectList

A container for displaying multiple project cards.

**Location**: `client/src/components/projects/ProjectList.tsx`

**Props**:
```typescript
interface ProjectListProps {
  projects: ProjectWithCategory[];
  title?: string;
}

interface ProjectWithCategory {
  project: Project;
  category: Category;
}
```

**Usage**:
```tsx
<ProjectList 
  projects={projects} 
  title="Featured Projects" 
/>
```

## Form Components

### ContactForm

Form component for the contact page.

**Location**: `client/src/components/forms/ContactForm.tsx`

**Props**:
```typescript
interface ContactFormProps {
  onSuccess?: () => void;
}
```

**Usage**:
```tsx
<ContactForm onSuccess={() => console.log('Form submitted successfully')} />
```

### SubscribeForm

Form component for the newsletter subscription.

**Location**: `client/src/components/forms/SubscribeForm.tsx`

**Props**:
```typescript
interface SubscribeFormProps {
  onSuccess?: () => void;
  variant?: "inline" | "block";
}
```

**Usage**:
```tsx
<SubscribeForm 
  onSuccess={() => console.log('Subscribed successfully')} 
  variant="inline" 
/>
```

## UI Components

### Button

Reusable button component with various styles.

**Location**: `client/src/components/ui/button.tsx`

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

**Usage**:
```tsx
<Button variant="default" size="default">Click Me</Button>
```

### ThemeToggle

Button component for toggling between light and dark themes.

**Location**: `client/src/components/ui/theme-toggle.tsx`

**Props**: None

**Usage**:
```tsx
<ThemeToggle />
```

### Card

Container component with consistent styling for content.

**Location**: `client/src/components/ui/card.tsx`

**Props**:
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

**Usage**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    Card Content
  </CardContent>
  <CardFooter>
    Card Footer
  </CardFooter>
</Card>
```

## Using the Components

All components are designed to be composable and reusable throughout the application. They follow consistent patterns and use the same styling approach (Tailwind CSS + Shadcn UI).

### Example: Building a Blog Page

```tsx
import { MainLayout } from "../components/layout/MainLayout";
import { BlogList } from "../components/blog/BlogList";
import { SubscribeForm } from "../components/forms/SubscribeForm";

function BlogPage() {
  // Fetch posts from API...
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        <BlogList 
          posts={posts} 
          title="Featured Posts" 
          showFeatured={true} 
        />
        
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">Subscribe to Our Newsletter</h2>
          <SubscribeForm variant="block" />
        </div>
      </div>
    </MainLayout>
  );
}

export default BlogPage;
```

## Styling Guidelines

All components follow these styling guidelines:

1. **Tailwind Classes**: Use Tailwind CSS utility classes for styling
2. **Shadcn UI Base**: Built on Shadcn UI components when applicable
3. **Dark Mode Support**: All components support both light and dark themes
4. **Responsive Design**: All components are responsive by default
5. **Accessibility**: Focus on accessibility with proper ARIA attributes and keyboard navigation

## Component Development Guidelines

When creating new components:

1. **Composition**: Prefer composition over inheritance
2. **Props Interface**: Define a clear props interface with JSDoc comments
3. **Default Props**: Provide sensible defaults for optional props
4. **Separation of Concerns**: Keep components focused on a single responsibility
5. **Testing**: Write tests for all components