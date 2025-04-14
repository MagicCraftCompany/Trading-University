import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AllCourses } from '@/Constant/constant';
import { StaticImageData } from 'next/image';

interface Course {
  id: number;
  name: string;
  desc: string;
  instructor: string;
  level: string;
  rating: number;
  noEnrolled: number;
  category: string;
  img: StaticImageData;
  field: string;
}

export default function Courses() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Most Popular', 'Beginner', 'Advanced', 'Finance'];

  const filteredCourses = filter === 'All' 
    ? AllCourses 
    : AllCourses.filter(course => 
        filter === 'Most Popular' ? course.category === 'Most Popular' :
        filter === 'Beginner' ? course.level === 'Beginner' :
        filter === 'Advanced' ? course.level === 'Advanced' :
        filter === 'Finance' ? course.field === 'Finance' : true
      );

  // Course card animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head>
        <title>Trading Courses | Trading University</title>
        <meta name="description" content="Browse our expert-led trading courses to master the financial markets" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Trading Courses</h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive courses designed by professional traders to help you master the financial markets.
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full text-sm md:text-base transition-colors ${
                    filter === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {filter === 'All' ? 'All Courses' : `${filter} Courses`}
          </h2>
          
          {filteredCourses.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCourses.map((course) => (
                <motion.div key={course.id} variants={cardVariants}>
                  <Link href={`/courses/${course.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100">
                      <div className="h-48 bg-gray-300 relative">
                        <Image 
                          src={course.img} 
                          alt={course.name} 
                          fill
                          className="object-cover"
                        />
                        {course.category === 'Most Popular' && (
                          <div className="absolute top-4 right-4 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{course.level}</span>
                          <div className="ml-auto flex items-center">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm font-medium">{course.rating}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-sm text-gray-600">{course.noEnrolled} students</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2 h-14 line-clamp-2">{course.name}</h3>
                        <p className="text-gray-600 mb-4 h-12 line-clamp-2">{course.desc}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Field: {course.field}</span>
                          <span className="text-sm text-blue-600 font-medium">View Course →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No courses found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Trading University</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our comprehensive trading courses and start your learning journey today.
          </p>
        </div>
      </section>
    </>
  );
} 