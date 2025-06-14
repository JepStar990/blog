import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Post } from '@shared/schema';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryBadge from '@/components/blog/CategoryBadge';

const FeaturedPosts: React.FC = () => {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['/api/posts/featured'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Failed to load featured posts</p>
      </div>
    );
  }

  const getCategoryName = (categoryId: number) => {
    if (!categories) return '';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const getCategorySlug = (categoryId: number) => {
    if (!categories) return '';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.slug : '';
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Articles</h2>
          <Link href="/blog">
            <a className="text-primary hover:text-primary-dark font-medium flex items-center">
              View All 
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            posts?.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <CategoryBadge 
                      name={getCategoryName(post.categoryId)} 
                      slug={getCategorySlug(post.categoryId)}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    <Link href={`/blog/${post.slug}`}>
                      <a className="hover:text-primary transition-colors">{post.title}</a>
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(post.publishedAt)} • {post.readingTime} min read
                    </span>
                    <Link href={`/blog/${post.slug}`}>
                      <a className="text-primary hover:text-primary-dark font-medium">Read More</a>
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
