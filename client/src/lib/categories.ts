export type CategoryColor = 
  | 'blue' 
  | 'purple' 
  | 'green' 
  | 'red' 
  | 'orange' 
  | 'yellow' 
  | 'indigo' 
  | 'pink';

export interface CategoryStyle {
  bg: string;
  text: string;
  iconBg: string;
  hover: string;
}

export const getCategoryStyle = (color: CategoryColor): CategoryStyle => {
  const styles: Record<CategoryColor, CategoryStyle> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconBg: 'bg-primary',
      hover: 'group-hover:bg-blue-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      iconBg: 'bg-purple-600',
      hover: 'group-hover:bg-purple-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      iconBg: 'bg-green-600',
      hover: 'group-hover:bg-green-100'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      iconBg: 'bg-red-600',
      hover: 'group-hover:bg-red-100'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      iconBg: 'bg-orange-600',
      hover: 'group-hover:bg-orange-100'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      iconBg: 'bg-yellow-600',
      hover: 'group-hover:bg-yellow-100'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      iconBg: 'bg-indigo-600',
      hover: 'group-hover:bg-indigo-100'
    },
    pink: {
      bg: 'bg-pink-50',
      text: 'text-pink-700',
      iconBg: 'bg-pink-600',
      hover: 'group-hover:bg-pink-100'
    }
  };
  
  return styles[color];
};

export const getCategoryBadgeClasses = (color: CategoryColor): string => {
  const baseClasses = 'text-xs font-medium px-2 py-1 rounded-full';
  
  const colorClasses: Record<CategoryColor, string> = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    pink: 'bg-pink-100 text-pink-800'
  };
  
  return `${baseClasses} ${colorClasses[color]}`;
};
