import React, { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Button from '../components/ui-custom/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define South African ID validation pattern
const validateSouthAfricanID = (id: string) => {
  if (id.length !== 13) {
    return false;
  }
  
  if (!/^\d+$/.test(id)) {
    return false;
  }
  
  const year = parseInt(id.substring(0, 2));
  const month = parseInt(id.substring(2, 4));
  const day = parseInt(id.substring(4, 6));
  
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year > currentYear ? 1900 + year : 2000 + year;
  
  const birthDate = new Date(fullYear, month - 1, day);
  if (
    birthDate.getFullYear() !== fullYear ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    birthDate > new Date()
  ) {
    return false;
  }
  
  const genderDigit = parseInt(id.charAt(6));
  if (![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(genderDigit)) {
    return false;
  }
  
  const citizenshipDigit = parseInt(id.charAt(10));
  if (![0, 1].includes(citizenshipDigit)) {
    return false;
  }
  
  return true;
};

// Define the course type
interface Course {
  id: number;
  name: string;
}

// Define the response type
interface CourseResponse {
  courses: Course[];
  message: string;
}

// Available courses/programs
const availableCourses = [
  { id: "cs", name: "Computer Science" },
  { id: "eng", name: "Engineering" },
  { id: "bus", name: "Business Administration" },
  { id: "med", name: "Medical Sciences" },
  { id: "arts", name: "Arts and Humanities" },
  { id: "edu", name: "Education" },
];

// Define the form schema with Zod
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters" }),
  gender: z.enum(["male", "female", "other"], { 
    required_error: "Please select a gender" 
  }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  idNumber: z.string().refine(
    (id) => validateSouthAfricanID(id),
    { message: "Please enter a valid South African ID number (13 digits in YYMMDDSSSCAZ format)" }
  ),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string(),
  role: z.enum(["lecturer", "student"], { 
    required_error: "Please select a role" 
  }),
  course: z.string().min(1, { message: "Please select a course/program" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      gender: undefined,
      email: "",
      idNumber: "",
      password: "",
      confirmPassword: "",
      role: undefined,
      course: "",
    },
    mode: "onChange", // This enables validation to run on change, helping clear errors as user types
  });

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await fetch('http://localhost:8800/api/course/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data: CourseResponse = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses', {
          description: 'Please try again later or contact support.',
        });
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        console.log("Form submitted:", values);
        
        toast.success("Registration successful!", {
          description: "Your account has been created. Please log in.",
        });
        
        navigate("/login");
      } catch (error) {
        toast.error("Registration failed", {
          description: "There was an error creating your account. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <GlassCard className="p-8">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-eduAccent" />
              <h1 className="text-3xl font-bold ml-2">Create Account</h1>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your surname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>South African ID Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="13-digit South African ID number" 
                          maxLength={13}
                          {...field} 
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: YYMMDDSSSCAZ (13 digits)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create a password" 
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
                      <p className="text-xs text-muted-foreground mt-1">
                        Must contain at least 8 characters, uppercase, lowercase, number, and special character
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-eduText-light hover:text-eduAccent"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="lecturer">Lecturer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course/Program <span className="text-red-500">*</span></FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingCourses}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select your course/program"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.length > 0 ? (
                            courses.map(course => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              {isLoadingCourses ? "Loading courses..." : "No courses available"}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col space-y-4 pt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    loading={isSubmitting}
                    className="w-full"
                  >
                    Create Account
                  </Button>
                  
                  <div className="text-center">
                    <span className="text-eduText-light">Already have an account? </span>
                    <Button variant="link" to="/login">
                      Log In
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

export default Register;
