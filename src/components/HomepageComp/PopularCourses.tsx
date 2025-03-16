import React, { useEffect } from "react";
import SectionHead from "../SectionHead/SectionHead";
import ButtonGroup from "../Button/ButtonGroup";
import { PaddedSectionStyle } from "@/styles/HomepageStyles/Section";
import { CoursesGroupStyle } from "@/styles/HeroStyles/coursesGroup";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { setFilteredByTimeCourses } from "@/redux/dataSlice";
import { CourseCard } from "../CourseCard/CourseCard";
import { convertToNaira } from "../Info/Wishlist";
import Link from "next/link";
import { motion } from "framer-motion";

const PopularCourses = () => {
  const { filtersByTime, filteredByTimeCourses, allCourses } = useAppSelector(
    (state: RootState) => state.data
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setFilteredByTimeCourses());
  }, [dispatch, allCourses]);

  const mainCourse = {
    name: "Cryptocurrency Master Course",
    description: "A beginner&apos;s guide to achieving profitable success in crypto trading through technical analysis and smart strategies",
    fullDescription: `Our beginner-friendly course, "Crypto Trading Success," is designed to guide you through the fundamentals of cryptocurrency trading, helping you develop the skills needed to navigate the dynamic and lucrative world of digital assets. Whether you're looking to start trading Bitcoin, Ethereum, or explore other altcoins, this course provides the essential knowledge to build a strong foundation.

The course is led by James Crypto Guru, a renowned crypto influencer with over 20 years of experience in both trading and investing. With his expert guidance, you'll learn the key strategies that successful traders use to make informed decisions and maximize their profitability. From technical and fundamental analysis to understanding risk management, James covers it all in an easy-to-follow, engaging way.

Throughout the course, you'll gain practical knowledge that you can apply right away. Learn how to read charts, use trading indicators, and recognize patterns that help predict price movements. You'll also understand the importance of discipline and how to create a personalized trading plan to avoid emotional decisions and minimize risks.`,
    level: "Beginner",
    requirements: "No prior knowledge of cryptocurrency or trading is required"
  };

  return (
    <div className="w-full">
      {/* Featured Course Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-b from-gray-50 to-white py-16"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {mainCourse.name}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {mainCourse.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Course Overview</h3>
                <p className="text-gray-600 leading-relaxed">
                  {mainCourse.fullDescription}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4">What You&apos;ll Learn</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#D4A64E] rounded-full mr-3"></span>
                    Technical Analysis Fundamentals
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#D4A64E] rounded-full mr-3"></span>
                    Chart Pattern Recognition
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#D4A64E] rounded-full mr-3"></span>
                    Risk Management Strategies
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#D4A64E] rounded-full mr-3"></span>
                    Trading Psychology
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4">Course Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500">Level</p>
                    <p className="text-lg font-medium">{mainCourse.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Requirements</p>
                    <p className="text-lg font-medium">{mainCourse.requirements}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
           {/* All Courses Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          
          <PaddedSectionStyle>
            <ButtonGroup filters={filtersByTime} />
            <CoursesGroupStyle>
              {filteredByTimeCourses?.map((ele, index) => (
                <CourseCard
                  key={index}
                  name={ele.name}
                  level={ele.level}
                  rating={ele.rating}
                  dollarPrice={ele.dollarPrice}
                  field={ele.field}
                  category={ele.category}
                  isLoved={ele.isLoved}
                  img={ele.img}
                  nairaPrice={convertToNaira(ele.dollarPrice)}
                  noEnrolled={ele.noEnrolled}
                  id={ele.id}
                  duration={ele.duration}
                  desc={ele.desc}
                  skills={ele.skills}
                  syllabus={ele.syllabus}
                  requirements={ele.requirements}
                  reviews={ele.reviews}
                  totalReviews={ele.totalReviews}
                  introVideo={ele.introVideo}
                />
              ))}
            </CoursesGroupStyle>
          </PaddedSectionStyle>
        </div>
      </div>
          <div className="text-center mb-16">
            <Link href="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D4A64E] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#c29543] transition-colors"
              >
                Start Learning Now
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

     
    </div>
  );
};

export default PopularCourses;
