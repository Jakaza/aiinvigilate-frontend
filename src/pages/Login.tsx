
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

import Navbar from '../components/layout/Navbar';
import GlassCard from '../components/ui-custom/GlassCard';
import Button from '../components/ui-custom/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Define form schema using zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  
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
      await login(values.email, values.password);
      
      toast.success("Login successful!", {
        description: "Welcome to EduExam platform.",
      });
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
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-eduAccent" />
              <h1 className="text-3xl font-bold ml-2">Log In</h1>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-eduText-light" />
                          <Input 
                            placeholder="Your email address" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-eduText-light" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Your password" 
                            className="pl-10" 
                            {...field} 
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-3 text-eduText-light hover:text-eduText"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-right">
                  <Button variant="link" to="/forgot-password" size="sm">
                    Forgot password?
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    loading={isSubmitting}
                    className="w-full"
                  >
                    Log In
                  </Button>
                </div>
                
                <div className="text-center pt-4">
                  <span className="text-eduText-light">Don't have an account? </span>
                  <Button variant="link" to="/register">
                    Register
                  </Button>
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
