
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { RegisterFormValues, Course } from './RegisterFormSchema';

interface RoleAndCourseFieldsProps {
  control: Control<RegisterFormValues>;
  courses: Course[];
  isLoadingCourses: boolean;
}

const RoleAndCourseFields: React.FC<RoleAndCourseFieldsProps> = ({ 
  control, 
  courses, 
  isLoadingCourses 
}) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
};

export default RoleAndCourseFields;
