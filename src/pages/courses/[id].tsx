import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getIntroVideo } from '@/components/iFRame';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoId: number;
  completed?: boolean;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  rating: number;
  totalStudents: number;
  totalLessons: number;
  totalHours: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  featured: boolean;
  learningPoints: string[];
  modules: Module[];
}

// Example course data
const coursesData: Record<string, Course> = {
  "1": {
    id: 1,
    title: 'Technical Analysis Mastery',
    description: 'Learn to read charts, identify patterns, and make profitable trading decisions based on technical analysis.',
    longDescription: 'This comprehensive course will take you from beginner to advanced in the art of technical analysis. You\'ll learn how to analyze price charts, identify powerful patterns, use indicators effectively, and make high-probability trading decisions based on what you see in the markets. By the end of this course, you\'ll have a complete technical analysis framework you can apply to any market or timeframe.',
    instructor: 'Michael Thompson',
    level: 'All Levels',
    rating: 4.8,
    totalStudents: 3245,
    totalLessons: 42,
    totalHours: '9h 28m',
    price: 199,
    discountPrice: 149,
    category: 'Technical Analysis',
    imageUrl: '/assets/courses/technical-analysis.jpg',
    featured: true,
    learningPoints: [
      'Master chart pattern recognition for high-probability trade setups',
      'Learn how to use technical indicators effectively without overwhelming your charts',
      'Develop a complete price action trading strategy',
      'Understand market structure and trend analysis',
      'Identify key support and resistance levels with precision',
      'Apply Fibonacci retracements and extensions to find optimal entry and exit points'
    ],
    modules: [
      {
        id: 1,
        title: 'Introduction to Technical Analysis',
        lessons: [
          { id: 1, title: 'What is Technical Analysis?', duration: '12:34', videoId: 1 },
          { id: 2, title: 'Price Action vs Indicators', duration: '15:21', videoId: 2 },
          { id: 3, title: 'Setting Up Your Charts', duration: '8:45', videoId: 3 }
        ]
      },
      {
        id: 2,
        title: 'Chart Patterns',
        lessons: [
          { id: 4, title: 'Trend Lines and Channels', duration: '14:23', videoId: 4 },
          { id: 5, title: 'Support and Resistance', duration: '17:52', videoId: 5 },
          { id: 6, title: 'Double Tops and Bottoms', duration: '13:11', videoId: 6 },
          { id: 7, title: 'Head and Shoulders Pattern', duration: '16:38', videoId: 7 }
        ]
      },
      {
        id: 3,
        title: 'Technical Indicators',
        lessons: [
          { id: 8, title: 'Moving Averages', duration: '18:27', videoId: 8 },
          { id: 9, title: 'RSI (Relative Strength Index)', duration: '14:53', videoId: 9 },
          { id: 10, title: 'MACD (Moving Average Convergence Divergence)', duration: '16:42', videoId: 10 },
          { id: 11, title: 'Bollinger Bands', duration: '15:18', videoId: 11 }
        ]
      },
      {
        id: 4,
        title: 'Advanced Concepts',
        lessons: [
          { id: 12, title: 'Fibonacci Retracements', duration: '19:31', videoId: 12 },
          { id: 13, title: 'Elliot Wave Theory', duration: '22:14', videoId: 13 },
          { id: 14, title: 'Harmonic Patterns', duration: '20:46', videoId: 14 }
        ]
      },
      {
        id: 5,
        title: 'Building Your Trading System',
        lessons: [
          { id: 15, title: 'Combining Multiple Indicators', duration: '16:53', videoId: 15 },
          { id: 16, title: 'Creating a Technical Analysis Checklist', duration: '13:27', videoId: 16 },
          { id: 17, title: 'Backtesting Your Strategy', duration: '24:18', videoId: 17 },
          { id: 18, title: 'Fine-Tuning Your Approach', duration: '18:39', videoId: 18 }
        ]
      }
    ]
  },
  "2": {
    id: 2,
    title: 'Forex Trading Fundamentals',
    description: 'Master the basics of forex trading and learn strategies to profit from currency market movements.',
    longDescription: 'This course provides a comprehensive introduction to the forex market, covering all the essential knowledge needed to start trading currencies with confidence. From understanding currency pairs and market mechanics to developing effective trading strategies and risk management techniques, this course will equip you with the skills needed to navigate the world\'s largest financial market.',
    instructor: 'Sarah Johnson',
    level: 'Beginner',
    rating: 4.7,
    totalStudents: 2890,
    totalLessons: 38,
    totalHours: '8h 45m',
    price: 179,
    discountPrice: 129,
    category: 'Forex',
    imageUrl: '/assets/courses/forex.jpg',
    featured: false,
    learningPoints: [
      'Understand how the forex market works and why currencies move',
      'Learn to read and interpret currency pairs and exchange rates',
      'Master essential forex trading terminology and concepts',
      'Develop effective risk management strategies to protect your capital',
      'Implement profitable forex trading strategies for different market conditions',
      'Set up professional forex trading charts and tools'
    ],
    modules: [
      {
        id: 1,
        title: 'Introduction to Forex Trading',
        lessons: [
          { id: 1, title: 'What is the Forex Market?', duration: '10:24', videoId: 19 },
          { id: 2, title: 'Major, Minor, and Exotic Currency Pairs', duration: '14:36', videoId: 20 },
          { id: 3, title: 'How Currency Exchange Works', duration: '12:18', videoId: 21 }
        ]
      },
      {
        id: 2,
        title: 'Forex Trading Basics',
        lessons: [
          { id: 4, title: 'Pips, Lots, and Leverage', duration: '16:42', videoId: 22 },
          { id: 5, title: 'Long vs Short Positions', duration: '9:27', videoId: 23 },
          { id: 6, title: 'Understanding Spreads and Swaps', duration: '11:53', videoId: 24 }
        ]
      },
      {
        id: 3,
        title: 'Fundamental Analysis',
        lessons: [
          { id: 7, title: 'Economic Indicators', duration: '18:37', videoId: 25 },
          { id: 8, title: 'Central Bank Policies', duration: '15:49', videoId: 26 },
          { id: 9, title: 'Geopolitical Factors', duration: '13:24', videoId: 27 }
        ]
      }
    ]
  }
};

