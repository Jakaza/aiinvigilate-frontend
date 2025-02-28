
// Define shared types used across student components

export interface Student {
  id: number;
  idNumber: string;
  name: string;
  surname: string;
  email: string;
  profileImage: string;
  role: string;
  program: string;
  year: number;
  enrollmentDate: string;
}

export interface Module {
  code: string;
  name: string;
  credits: number;
  grade: string;
  completionStatus: "completed" | "in-progress" | "upcoming";
}

export interface Test {
  id: number;
  name: string;
  module: string;
  moduleId?: string; // Added moduleId
  duration: string;
  dueDate: string;
  status: "upcoming" | "pending" | "completed";
}

export interface TestResult {
  id: number;
  name: string;
  module: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface QuestionDetail {
  id: number;
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  profileImage: string;
}
