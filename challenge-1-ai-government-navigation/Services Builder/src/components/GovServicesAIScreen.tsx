import React, { useState } from 'react';
import { Baby, Briefcase, Heart, Home, TrendingUp, Brain, Shield, Eye, Users, Lock, MessageCircle, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import LifeEventsScreen from './LifeEventsScreen';
import ServiceResultsScreen from './ServiceResultsScreen';
import EligibilityCheckScreen from './EligibilityCheckScreen';
import ChatAssistantScreen from './ChatAssistantScreen';

type ScreenType = 'landing' | 'life-events' | 'service-results' | 'eligibility-check' | 'chat-assistant';

interface GovServicesAIScreenProps {
  selectedLifeEvent?: string;
}

export default function GovServicesAIScreen({ selectedLifeEvent }: GovServicesAIScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [showTrustModal, setShowTrustModal] = useState(false);
  const trustItems = [
    { icon: Shield, label: 'Privacy' },
    { icon: Eye, label: 'Transparency' },
    { icon: Users, label: 'Human-in-the-loop' },
    { icon: Lock, label: 'Accessibility' }
  ];

  const datasetSources = [
    {
      name: 'Services Australia datasets from Data.gov.au',
      description: 'JobSeeker Payment, Disability Support Pension, Age Pension eligibility and application data',
      lastUpdated: 'August 2025'
    },
    {
      name: 'NSW Service Directory (Data.gov.au)',
      description: 'State-level employment services, housing assistance, and community support programs',
      lastUpdated: 'July 2025'
    },
    {
      name: 'Transparency.gov.au',
      description: 'Program funding allocations, performance reports, and government service delivery metrics',
      lastUpdated: 'August 2025'
    }
  ];

  const handleNavigateToLifeEvents = () => {
    setCurrentScreen('life-events');
  };

  const handleNavigateToChat = () => {
    setCurrentScreen('chat-assistant');
  };

  const handleSelectLifeEvent = (eventId: string) => {
    setSelectedEvent(eventId);
    setCurrentScreen('service-results');
  };

  const handleCheckEligibility = (serviceId: string) => {
    setCurrentScreen('eligibility-check');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleBackToLifeEvents = () => {
    setCurrentScreen('life-events');
  };

  const handleBackToServiceResults = () => {
    setCurrentScreen('service-results');
  };

  // Screen render functions
  const renderLandingScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-heading text-gray-900 mb-6">
            Using AI to Help Australians Navigate Government Services
          </h1>
          <p className="text-subheading text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose a life event or ask the AI Assistant to start.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button 
              onClick={handleNavigateToLifeEvents}
              className="bg-nav-teal hover:bg-nav-teal/90 text-white px-8 py-4 h-auto flex items-center space-x-3"
            >
              <Search className="w-5 h-5" />
              <span className="text-subheading">Browse Life Events</span>
            </Button>
            <Button 
              onClick={handleNavigateToChat}
              variant="outline" 
              className="border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white px-8 py-4 h-auto flex items-center space-x-3"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-subheading">Chat with AI Assistant</span>
            </Button>
          </div>

          {/* Powered by note */}
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <button 
              onClick={() => setShowTrustModal(true)}
              className="text-nav-teal hover:underline"
            >
              Data.gov.au and Transparency.gov.au
            </button>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center space-x-3 text-gray-600">
                  <Icon className="w-6 h-6" />
                  <span className="font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Main render function
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return renderLandingScreen();
      case 'life-events':
        return (
          <LifeEventsScreen 
            onSelectLifeEvent={handleSelectLifeEvent}
            onBack={handleBackToLanding}
          />
        );
      case 'service-results':
        return (
          <ServiceResultsScreen 
            selectedEvent={selectedEvent}
            onCheckEligibility={handleCheckEligibility}
            onBack={handleBackToLifeEvents}
          />
        );
      case 'eligibility-check':
        return (
          <EligibilityCheckScreen 
            onBack={handleBackToServiceResults}
          />
        );
      case 'chat-assistant':
        return (
          <ChatAssistantScreen 
            onBack={handleBackToLanding}
          />
        );
      default:
        return renderLandingScreen();
    }
  };

  return (
    <>
      {renderCurrentScreen()}
      
      {/* Trust & Transparency Modal */}
      <Dialog open={showTrustModal} onOpenChange={setShowTrustModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sources Used</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Our AI assistant uses the following verified government datasets to provide accurate, 
              up-to-date information about Australian government services.
            </p>
            
            <div className="space-y-4">
              {datasetSources.map((source, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{source.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                    <p className="text-xs text-gray-500">Last updated: {source.lastUpdated}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Compliance & Standards</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AI aligned to Australian AI Technical Standard</li>
                <li>• Privacy Act 1988 compliant</li>
                <li>• Government Information Security Manual (ISM) aligned</li>
                <li>• Regular audits and human oversight</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}