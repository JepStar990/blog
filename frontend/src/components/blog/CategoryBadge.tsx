import React from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  name: string;
  slug?: string;
  light?: boolean;
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  name, 
  slug,
  light = false,
  className
}) => {
  const getColorClasses = (): string => {
    if (light) {
      return 'bg-white/20 text-white';
    }
    
    switch (name.toLowerCase()) {
      case 'data engineering':
        return 'bg-blue-100 text-blue-800';
      case 'machine learning':
        return 'bg-purple-100 text-purple-800';
      case 'data visualization':
        return 'bg-green-100 text-green-800';
      case 'cloud solutions':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const badgeContent = (
    <span className={cn(
      "text-xs font-medium px-2 py-1 rounded-full", 
      getColorClasses(),
      className
    )}>
      {name}
    </span>
  );

  if (slug) {
    return (
      <Link href={`/blog/category/${slug}`}>
        <a className="hover:opacity-80 transition-opacity">
          {badgeContent}
        </a>
      </Link>
    );
  }

  return badgeContent;
};

export default CategoryBadge;
