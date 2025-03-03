
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, Users, FileText, ChevronDown, Menu, X, LogOut, Home, User, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type NavLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

const NavLink = ({ to, icon, label, isActive }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
      isActive 
        ? "bg-eduPrimary-dark text-eduAccent" 
        : "hover:bg-eduPrimary-dark/50 text-eduText hover:text-eduAccent"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

type AdminNavbarProps = {
  userRole: 'admin' | 'lecturer' | 'student';
  userName?: string;
  userImage?: string;
};

const AdminNavbar = ({ userRole, userName = 'User', userImage }: AdminNavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!userName) return "U";
    const nameParts = userName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return userName.substring(0, 2);
  };
  
  // Define navigation links based on user role
  const navLinks = [
    {
      to: "/",
      icon: <Home className="h-4 w-4" />,
      label: "Home"
    },
    ...(userRole === 'admin' ? [
      {
        to: "/admin",
        icon: <Users className="h-4 w-4" />,
        label: "User Management"
      },
      {
        to: "/admin/modules",
        icon: <Book className="h-4 w-4" />,
        label: "Module Management"
      },
      {
        to: "/admin/tests",
        icon: <BookOpen className="h-4 w-4" />,
        label: "Test Management"
      }
    ] : []),
    ...(userRole === 'lecturer' ? [
      {
        to: "/lecturer",
        icon: <BookOpen className="h-4 w-4" />,
        label: "Create Tests"
      },
      {
        to: "/lecturer/reports",
        icon: <FileText className="h-4 w-4" />,
        label: "Test Reports"
      }
    ] : []),
    ...(userRole === 'student' ? [
      {
        to: "/student",
        icon: <User className="h-4 w-4" />,
        label: "Dashboard"
      },
      {
        to: "/exam",
        icon: <BookOpen className="h-4 w-4" />,
        label: "Tests"
      }
    ] : [])
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-eduAccent" />
              <span className="ml-2 text-xl font-semibold">EduExam</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  label={link.label}
                  isActive={location.pathname === link.to}
                />
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback className="bg-eduAccent-light text-eduAccent-dark">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" className="flex items-center w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <div className="flex items-center w-full gap-2 text-red-500">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden ml-2 p-2 rounded-md text-eduText hover:text-eduAccent focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 pt-2 pb-3 px-4 bg-white shadow-lg animate-in fade-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={location.pathname === link.to}
              />
            ))}
            <div className="pt-4 mt-2 border-t border-gray-200">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-eduPrimary-dark/50 text-eduText hover:text-eduAccent"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-eduPrimary-dark/50 text-eduText hover:text-eduAccent"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 text-red-500 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
