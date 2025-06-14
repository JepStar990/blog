import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { insertSubscriptionSchema } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Helmet } from 'react-helmet';
import { Mail, Check } from 'lucide-react';

const subscribeSchema = insertSubscriptionSchema.extend({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

const Subscribe: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SubscribeFormData) => {
      const response = await apiRequest('POST', '/api/subscribe', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      form.reset();
      setIsSubmitting(false);
      setIsSuccess(true);
    },
    onError: (error) => {
      toast({
        title: "Failed to subscribe",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: SubscribeFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Subscribe to Newsletter | DataEngineered</title>
        <meta name="description" content="Subscribe to receive the latest insights on data engineering, AI, and machine learning directly to your inbox." />
      </Helmet>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto bg-white p-8 md:p-12 rounded-lg shadow-md">
            {isSuccess ? (
              <div className="text-center">
                <div className="bg-green-100 text-green-700 rounded-full p-4 inline-block mb-6">
                  <Check className="h-12 w-12" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">Subscription Confirmed!</h1>
                <p className="text-gray-600 mb-8">
                  Thank you for subscribing to the DataEngineered newsletter. You'll now receive the latest insights on data engineering, AI, and machine learning directly to your inbox.
                </p>
                <Button asChild>
                  <a href="/">Return to Homepage</a>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="bg-primary/10 text-primary rounded-full p-4 inline-block mb-6">
                    <Mail className="h-12 w-12" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to My Newsletter</h1>
                  <p className="text-gray-600">
                    Get the latest data engineering, AI, and ML insights delivered straight to your inbox. No spam, just valuable content.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Your email address" 
                              className="h-12"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-12"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </form>
                </Form>

                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>By subscribing, you agree to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold mb-6 text-center">What You'll Receive</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-primary/10 text-primary rounded-full p-3 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Technical Insights</h3>
              <p className="text-gray-600">In-depth articles about data engineering best practices and emerging technologies.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-primary/10 text-primary rounded-full p-3 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Industry Trends</h3>
              <p className="text-gray-600">Analysis of the latest trends and developments in AI and machine learning.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="bg-primary/10 text-primary rounded-full p-3 inline-block mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Resources & Tools</h3>
              <p className="text-gray-600">Exclusive access to tutorials, code snippets, and tools to enhance your work.</p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Subscribe;
