
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import Button from '@/components/ui-custom/Button';
import PersonalInfoFields from './PersonalInfoFields';
import PasswordFields from './PasswordFields';
import RoleAndCourseFields from './RoleAndCourseFields';
import { registerSchema, RegisterFormValues, Course } from './RegisterFormSchema';

interface RegisterFormProps {
  courses: Course[];
  isLoadingCourses: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ courses, isLoadingCourses }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    mode: "onChange",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the data to send to the backend
      const userData = {
        name: values.name,
        surname: values.surname,
        gender: values.gender,
        email: values.email,
        idNumber: values.idNumber,
        password: values.password,
        role: values.role,
        courseId: parseInt(values.course)
      };
      
      // Make the API call
      const response = await fetch('http://localhost:8800/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Navigate to verification page with email
      navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
      
      toast.success("Registration successful!", {
        description: "Please check your email to verify your account.",
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "There was an error creating your account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoFields control={form.control} />
        <PasswordFields control={form.control} />
        <RoleAndCourseFields 
          control={form.control} 
          courses={courses} 
          isLoadingCourses={isLoadingCourses} 
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
  );
};

export default RegisterForm;
