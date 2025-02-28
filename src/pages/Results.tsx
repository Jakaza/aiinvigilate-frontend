
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, FileText, BookOpen, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import GlassCard from '../components/ui-custom/GlassCard';
import Button from '../components/ui-custom/Button';
import { Progress } from "@/components/ui/progress";

// Define the types for our quiz questions
interface QuizQuestion {
  id: number;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// Define the test result type
interface TestResult {
  id: number;
  name: string;
  module: string;
  moduleFullName: string;
  score: number;
  maxScore: number;
  date: string;
  duration: string;
  questions: QuizQuestion[];
}

// Mock test results
const mockTestResults: TestResult[] = [
  { 
    id: 1, 
    name: "Introduction to Programming Final", 
    module: "CS101", 
    moduleFullName: "Introduction to Computer Science",
    score: 92, 
    maxScore: 100, 
    date: "2022-06-15",
    duration: "90 min",
    questions: [
      { id: 1, question: "What is a variable?", yourAnswer: "A named storage location in memory", correctAnswer: "A named storage location in memory", isCorrect: true },
      { id: 2, question: "What is a function?", yourAnswer: "A block of code that performs a specific task", correctAnswer: "A block of code that performs a specific task", isCorrect: true },
      { id: 3, question: "What does 'if' statement do?", yourAnswer: "Executes a block of code if a condition is true", correctAnswer: "Executes a block of code if a condition is true", isCorrect: true },
      { id: 4, question: "What is a loop?", yourAnswer: "Repeats a block of code until a condition is met", correctAnswer: "Repeats a block of code until a condition is met", isCorrect: true },
      { id: 5, question: "What is a compiler?", yourAnswer: "A program that converts code to machine language", correctAnswer: "A program that translates high-level code to machine code", isCorrect: false }
    ]
  },
  { 
    id: 2, 
    name: "Data Structures Midterm", 
    module: "CS202", 
    moduleFullName: "Data Structures and Algorithms",
    score: 85, 
    maxScore: 100, 
    date: "2023-03-22",
    duration: "120 min",
    questions: [
      { id: 1, question: "What is a linked list?", yourAnswer: "A sequence of elements where each points to the next", correctAnswer: "A sequence of elements where each points to the next", isCorrect: true },
      { id: 2, question: "What is stack data structure?", yourAnswer: "LIFO (Last In, First Out) data structure", correctAnswer: "LIFO (Last In, First Out) data structure", isCorrect: true },
      { id: 3, question: "What is a queue?", yourAnswer: "LIFO data structure", correctAnswer: "FIFO (First In, First Out) data structure", isCorrect: false },
      { id: 4, question: "What is Big O notation?", yourAnswer: "Describes algorithm efficiency as input size grows", correctAnswer: "Describes algorithm efficiency as input size grows", isCorrect: true },
      { id: 5, question: "What is a binary tree?", yourAnswer: "A tree data structure where each node has two children", correctAnswer: "A tree data structure where each node has at most two children", isCorrect: true }
    ]
  },
  { 
    id: 3, 
    name: "Algorithms Quiz", 
    module: "CS202", 
    moduleFullName: "Data Structures and Algorithms",
    score: 78, 
    maxScore: 100, 
    date: "2023-04-05",
    duration: "60 min",
    questions: [
      { id: 1, question: "What is the time complexity of binary search?", yourAnswer: "O(log n)", correctAnswer: "O(log n)", isCorrect: true },
      { id: 2, question: "What is a greedy algorithm?", yourAnswer: "Makes locally optimal choice at each stage", correctAnswer: "Makes locally optimal choice at each stage", isCorrect: true },
      { id: 3, question: "What is the worst case time complexity of quicksort?", yourAnswer: "O(n log n)", correctAnswer: "O(n²)", isCorrect: false },
      { id: 4, question: "What is dynamic programming?", yourAnswer: "Breaking problems into simpler subproblems", correctAnswer: "Breaking problems into simpler subproblems", isCorrect: true },
      { id: 5, question: "What is a divide and conquer algorithm?", yourAnswer: "Divides problem into smaller subproblems", correctAnswer: "Divides problem into smaller subproblems", isCorrect: true }
    ]
  },
  { 
    id: 4, 
    name: "Database Concepts", 
    module: "CS303", 
    moduleFullName: "Database Management Systems",
    score: 88, 
    maxScore: 100, 
    date: "2023-11-10",
    duration: "75 min",
    questions: [
      { id: 1, question: "What is a database?", yourAnswer: "A structured collection of data", correctAnswer: "A structured collection of data", isCorrect: true },
      { id: 2, question: "What is SQL?", yourAnswer: "Structured Query Language", correctAnswer: "Structured Query Language", isCorrect: true },
      { id: 3, question: "What is a primary key?", yourAnswer: "A field that uniquely identifies each record", correctAnswer: "A field that uniquely identifies each record", isCorrect: true },
      { id: 4, question: "What is normalization?", yourAnswer: "Process of organizing data to reduce redundancy", correctAnswer: "Process of organizing data to reduce redundancy", isCorrect: true },
      { id: 5, question: "What is a foreign key?", yourAnswer: "A key that refers to another table's key", correctAnswer: "A key that links to another table's primary key", isCorrect: false }
    ]
  },
  { 
    id: 5, 
    name: "Software Design Patterns Quiz", 
    module: "CS404", 
    moduleFullName: "Software Engineering",
    score: 75, 
    maxScore: 100, 
    date: "2024-05-10",
    duration: "45 min",
    questions: [
      { id: 1, question: "What is a design pattern?", yourAnswer: "Reusable solution to common problems", correctAnswer: "Reusable solution to common problems", isCorrect: true },
      { id: 2, question: "What is Singleton pattern?", yourAnswer: "Restricts instantiation of a class to one object", correctAnswer: "Restricts instantiation of a class to one object", isCorrect: true },
      { id: 3, question: "What is Factory pattern?", yourAnswer: "Creates objects without exposing creation logic", correctAnswer: "Creates objects without exposing creation logic", isCorrect: true },
      { id: 4, question: "What is Observer pattern?", yourAnswer: "Defines a dependency between objects", correctAnswer: "Defines a one-to-many dependency between objects", isCorrect: false },
      { id: 5, question: "What is MVC?", yourAnswer: "Model-View-Controller", correctAnswer: "Model-View-Controller", isCorrect: true }
    ]
  }
];

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  
  useEffect(() => {
    // Get test ID from URL query parameter
    const params = new URLSearchParams(location.search);
    const testId = params.get('test');
    
    if (testId) {
      const result = mockTestResults.find(r => r.id === parseInt(testId));
      if (result) {
        setTestResult(result);
      }
    }
  }, [location]);
  
