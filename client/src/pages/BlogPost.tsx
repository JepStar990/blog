import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import MainLayout from '@/components/layout/MainLayout';
import PostContent from '@/components/blog/PostContent';
import BlogCard from '@/components/blog/BlogCard';
import { Helmet } from 'react-helmet';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPost: React.FC = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  const { data: post, isLoading: postLoading, error } = useQuery({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
  });

  const { data: latestPosts, isLoading: latestLoading } = useQuery({
    queryKey: ['/api/posts/latest', 3],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`${queryKey[0]}?limit=${queryKey[1]}`);
      if (!response.ok) throw new Error('Failed to fetch latest posts');
      return response.json();
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (error) {
    setLocation('/not-found');
    return null;
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

  // Filter out the current post from related posts
  const relatedPosts = latestPosts?.filter(p => p.slug !== slug).slice(0, 3) || [];

  return (
    <MainLayout>
      {postLoading ? (
        <div className="container mx-auto px-4 py-12">
          <article className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-4/5 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto mb-6" />
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div className="text-left">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-32 mr-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </header>

            <Skeleton className="w-full h-80 mb-10 rounded-lg" />

            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          </article>
        </div>
      ) : post ? (
        <>
          <Helmet>
            <title>{post.title} | DataEngineered</title>
            <meta name="description" content={post.excerpt} />
          </Helmet>
          
          <div className="container mx-auto px-4 py-12">
            <PostContent post={post} />
          </div>
        </>
      ) : null}

      {/* Related posts section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">More Articles You Might Like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              relatedPosts.map(relatedPost => (
                <BlogCard 
                  key={relatedPost.id} 
                  post={relatedPost}
                  categoryName={getCategoryName(relatedPost.categoryId)}
                  categorySlug={getCategorySlug(relatedPost.categoryId)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default BlogPost;