export default function CoursePage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const courseData = coursesData[id];
      if (courseData) {
        setCourse(courseData);
        // Set first module as active by default
        if (courseData.modules.length > 0) {
          setActiveModuleId(courseData.modules[0].id);
          // Set first lesson as selected by default
          if (courseData.modules[0].lessons.length > 0) {
            setSelectedLesson(courseData.modules[0].lessons[0]);
          }
        }
      }
    }
  }, [id]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const toggleModule = (moduleId: number) => {
    setActiveModuleId(activeModuleId === moduleId ? null : moduleId);
  };

  const selectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const enrollInCourse = () => {
    setIsEnrolled(true);
    // Would typically make an API call to enroll the user in the course
  };

  return (
    <>
      <Head>
        <title>{course.title} | Trading University</title>
        <meta name="description" content={course.description} />
      </Head>

      <div className="bg-gray-100 min-h-screen">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-12">
                <Link href="/courses">
                  <span className="inline-flex items-center text-sm font-medium text-blue-300 hover:text-blue-200 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to All Courses
                  </span>
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-gray-300 mb-4">{course.description}</p>
                <div className="flex flex-wrap items-center text-sm">
                  <div className="flex items-center mr-6 mb-2">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {course.rating} ({course.totalStudents.toLocaleString()} students)
                  </div>
                  <div className="flex items-center mr-6 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.totalHours} total
                  </div>
                  <div className="flex items-center mr-6 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {course.totalLessons} lessons
                  </div>
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {course.level}
                  </div>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    {isEnrolled ? (
                      <div className="text-center">
                        <div className="mb-4 text-green-600 bg-green-100 p-2 rounded-md">
                          <svg className="w-6 h-6 mx-auto text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="font-bold">You're enrolled in this course</p>
                        </div>
                        <p className="mb-4">Continue learning with your course modules below.</p>
                        <button 
                          onClick={() => window.scrollTo({ top: document.getElementById('course-content')?.offsetTop || 0, behavior: 'smooth' })}
                          className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
                        >
                          Continue Learning
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            {course.discountPrice ? (
                              <>
                                <span className="text-3xl font-bold text-gray-900">${course.discountPrice}</span>
                                <span className="ml-2 text-lg text-gray-500 line-through">${course.price}</span>
                              </>
                            ) : (
                              <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                            )}
                          </div>
                          {course.discountPrice && (
                            <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded">
                              {Math.round((1 - course.discountPrice / course.price) * 100)}% OFF
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={enrollInCourse}
                          className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors mb-4"
                        >
                          Enroll Now
                        </button>
                        <p className="text-center text-sm text-gray-500 mb-4">30-Day Money-Back Guarantee</p>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Full lifetime access</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Access on mobile and desktop</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Certificate of completion</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Premium trading community access</span>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto px-4 py-12" id="course-content">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="lg:w-2/3 lg:pr-12">
              {selectedLesson ? (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {getIntroVideo(selectedLesson.videoId)}
                  </div>
                </div>
              ) : (
                <div className="mb-12 bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
                  <p className="text-gray-700 mb-6">{course.longDescription}</p>
                  
                  <h3 className="text-xl font-bold mb-4">What You'll Learn</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {course.learningPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-bold mb-4">Meet Your Instructor</h3>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-bold">{course.instructor}</h4>
                      <p className="text-gray-600">Professional Trader & Trading Coach</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Description */}
              {selectedLesson && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h3 className="text-xl font-bold mb-4">About This Lesson</h3>
                  <p className="text-gray-700 mb-6">
                    In this lesson, you'll learn key concepts that will help you understand {selectedLesson.title.toLowerCase()}. 
                    This knowledge is essential for building your trading skills and making informed decisions in the market.
                  </p>
                  
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="font-bold mb-2">Resources</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center text-blue-600 hover:text-blue-800">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <a href="#">Lesson Worksheet</a>
                      </li>
                      <li className="flex items-center text-blue-600 hover:text-blue-800">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <a href="#">Trading Examples</a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Course Curriculum */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold">Course Curriculum</h3>
                  <p className="text-gray-600">
                    {course.totalLessons} lessons • {course.totalHours} total length
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {course.modules.map((module) => (
                    <div key={module.id} className="overflow-hidden">
                      <button 
                        className="w-full px-6 py-4 flex items-center justify-between font-medium hover:bg-gray-50 focus:outline-none"
                        onClick={() => toggleModule(module.id)}
                      >
                        <span>{module.title}</span>
                        <svg 
                          className={`w-5 h-5 transition-transform ${activeModuleId === module.id ? 'transform rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {activeModuleId === module.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50"
                        >
                          <ul className="divide-y divide-gray-100">
                            {module.lessons.map((lesson) => (
                              <li key={lesson.id}>
                                <button 
                                  className={`w-full px-6 py-3 flex items-start text-left ${selectedLesson?.id === lesson.id ? 'bg-blue-50' : ''}`}
                                  onClick={() => selectLesson(lesson)}
                                >
                                  <div className="mr-3 mt-0.5">
                                    {selectedLesson?.id === lesson.id ? (
                                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`font-medium ${selectedLesson?.id === lesson.id ? 'text-blue-600' : 'text-gray-700'}`}>
                                      {lesson.title}
                                    </div>
                                    <p className="text-sm text-gray-500">{lesson.duration}</p>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 