  const getCorrectAnswersCount = (questions: QuizQuestion[] | undefined) => {
    if (!questions) return 0;
    return questions.filter(q => q.isCorrect).length;
  };
  
  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <Navbar />
      
      <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/student')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        {testResult ? (
          <div className="space-y-8">
            <GlassCard className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{testResult.name}</h1>
                  <p className="text-eduText-light flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {testResult.moduleFullName} ({testResult.module})
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-eduAccent mb-1">
                      {testResult.score}%
                    </div>
                    <p className="text-xs text-eduText-light">Your Score</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 text-eduAccent mr-2" />
                    <h3 className="font-medium">Date Taken</h3>
                  </div>
                  <p>{new Date(testResult.date).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-eduAccent mr-2" />
                    <h3 className="font-medium">Duration</h3>
                  </div>
                  <p>{testResult.duration}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 text-eduAccent mr-2" />
                    <h3 className="font-medium">Correct Answers</h3>
                  </div>
                  <p>{getCorrectAnswersCount(testResult.questions)}/{testResult.questions.length}</p>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-eduAccent" />
                    Performance Summary
                  </h3>
                  <Progress value={testResult.score} className="h-3 mb-2" />
                  <div className="flex justify-between text-sm text-eduText-light">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-eduAccent" />
                    Question Analysis
                  </h3>
                  
                  <div className="space-y-6">
                    {testResult.questions.map((question, index) => (
                      <div 
                        key={question.id} 
                        className={`border rounded-lg p-6 ${
                          question.isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'
                        }`}
                      >
                        <div className="flex justify-between mb-4">
                          <h4 className="font-medium text-lg">Question {index + 1}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {question.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="font-medium mb-2">{question.question}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">Your Answer:</p>
                            <p className={`p-2 rounded ${
                              question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {question.yourAnswer}
                            </p>
                          </div>
                          
                          {!question.isCorrect && (
                            <div>
                              <p className="text-sm font-medium mb-1">Correct Answer:</p>
                              <p className="p-2 rounded bg-green-100 text-green-800">
                                {question.correctAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        ) : (
          <GlassCard className="p-8 text-center">
            <FileText className="mx-auto h-16 w-16 text-eduText-light opacity-50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Test Result Not Found</h2>
            <p className="text-eduText-light mb-6">
              The test result you're looking for could not be found. Please return to your dashboard and try again.
            </p>
            <Button variant="primary" onClick={() => navigate('/student')}>
              Return to Dashboard
            </Button>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default Results;
