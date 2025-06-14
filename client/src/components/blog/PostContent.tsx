import React from 'react';
import { Post, Tag, Category } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import Markdown from '@/lib/markdown';
import { 
  FacebookIcon, 
  TwitterIcon, 
  LinkedinIcon, 
  MailIcon 
} from 'lucide-react';
import CategoryBadge from './CategoryBadge';

interface PostContentProps {
  post: Post & { 
    category?: Category;
    tags?: Tag[];
  };
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const socialShareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      icon: <TwitterIcon className="h-4 w-4" />
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: <FacebookIcon className="h-4 w-4" />
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      icon: <LinkedinIcon className="h-4 w-4" />
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
      icon: <MailIcon className="h-4 w-4" />
    }
  ];

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex justify-center gap-2 mb-4">
          {post.category && (
            <CategoryBadge 
              name={post.category.name} 
              slug={post.category.slug} 
            />
          )}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 text-lg mb-6">{post.excerpt}</p>
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                alt="Author" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="text-left">
              <h3 className="font-bold">David Chen</h3>
              <p className="text-sm text-gray-600">Lead Data Engineer</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readingTime} min read
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="mb-10 rounded-lg overflow-hidden">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-auto object-cover" 
        />
      </div>

      {/* Content */}
      <div className="prose prose-lg lg:prose-xl max-w-none">
        <Markdown>{post.content}</Markdown>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                <a className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors">
                  {tag.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Share this article:</h3>
        <div className="flex space-x-2">
          {socialShareLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label={`Share on ${link.name}`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="mt-12 p-8 bg-gray-100 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
        <p className="text-gray-600 mb-4">Sign up for my newsletter to get the latest insights on data engineering and AI.</p>
        <Button asChild>
          <Link href="/subscribe">
            <a>Subscribe to Newsletter</a>
          </Link>
        </Button>
      </div>
    </article>
  );
};

export default PostContent;
