import React from 'react';
import { Project, Category } from '@shared/schema';
import { ExternalLink } from 'lucide-react';

interface PortfolioCardProps {
  project: Project;
  category?: Category;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, category }) => {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg">
      <div className="h-56 overflow-hidden relative">
        <img 
          src={project.coverImage} 
          alt={project.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6">
            <div className="flex gap-2 mb-2">
              {category && (
                <span className="text-xs font-medium bg-blue-100 bg-opacity-80 text-primary px-2 py-1 rounded-full">
                  {category.name}
                </span>
              )}
              {project.featured && (
                <span className="text-xs font-medium bg-orange-100 bg-opacity-80 text-orange-700 px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
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
  );
};

export default PortfolioCard;
