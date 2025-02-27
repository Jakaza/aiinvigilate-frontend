
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  blur?: 'none' | 'sm' | 'md' | 'lg';
  opacity?: 'light' | 'medium' | 'heavy';
  border?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  blur = 'md', 
  opacity = 'medium', 
  border = true,
  ...props 
}: GlassCardProps) => {
  const blurMap = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const opacityMap = {
    light: 'bg-white/60',
    medium: 'bg-white/80',
    heavy: 'bg-white/95',
  };

  return (
    <div
      className={cn(
        'rounded-xl shadow-soft transition-all duration-300',
        blurMap[blur],
        opacityMap[opacity],
        border ? 'border border-white/20' : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
