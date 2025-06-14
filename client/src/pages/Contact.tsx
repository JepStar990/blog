import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ContactForm from '@/components/contact/ContactForm';
import { Helmet } from 'react-helmet';
import { Mail, MapPin, Phone, Clock, Globe } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Contact | DataEngineered</title>
        <meta name="description" content="Get in touch with David Chen for data engineering consultation, speaking engagements, or collaboration opportunities." />
      </Helmet>

      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Me</h1>
          <p className="text-xl text-gray-300 mb-0 max-w-2xl mx-auto">
            Have a question or want to work together? I'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
              <ContactForm />
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:david@dataengineered.com" className="text-gray-600 hover:text-primary">
                        david@dataengineered.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">San Francisco, California</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mt-1 mr-3" />
                    <div>
                      <p className="font-medium">Working Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9am - 5pm PST</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-primary text-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">Connect With Me</h3>
                <p className="mb-6">
                  Follow me on social media for updates on new articles, projects, and more.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                    aria-label="GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                  </a>
                  <a 
                    href="https://medium.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                    aria-label="Medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="M12 4v16"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Looking for Consultation?</h2>
          <p className="text-gray-600 mb-6">
            I offer consulting services in data engineering, machine learning implementation, and building data-driven applications. Whether you need help architecting a new data platform or optimizing your existing pipelines, I can help.
          </p>
          <p className="text-gray-600">
            Send me a message with details about your project, and I'll get back to you to discuss how we can work together.
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
