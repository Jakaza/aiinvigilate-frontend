
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['student', 'lecturer', 'admin'] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-eduAccent animate-spin" />
        <p className="mt-4 text-eduText">Loading...</p>
      </div>
    );
  }
  
  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check role-based access
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case 'student':
        return <Navigate to="/student" replace />;
      case 'lecturer':
        return <Navigate to="/lecturer" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  // All checks passed - render children
  return <>{children}</>;
};

export default ProtectedRoute;
