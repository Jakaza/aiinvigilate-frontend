
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Award, FileText, BookOpen, ArrowLeft, Calendar, Clock, Download } from 'lucide-react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock student submissions
interface StudentSubmission {
  id: number;
  studentId: string;
  studentName: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  timeSpent: string;
  status: "completed" | "in-progress" | "not-started";
}

// Mock test data
interface TestData {
  id: number;
  name: string;
  module: string;
  moduleFullName: string;
  dueDate: string;
  duration: string;
  totalSubmissions: number;
  avgScore: number;
  maxScore: number;
  submissions: StudentSubmission[];
}

const mockTestData: TestData = {
  id: 1,
  name: "Database Management Systems Midterm",
  module: "CS303",
  moduleFullName: "Database Management Systems",
  dueDate: "2024-05-15",
  duration: "90 min",
  totalSubmissions: 28,
  avgScore: 78,
  maxScore: 100,
  submissions: [
    { id: 1, studentId: "S12345", studentName: "John Doe", score: 92, maxScore: 100, submittedAt: "2024-05-10T10:45:00", timeSpent: "65 min", status: "completed" },
    { id: 2, studentId: "S12346", studentName: "Jane Smith", score: 85, maxScore: 100, submittedAt: "2024-05-10T11:30:00", timeSpent: "75 min", status: "completed" },
    { id: 3, studentId: "S12347", studentName: "Bob Johnson", score: 78, maxScore: 100, submittedAt: "2024-05-11T09:20:00", timeSpent: "80 min", status: "completed" },
    { id: 4, studentId: "S12348", studentName: "Alice Brown", score: 90, maxScore: 100, submittedAt: "2024-05-10T14:15:00", timeSpent: "72 min", status: "completed" },
    { id: 5, studentId: "S12349", studentName: "Charlie Wilson", score: 65, maxScore: 100, submittedAt: "2024-05-11T15:40:00", timeSpent: "88 min", status: "completed" },
    { id: 6, studentId: "S12350", studentName: "Diana Miller", score: 0, maxScore: 100, submittedAt: "", timeSpent: "", status: "not-started" },
    { id: 7, studentId: "S12351", studentName: "Ethan Davis", score: 73, maxScore: 100, submittedAt: "2024-05-10T16:25:00", timeSpent: "83 min", status: "completed" },
    { id: 8, studentId: "S12352", studentName: "Fiona Clark", score: 0, maxScore: 100, submittedAt: "2024-05-11T10:10:00", timeSpent: "25 min", status: "in-progress" },
  ]
};

const LecturerTestResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StudentSubmission;
    direction: 'ascending' | 'descending';
  } | null>(null);
  
  useEffect(() => {
    // Get test ID from URL query parameter
    const params = new URLSearchParams(location.search);
    const testId = params.get('test');
    
    if (testId && parseInt(testId) === mockTestData.id) {
      setTestData(mockTestData);
    }
  }, [location]);
  
  const handleSort = (key: keyof StudentSubmission) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  const sortedSubmissions = React.useMemo(() => {
    if (!testData || !sortConfig) {
      return testData?.submissions;
    }
    
    return [...testData.submissions].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [testData, sortConfig]);
  
  const getSortIcon = (key: keyof StudentSubmission) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };
  
  const getStatusClass = (status: StudentSubmission['status']) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getScoreDistribution = () => {
    if (!testData) return { excellent: 0, good: 0, average: 0, below: 0, notStarted: 0 };
    
    const completed = testData.submissions.filter(s => s.status === "completed");
    const excellent = completed.filter(s => s.score >= 90).length;
    const good = completed.filter(s => s.score >= 75 && s.score < 90).length;
    const average = completed.filter(s => s.score >= 60 && s.score < 75).length;
    const below = completed.filter(s => s.score < 60 && s.status === "completed").length;
    const notStarted = testData.submissions.filter(s => s.status !== "completed").length;
    
    return { excellent, good, average, below, notStarted };
  };
  
  const distribution = getScoreDistribution();
  
  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <AdminNavbar userRole="lecturer" userName="Lecturer User" />
      
      <div className="container mx-auto max-w-7xl py-12 px-4 md:px-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/lecturer/reports')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Button>
        
        {testData ? (
          <div className="space-y-8">
            <GlassCard className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{testData.name}</h1>
                  <p className="text-eduText-light flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {testData.moduleFullName} ({testData.module})
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4 md:mt-0"
                  onClick={() => {
                    // In a real app, this would download a CSV or Excel file
                    alert('Downloading results...');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 text-eduAccent mr-2" />
                    <h3 className="font-medium">Due Date</h3>
                  </div>
                  <p>{new Date(testData.dueDate).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-eduAccent mr-2" />
                    <h3 className="font-medium">Duration</h3>
                  </div>
                  <p>{testData.duration}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 text-eduAccent mr-2" />
                    <h3 className="font-medium">Average Score</h3>
                  </div>
                  <p>{testData.avgScore}%</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <FileText className="h-4 w-4 text-eduAccent mr-2" />
                    <h3 className="font-medium">Submissions</h3>
                  </div>
                  <p>{testData.submissions.filter(s => s.status === "completed").length}/{testData.totalSubmissions}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Score Distribution</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Excellent (90-100%)</span>
                          <span>{distribution.excellent} students</span>
                        </div>
                        <Progress value={(distribution.excellent / testData.totalSubmissions) * 100} className="h-2 bg-gray-200" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Good (75-89%)</span>
                          <span>{distribution.good} students</span>
                        </div>
                        <Progress value={(distribution.good / testData.totalSubmissions) * 100} className="h-2 bg-gray-200" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Average (60-74%)</span>
                          <span>{distribution.average} students</span>
                        </div>
                        <Progress value={(distribution.average / testData.totalSubmissions) * 100} className="h-2 bg-gray-200" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Below Average (<60%)</span>
                          <span>{distribution.below} students</span>
                        </div>
                        <Progress value={(distribution.below / testData.totalSubmissions) * 100} className="h-2 bg-gray-200" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Not Started/In Progress</span>
                          <span>{distribution.notStarted} students</span>
                        </div>
                        <Progress value={(distribution.notStarted / testData.totalSubmissions) * 100} className="h-2 bg-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-4">Test Summary</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm h-full">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-eduAccent mb-4">
                          {testData.avgScore}%
                        </div>
                        <p className="text-eduText-light">Class Average</p>
                        <div className="flex justify-center mt-4 space-x-8">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {testData.submissions.filter(s => s.score >= testData.avgScore).length}
                            </div>
                            <p className="text-sm text-eduText-light">Above Average</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-500">
                              {testData.submissions.filter(s => s.score < testData.avgScore && s.status === "completed").length}
                            </div>
                            <p className="text-sm text-eduText-light">Below Average</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Student Submissions</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('studentId')}
                        >
                          Student ID {getSortIcon('studentId')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('studentName')}
                        >
                          Name {getSortIcon('studentName')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer text-center"
                          onClick={() => handleSort('score')}
                        >
                          Score {getSortIcon('score')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('submittedAt')}
                        >
                          Submitted {getSortIcon('submittedAt')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort('timeSpent')}
                        >
                          Time Spent {getSortIcon('timeSpent')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer text-center"
                          onClick={() => handleSort('status')}
                        >
                          Status {getSortIcon('status')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedSubmissions?.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.studentId}</TableCell>
                          <TableCell>{submission.studentName}</TableCell>
                          <TableCell className="text-center">
                            {submission.status === "completed" ? (
                              <span className="font-bold">{submission.score}%</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {submission.submittedAt ? (
                              new Date(submission.submittedAt).toLocaleString()
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {submission.timeSpent || <span className="text-gray-400">-</span>}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(submission.status)}`}>
                              {submission.status === "completed" 
                                ? "Completed" 
                                : submission.status === "in-progress" 
                                  ? "In Progress" 
                                  : "Not Started"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </GlassCard>
          </div>
        ) : (
          <GlassCard className="p-8 text-center">
            <FileText className="mx-auto h-16 w-16 text-eduText-light opacity-50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Test Result Not Found</h2>
            <p className="text-eduText-light mb-6">
              The test result you're looking for could not be found. Please return to the reports dashboard and try again.
            </p>
            <Button variant="primary" onClick={() => navigate('/lecturer/reports')}>
              Return to Reports
            </Button>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default LecturerTestResults;
