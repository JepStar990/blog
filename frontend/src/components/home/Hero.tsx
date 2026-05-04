import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gray-900 text-white py-16 md:py-24">
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Insights on Data Engineering, AI & Machine Learning
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Exploring the intersection of data infrastructure, artificial intelligence, and modern reporting techniques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/blog">
                <a>Read Latest Articles</a>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border border-white hover:bg-white text-white hover:text-gray-900" asChild>
              <Link href="/portfolio">
                <a>View Portfolio</a>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
