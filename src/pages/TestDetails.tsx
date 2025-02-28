
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AdminNavbar from '@/components/layout/AdminNavbar';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Test } from '@/components/student/types';
import { formatRemainingTime, getStatusClass } from '@/components/student/utils';

// Mock available tests
const mockAvailableTests: Test[] = [
  { id: 1, name: "Database Midterm Exam", module: "CS303", duration: "90 min", dueDate: "2024-05-20T14:30:00", status: "upcoming" },
  { id: 2, name: "Software Engineering Quiz", module: "CS404", duration: "30 min", dueDate: "2024-05-18T10:00:00", status: "upcoming" },
  { id: 3, name: "Database Management Lab Test", module: "CS303", duration: "60 min", dueDate: "2024-05-15T15:00:00", status: "pending" },
  { id: 4, name: "Software Design Patterns Quiz", module: "CS404", duration: "45 min", dueDate: "2024-05-10T11:30:00", status: "completed" },
];

const TestDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [test, setTest] = useState<Test | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'lecturer'>('student');
  
  useEffect(() => {
    // Get test ID from URL query parameter
    const params = new URLSearchParams(location.search);
    const testId = params.get('id');
    const role = params.get('role') as 'student' | 'lecturer' || 'student';
    
    setUserRole(role);
    
    if (testId) {
      const foundTest = mockAvailableTests.find(t => t.id === parseInt(testId));
      if (foundTest) {
        setTest(foundTest);
      }
    }
  }, [location]);

  const handleStartTest = () => {
    if (test) {
      navigate(`/exam?id=${test.id}`);
    }
  };
  
  const handleBack = () => {
    if (userRole === 'lecturer') {
      navigate('/lecturer');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-eduPrimary-light">
      {userRole === 'lecturer' ? (
        <AdminNavbar userRole="lecturer" userName="Lecturer User" />
      ) : (
        <Navbar />
      )}
      
      <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        {test ? (
          <GlassCard className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold">{test.name}</h1>
                  <span className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                </div>
                <p className="text-eduText-light mt-2">Module: {test.module}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-eduAccent mr-2" />
                  <h3 className="font-medium">Duration</h3>
                </div>
                <p>{test.duration}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-eduAccent mr-2" />
                  <h3 className="font-medium">Due Date</h3>
                </div>
                <p>{new Date(test.dueDate).toLocaleDateString()} at {new Date(test.dueDate).toLocaleTimeString()}</p>
                {test.status === "upcoming" && (
                  <p className="text-sm font-medium mt-1 text-orange-600">
                    Available in {formatRemainingTime(test.dueDate)}
                  </p>
                )}
              </div>
            </div>
            
            {userRole === 'student' && (
              <div className="flex justify-center">
                {test.status === "pending" && (
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleStartTest}
                  >
                    Start Test
                  </Button>
                )}
                
                {test.status === "upcoming" && (
                  <Button 
                    variant="secondary" 
                    size="lg"
                    disabled
                  >
                    Not Available Yet
                  </Button>
                )}
                
                {test.status === "completed" && (
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => navigate(`/results?test=${test.id}`)}
                  >
                    View Results
                  </Button>
                )}
              </div>
            )}
            
            {userRole === 'lecturer' && (
              <div className="flex justify-center gap-4">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate(`/lecturer/results?test=${test.id}`)}
                >
                  View Results
                </Button>
                
                <Button 
                  variant="primary"
                  onClick={() => navigate(`/lecturer?edit=${test.id}`)}
                >
                  Edit Test
                </Button>
              </div>
            )}
          </GlassCard>
        ) : (
          <GlassCard className="p-8 text-center">
            <FileText className="mx-auto h-16 w-16 text-eduText-light opacity-50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Test Not Found</h2>
            <p className="text-eduText-light mb-6">
              The test you're looking for could not be found. Please return to your dashboard and try again.
            </p>
            <Button variant="primary" onClick={handleBack}>
              Return to Dashboard
            </Button>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default TestDetails;
