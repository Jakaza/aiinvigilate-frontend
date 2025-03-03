
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import GlassCard from '../components/ui-custom/GlassCard';
import Button from '../components/ui-custom/Button';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isResending, setIsResending] = useState(false);
  
  // Get email from URL query params
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || '';
  
  // Mock verification check - in a real app, this would check an API endpoint
  useEffect(() => {
    const verificationToken = searchParams.get('token');
    
    if (verificationToken) {
      // Simulate API call to verify the token
      const verifyToken = async () => {
        try {
          // In a real app, this would be an API call
          const response = await fetch(`http://localhost:8800/api/auth/verify?token=${verificationToken}`, {
            method: 'GET',
          });
          
          if (response.ok) {
            setVerificationStatus('success');
            toast.success("Email verified successfully!", {
              description: "You can now log in to your account.",
            });
          } else {
            setVerificationStatus('error');
            toast.error("Verification failed", {
              description: "The verification link is invalid or has expired.",
            });
          }
        } catch (error) {
          setVerificationStatus('error');
          toast.error("Verification failed", {
            description: "There was an error verifying your email. Please try again.",
          });
        }
      };
      
      verifyToken();
    }
  }, [location.search]);
  
  const handleResendVerification = async () => {
    setIsResending(true);
    
    try {
      // In a real app, this would be an API call
      const response = await fetch('http://localhost:8800/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        toast.success("Verification email sent!", {
          description: "Please check your inbox for the verification link.",
        });
      } else {
        throw new Error("Failed to resend verification email");
      }
    } catch (error) {
      toast.error("Failed to resend verification email", {
        description: "There was an error sending the verification email. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <GlassCard className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              {verificationStatus === 'pending' && (
                <>
                  <Mail className="h-16 w-16 text-eduAccent mb-4" />
                  <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
                  <p className="text-eduText mb-6">
                    We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to verify your account.
                  </p>
                  <div className="space-y-4 w-full">
                    <Button
                      variant="secondary"
                      onClick={handleResendVerification}
                      loading={isResending}
                      className="w-full"
                    >
                      Resend Verification Email
                    </Button>
                    <Button
                      variant="ghost"
                      to="/login"
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
              
              {verificationStatus === 'success' && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
                  <p className="text-eduText mb-6">
                    Your email has been successfully verified. You can now log in to your account.
                  </p>
                  <Button
                    variant="primary"
                    to="/login"
                    className="w-full"
                    icon={<ArrowRight className="ml-2 h-4 w-4" />}
                  >
                    Continue to Login
                  </Button>
                </>
              )}
              
              {verificationStatus === 'error' && (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mb-4" />
                  <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
                  <p className="text-eduText mb-6">
                    The verification link is invalid or has expired. Please request a new verification email.
                  </p>
                  <div className="space-y-4 w-full">
                    <Button
                      variant="secondary"
                      onClick={handleResendVerification}
                      loading={isResending}
                      className="w-full"
                    >
                      Request New Verification
                    </Button>
                    <Button
                      variant="ghost"
                      to="/login"
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
