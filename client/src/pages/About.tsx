import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Database, Server, Brain, BarChart, Users, Code } from 'lucide-react';

const About: React.FC = () => {
  const skills = [
    { name: 'Data Engineering', icon: <Database className="h-6 w-6" />, description: 'Building robust data pipelines and ETL processes' },
    { name: 'Big Data Systems', icon: <Server className="h-6 w-6" />, description: 'Working with large-scale distributed systems like Hadoop and Spark' },
    { name: 'Machine Learning', icon: <Brain className="h-6 w-6" />, description: 'Implementing ML models for predictive analytics' },
    { name: 'Data Visualization', icon: <BarChart className="h-6 w-6" />, description: 'Creating insightful data dashboards and visualizations' },
    { name: 'Team Leadership', icon: <Users className="h-6 w-6" />, description: 'Leading data teams and managing complex projects' },
    { name: 'Software Development', icon: <Code className="h-6 w-6" />, description: 'Building data-driven applications and APIs' },
  ];

  const experiences = [
    {
      title: 'Junior Data Engineer',
      company: 'Netstar',
      period: 'October 2023 - January 2025',
      description: 'As a junior developer, I focused on data engineering by designing Azure Synapse monitoring systems and optimizing data pipelines. I utilized Databricks for managing Cassandra data and investigated discrepancies with SQL.'
    },
    {
      title: 'Data analytics Trainee',
      company: 'Mecer Inter Ed',
      period: 'June 2023 - September 2023',
      description: 'To learn and acquire skills to maintain Databases, identify new opportunities to improve processes, create visually appealing visualizations using Power BI, extracting useful insights from data to support critical decision making.'
    }
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>About Me | DataEngineered</title>
        <meta name="description" content="Learn more about Zwiswa Muridili, a junior data engineer with expertise in building data pipelines, machine learning models, and data visualization solutions." />
      </Helmet>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3">
              <img 
                src="https://media.licdn.com/dms/image/v2/D4D03AQEnT-sSFiUxWA/profile-displayphoto-shrink_800_800/B4DZam7GSyHQAc-/0/1746557234703?e=1753920000&v=beta&t=SafxZDXFAfbf0fWbGmJYqZQMcbOxn-QGcun_cS2AXy8" 
                alt="Zwiswa Muridili" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">About Me</h1>
              <p className="text-xl text-gray-600 mb-6">
                I'm Zwiswa Muridili, a Junior Data Engineer with less than 2 years of experience in building data infrastructure, implementing machine learning solutions, and creating meaningful data visualizations.
              </p>
              <p className="text-gray-600 mb-6">
                With a background in computer science and a passion for solving complex data problems, I've helped numerous organizations transform their data into actionable insights. This blog is my way of sharing knowledge and experiences with the data community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/contact">
                    <a>Get in Touch</a>
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/portfolio">
                    <a>View My Work</a>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Skills & Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-primary rounded-full p-2 text-white mr-3">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold">{skill.name}</h3>
                </div>
                <p className="text-gray-600">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Professional Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-primary">{exp.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{exp.company}</span>
                  <span className="text-gray-500 text-sm">{exp.period}</span>
                </div>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">My Approach</h2>
          <p className="text-gray-600 mb-6">
            I believe that effective data solutions require a combination of technical expertise, business understanding, and clear communication. My approach focuses on delivering practical, scalable solutions that provide real value and insights.
          </p>
          <p className="text-gray-600 mb-8">
            Whether I'm designing a data pipeline, implementing a machine learning model, or creating a visualization dashboard, I prioritize clean code, robust architecture, and user-friendly interfaces.
          </p>
          <Button asChild>
            <Link href="/blog">
              <a>Read My Articles</a>
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Let's Connect</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <Button asChild>
            <Link href="/contact">
              <a>Contact Me</a>
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
