import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import { Project, Category } from '@shared/schema';
import { Helmet } from 'react-helmet';
import { Skeleton } from '@/components/ui/skeleton';

const Portfolio: React.FC = () => {
  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const isLoading = projectsLoading || categoriesLoading;

  const getCategoryForProject = (categoryId: number) => {
    if (!categories) return undefined;
    return categories.find(cat => cat.id === categoryId);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Portfolio | DataEngineered</title>
        <meta name="description" content="View my data engineering, machine learning, and data visualization projects." />
      </Helmet>

      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">My Portfolio</h1>
          <p className="text-xl text-gray-300 mb-0 max-w-2xl mx-auto">
            A collection of my work in data engineering, machine learning, and data visualization
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))
            ) : projects?.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No projects found.</p>
              </div>
            ) : (
              projects?.map(project => (
                <PortfolioCard 
                  key={project.id} 
                  project={project} 
                  category={getCategoryForProject(project.categoryId)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">My Approach to Projects</h2>
          <p className="text-gray-600 mb-6">
            I believe in building robust, scalable solutions that solve real business problems. My projects focus on delivering measurable value through quality engineering and thoughtful design.
          </p>
          <p className="text-gray-600">
            Each project represents a unique challenge that required a tailored approach, from large-scale data processing systems to machine learning models and interactive visualizations.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Have a Project in Mind?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects and challenges. Let's create something amazing together.
          </p>
          <a 
            href="/contact" 
            className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-md transition-colors inline-block"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

export default Portfolio;
