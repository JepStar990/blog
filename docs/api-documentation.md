# API Documentation

## Overview

This document provides detailed information about the API endpoints available in the Data Engineering Blog Platform. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

Currently, the API does not require authentication for read operations. Future versions may implement authentication for write operations.

## Error Handling

The API returns appropriate HTTP status codes along with error messages in the response body:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common error codes:
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## Endpoints

### Posts

#### Get All Posts

```
GET /api/posts
```

Returns a list of all blog posts ordered by publication date (newest first).

**Response**:
```json
[
  {
    "id": 1,
    "title": "Building Resilient Data Pipelines with Apache Airflow",
    "slug": "building-resilient-data-pipelines-apache-airflow",
    "excerpt": "Learn how to design and implement fault-tolerant data pipelines...",
    "content": "# Building Resilient Data Pipelines with Apache Airflow\n\nThis is sample content...",
    "coverImage": "https://example.com/image.jpg",
    "publishedAt": "2023-05-12T00:00:00.000Z",
    "featured": true,
    "readingTime": 8,
    "categoryId": 1,
    "authorId": 1
  },
  ...
]
```

#### Get Featured Posts

```
GET /api/posts/featured
```

Returns a list of featured blog posts ordered by publication date.

**Response**: Same structure as Get All Posts.

#### Get Latest Posts

```
GET /api/posts/latest
```

Returns the most recent blog posts.

**Query Parameters**:
- `limit` (optional): Number of posts to return (default: 10)

**Response**: Same structure as Get All Posts.

#### Get Post by Slug

```
GET /api/posts/:slug
```

Returns a specific blog post by its slug, including its category and tags.

**URL Parameters**:
- `slug`: The slug of the post

**Response**:
```json
{
  "id": 1,
  "title": "Building Resilient Data Pipelines with Apache Airflow",
  "slug": "building-resilient-data-pipelines-apache-airflow",
  "excerpt": "Learn how to design and implement fault-tolerant data pipelines...",
  "content": "# Building Resilient Data Pipelines with Apache Airflow\n\nThis is sample content...",
  "coverImage": "https://example.com/image.jpg",
  "publishedAt": "2023-05-12T00:00:00.000Z",
  "featured": true,
  "readingTime": 8,
  "categoryId": 1,
  "authorId": 1,
  "category": {
    "id": 1,
    "name": "Data Engineering",
    "slug": "data-engineering",
    "description": "Data pipelines, ETL processes, and data architecture best practices.",
    "icon": "database",
    "color": "blue"
  },
  "tags": [
    {
      "id": 1,
      "name": "ETL",
      "slug": "etl"
    },
    {
      "id": 7,
      "name": "AWS",
      "slug": "aws"
    }
  ]
}
```

### Categories

#### Get All Categories

```
GET /api/categories
```

Returns a list of all blog categories.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Data Engineering",
    "slug": "data-engineering",
    "description": "Data pipelines, ETL processes, and data architecture best practices.",
    "icon": "database",
    "color": "blue"
  },
  ...
]
```

#### Get Category by Slug

```
GET /api/categories/:slug
```

Returns a specific category by its slug.

**URL Parameters**:
- `slug`: The slug of the category

**Response**:
```json
{
  "id": 1,
  "name": "Data Engineering",
  "slug": "data-engineering",
  "description": "Data pipelines, ETL processes, and data architecture best practices.",
  "icon": "database",
  "color": "blue"
}
```

#### Get Posts by Category

```
GET /api/categories/:slug/posts
```

Returns all posts in a specific category.

**URL Parameters**:
- `slug`: The slug of the category

**Response**: Array of posts in the same format as Get All Posts.

### Tags

#### Get All Tags

```
GET /api/tags
```

Returns a list of all blog tags.

**Response**:
```json
[
  {
    "id": 1,
    "name": "ETL",
    "slug": "etl"
  },
  ...
]
```

#### Get Posts by Tag

```
GET /api/tags/:slug/posts
```

Returns all posts with a specific tag.

**URL Parameters**:
- `slug`: The slug of the tag

**Response**: Array of posts in the same format as Get All Posts.

### Projects

#### Get All Projects

```
GET /api/projects
```

Returns a list of all projects.

**Response**:
```json
[
  {
    "id": 1,
    "title": "Real-time Analytics Platform",
    "slug": "real-time-analytics-platform",
    "description": "Built a streaming data analytics platform processing 10TB+ daily...",
    "coverImage": "https://example.com/project.jpg",
    "technologies": ["Apache Kafka", "Spark Streaming", "Elasticsearch", "Kibana", "Python", "AWS"],
    "featured": true,
    "categoryId": 1,
    "url": "https://github.com/example/analytics-platform"
  },
  ...
]
```

#### Get Featured Projects

```
GET /api/projects/featured
```

Returns a list of featured projects.

**Response**: Same structure as Get All Projects.

### Contact & Subscription

#### Send Contact Message

```
POST /api/contact
```

Sends a contact message to the site owner.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Collaboration Opportunity",
  "message": "I'd like to discuss a potential collaboration..."
}
```

**Response**:
```json
{
  "message": "Message sent successfully",
  "contactMessage": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Collaboration Opportunity",
    "message": "I'd like to discuss a potential collaboration...",
    "createdAt": "2023-06-15T10:30:00.000Z"
  }
}
```

#### Subscribe to Newsletter

```
POST /api/subscribe
```

Subscribes an email address to the newsletter.

**Request Body**:
```json
{
  "email": "subscriber@example.com"
}
```

**Response**:
```json
{
  "message": "Subscribed successfully",
  "subscription": {
    "id": 1,
    "email": "subscriber@example.com",
    "createdAt": "2023-06-15T10:35:00.000Z"
  }
}
```

### Search

#### Search Posts

```
GET /api/search?q=query
```

Searches for posts containing the specified query in title, excerpt, or content.

**Query Parameters**:
- `q`: The search query

**Response**: Array of matching posts in the same format as Get All Posts.

## Data Models

### User
```typescript
{
  id: number;
  username: string;
  password: string; // Hashed
}
```

### Post
```typescript
{
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
}
```

### Category
```typescript
{
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}
```

### Tag
```typescript
{
  id: number;
  name: string;
  slug: string;
}
```

### PostTag
```typescript
{
  id: number;
  postId: number;
  tagId: number;
}
```

### Project
```typescript
{
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  technologies: string[];
  featured: boolean;
  categoryId: number;
  url: string | null;
}
```

### ContactMessage
```typescript
{
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}
```

### Subscription
```typescript
{
  id: number;
  email: string;
  createdAt: Date;
}
```