import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import MainLayout from '@/components/layout/MainLayout';
import BlogCard from '@/components/blog/BlogCard';
import { Helmet } from 'react-helmet';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from '@shared/schema';

const TagPage: React.FC = () => {
  const [, params] = useRoute('/blog/tag/:slug');
  const slug = params?.slug;

  const { data: tag, isLoading: tagLoading } = useQuery<Tag>({
    queryKey: [`/api/tags/${slug}`],
    enabled: !!slug,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: [`/api/tags/${slug}/posts`],
    enabled: !!slug,
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const isLoading = tagLoading || postsLoading;

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

  if (!isLoading && !tag) {
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Tag not found</h1>
          <p>The tag you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>{tag ? `Posts tagged with ${tag.name} | DataEngineered` : 'Loading...'}</title>
        <meta 
          name="description" 
          content={tag ? `Browse all articles tagged with ${tag.name}` : 'Loading tag...'}
        />
      </Helmet>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {isLoading ? (
              <>
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </>
            ) : (
              <>
                <span className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full inline-block mb-4">Tag</span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">#{tag?.name}</h1>
                <p className="text-lg text-gray-600">
                  Browse all articles tagged with {tag?.name}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">All Articles</h2>
          
          <div className="grid grid-cols-1 gap-8">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <Skeleton className="h-48 md:h-full w-full" />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex gap-2 mb-3">
                        <Skeleton className="h-6 w-24" />
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
            ) : posts?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No posts found with this tag.</p>
              </div>
            ) : (
              posts?.map(post => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  categoryName={getCategoryName(post.categoryId)}
                  categorySlug={getCategorySlug(post.categoryId)}
                  variant="horizontal"
                />
              ))
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default TagPage;
