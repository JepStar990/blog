import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import MainLayout from '@/components/layout/MainLayout';
import BlogCard from '@/components/blog/BlogCard';
import { Helmet } from 'react-helmet';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@shared/schema';
import { getCategoryStyle, CategoryColor } from '@/lib/categories';
import { Database, Brain, BarChart, Cloud } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const [, params] = useRoute('/blog/category/:slug');
  const slug = params?.slug;

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: [`/api/categories/${slug}/posts`],
    enabled: !!slug,
  });

  const getCategoryIcon = (icon?: string) => {
    switch (icon) {
      case 'database':
        return <Database className="text-white text-xl" />;
      case 'brain':
        return <Brain className="text-white text-xl" />;
      case 'chart-line':
        return <BarChart className="text-white text-xl" />;
      case 'cloud':
        return <Cloud className="text-white text-xl" />;
      default:
        return <Database className="text-white text-xl" />;
    }
  };

  const isLoading = categoryLoading || postsLoading;

  if (!isLoading && !category) {
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <p>The category you're looking for doesn't exist.</p>
        </div>
      </MainLayout>
    );
  }

  const style = category ? getCategoryStyle(category.color as CategoryColor) : { bg: '', iconBg: '' };

  return (
    <MainLayout>
      <Helmet>
        <title>{category ? `${category.name} | DataEngineered` : 'Loading...'}</title>
        <meta 
          name="description" 
          content={category ? category.description : 'Loading category...'}
        />
      </Helmet>

      <section className={`py-16 ${style.bg}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {isLoading ? (
              <>
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-6" />
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </>
            ) : (
              <>
                <div className={`w-16 h-16 ${style.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  {getCategoryIcon(category?.icon)}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{category?.name}</h1>
                <p className="text-lg text-gray-600">
                  {category?.description}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">All Articles</h2>
          
          <div className="grid grid-cols-1 gap-8">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <p className="text-gray-600">No posts found in this category.</p>
              </div>
            ) : (
              posts?.map(post => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  categoryName={category?.name || ''}
                  categorySlug={category?.slug || ''}
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

export default CategoryPage;
