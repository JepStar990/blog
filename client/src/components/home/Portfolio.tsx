import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects/featured'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (error) {
    return null;
  }

  const getCategoryName = (categoryId: number) => {
    if (!categories) return '';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
            <p className="text-gray-600 mt-2">A selection of my recent data engineering and machine learning work</p>
          </div>
          <Link href="/portfolio">
            <a className="text-primary hover:text-primary-dark font-medium mt-4 md:mt-0 flex items-center">
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading ? (
            Array(2).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                <div className="h-56 overflow-hidden relative">
                  <Skeleton className="w-full h-full absolute" />
                </div>
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <Skeleton className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            projects?.map(project => (
              <div key={project.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
                <div className="h-56 overflow-hidden relative">
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs font-medium bg-blue-100 bg-opacity-80 text-primary px-2 py-1 rounded-full">
                          {getCategoryName(project.categoryId)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:text-primary-dark"
                        aria-label="External link"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
