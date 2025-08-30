import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, MapPin, Phone, Users, AlertCircle, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface ActionFeedbackProps {
  type: 'success' | 'info' | 'warning' | 'error';
  action: string;
  message: string;
  details?: string;
  duration?: number;
  onDismiss?: () => void;
  actionButtons?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  icon?: React.ReactNode;
  autoClose?: boolean;
}

const actionIcons = {
  appointment: Calendar,
  location: MapPin,
  call: Phone,
  volunteer: Users,
  success: CheckCircle,
  error: AlertCircle
};

export default function ActionFeedback({
  type,
  action,
  message,
  details,
  duration = 5000,
  onDismiss,
  actionButtons,
  icon,
  autoClose = true
}: ActionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onDismiss?.();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, autoClose, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          card: 'border-green-200 bg-green-50',
          icon: 'text-green-600',
          text: 'text-green-900',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'info':
        return {
          card: 'border-blue-200 bg-blue-50',
          icon: 'text-blue-600',
          text: 'text-blue-900',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'warning':
        return {
          card: 'border-yellow-200 bg-yellow-50',
          icon: 'text-yellow-600',
          text: 'text-yellow-900',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'error':
        return {
          card: 'border-red-200 bg-red-50',
          icon: 'text-red-600',
          text: 'text-red-900',
          button: 'bg-red-600 hover:bg-red-700'
        };
      default:
        return {
          card: 'border-gray-200 bg-gray-50',
          icon: 'text-gray-600',
          text: 'text-gray-900',
          button: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const colors = getColorClasses();
  const IconComponent = icon || actionIcons[action as keyof typeof actionIcons] || CheckCircle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <Card className={`${colors.card} border-l-4 shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 mt-1 ${colors.icon}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${colors.text}`}>
                      Action Completed
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-black/10"
                      onClick={handleDismiss}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className={`text-sm ${colors.text} opacity-90 mb-2`}>
                    {message}
                  </p>
                  
                  {details && (
                    <p className={`text-xs ${colors.text} opacity-75 mb-3`}>
                      {details}
                    </p>
                  )}
                  
                  {actionButtons && actionButtons.length > 0 && (
                    <div className="flex space-x-2">
                      {actionButtons.map((button, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={button.variant || 'default'}
                          className={button.variant === 'default' ? colors.button : ''}
                          onClick={button.action}
                        >
                          {button.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress bar for auto-close */}
              {autoClose && duration > 0 && (
                <motion.div
                  className={`mt-3 h-1 bg-black/10 rounded-full overflow-hidden`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className={`h-full ${colors.button.split(' ')[0]} rounded-full`}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                  />
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing multiple action feedbacks
export function useActionFeedback() {
  const [feedbacks, setFeedbacks] = useState<Array<ActionFeedbackProps & { id: string }>>([]);

  const showFeedback = (feedback: Omit<ActionFeedbackProps, 'onDismiss'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newFeedback = {
      ...feedback,
      id,
      onDismiss: () => removeFeedback(id)
    };
    
    setFeedbacks(prev => [...prev, newFeedback]);
    return id;
  };

  const removeFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  const clearAllFeedbacks = () => {
    setFeedbacks([]);
  };

  const FeedbackContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {feedbacks.map((feedback) => (
        <ActionFeedback key={feedback.id} {...feedback} />
      ))}
    </div>
  );

  return {
    showFeedback,
    removeFeedback,
    clearAllFeedbacks,
    FeedbackContainer,
    feedbacks
  };
}