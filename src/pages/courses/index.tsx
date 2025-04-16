import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AllCourses, ICourse } from '@/Constant/constant';
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

  // Apply filter and sort by ID to ensure consistent order
  const filteredCourses = useMemo(() => {
    const filtered = filter === 'All' 
      ? [...AllCourses] 
      : AllCourses.filter(course => 
          filter === 'Most Popular' ? course.category === 'Most Popular' :
          filter === 'Beginner' ? course.level === 'Beginner' :
          filter === 'Advanced' ? course.level === 'Advanced' :
          filter === 'Finance' ? course.field === 'Finance' : true
        );
    
    // Sort courses by ID to ensure consistent order
    return filtered.sort((a, b) => a.id - b.id);
  }, [filter]);

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
      <section className="bg-[#061213] text-white py-16 md:py-24">
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
                      ? 'bg-[#CB9006] text-white'
                      : 'bg-[#0A1114] text-white hover:bg-[#0F1A1B]'
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
      <section className="py-16 bg-[#0A1114]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">
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
                    <div className="group h-full bg-[#061213] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#1A1D24]/30 hover:border-[#CB9006]/50 relative flex flex-col">
                      {/* Image container with overlay */}
                      <div className="h-48 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-all duration-300"></div>
                        <Image 
                          src={course.img} 
                          alt={course.name} 
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {course.category === 'Most Popular' && (
                          <div className="absolute top-4 right-4 bg-[#CB9006] text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg">
                            Featured
                          </div>
                        )}
                        {/* Level badge */}
                        <div className="absolute bottom-4 left-4 z-20">
                          <span className="bg-[#0A1114]/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-md border border-[#1A1D24]/50">
                            {course.level}
                          </span>
                        </div>
                        {/* ID badge for better identification */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-[#0A1114]/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-md border border-[#1A1D24]/50">
                            #{course.id}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Rating and students */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center bg-[#0A1114]/50 rounded-full px-2.5 py-1">
                            <svg className="w-3.5 h-3.5 text-[#CB9006]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-xs font-medium text-white">{course.rating}</span>
                            <span className="mx-1.5 text-gray-500 text-xs">|</span>
                            <span className="text-xs text-gray-400">{course.noEnrolled} students</span>
                          </div>
                        </div>
                        
                        {/* Course title */}
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#CB9006] transition-colors duration-300 line-clamp-2">{course.name}</h3>
                        
                        {/* Course description */}
                        <p className="text-gray-400 mb-4 text-sm line-clamp-2 flex-grow">{course.desc}</p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#1A1D24]/30 mt-auto">
                          <span className="text-xs text-gray-500">Field: {course.field}</span>
                          <span className="text-sm text-[#CB9006] font-medium group-hover:translate-x-1 transition-transform duration-300 flex items-center">
                            View Course
                            <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No courses found in this category.</p>
            </div>
          )}
        </div>
      </section>

 
     
    </>
  );
} 