
import { z } from 'zod';
import { validateSouthAfricanID } from '@/utils/validations';

// Define the form schema with Zod
export const registerSchema = z.object({
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

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Define the course type
export interface Course {
  id: number;
  name: string;
}

// Define the response type
export interface CourseResponse {
  courses: Course[];
  message: string;
}
