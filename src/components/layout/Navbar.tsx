
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from '../ui-custom/Button';
import GlassCard from '../ui-custom/GlassCard';
import { Menu, X, BookOpen, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Exam', path: '/exam' },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'py-2' : 'py-4'
    )}>
      <GlassCard 
        className={cn(
          'mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300',
          isScrolled ? 'rounded-none' : 'mx-4 sm:mx-6 mt-4 rounded-xl'
        )}
        blur={isScrolled ? 'lg' : 'md'}
        opacity={isScrolled ? 'heavy' : 'medium'}
        border={!isScrolled}
      >
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-8 w-8 text-eduAccent" />
            <span className="ml-2 text-xl font-display font-semibold tracking-tight">EduExam</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-eduAccent',
                location.pathname === link.path 
                  ? 'text-eduAccent' 
                  : 'text-eduText'
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" to="/login" icon={<User className="w-4 h-4" />}>
              Login
            </Button>
            <Button variant="primary" size="sm" to="/register">
              Register
            </Button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md text-eduText hover:text-eduAccent focus:outline-none"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-eduText" />
          ) : (
            <Menu className="h-6 w-6 text-eduText" />
          )}
        </button>
      </GlassCard>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <GlassCard className="mt-2 mx-4 py-3 px-4 opacity-heavy">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-3 py-2 rounded-md text-base font-medium',
                    location.pathname === link.path 
                      ? 'bg-eduPrimary text-eduAccent' 
                      : 'text-eduText hover:bg-eduPrimary hover:text-eduAccent'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-base font-medium text-eduText hover:bg-eduPrimary hover:text-eduAccent"
              >
                Login
              </Link>
              <Button className="w-full mt-2" variant="primary" to="/register">
                Register
              </Button>
            </nav>
          </GlassCard>
        </div>
      )}
    </header>
  );
};

export default Navbar;
