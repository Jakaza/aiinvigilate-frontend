
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, User, FileText, Calendar, GraduationCap, Award, Check, AlarmClock } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AdminNavbar from '@/components/layout/AdminNavbar';

// Mock user data
const studentUser = {
  id: 1,
  idNumber: "STU001",
  name: "John",
  surname: "Doe",
  email: "john.doe@example.com",
  profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&auto=format&fit=crop",
  role: "student",
  program: "Bachelor of Computer Science",
  year: 2,
  enrollmentDate: "2022-02-15",
};

// Mock modules
const mockModules = [
  { code: "CS101", name: "Introduction to Computer Science", credits: 15, grade: "A", completionStatus: "completed" },
  { code: "CS202", name: "Data Structures and Algorithms", credits: 20, grade: "B+", completionStatus: "completed" },
  { code: "CS303", name: "Database Management Systems", credits: 15, grade: "A-", completionStatus: "in-progress" },
  { code: "CS404", name: "Software Engineering", credits: 20, grade: "TBD", completionStatus: "in-progress" },
  { code: "CS505", name: "Web Development", credits: 15, grade: "TBD", completionStatus: "upcoming" },
  { code: "CS606", name: "Artificial Intelligence", credits: 20, grade: "TBD", completionStatus: "upcoming" },
];

// Mock available tests
const mockAvailableTests = [
  { id: 1, name: "Database Midterm Exam", module: "CS303", duration: "90 min", dueDate: "2024-05-20T14:30:00", status: "upcoming" },
  { id: 2, name: "Software Engineering Quiz", module: "CS404", duration: "30 min", dueDate: "2024-05-18T10:00:00", status: "upcoming" },
  { id: 3, name: "Database Management Lab Test", module: "CS303", duration: "60 min", dueDate: "2024-05-15T15:00:00", status: "pending" },
  { id: 4, name: "Software Design Patterns Quiz", module: "CS404", duration: "45 min", dueDate: "2024-05-10T11:30:00", status: "completed" },
];

