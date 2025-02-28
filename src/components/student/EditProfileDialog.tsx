
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Button from '@/components/ui-custom/Button';
import { ProfileFormData } from './types';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileForm: ProfileFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ 
  open, 
  onOpenChange, 
  profileForm, 
  onChange, 
  onSave 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 border-2 border-eduAccent">
              <AvatarImage src={profileForm.profileImage || undefined} alt={`${profileForm.name} ${profileForm.surname}`} />
              <AvatarFallback>{profileForm.name.charAt(0)}{profileForm.surname.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profileImage" className="text-right">
              Avatar URL
            </Label>
            <Input
              id="profileImage"
              name="profileImage"
              className="col-span-3"
              value={profileForm.profileImage || ''}
              onChange={onChange}
              placeholder="Enter image URL"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              First Name
            </Label>
            <Input
              id="name"
              name="name"
              className="col-span-3"
              value={profileForm.name}
              onChange={onChange}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surname" className="text-right">
              Last Name
            </Label>
            <Input
              id="surname"
              name="surname"
              className="col-span-3"
              value={profileForm.surname}
              onChange={onChange}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="col-span-3"
              value={profileForm.email}
              onChange={onChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
