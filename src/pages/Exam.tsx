
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import QuestionCard from '../components/exam/QuestionCard';
import GlassCard from '../components/ui-custom/GlassCard';
import Button from '../components/ui-custom/Button';
import { toast } from '@/components/ui/use-toast';

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

  // Calculate remaining time
  useEffect(() => {
    if (examStarted && !examComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
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
  }, [examStarted, examComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    toast({
      title: "Exam Started",
      description: "You have 30 minutes to complete the exam. Good luck!",
    });
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
      
      <div className="pt-28 pb-16 px-4">
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
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setTimeLeft(30 * 60);
                }}>
                  Take Another Exam
                </Button>
              </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
