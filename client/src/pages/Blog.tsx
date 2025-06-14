import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import BlogCard from '@/components/blog/BlogCard';
import SearchBar from '@/components/blog/SearchBar';
import { Helmet } from 'react-helmet';
import { Post, Category } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const Blog: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const isLoading = postsLoading || categoriesLoading;

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

  const getFilteredPosts = () => {
    if (!posts) return [];
    if (activeTab === 'all') return posts;
    
    return posts.filter(post => {
      const category = categories?.find(cat => cat.id === post.categoryId);
      return category?.slug === activeTab;
    });
  };

  const filteredPosts = getFilteredPosts();

  return (
    <MainLayout>
      <Helmet>
        <title>Blog | DataEngineered</title>
        <meta name="description" content="Articles and insights on data engineering, AI, machine learning, and data visualization." />
      </Helmet>

      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Blog</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Insights and articles on data engineering, machine learning, 
            and everything in between
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <TabsTrigger key={i} value={`loading-${i}`} disabled>
                    <Skeleton className="h-4 w-24" />
                  </TabsTrigger>
                ))
              ) : (
                categories?.map(category => (
                  <TabsTrigger key={category.id} value={category.slug}>
                    {category.name}
                  </TabsTrigger>
                ))
              )}
            </TabsList>

            <TabsContent value="all" className="mt-4">
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
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No posts found in this category.</p>
                  </div>
                ) : (
                  filteredPosts.map(post => (
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
            </TabsContent>

            {!isLoading && categories?.map(category => (
              <TabsContent key={category.id} value={category.slug} className="mt-4">
                <div className="grid grid-cols-1 gap-8">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No posts found in this category.</p>
                    </div>
                  ) : (
                    filteredPosts.map(post => (
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
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default Blog;
