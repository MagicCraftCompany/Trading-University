import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AllCourses, courseQuizzes, IQuizQuestion, ICourse } from '@/Constant/constant';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [course, setCourse] = useState<ICourse | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'quiz'>('overview');
  const [quizData, setQuizData] = useState<IQuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Find course and quiz data when ID changes
  useEffect(() => {
    if (id) {
      const courseId = Number(id);
      const foundCourse = AllCourses.find(c => c.id === courseId);
      const courseQuiz = courseQuizzes[courseId] || [];
      
      if (foundCourse) {
        setCourse(foundCourse);
        setQuizData(courseQuiz);
        setUserAnswers(new Array(courseQuiz.length).fill(-1));
      } else {
        router.push('/courses');
      }
    }
  }, [id, router]);
  
  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (quizSubmitted) return;
    
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };
  
  // Handle quiz submission
  const handleQuizSubmit = () => {
    if (quizSubmitted) return;
    
    // Calculate score
    let correctAnswers = 0;
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / quizData.length) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);
  };
  
  // Reset quiz
  const resetQuiz = () => {
    setUserAnswers(new Array(quizData.length).fill(-1));
    setQuizSubmitted(false);
    setScore(0);
  };
  
  if (!course) {
    return (
      <div className="min-h-screen bg-[#0A1114] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CB9006]"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{course.name} | Trading University</title>
        <meta name="description" content={course.desc} />
      </Head>
      
      {/* Hero Section */}
      <section className="bg-[#061213] text-white pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Details */}
            <div className="lg:w-7/12">
              <div className="flex items-center gap-2 mb-3">
                <Link href="/courses">
                  <span className="text-gray-400 hover:text-[#CB9006] transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Courses
                  </span>
                </Link>
                <span className="text-gray-600">/</span>
                <span className="text-[#CB9006]">{course.name}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              
              <p className="text-gray-300 mb-6">{course.desc}</p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-[#0A1114]/80 px-3 py-2 rounded-lg border border-[#1A1D24]/30">
                  <span className="text-sm text-gray-400">Level</span>
                  <p className="font-medium text-white">{course.level}</p>
                </div>
                
                <div className="bg-[#0A1114]/80 px-3 py-2 rounded-lg border border-[#1A1D24]/30">
                  <span className="text-sm text-gray-400">Duration</span>
                  <p className="font-medium text-white">{course.duration} weeks</p>
                </div>
                
                <div className="bg-[#0A1114]/80 px-3 py-2 rounded-lg border border-[#1A1D24]/30">
                  <span className="text-sm text-gray-400">Students</span>
                  <p className="font-medium text-white">{course.noEnrolled}+ enrolled</p>
                </div>
                
                <div className="bg-[#0A1114]/80 px-3 py-2 rounded-lg border border-[#1A1D24]/30">
                  <span className="text-sm text-gray-400">Rating</span>
                  <p className="font-medium text-white flex items-center">
                    <svg className="w-4 h-4 text-[#CB9006] mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {course.rating}/5.0
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {course.skills.map((skill, index) => (
                  <span key={index} className="bg-[#0A1114]/50 text-white text-xs px-3 py-1.5 rounded-full border border-[#1A1D24]/30">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4 mb-8">
              
                
                <button className="px-6 py-3 bg-transparent text-white rounded-lg font-medium border border-[#1A1D24]/70 hover:border-[#CB9006]/70 transition-colors flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save Course
                </button>
              </div>
            </div>
            
            {/* Course Video */}
            <div className="lg:w-5/12 rounded-xl overflow-hidden border border-[#1A1D24]/30 relative">
              {course.introVideo}
            </div>
          </div>
        </div>
      </section>
      
      {/* Course Content */}
      <section className="bg-[#0A1114] py-12">
        <div className="container mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#1A1D24]/30 mb-8">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview' ? 'text-[#CB9006] border-b-2 border-[#CB9006]' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Overview
            </button>
            
            <button 
              onClick={() => setActiveTab('syllabus')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'syllabus' ? 'text-[#CB9006] border-b-2 border-[#CB9006]' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Syllabus
            </button>
            
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'quiz' ? 'text-[#CB9006] border-b-2 border-[#CB9006]' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Quiz
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="text-white">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Course Details</h2>
                  <p className="text-gray-300 leading-relaxed mb-6">{course.desc}</p>
                  
                  <div className="bg-[#061213] border border-[#1A1D24]/30 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">What You'll Learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.skills.map((skill, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-[#CB9006] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-300">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-[#061213] border border-[#1A1D24]/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-[#CB9006] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                  <div className="space-y-6">
                    {course.reviews.map((review, index) => (
                      <div key={index} className="bg-[#061213] border border-[#1A1D24]/30 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                            <Image src={review.img} alt={review.name} width={48} height={48} className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold">{review.name}</h4>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-400">{review.post}</span>
                              <span className="mx-2 text-gray-600">•</span>
                              <span className="text-sm text-gray-400">{review.daysAgo} {review.daysAgo === 1 ? 'day' : 'days'} ago</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.review}</p>
                        <div className="mt-4 flex items-center">
                          <button className="flex items-center text-gray-400 hover:text-[#CB9006]">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {review.likes}
                          </button>
                          <button className="flex items-center text-gray-400 hover:text-[#CB9006] ml-4">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            {review.comments}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Syllabus Tab */}
            {activeTab === 'syllabus' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Syllabus</h2>
                <div className="space-y-4">
                  {course.syllabus.map((section, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#061213] border border-[#1A1D24]/30 rounded-xl overflow-hidden"
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#0A1114] flex items-center justify-center text-[#CB9006] font-bold mr-3">
                            {section.number}
                          </div>
                          <h3 className="font-bold">{section.title}</h3>
                        </div>
                      </div>
                      <div className="border-t border-[#1A1D24]/30 p-4 bg-[#071415]">
                        <ul className="space-y-2">
                          {section.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-start">
                              <svg className="w-5 h-5 text-[#CB9006] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-300">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Quiz</h2>
                
                {quizData.length > 0 ? (
                  <div className="bg-[#061213] border border-[#1A1D24]/30 rounded-xl p-6">
                    {quizSubmitted && (
                      <div className={`mb-6 p-4 rounded-lg ${score >= 70 ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                        <h3 className="font-bold text-xl mb-2">Your Score: {score}%</h3>
                        <p className="text-gray-300">
                          {score >= 70 
                            ? `Congratulations! You've passed the quiz.` 
                            : `You need to score at least 70% to pass the quiz. Try again!`}
                        </p>
                        <button 
                          onClick={resetQuiz}
                          className="mt-4 px-4 py-2 bg-[#CB9006] text-white rounded-lg hover:bg-[#BA8405] transition-colors"
                        >
                          Retake Quiz
                        </button>
                      </div>
                    )}
                    
                    <form onSubmit={(e) => { e.preventDefault(); handleQuizSubmit(); }}>
                      {quizData.map((question, qIndex) => (
                        <div key={qIndex} className={`mb-8 ${qIndex < quizData.length - 1 ? 'border-b border-[#1A1D24]/30 pb-6' : ''}`}>
                          <h3 className="font-bold text-lg mb-4">
                            {qIndex + 1}. {question.question}
                          </h3>
                          <div className="space-y-3">
                            {question.options.map((option, oIndex) => (
                              <div 
                                key={oIndex} 
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  userAnswers[qIndex] === oIndex
                                    ? 'border-[#CB9006] bg-[#CB9006]/10'
                                    : 'border-[#1A1D24]/30 hover:border-[#CB9006]/50'
                                } ${
                                  quizSubmitted && oIndex === question.correctAnswer
                                    ? 'border-green-500 bg-green-500/10'
                                    : quizSubmitted && userAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer
                                    ? 'border-red-500 bg-red-500/10'
                                    : ''
                                }`}
                                onClick={() => handleAnswerSelect(qIndex, oIndex)}
                              >
                                <div className="flex items-center">
                                  <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                                    userAnswers[qIndex] === oIndex
                                      ? 'border-[#CB9006]'
                                      : 'border-gray-500'
                                  }`}>
                                    {userAnswers[qIndex] === oIndex && (
                                      <div className="w-3 h-3 rounded-full bg-[#CB9006]"></div>
                                    )}
                                  </div>
                                  <span>{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {quizSubmitted && (
                            <div className="mt-4 text-sm">
                              {userAnswers[qIndex] === question.correctAnswer ? (
                                <p className="text-green-500">Correct!</p>
                              ) : (
                                <p className="text-red-500">
                                  Incorrect. The correct answer is: {question.options[question.correctAnswer]}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {!quizSubmitted && (
                        <button 
                          type="submit"
                          className="px-6 py-3 bg-[#CB9006] text-white rounded-lg font-medium hover:bg-[#BA8405] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={userAnswers.includes(-1)}
                        >
                          Submit Quiz
                        </button>
                      )}
                    </form>
                  </div>
                ) : (
                  <div className="bg-[#061213] border border-[#1A1D24]/30 rounded-xl p-6 text-center">
                    <p className="text-gray-400">This course doesn't have a quiz yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
