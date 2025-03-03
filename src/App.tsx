
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Exam from "./pages/Exam";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminModuleManagement from "./pages/AdminModuleManagement";
import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerReports from "./pages/LecturerReports";
import LecturerTestResults from "./pages/LecturerTestResults";
import StudentDashboard from "./pages/StudentDashboard";
import Results from "./pages/Results";
import TestDetails from "./pages/TestDetails";
import ModuleTests from "./pages/ModuleTests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Student routes */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exam" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Exam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Results />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-details" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TestDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/module-tests" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ModuleTests />
                </ProtectedRoute>
              } 
            />
            
            {/* Lecturer routes */}
            <Route 
              path="/lecturer" 
              element={
                <ProtectedRoute allowedRoles={['lecturer']}>
                  <LecturerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lecturer/reports" 
              element={
                <ProtectedRoute allowedRoles={['lecturer']}>
                  <LecturerReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lecturer/results" 
              element={
                <ProtectedRoute allowedRoles={['lecturer']}>
                  <LecturerTestResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/modules" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminModuleManagement />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
