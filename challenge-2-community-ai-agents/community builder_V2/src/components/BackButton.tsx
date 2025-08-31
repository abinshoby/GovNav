import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';

interface BackButtonProps {
  onBack: () => void;
  onHome?: () => void;
  label?: string;
  variant?: 'default' | 'minimal' | 'floating';
  showHome?: boolean;
  className?: string;
}

export default function BackButton({ 
  onBack, 
  onHome, 
  label = 'Back', 
  variant = 'default',
  showHome = false,
  className = ''
}: BackButtonProps) {
  
  const baseClasses = "transition-all duration-200";
  
  const variantClasses = {
    default: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm",
    minimal: "bg-transparent border-none hover:bg-gray-100 text-gray-600",
    floating: "fixed top-4 left-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-lg z-50 rounded-full"
  };

  if (variant === 'floating') {
    return (
      <div className="fixed top-4 left-4 z-50 flex space-x-2">
        <Button
          size="sm"
          className={`${variantClasses.floating} ${className}`}
          onClick={onBack}
          aria-label="Go back to previous screen"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        {showHome && onHome && (
          <Button
            size="sm"
            className={`${variantClasses.floating} ${className}`}
            onClick={onHome}
            aria-label="Go to home screen"
          >
            <Home className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        className={`${baseClasses} ${variantClasses[variant]}`}
        onClick={onBack}
        aria-label={`Go back to previous screen`}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {label}
      </Button>
      
      {showHome && onHome && (
        <Button
          variant="outline"
          size="sm"
          className={`${baseClasses} ${variantClasses[variant]}`}
          onClick={onHome}
          aria-label="Go to home screen"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      )}
    </div>
  );
}