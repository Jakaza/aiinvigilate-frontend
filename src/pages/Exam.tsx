
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import QuestionCard from '../components/exam/QuestionCard';
import GlassCard from '../components/ui-custom/GlassCard';
import Button from '../components/ui-custom/Button';
import { toast } from '@/components/ui/use-toast';
import PhotoVerification from '@/components/exam/PhotoVerification';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Mock data for the exam
const mockQuestions = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: [
      { id: "a", text: "London" },
      { id: "b", text: "Berlin" },
      { id: "c", text: "Paris" },
      { id: "d", text: "Madrid" }
    ]
  },
  {
    id: 2,
    text: "Which of the following is a prime number?",
    options: [
      { id: "a", text: "4" },
      { id: "b", text: "7" },
      { id: "c", text: "9" },
      { id: "d", text: "15" }
    ]
  },
  {
    id: 3,
    text: "In which year did World War II end?",
    options: [
      { id: "a", text: "1943" },
      { id: "b", text: "1945" },
      { id: "c", text: "1947" },
      { id: "d", text: "1950" }
    ]
  },
  {
    id: 4,
    text: "Which planet is known as the Red Planet?",
    options: [
      { id: "a", text: "Venus" },
      { id: "b", text: "Mars" },
      { id: "c", text: "Jupiter" },
      { id: "d", text: "Saturn" }
    ]
  },
  {
    id: 5,
    text: "Which element has the chemical symbol 'O'?",
    options: [
      { id: "a", text: "Osmium" },
      { id: "b", text: "Oxygen" },
      { id: "c", text: "Oganesson" },
      { id: "d", text: "Polonium" }
    ]
  }
];

