
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Edit, Search, Users, Filter } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminNavbar from '@/components/layout/AdminNavbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data to simulate users
const mockUsers = [
  { 
    id: 1, 
    name: 'John', 
    surname: 'Doe', 
    email: 'john.doe@example.com', 
    role: 'student', 
    status: 'active', 
    idNumber: 'STU001',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&auto=format&fit=crop'
  },
  { 
    id: 2, 
    name: 'Jane', 
    surname: 'Smith', 
    email: 'jane.smith@example.com', 
    role: 'student', 
    status: 'active', 
    idNumber: 'STU002',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
  },
  { 
    id: 3, 
    name: 'Robert', 
    surname: 'Johnson', 
    email: 'robert.j@example.com', 
    role: 'lecturer', 
    status: 'active', 
    idNumber: 'LEC001',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  },
  { 
    id: 4, 
    name: 'Sarah', 
    surname: 'Williams', 
    email: 'sarah.w@example.com', 
    role: 'lecturer', 
    status: 'inactive', 
    idNumber: 'LEC002',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
  },
  { 
    id: 5, 
    name: 'Michael', 
    surname: 'Brown', 
    email: 'michael.b@example.com', 
    role: 'student', 
    status: 'inactive', 
    idNumber: 'STU003',
    profileImage: null
  },
  { 
    id: 6, 
    name: 'Lisa', 
    surname: 'Davis', 
    email: 'lisa.d@example.com', 
    role: 'student', 
    status: 'active', 
    idNumber: 'STU004',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
  },
  { 
    id: 7, 
    name: 'James', 
    surname: 'Wilson', 
    email: 'james.w@example.com', 
    role: 'lecturer', 
    status: 'active', 
    idNumber: 'LEC003',
    profileImage: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=150&auto=format&fit=crop'
  },
  { 
    id: 8, 
    name: 'Emily', 
    surname: 'Taylor', 
    email: 'emily.t@example.com', 
    role: 'student', 
    status: 'inactive', 
    idNumber: 'STU005',
    profileImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=150&auto=format&fit=crop'
  },
];

// Edit user form schema
const editUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["admin", "lecturer", "student"], { required_error: "Please select a role" }),
  status: z.enum(["active", "inactive"], { required_error: "Please select a status" }),
  idNumber: z.string().min(2, { message: "ID Number is required" }),
  profileImage: z.string().nullable(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const adminProfileImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop';

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      role: 'student',
      status: 'active',
      idNumber: '',
      profileImage: null,
    },
  });

  // Apply filters when search term or filters change
  useEffect(() => {
    let result = users;
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowerCaseSearch) || 
        user.surname.toLowerCase().includes(lowerCaseSearch) || 
        user.email.toLowerCase().includes(lowerCaseSearch) ||
        user.idNumber.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleEditUser = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    form.reset({
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role as "admin" | "lecturer" | "student",
      status: user.status as "active" | "inactive",
      idNumber: user.idNumber,
      profileImage: user.profileImage,
    });
    setIsEditModalOpen(true);
  };

  const onSubmitEdit = (values: EditUserFormValues) => {
    if (!selectedUser) return;
    
    // Update user in the users array
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, ...values } : user
    );
    
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    
    toast.success("User updated successfully", {
      description: `${values.name} ${values.surname}'s information has been updated.`,
    });
  };

  const toggleUserStatus = (userId: number) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`, {
          description: `${user.name} ${user.surname}'s account is now ${newStatus}.`,
        });
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };

  return (
    <div className="min-h-screen bg-eduPrimary-light">
      <AdminNavbar 
        userRole="admin" 
        userName="Admin User" 
        userImage={adminProfileImage}
      />
      
      <div className="container mx-auto max-w-7xl py-8 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-eduText-dark">User Management</h1>
            <p className="text-eduText-light mt-2">View and manage system users</p>
          </div>
        </div>
        
        <GlassCard className="mb-8 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="mr-2 h-5 w-5 text-eduAccent" />
              All Users
            </h2>
            
            <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col md:flex-row items-stretch md:items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-eduText-light" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-eduText-light" />
                <Select
                  value={roleFilter}
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="lecturer">Lecturers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-eduPrimary text-eduText-dark">
                  <th className="py-3 px-4 text-left font-medium">User</th>
                  <th className="py-3 px-4 text-left font-medium">ID</th>
                  <th className="py-3 px-4 text-left font-medium">Email</th>
                  <th className="py-3 px-4 text-left font-medium">Role</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-eduPrimary-dark hover:bg-eduPrimary">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={user.profileImage || undefined} alt={`${user.name} ${user.surname}`} />
                            <AvatarFallback className="bg-eduAccent-light text-eduAccent-dark">
                              {user.name[0]}{user.surname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name} {user.surname}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{user.idNumber}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'lecturer' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(user.id)}
                            className={`${
                              user.status === 'active' 
                                ? 'text-red-600 hover:text-red-800' 
                                : 'text-green-600 hover:text-green-800'
                            }`}
                            title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.status === 'active' ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-eduText-light">
                      No users found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4 pt-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={form.watch('profileImage') || undefined} 
                    alt={`${form.watch('name')} ${form.watch('surname')}`} 
                  />
                  <AvatarFallback className="bg-eduAccent-light text-eduAccent-dark text-lg">
                    {form.watch('name')?.[0]}{form.watch('surname')?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter profile image URL" 
                        {...field} 
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="lecturer">Lecturer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="active" id="active" />
                          <Label htmlFor="active">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="inactive" id="inactive" />
                          <Label htmlFor="inactive">Inactive</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
