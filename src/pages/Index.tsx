
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import GlassCard from '../components/ui-custom/GlassCard';
import Button from '../components/ui-custom/Button';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <GlassCard className="p-6 h-full">
    <div className="flex items-start">
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-eduAccent/10 text-eduAccent mb-4">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-eduText-light">{description}</p>
  </GlassCard>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-eduPrimary-light to-white z-0" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-eduAccent/5 rounded-bl-[100px] z-0" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-eduAccent/10 text-eduAccent text-sm font-medium mb-4">
                Educational Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master Your Knowledge with EduExam
              </h1>
              <p className="text-xl text-eduText-light mb-8">
                An elegant platform designed to help you assess your knowledge through carefully crafted examinations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  variant="primary"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  onClick={() => navigate('/exam')}
                >
                  Start an Exam
                </Button>
                <Button size="lg" variant="secondary">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <GlassCard className="p-2 shadow-medium overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                alt="Student taking an exam"
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
              />
            </GlassCard>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-eduPrimary-light">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose EduExam?</h2>
            <p className="text-eduText-light">
              Our platform offers a seamless experience for students and educators alike, with features designed to enhance the examination process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<BookOpen className="w-6 h-6" />}
                title="Comprehensive Question Bank"
                description="Access thousands of professionally crafted questions across various subjects and difficulty levels."
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Clock className="w-6 h-6" />}
                title="Timed Examinations"
                description="Practice under real exam conditions with customizable timers and automatic submission."
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={<Award className="w-6 h-6" />}
                title="Detailed Analysis"
                description="Receive comprehensive performance reports with insights on strengths and areas for improvement."
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-eduPrimary to-eduPrimary-dark z-0" />
        <div className="container relative z-10">
          <GlassCard className="max-w-4xl mx-auto p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Test Your Knowledge?</h2>
            <p className="text-eduText-light mb-8 max-w-2xl mx-auto">
              Start your examination journey today and take the first step towards academic excellence.
            </p>
            <Button
              size="lg"
              variant="primary"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => navigate('/exam')}
            >
              Begin Your Exam
            </Button>
          </GlassCard>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-white border-t border-eduPrimary-dark">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-eduAccent" />
              <span className="ml-2 text-lg font-display font-semibold">EduExam</span>
            </div>
            <div className="text-sm text-eduText-light">
              © {new Date().getFullYear()} EduExam. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