const Exam = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [examComplete, setExamComplete] = useState(false);
  const [score, setScore] = useState(0);
  
  // Photo verification states
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationImages, setVerificationImages] = useState<{
    selfie: string | null;
    environment: string | null;
    verificationTimes: string[];
  }>({
    selfie: null,
    environment: null,
    verificationTimes: []
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [nextVerificationTime, setNextVerificationTime] = useState(0);

  // Calculate remaining time and handle periodic verification
  useEffect(() => {
    if (examStarted && !examComplete && verificationComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Check if it's time for verification
          if (nextVerificationTime > 0 && prevTime <= nextVerificationTime) {
            triggerVerification();
          }
          
          if (prevTime <= 1) {
            clearInterval(timer);
            handleExamComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [examStarted, examComplete, verificationComplete, nextVerificationTime]);

  // Set up periodic verification after exam starts
  useEffect(() => {
    if (examStarted && verificationComplete && !examComplete) {
      // Schedule first verification after 5 minutes (300 seconds)
      const firstVerificationAt = timeLeft - 300;
      setNextVerificationTime(firstVerificationAt);
    }
  }, [examStarted, verificationComplete, examComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleVerificationComplete = (images: { selfie: string; environment: string }) => {
    const now = new Date().toISOString();
    
    setVerificationImages({
      selfie: images.selfie,
      environment: images.environment,
      verificationTimes: [...verificationImages.verificationTimes, now]
    });
    
    setVerificationComplete(true);
    
    toast({
      title: "Verification Successful",
      description: "Your identity has been verified. You may now begin the exam.",
    });
  };

  const triggerVerification = () => {
    setShowVerificationModal(true);
    // Pause the timer while verification is in progress
    // This is handled by the useEffect that runs the timer
  };

  const handleVerificationDuringExam = () => {
    const now = new Date().toISOString();
    
    setVerificationImages(prev => ({
      ...prev,
      verificationTimes: [...prev.verificationTimes, now]
    }));
    
    setShowVerificationModal(false);
    
    // Schedule next verification after 7-10 minutes (random)
    const nextVerification = Math.floor(Math.random() * (600 - 420 + 1) + 420); // 7-10 minutes in seconds
    const nextVerificationAt = timeLeft - nextVerification;
    setNextVerificationTime(nextVerificationAt > 0 ? nextVerificationAt : 0);
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleExamComplete();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswer = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleExamComplete = () => {
    setExamComplete(true);
    
    // Calculate score - in a real app, this would compare with correct answers
    // For now, let's just count how many questions were answered
    const answeredCount = Object.keys(answers).length;
    const correctAnswers = calculateCorrectAnswers();
    setScore(correctAnswers);
    
    toast({
      title: "Exam Completed",
      description: `You've completed the exam with a score of ${correctAnswers}/${mockQuestions.length}.`,
    });
  };

  // Mock function to calculate correct answers
  const calculateCorrectAnswers = () => {
    // For this demo, we'll use hardcoded correct answers
    const correctAnswerMap: Record<number, string> = {
      1: "c", // Paris
      2: "b", // 7
      3: "b", // 1945
      4: "b", // Mars
      5: "b", // Oxygen
    };
    
    let correct = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      const qId = parseInt(questionId);
      if (correctAnswerMap[qId] === answer) {
        correct++;
      }
    });
    
    return correct;
  };

  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 md:px-8">
        {!examStarted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-8">
              <h1 className="text-3xl font-bold mb-6 text-center">General Knowledge Exam</h1>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-eduAccent mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Duration</h3>
                    <p className="text-eduText-light">30 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageCircle className="w-5 h-5 text-eduAccent mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Format</h3>
                    <p className="text-eduText-light">5 multiple-choice questions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-eduAccent mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Instructions</h3>
                    <ul className="text-eduText-light list-disc pl-5 space-y-2">
                      <li>Read each question carefully before answering.</li>
                      <li>You can navigate between questions using the Previous and Next buttons.</li>
                      <li>Your progress is automatically saved.</li>
                      <li>Submit your exam once you have completed all questions.</li>
                      <li><strong>You must complete an identity verification before starting.</strong></li>
                      <li><strong>Random verification checks may occur during the exam.</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  variant="primary"
                  onClick={handleStartExam}
                >
                  Start Exam
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ) : examComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-8">
              <h1 className="text-3xl font-bold mb-6 text-center">Exam Complete</h1>
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-eduAccent/10 text-eduAccent mb-4">
                  <span className="text-2xl font-bold">{score}/{mockQuestions.length}</span>
                </div>
                <h2 className="text-xl font-medium mb-2">Your Score</h2>
                <p className="text-eduText-light">
                  {score === mockQuestions.length 
                    ? "Perfect! You've answered all questions correctly."
                    : score > mockQuestions.length / 2
                    ? "Good job! You've passed the exam."
                    : "Keep practicing. You can do better next time."}
                </p>
              </div>
              
              <div className="bg-eduPrimary rounded-lg p-6 mb-8">
                <h3 className="font-medium mb-4">Question Summary</h3>
                {mockQuestions.map((question, index) => {
                  const isAnswered = answers[question.id] !== undefined;
                  const isCorrect = answers[question.id] === "b" || question.id === 1 && answers[question.id] === "c";
                  
                  return (
                    <div key={question.id} className="flex items-center py-2 border-b border-eduPrimary-dark last:border-0">
                      <span className="w-8 text-eduText-light">Q{index + 1}.</span>
                      <span className="flex-grow truncate">{question.text.substring(0, 30)}...</span>
                      <span className={`px-2 py-1 text-xs rounded ${isAnswered 
                        ? isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'}`}>
                        {isAnswered 
                          ? isCorrect 
                            ? 'Correct' 
                            : 'Incorrect'
                          : 'Unanswered'}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button variant="secondary" to="/">
                  Back to Home
                </Button>
                <Button variant="primary" onClick={() => {
                  setExamStarted(false);
                  setExamComplete(false);
                  setVerificationComplete(false);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setTimeLeft(30 * 60);
                  setVerificationImages({
                    selfie: null,
                    environment: null,
                    verificationTimes: []
                  });
                }}>
                  Take Another Exam
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ) : !verificationComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-8">
              <h1 className="text-3xl font-bold mb-6 text-center">Identity Verification Required</h1>
              <PhotoVerification onComplete={handleVerificationComplete} />
            </GlassCard>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">General Knowledge Exam</h1>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-soft flex items-center">
                <Clock className="w-4 h-4 text-eduAccent mr-2" />
                <span className={`font-medium ${timeLeft < 300 ? 'text-red-500' : ''}`}>
                  Time Remaining: {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            <QuestionCard
              question={mockQuestions[currentQuestionIndex]}
              totalQuestions={mockQuestions.length}
              currentIndex={currentQuestionIndex}
              onNext={handleNext}
              onPrev={handlePrev}
              onAnswer={handleAnswer}
              selectedAnswer={answers[mockQuestions[currentQuestionIndex].id]}
            />
            
            <div className="mt-8 flex justify-center">
              <GlassCard className="py-3 px-6 inline-flex items-center">
                <span className="text-sm text-eduText-light mr-4">Question Navigation:</span>
                <div className="flex space-x-2">
                  {mockQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all ${
                        index === currentQuestionIndex
                          ? 'bg-eduAccent text-white'
                          : answers[mockQuestions[index].id]
                          ? 'bg-eduAccent/20 text-eduAccent'
                          : 'bg-white text-eduText hover:bg-eduPrimary-dark'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
            
            {/* Periodic Verification Modal */}
            <Dialog open={showVerificationModal} onOpenChange={(open) => {
              // Prevent closing by clicking outside
              if (!open && showVerificationModal) {
                return;
              }
              setShowVerificationModal(open);
            }}>
              <DialogContent className="sm:max-w-md">
                <div className="py-4">
                  <h2 className="text-xl font-bold mb-4 text-center">Random Verification Check</h2>
                  <p className="mb-6 text-center">
                    This is a routine verification check to ensure academic integrity.
                    Please complete the verification to continue your exam.
                  </p>
                  <PhotoVerification 
                    onComplete={handleVerificationComplete}
                    isVerificationTime={true}
                    onVerificationComplete={handleVerificationDuringExam}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
