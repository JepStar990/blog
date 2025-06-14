import React from 'react';
import { Link } from 'wouter';
import { Post } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import CategoryBadge from './CategoryBadge';

interface BlogCardProps {
  post: Post;
  categoryName: string;
  categorySlug: string;
  variant?: 'compact' | 'horizontal' | 'featured';
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  post, 
  categoryName, 
  categorySlug, 
  variant = 'compact' 
}) => {
  if (variant === 'horizontal') {
    return (
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex gap-2 mb-3">
              <CategoryBadge name={categoryName} slug={categorySlug} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                {post.title}
              </Link>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(post.publishedAt)} • {post.readingTime} min read
              </span>
              <Link href={`/blog/${post.slug}`} className="text-primary hover:text-primary-dark font-medium">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`}>
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg cursor-pointer">
          <div className="h-64 overflow-hidden relative">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6">
                <div className="flex gap-2 mb-2">
                  <CategoryBadge name={categoryName} slug={categorySlug} light />
                </div>
                <h3 className="text-2xl font-bold text-white">{post.title}</h3>
                <p className="text-gray-200 mt-2 mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center text-gray-300 text-sm">
                  <span>{formatDate(post.publishedAt)} • {post.readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Default compact card
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <CategoryBadge name={categoryName} slug={categorySlug} />
        </div>
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.publishedAt)} • {post.readingTime} min read
          </span>
          <Link href={`/blog/${post.slug}`} className="text-primary hover:text-primary-dark font-medium">
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
