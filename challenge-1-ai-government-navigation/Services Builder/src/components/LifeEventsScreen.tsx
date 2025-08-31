import React from 'react';
import { Baby, Briefcase, Heart, Home, TrendingUp, Brain, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LifeEventsScreenProps {
  onSelectLifeEvent: (eventId: string) => void;
  onBack: () => void;
}

export default function LifeEventsScreen({ onSelectLifeEvent, onBack }: LifeEventsScreenProps) {
  const lifeEvents = [
    {
      id: 'birth-of-child',
      title: 'Birth of a child',
      icon: Baby,
      description: 'Parental leave, child care support, family payments',
      services: ['Parental Leave Pay', 'Child Care Subsidy', 'Family Tax Benefit']
    },
    {
      id: 'job-loss',
      title: 'Job loss',
      icon: Briefcase,
      description: 'JobSeeker payment, employment services, training',
      services: ['JobSeeker Payment', 'Employment Services', 'Skills Training']
    },
    {
      id: 'becoming-carer',
      title: 'Becoming a carer',
      icon: Heart,
      description: 'Carer payment, support services, respite care',
      services: ['Carer Payment', 'Carer Allowance', 'Respite Care']
    },
    {
      id: 'disaster-recovery',
      title: 'Disaster recovery',
      icon: Home,
      description: 'Emergency assistance, housing support, cleanup help',
      services: ['Emergency Assistance', 'Temporary Accommodation', 'Clean-up Support']
    },
    {
      id: 'starting-business',
      title: 'Starting a business',
      icon: TrendingUp,
      description: 'Business registration, grants, tax obligations',
      services: ['Business Registration', 'Start-up Grants', 'Tax Guidance']
    },
    {
      id: 'mental-health',
      title: 'Mental health',
      icon: Brain,
      description: 'Mental health plans, counselling, support services',
      services: ['Mental Health Care Plan', 'Counselling Services', 'Support Groups']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to main menu
          </Button>
          
          <h1 className="text-heading text-gray-900 mb-4">
            Choose Your Life Event
          </h1>
          <p className="text-subheading text-gray-600 max-w-2xl">
            Select the life event that best matches your situation to find relevant government services and support.
          </p>
        </div>

        {/* Life Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifeEvents.map((event) => {
            const Icon = event.icon;
            return (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-nav-teal">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Icon and Title */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-nav-teal/10 rounded-lg flex items-center justify-center group-hover:bg-nav-teal group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6 text-nav-teal group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-nav-teal transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600">
                      {event.description}
                    </p>

                    {/* Sample Services */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Available Services
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {event.services.map((service, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => onSelectLifeEvent(event.id)}
                      className="w-full bg-nav-teal hover:bg-nav-teal/90 text-white"
                    >
                      View Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-medium text-gray-900 mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our AI Assistant can help you discover services based on your specific situation and needs.
            </p>
            <Button 
              variant="outline" 
              className="border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white"
              onClick={onBack}
            >
              Try AI Assistant Instead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}