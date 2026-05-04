import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Database, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';

const Header: React.FC = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-primary text-2xl font-bold flex items-center">
            <Database className="mr-2 h-6 w-6" />
            <span>DataEngineered</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`font-medium ${isActive('/') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
          >
            Home
          </Link>
          <Link 
            href="/blog" 
            className={`font-medium ${isActive('/blog') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
          >
            Blog
          </Link>
          <Link 
            href="/portfolio" 
            className={`font-medium ${isActive('/portfolio') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
          >
            Portfolio
          </Link>
          <Link 
            href="/about" 
            className={`font-medium ${isActive('/about') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`font-medium ${isActive('/contact') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
          >
            Contact
          </Link>
          
          {/* Theme toggle button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="mr-2"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button asChild>
            <Link href="/subscribe">
              Subscribe
            </Link>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="mr-2"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            )}
          </Button>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white dark:bg-gray-900 w-full absolute transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
          <Link 
            href="/"
            className={`font-medium py-2 ${isActive('/') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/blog"
            className={`font-medium py-2 ${isActive('/blog') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link 
            href="/portfolio"
            className={`font-medium py-2 ${isActive('/portfolio') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Portfolio
          </Link>
          <Link 
            href="/about"
            className={`font-medium py-2 ${isActive('/about') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/contact"
            className={`font-medium py-2 ${isActive('/contact') ? 'text-primary' : 'text-gray-800 dark:text-gray-200'} hover:text-primary transition-colors`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Button className="w-full" asChild>
            <Link 
              href="/subscribe"
              onClick={() => setMobileMenuOpen(false)}
            >
              Subscribe
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
