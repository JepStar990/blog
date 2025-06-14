import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedTutorial: React.FC = () => {
  // Fetch a featured post - in this case, we're getting the first featured post from our API
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['/api/posts/featured'],
  });

  if (error) {
    return null;
  }

  // Get the first post to feature as a tutorial
  const featuredPost = posts && posts.length > 0 ? posts[0] : null;

  return (
    <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {isLoading ? (
          <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="lg:w-1/2 h-64 lg:h-auto relative">
              <Skeleton className="absolute w-full h-full" />
            </div>
            <div className="lg:w-1/2 p-8 md:p-12">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-6" />
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-32 mr-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        ) : featuredPost ? (
          <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="lg:w-1/2 h-64 lg:h-auto relative">
              <img 
                src={featuredPost.coverImage} 
                alt={featuredPost.title} 
                className="absolute w-full h-full object-cover" 
              />
            </div>
            <div className="lg:w-1/2 p-8 md:p-12">
              <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                FEATURED TUTORIAL
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredPost.title}</h2>
              <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                      alt="Author" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">David Chen</h4>
                    <p className="text-sm text-gray-600">Lead Data Engineer</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {featuredPost.readingTime} min read
                  </span>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(featuredPost.publishedAt)}
                  </span>
                </div>
              </div>
              <Button asChild>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <a>Read Full Tutorial</a>
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default FeaturedTutorial;
