
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, LinkProps } from 'react-router-dom';

// Create two separate interfaces for the different rendering modes
type ButtonAsButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  to?: undefined; // Explicitly make to undefined for button mode
};

type ButtonAsLinkProps = Omit<LinkProps, 'to'> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  to: string; // Make to required for link mode
};

// Create a union type for the two rendering modes
type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

// Helper function to determine if the button is a link
const isLink = (props: ButtonProps): props is ButtonAsLinkProps => {
  return props.to !== undefined;
};

const Button = (props: ButtonProps) => {
  const { 
    children, 
    variant = 'primary', 
    size = 'md', 
    className,
    loading = false,
    icon,
    iconPosition = 'left',
    ...rest
  } = props;

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus-ring';

  const variantStyles = {
    primary: 'bg-eduAccent hover:bg-eduAccent-dark text-white shadow-sm',
    secondary: 'bg-eduPrimary hover:bg-eduPrimary-dark text-eduText border border-eduPrimary-dark',
    ghost: 'hover:bg-eduPrimary-dark/50 text-eduText',
    link: 'text-eduAccent hover:text-eduAccent-dark underline-offset-4 hover:underline p-0'
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const loadingClassName = loading ? 'opacity-80 cursor-not-allowed' : '';
  
  // Skip size styling for link variant
  const buttonClassName = variant === 'link' 
    ? cn(baseStyles, variantStyles[variant], loadingClassName, className)
    : cn(baseStyles, variantStyles[variant], sizeStyles[size], loadingClassName, className);

  const content = (
    <>
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
      {!loading && icon && iconPosition === 'right' ? (
        <span className="ml-2">{icon}</span>
      ) : null}
    </>
  );

  // Render as Link or button based on the presence of 'to' prop
  if (isLink(props)) {
    return (
      <Link className={buttonClassName} to={props.to} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} {...rest}>
      {content}
    </button>
  );
};

export default Button;
