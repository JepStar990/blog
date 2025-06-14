import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { CategoryColor, getCategoryStyle } from '@/lib/categories';
import { Database, Brain, BarChart, Cloud } from 'lucide-react';

const Categories: React.FC = () => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const getCategoryIcon = (icon: string) => {
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

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore Topics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            ))
          ) : (
            categories?.map(category => {
              const style = getCategoryStyle(category.color as CategoryColor);
              
              return (
                <Link key={category.id} href={`/blog/category/${category.slug}`}>
                  <a className="block group">
                    <div className={`${style.bg} rounded-lg p-6 transition-all group-hover:shadow-md`}>
                      <div className={`w-12 h-12 ${style.iconBg} rounded-full flex items-center justify-center mb-4`}>
                        {getCategoryIcon(category.icon)}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <span className="text-primary group-hover:text-primary-dark font-medium flex items-center">
                        Browse Articles
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
