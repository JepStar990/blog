import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Post } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import CategoryBadge from '@/components/blog/CategoryBadge';

const LatestPosts: React.FC = () => {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['/api/posts/latest'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Failed to load latest posts</p>
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

  const getCategoryColor = (categoryId: number): string => {
    if (!categories) return 'blue';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'blue';
  };

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Latest Articles</h2>
        
        <div className="grid grid-cols-1 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <Skeleton className="h-48 md:h-full w-full" />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            posts?.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex gap-2 mb-3">
                      <CategoryBadge 
                        name={getCategoryName(post.categoryId)} 
                        slug={getCategorySlug(post.categoryId)} 
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      <Link href={`/blog/${post.slug}`}>
                        <a className="hover:text-primary transition-colors">{post.title}</a>
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatDate(post.publishedAt)} • {post.readingTime} min read
                      </span>
                      <Link href={`/blog/${post.slug}`}>
                        <a className="text-primary hover:text-primary-dark font-medium">Read More</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/blog">
              <a>View All Articles</a>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
