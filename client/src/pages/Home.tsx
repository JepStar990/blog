import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/home/Hero';
import FeaturedPosts from '@/components/home/FeaturedPosts';
import Categories from '@/components/home/Categories';
import LatestPosts from '@/components/home/LatestPosts';
import Newsletter from '@/components/home/Newsletter';
import FeaturedTutorial from '@/components/home/FeaturedTutorial';
import Portfolio from '@/components/home/Portfolio';
import ContactCTA from '@/components/home/ContactCTA';
import { Helmet } from 'react-helmet';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>DataEngineered | A Blog on Data Engineering, AI & ML</title>
        <meta name="description" content="Insights and expertise on data engineering, AI & machine learning, and modern reporting techniques." />
      </Helmet>

      <Hero />
      <FeaturedPosts />
      <Categories />
      <LatestPosts />
      <Newsletter />
      <FeaturedTutorial />
      <Portfolio />
      <ContactCTA />
    </MainLayout>
  );
};

export default Home;
