
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronDown, Calendar, Filter, Download, Printer, Eye, BarChart, BookOpen, Search } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock test data
const mockTests = [
  { 
    id: 1, 
    name: 'Midterm Examination', 
    course: 'Introduction to Computer Science', 
    date: '2023-10-15', 
    students: 42, 
    averageScore: 72.5,
    submissions: 38,
    status: 'completed'
  },
  { 
    id: 2, 
    name: 'Programming Fundamentals Quiz', 
    course: 'Programming in Java', 
    date: '2023-11-22', 
    students: 35, 
    averageScore: 68.3,
    submissions: 35,
    status: 'completed'
  },
  { 
    id: 3, 
    name: 'Data Structures Final', 
    course: 'Advanced Data Structures', 
    date: '2023-12-05', 
    students: 28, 
    averageScore: 75.8,
    submissions: 27,
    status: 'completed'
  },
  { 
    id: 4, 
    name: 'Web Development Project', 
    course: 'Modern Web Technologies', 
    date: '2024-01-10', 
    students: 31, 
    averageScore: 81.2,
    submissions: 29,
    status: 'completed'
  },
  { 
    id: 5, 
    name: 'Database Concepts', 
    course: 'Database Management Systems', 
    date: '2024-02-08', 
    students: 39, 
    averageScore: 76.4,
    submissions: 37,
    status: 'completed'
  },
  { 
    id: 6, 
    name: 'Algorithm Analysis Quiz', 
    course: 'Algorithm Design', 
    date: '2024-03-15', 
    students: 25, 
    averageScore: 65.9,
    submissions: 24,
    status: 'completed'
  },
  { 
    id: 7, 
    name: 'Software Engineering Midterm', 
    course: 'Software Development Process', 
    date: '2024-04-10', 
    students: 33, 
    averageScore: 79.1,
    submissions: 32,
    status: 'completed'
  },
  { 
    id: 8, 
    name: 'Final JavaScript Assessment', 
    course: 'Modern Web Technologies', 
    date: '2024-05-02', 
    students: 31, 
    averageScore: 0,
    submissions: 0,
    status: 'pending'
  },
];

// Mock performance data
const mockPerformanceData = [
  { name: '0-50', students: 2 },
  { name: '51-60', students: 4 },
  { name: '61-70', students: 7 },
  { name: '71-80', students: 15 },
  { name: '81-90', students: 9 },
  { name: '91-100', students: 3 },
];

const LecturerReports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<typeof mockTests[0] | null>(null);
  
  // Filter tests based on search term and filters
  const filteredTests = mockTests.filter(test => {
    const matchesSearch = 
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || test.course.includes(courseFilter);
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });
  
  // Get unique courses for the filter
  const uniqueCourses = Array.from(new Set(mockTests.map(test => test.course)));
  
  const handleViewReport = (test: typeof mockTests[0]) => {
    setSelectedTest(test);
    setIsReportModalOpen(true);
  };
  
  const handleGenerateReport = (format: 'pdf' | 'csv' | 'excel') => {
    if (!selectedTest) return;
    
    toast.success(`${format.toUpperCase()} Report Generated`, {
      description: `Report for ${selectedTest.name} has been generated.`,
    });
    
    // Here you would normally generate and download the report
    console.log(`Generating ${format} report for:`, selectedTest);
  };
  
  const handlePrintReport = () => {
    if (!selectedTest) return;
    
    toast.success(`Print Job Sent`, {
      description: `Report for ${selectedTest.name} has been sent to the printer.`,
    });
    
    // Here you would normally trigger the print dialog
    console.log(`Printing report for:`, selectedTest);
  };
  
  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <AdminNavbar userRole="lecturer" userName="Lecturer User" />
      
      <div className="container mx-auto max-w-7xl py-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-eduText-dark">Test Reports</h1>
            <p className="text-eduText-light mt-2">Generate and view reports for your tests</p>
          </div>
        </div>
        
        <GlassCard className="mb-8 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="mr-2 h-5 w-5 text-eduAccent" />
              All Tests
            </h2>
            
            <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-eduText-light" />
                <Input
                  type="text"
                  placeholder="Search tests..."
                  className="pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-eduText-light" />
                <Select
                  value={courseFilter}
                  onValueChange={setCourseFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {uniqueCourses.map((course, index) => (
                      <SelectItem key={index} value={course}>{course}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead className="text-center">Submissions</TableHead>
                  <TableHead className="text-center">Avg. Score</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.length > 0 ? (
                  filteredTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{test.course}</TableCell>
                      <TableCell>{new Date(test.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">{test.students}</TableCell>
                      <TableCell className="text-center">{test.submissions}</TableCell>
                      <TableCell className="text-center">
                        {test.status === 'completed' ? `${test.averageScore}%` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => test.status === 'completed' && handleViewReport(test)}
                            disabled={test.status !== 'completed'}
                            icon={<Eye className="h-4 w-4" />}
                          >
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No tests found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
        
        {/* Test Report Modal */}
        {selectedTest && (
          <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTest.name} Report</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-eduPrimary rounded-lg p-4">
                    <h3 className="text-sm font-medium text-eduText-light mb-1">Total Students</h3>
                    <p className="text-2xl font-bold">{selectedTest.students}</p>
                  </div>
                  
                  <div className="bg-eduPrimary rounded-lg p-4">
                    <h3 className="text-sm font-medium text-eduText-light mb-1">Submissions</h3>
                    <p className="text-2xl font-bold">{selectedTest.submissions}</p>
                  </div>
                  
                  <div className="bg-eduPrimary rounded-lg p-4">
                    <h3 className="text-sm font-medium text-eduText-light mb-1">Average Score</h3>
                    <p className="text-2xl font-bold">{selectedTest.averageScore}%</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium mb-4">Score Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={mockPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill="#6366F1" name="Number of Students" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="secondary" 
                        icon={<Download className="w-4 h-4" />}
                      >
                        Download Report <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleGenerateReport('pdf')}>
                        PDF Format
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGenerateReport('csv')}>
                        CSV Format
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleGenerateReport('excel')}>
                        Excel Format
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handlePrintReport}
                    icon={<Printer className="w-4 h-4" />}
                  >
                    Print Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default LecturerReports;
