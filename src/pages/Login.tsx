
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import GlassCard from '../components/ui-custom/GlassCard';
import { Input } from '@/components/ui/input';
import Button from '../components/ui-custom/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the form schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Make the API call
      const response = await fetch('http://localhost:8800/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token or user data in localStorage if needed
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Show success message
      toast.success("Login successful!", {
        description: "Welcome to EduExam platform.",
      });
      
      // Redirect based on user role if provided, otherwise go to home
      if (data.user && data.user.role) {
        switch (data.user.role) {
          case 'student':
            navigate("/student-dashboard");
            break;
          case 'lecturer':
            navigate("/lecturer-dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
            <div className="flex flex-col items-center justify-center mb-8">
              <BookOpen className="h-12 w-12 text-eduAccent mb-4" />
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-eduText-light mt-2">Sign in to your account</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Button variant="link" to="/forgot-password" className="text-xs">
                          Forgot password?
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-eduText-light hover:text-eduAccent"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 space-y-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    loading={isSubmitting}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  
                  <div className="text-center">
                    <span className="text-eduText-light">Don't have an account? </span>
                    <Button variant="link" to="/register">
                      Register
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
