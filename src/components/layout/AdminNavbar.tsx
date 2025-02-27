
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BookOpen, Users, FileText, ChevronDown, Menu, X, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  userRole: 'admin' | 'lecturer';
  userName?: string;
};

const AdminNavbar = ({ userRole, userName = 'User' }: AdminNavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
    ] : [])
  ];

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
                <Button variant="ghost" className="flex items-center gap-1">
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
                <DropdownMenuItem>
                  <Link to="/login" className="flex items-center w-full gap-2 text-red-500">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
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
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 text-red-500"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AdminNavbar;
