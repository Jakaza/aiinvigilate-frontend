
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Trash2 } from 'lucide-react';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define module schema
const moduleSchema = z.object({
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  credits: z.coerce.number().min(1, { message: "Credits must be at least 1" }).max(60, { message: "Credits cannot exceed 60" }),
  description: z.string().optional(),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

// Define Module type
interface Module {
  id: number;
  code: string;
  name: string;
  credits: number;
  description?: string;
}

const AdminModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      code: "",
      name: "",
      credits: 15,
      description: "",
    },
  });
  
  const onSubmit = async (values: ModuleFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      const response = await fetch('http://localhost:8800/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create module');
      }
      
      // Mock response data
      const newModule: Module = {
        id: modules.length + 1,
        ...values
      };
      
      setModules([...modules, newModule]);
      form.reset();
      
      toast.success("Module created successfully", {
        description: `Created ${values.code} - ${values.name}`,
      });
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error("Failed to create module", {
        description: error instanceof Error ? error.message : "There was an error creating the module. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteModule = async (id: number) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch(`http://localhost:8800/api/modules/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete module');
      }
      
      setModules(modules.filter(module => module.id !== id));
      
      toast.success("Module deleted successfully");
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error("Failed to delete module", {
        description: error instanceof Error ? error.message : "There was an error deleting the module. Please try again.",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <AdminNavbar userRole="admin" userName="Admin User" />
      
      <div className="container mx-auto max-w-7xl py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module Form */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add New Module</CardTitle>
                <CardDescription>Create a new module for the curriculum</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Module Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. CS101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Module Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Introduction to Programming" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="credits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credits</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of the module" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Creating...</>
                      ) : (
                        <>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Module
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Modules List */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Module List</CardTitle>
                <CardDescription>Manage existing modules</CardDescription>
              </CardHeader>
              <CardContent>
                {modules.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center">Credits</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => (
                        <TableRow key={module.id}>
                          <TableCell className="font-medium">{module.code}</TableCell>
                          <TableCell>{module.name}</TableCell>
                          <TableCell className="text-center">{module.credits}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteModule(module.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No modules added yet. Create your first module using the form.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModuleManagement;
