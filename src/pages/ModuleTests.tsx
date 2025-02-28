
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, FileText, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Module, Test } from '@/components/student/types';
import { formatRemainingTime, getStatusClass } from '@/components/student/utils';

// Mock modules
const mockModules: Module[] = [
  { code: "CS101", name: "Introduction to Computer Science", credits: 15, grade: "A", completionStatus: "completed" },
  { code: "CS202", name: "Data Structures and Algorithms", credits: 20, grade: "B+", completionStatus: "completed" },
  { code: "CS303", name: "Database Management Systems", credits: 15, grade: "A-", completionStatus: "in-progress" },
  { code: "CS404", name: "Software Engineering", credits: 20, grade: "TBD", completionStatus: "in-progress" },
  { code: "CS505", name: "Web Development", credits: 15, grade: "TBD", completionStatus: "upcoming" },
  { code: "CS606", name: "Artificial Intelligence", credits: 20, grade: "TBD", completionStatus: "upcoming" },
];

// Mock available tests
const mockAvailableTests: Test[] = [
  { id: 1, name: "Database Midterm Exam", module: "CS303", duration: "90 min", dueDate: "2024-05-20T14:30:00", status: "upcoming" },
  { id: 2, name: "Software Engineering Quiz", module: "CS404", duration: "30 min", dueDate: "2024-05-18T10:00:00", status: "upcoming" },
  { id: 3, name: "Database Management Lab Test", module: "CS303", duration: "60 min", dueDate: "2024-05-15T15:00:00", status: "pending" },
  { id: 4, name: "Software Design Patterns Quiz", module: "CS404", duration: "45 min", dueDate: "2024-05-10T11:30:00", status: "completed" },
  { id: 5, name: "Introduction to Programming Final", module: "CS101", duration: "120 min", dueDate: "2022-06-15T09:00:00", status: "completed" },
  { id: 6, name: "Data Structures Midterm", module: "CS202", duration: "90 min", dueDate: "2022-03-22T13:30:00", status: "completed" },
  { id: 7, name: "Algorithms Quiz", module: "CS202", duration: "60 min", dueDate: "2022-04-05T10:45:00", status: "completed" },
];

const ModuleTests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [moduleCode, setModuleCode] = useState<string | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [moduleTests, setModuleTests] = useState<Test[]>([]);
  
  useEffect(() => {
    // Get module code from URL query parameter
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      setModuleCode(code);
      const foundModule = mockModules.find(m => m.code === code);
      if (foundModule) {
        setModule(foundModule);
        const tests = mockAvailableTests.filter(t => t.module === code);
        setModuleTests(tests);
      }
    }
  }, [location]);
  
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
        
        {module ? (
          <div className="space-y-8">
            <GlassCard className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{module.name}</h1>
                  <p className="text-eduText-light flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Module Code: {module.code}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(module.completionStatus)}`}>
                      {module.completionStatus === "in-progress" 
                        ? "In Progress" 
                        : module.completionStatus.charAt(0).toUpperCase() + module.completionStatus.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Grade:</span>
                    <span className="font-bold">{module.grade}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-eduAccent" />
                  Tests for this Module
                </h2>
                
                {moduleTests.length > 0 ? (
                  <div className="space-y-6">
                    {moduleTests.map((test) => (
                      <div key={test.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-lg">{test.name}</h3>
                              <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-eduText-light mt-1">Duration: {test.duration}</p>
                            <p className="text-eduText-light mt-1">
                              Due: {new Date(test.dueDate).toLocaleDateString()} at {new Date(test.dueDate).toLocaleTimeString()}
                            </p>
                            
                            {test.status === "upcoming" && (
                              <p className="text-sm font-medium mt-2 text-orange-600">
                                Available in {formatRemainingTime(test.dueDate)}
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-4 md:mt-0">
                            {test.status === "pending" && (
                              <Button
                                variant="primary"
                                to={`/exam?id=${test.id}`}
                              >
                                Start Test
                              </Button>
                            )}
                            
                            {test.status === "upcoming" && (
                              <Button
                                variant="secondary"
                                to={`/test-details?id=${test.id}&role=student`}
                              >
                                View Details
                              </Button>
                            )}
                            
                            {test.status === "completed" && (
                              <Button
                                variant="secondary"
                                to={`/results?test=${test.id}`}
                              >
                                View Results
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No Tests Found</h3>
                    <p className="mt-2 text-eduText-light">
                      There are no tests available for this module at the moment.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        ) : (
          <GlassCard className="p-8 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-eduText-light opacity-50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Module Not Found</h2>
            <p className="text-eduText-light mb-6">
              The module you're looking for could not be found. Please return to your dashboard and try again.
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

export default ModuleTests;
