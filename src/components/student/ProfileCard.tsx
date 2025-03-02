
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Student } from './types';

interface ProfileCardProps {
  student: Student;
  onEditProfile: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ student, onEditProfile }) => {
  return (
    <GlassCard className="p-6 lg:col-span-1">
      <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
        {/* Left side - Profile image, name and role */}
        <div className="flex flex-col items-center md:w-1/4">
          <Avatar className="h-24 w-24 mb-4 border-2 border-eduAccent">
            <AvatarImage src={student.profileImage} alt={`${student.name} ${student.surname}`} />
            <AvatarFallback>{student.name.charAt(0)}{student.surname.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-center">{student.name} {student.surname}</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-eduAccent-light text-eduAccent-dark">
            {student.role.charAt(0).toUpperCase() + student.role.slice(1)}
          </span>
        </div>
        
        {/* Right side - Student details */}
        <div className="mt-6 md:mt-0 md:flex-1">
          <div className="w-full space-y-2">
            <div className="flex justify-between">
              <span className="text-eduText-light">ID Number</span>
              <span className="font-medium">{student.idNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-eduText-light">Program</span>
              <span className="font-medium">{student.program}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-eduText-light">Year</span>
              <span className="font-medium">{student.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-eduText-light">Email</span>
              <span className="font-medium">{student.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-eduText-light">Enrollment Date</span>
              <span className="font-medium">{new Date(student.enrollmentDate).toLocaleDateString()}</span>
            </div>
          </div>
          <Button 
            variant="primary" 
            className="mt-6 w-full"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileCard;