// Mock test results
const mockTestResults = [
  { id: 1, name: "Introduction to Programming Final", module: "CS101", score: 92, maxScore: 100, date: "2022-06-15" },
  { id: 2, name: "Data Structures Midterm", module: "CS202", score: 85, maxScore: 100, date: "2023-03-22" },
  { id: 3, name: "Algorithms Quiz", module: "CS202", score: 78, maxScore: 100, date: "2023-04-05" },
  { id: 4, name: "Database Concepts", module: "CS303", score: 88, maxScore: 100, date: "2023-11-10" },
  { id: 5, name: "Software Design Patterns Quiz", module: "CS404", score: 75, maxScore: 100, date: "2024-05-10" },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Filtering for modules tab
  const [moduleStatusFilter, setModuleStatusFilter] = useState("all");
  const filteredModules = mockModules.filter(module => 
    moduleStatusFilter === "all" || module.completionStatus === moduleStatusFilter
  );
  
  // Calculate upcoming tests
  const upcomingTests = mockAvailableTests.filter(test => 
    test.status === "upcoming" || test.status === "pending"
  );
  
  const formatRemainingTime = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffInMs = due.getTime() - now.getTime();
    
    if (diffInMs <= 0) return "Expired";
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ${diffInHours} hr${diffInHours !== 1 ? 's' : ''}`;
    } else {
      const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffInHours} hr${diffInHours !== 1 ? 's' : ''} ${diffInMinutes} min${diffInMinutes !== 1 ? 's' : ''}`;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <AdminNavbar userRole="student" userName={`${studentUser.name} ${studentUser.surname}`} />
      
      <div className="container mx-auto max-w-7xl py-8 px-4 md:px-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center justify-center">
              <User className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center justify-center">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Modules</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center justify-center">
              <FileText className="mr-2 h-4 w-4" />
              <span>Tests</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center justify-center">
              <Award className="mr-2 h-4 w-4" />
              <span>Results</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <GlassCard className="p-6 lg:col-span-1">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4 border-2 border-eduAccent">
                    <AvatarImage src={studentUser.profileImage} alt={`${studentUser.name} ${studentUser.surname}`} />
                    <AvatarFallback>{studentUser.name.charAt(0)}{studentUser.surname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-center">{studentUser.name} {studentUser.surname}</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-eduAccent-light text-eduAccent-dark">
                    {studentUser.role.charAt(0).toUpperCase() + studentUser.role.slice(1)}
                  </span>
                  <div className="w-full mt-6 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-eduText-light">ID Number</span>
                      <span className="font-medium">{studentUser.idNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-eduText-light">Program</span>
                      <span className="font-medium">{studentUser.program}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-eduText-light">Year</span>
                      <span className="font-medium">{studentUser.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-eduText-light">Email</span>
                      <span className="font-medium">{studentUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-eduText-light">Enrollment Date</span>
                      <span className="font-medium">{new Date(studentUser.enrollmentDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="primary" className="mt-6 w-full">
                    Edit Profile
                  </Button>
                </div>
              </GlassCard>
              
              {/* Dashboard Overview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-eduText-light">Total Modules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-eduAccent" />
                        <span className="text-2xl font-bold">{mockModules.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-eduText-light">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-2xl font-bold">
                          {mockModules.filter(m => m.completionStatus === "completed").length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-eduText-light">Upcoming Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-orange-500" />
                        <span className="text-2xl font-bold">{upcomingTests.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Upcoming Tests */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-eduAccent" />
                    Upcoming Tests
                  </h3>
                  
                  {upcomingTests.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingTests.map((test) => (
                        <div key={test.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{test.name}</h4>
                              <p className="text-sm text-eduText-light">{test.module} • {test.duration}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              test.status === "pending" ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {test.status === "pending" ? "Ready to Take" : "Upcoming"}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center">
                            <AlarmClock className="h-4 w-4 text-eduText-light mr-1" />
                            <span className="text-sm font-medium">
                              {formatRemainingTime(test.dueDate)} remaining
                            </span>
                          </div>
                          <div className="mt-3">
                            <Button 
                              variant={test.status === "pending" ? "primary" : "secondary"} 
                              size="sm"
                              className="w-full"
                              to={test.status === "pending" ? `/exam?id=${test.id}` : "#"}
                              disabled={test.status !== "pending"}
                            >
                              {test.status === "pending" ? "Start Test" : "View Details"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No Upcoming Tests</h3>
                      <p className="mt-2 text-eduText-light">
                        You don't have any upcoming tests at the moment.
                      </p>
                    </div>
                  )}
                </GlassCard>
                
                {/* Recent Results */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-eduAccent" />
                    Recent Results
                  </h3>
                  
                  <div className="space-y-4">
                    {mockTestResults.slice(0, 3).map((result) => (
                      <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{result.name}</h4>
                            <p className="text-sm text-eduText-light">{result.module} • {new Date(result.date).toLocaleDateString()}</p>
                          </div>
                          <span className="text-lg font-bold">
                            {result.score}%
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score</span>
                            <span>{result.score}/{result.maxScore}</span>
                          </div>
                          <Progress value={(result.score / result.maxScore) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveTab("results")}
                    >
                      View All Results
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </TabsContent>
          
          {/* Modules Tab */}
          <TabsContent value="modules">
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-eduAccent" />
                  My Modules
                </h2>
                
                <div className="w-full md:w-auto mt-4 md:mt-0">
                  <select
                    className="bg-white border border-gray-300 text-eduText-dark rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-eduAccent"
                    value={moduleStatusFilter}
                    onChange={(e) => setModuleStatusFilter(e.target.value)}
                  >
                    <option value="all">All Modules</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Module Name</TableHead>
                      <TableHead className="text-center">Credits</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModules.length > 0 ? (
                      filteredModules.map((module) => (
                        <TableRow key={module.code}>
                          <TableCell className="font-medium">{module.code}</TableCell>
                          <TableCell>{module.name}</TableCell>
                          <TableCell className="text-center">{module.credits}</TableCell>
                          <TableCell className="text-center">{module.grade}</TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(module.completionStatus)}`}>
                              {module.completionStatus === "in-progress" 
                                ? "In Progress" 
                                : module.completionStatus.charAt(0).toUpperCase() + module.completionStatus.slice(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No modules found matching the selected filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </TabsContent>
          
          {/* Tests Tab */}
          <TabsContent value="tests">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold flex items-center mb-6">
                <FileText className="mr-2 h-5 w-5 text-eduAccent" />
                Available Tests
              </h2>
              
              <div className="space-y-6">
                {mockAvailableTests.length > 0 ? (
                  mockAvailableTests.map((test) => (
                    <div key={test.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <div className="flex flex-col md:flex-row justify-between md:items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{test.name}</h3>
                          <p className="text-eduText-light mt-1">Module: {test.module}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-eduText-light" />
                              <span>{test.duration}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-1 text-eduText-light" />
                              <span>{new Date(test.dueDate).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                              {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                            </span>
                          </div>
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
                            <div className="text-right md:text-center">
                              <p className="text-sm font-medium mb-2">
                                Available in {formatRemainingTime(test.dueDate)}
                              </p>
                              <Button
                                variant="secondary"
                                disabled
                              >
                                Not Available Yet
                              </Button>
                            </div>
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No Tests Available</h3>
                    <p className="mt-2 text-eduText-light">
                      There are no tests available for you at the moment.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold flex items-center mb-6">
                <Award className="mr-2 h-5 w-5 text-eduAccent" />
                Test Results
              </h2>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTestResults.length > 0 ? (
                      mockTestResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.name}</TableCell>
                          <TableCell>{result.module}</TableCell>
                          <TableCell>{new Date(result.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-lg">{result.score}%</span>
                              <Progress value={(result.score / result.maxScore) * 100} className="h-2 w-24 mt-1" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              to={`/results?test=${result.id}`}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No test results available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
