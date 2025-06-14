import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const ContactCTA: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Let's Work Together</h2>
              <p className="text-gray-300 text-lg mb-6">
                Looking for consultation on data engineering, ML implementation, or need help with your next data-driven project? I'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/contact">
                    <a>Contact Me</a>
                  </Link>
                </Button>
                <Button variant="outline" className="bg-transparent border border-white hover:bg-white text-white hover:text-gray-900" asChild>
                  <Link href="/portfolio">
                    <a>View Services</a>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                alt="Working on Data" 
                className="rounded-lg shadow-lg" 
                style={{ maxWidth: '280px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
