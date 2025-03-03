
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import GlassCard from '../components/ui-custom/GlassCard';
import RegisterForm from '@/components/register/RegisterForm';
import { Course, CourseResponse } from '@/components/register/RegisterFormSchema';

const Register = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await fetch('http://localhost:8800/api/course/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data: CourseResponse = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses', {
          description: 'Please try again later or contact support.',
        });
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <GlassCard className="p-8">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-eduAccent" />
              <h1 className="text-3xl font-bold ml-2">Create Account</h1>
            </div>
            
            <RegisterForm 
              courses={courses} 
              isLoadingCourses={isLoadingCourses} 
            />
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
