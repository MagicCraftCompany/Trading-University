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
        <title>{course?.title || 'Course'} | Trading University</title>
        <meta name="description" content={course?.description} />
      </Head>

      <div className="min-h-screen bg-[#0A0D14] text-white">
        {course ? (
          <div className="container mx-auto px-4 py-8">
            {/* Back Navigation */}
            <div className="mb-8">
              <Link href="/courses" className="text-blue-400 hover:text-blue-300 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Courses
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {selectedLesson && (
                  <div className="bg-[#1A1D24] rounded-lg overflow-hidden mb-8">
                    <div className="aspect-w-16 aspect-h-9">
                      {getIntroVideo(selectedLesson.videoId)}
                    </div>
                  </div>
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-gray-300 mb-6">{course.longDescription}</p>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{course.rating}</span>
                    <span className="ml-1">({course.totalStudents.toLocaleString()} students)</span>
                  </div>
                  <div className="flex items-center">
                    <span>•</span>
                    <span className="ml-2">{course.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <span>•</span>
                    <span className="ml-2">{course.totalHours} total</span>
                  </div>
                  <div className="flex items-center">
                    <span>•</span>
                    <span className="ml-2">{course.level}</span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="space-y-6">
                  {course.modules.map((module) => (
                    <div key={module.id} className="bg-[#1A1D24] rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full px-6 py-4 flex justify-between items-center hover:bg-[#2A2D34]"
                      >
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                        <span className="text-sm text-gray-400">{module.lessons.length} lessons</span>
                      </button>
                      
                      {activeModuleId === module.id && (
                        <div className="border-t border-gray-700">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => selectLesson(lesson)}
                              className={`w-full px-6 py-3 flex justify-between items-center hover:bg-[#2A2D34] ${
                                selectedLesson?.id === lesson.id ? 'bg-[#2A2D34]' : ''
                              }`}
                            >
                              <span className="text-sm">{lesson.title}</span>
                              <span className="text-sm text-gray-400">{lesson.duration}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#1A1D24] rounded-lg p-6 sticky top-24">
                  {/* Course Progress Section */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Course Progress</h4>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <p className="text-sm text-gray-400">6 of 24 lessons completed</p>
                  </div>

                  {/* Course Resources */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Course Resources</h4>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Course Workbook
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Trading Templates
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Practice Exercises
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Course Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Course Features</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {course.learningPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </>
  );
} 