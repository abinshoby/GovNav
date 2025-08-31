import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ServiceDiscoveryScreen from './ServiceDiscoveryScreen';
import ServiceResultsScreen from './ServiceResultsScreen';
import TaskExecutionScreen from './TaskExecutionScreen';
import VolunteerMatchingScreen from './VolunteerMatchingScreen';
import NotificationsScreen from './NotificationsScreen';
import AccessibilitySettingsScreen from './AccessibilitySettingsScreen';
import KioskModeScreen from './KioskModeScreen';
import VoiceModeScreen from './VoiceModeScreen';

type CommunityAgentView = 
  | 'welcome'
  | 'discovery' 
  | 'results'
  | 'booking'
  | 'tasks'
  | 'volunteer'
  | 'notifications'
  | 'accessibility'
  | 'voice'
  | 'kiosk';

interface CommunityAgentState {
  currentView: CommunityAgentView;
  searchQuery: string;
  searchFilters: any;
  selectedService: number | null;
  selectedOrganization: {
    id: number;
    name: string;
    type: string;
    services: string[];
  } | null;
  accessMode: string;
  navigationHistory: CommunityAgentView[];
}

interface CommunityAgentScreenProps {
  onNavigateToTab?: (tab: string) => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export default function CommunityAgentScreen({ 
  onNavigateToTab, 
  onGoBack, 
  onGoHome 
}: CommunityAgentScreenProps) {
  const [state, setState] = useState<CommunityAgentState>({
    currentView: 'welcome',
    searchQuery: '',
    searchFilters: {},
    selectedService: null,
    selectedOrganization: null,
    accessMode: 'app',
    navigationHistory: ['welcome']
  });

  const addToNavigationHistory = (view: CommunityAgentView) => {
    setState(prev => ({
      ...prev,
      navigationHistory: [...prev.navigationHistory, view].slice(-10) // Keep last 10 items
    }));
  };

  const handleNavigateToService = (service: string) => {
    let newView: CommunityAgentView = 'welcome';
    let searchQuery = '';

    switch (service) {
      case 'discovery':
        newView = 'discovery';
        break;
      case 'booking':
        newView = 'results';
        searchQuery = 'book appointment';
        break;
      case 'tasks':
        newView = 'tasks';
        break;
      case 'volunteer':
        newView = 'volunteer';
        break;
      case 'notifications':
        newView = 'notifications';
        break;
      default:
        newView = 'welcome';
    }

    addToNavigationHistory(newView);
    setState(prev => ({ 
      ...prev, 
      currentView: newView,
      searchQuery: searchQuery || prev.searchQuery
    }));
  };

  const handleSetMode = (mode: string) => {
    setState(prev => ({ ...prev, accessMode: mode }));
    
    if (mode === 'kiosk') {
      setState(prev => ({ ...prev, currentView: 'kiosk' }));
    } else if (mode === 'accessibility') {
      setState(prev => ({ ...prev, currentView: 'accessibility' }));
    } else if (mode === 'voice') {
      setState(prev => ({ ...prev, currentView: 'voice' }));
    }
  };

  const handleNavigateToResults = (query: string, filters: any) => {
    addToNavigationHistory('results');
    setState(prev => ({
      ...prev,
      currentView: 'results',
      searchQuery: query,
      searchFilters: filters
    }));
  };

  const handleBookAppointment = (serviceId: number) => {
    // Map service ID to organization data based on Adelaide organizations
    const orgMapping: Record<number, {id: number, name: string, type: string, services: string[]}> = {
      1: {
        id: 1,
        name: "Aboriginal Family Support Services",
        type: "Aboriginal & Torres Strait Islander Services",
        services: ["Cultural support", "Family services", "Emergency relief", "Advocacy"]
      },
      2: {
        id: 2,
        name: "Adelaide City Mission", 
        type: "Emergency Relief",
        services: ["Emergency accommodation", "Food relief", "Support services", "Community programs"]
      },
      3: {
        id: 3,
        name: "Adelaide Community Healthcare Alliance",
        type: "Health Services",
        services: ["Primary healthcare", "Mental health", "Dental services", "Community health"]
      },
      10: {
        id: 10,
        name: "Foodbank SA",
        type: "Food Relief", 
        services: ["Food distribution", "School programs", "Community pantries", "Emergency food"]
      },
      11: {
        id: 11,
        name: "Hutt St Centre",
        type: "Homelessness Services",
        services: ["Meals", "Accommodation", "Health services", "Case management"]
      },
      13: {
        id: 13,
        name: "Lifeline Adelaide",
        type: "Crisis Support",
        services: ["Crisis counselling", "Suicide prevention", "Community programs", "Mental health support"]
      },
      15: {
        id: 15,
        name: "Multicultural Communities Council of SA",
        type: "Multicultural Services", 
        services: ["Settlement services", "Advocacy", "Cultural programs", "Translation"]
      }
    };

    const selectedOrg = orgMapping[serviceId] || null;

    addToNavigationHistory('tasks');
    setState(prev => ({
      ...prev,
      selectedService: serviceId,
      selectedOrganization: selectedOrg,
      currentView: 'tasks'
    }));
  };

  const handleGetDirections = (serviceId: number) => {
    // In a real app, this would open maps
    console.log(`Getting directions to service ${serviceId}`);
  };

  const handleBackToWelcome = () => {
    setState(prev => ({ 
      ...prev, 
      currentView: 'welcome',
      navigationHistory: ['welcome']
    }));
  };

  const handleGoBackWithinAgent = () => {
    setState(prev => {
      const newHistory = [...prev.navigationHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1] || 'welcome';
      
      return {
        ...prev,
        currentView: previousView,
        navigationHistory: newHistory.length > 0 ? newHistory : ['welcome']
      };
    });
  };

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'welcome':
        return (
          <WelcomeScreen
            onNavigateToService={handleNavigateToService}
            onSetMode={handleSetMode}
            onNavigateToTab={onNavigateToTab}
            onBack={onGoBack}
          />
        );
      
      case 'discovery':
        return (
          <ServiceDiscoveryScreen
            onNavigateToResults={handleNavigateToResults}
            onBack={handleGoBackWithinAgent}
          />
        );
      
      case 'results':
        return (
          <ServiceResultsScreen
            query={state.searchQuery}
            filters={state.searchFilters}
            onBookAppointment={handleBookAppointment}
            onGetDirections={handleGetDirections}
            onBack={handleGoBackWithinAgent}
          />
        );
      
      case 'tasks':
        return (
          <TaskExecutionScreen 
            selectedOrganization={state.selectedOrganization}
            userQuery={state.searchQuery}
            onBack={handleGoBackWithinAgent}
          />
        );
      
      case 'volunteer':
        return <VolunteerMatchingScreen onBack={handleGoBackWithinAgent} />;
      
      case 'notifications':
        return <NotificationsScreen />;
      
      case 'accessibility':
        return (
          <AccessibilitySettingsScreen 
            onBack={handleBackToWelcome}
          />
        );
      
      case 'voice':
        return (
          <VoiceModeScreen 
            onBack={handleBackToWelcome}
            onNavigateToTab={onNavigateToTab}
            language={state.accessMode}
          />
        );
      
      case 'kiosk':
        return (
          <KioskModeScreen 
            onBack={handleBackToWelcome}
          />
        );
      
      default:
        return (
          <WelcomeScreen
            onNavigateToService={handleNavigateToService}
            onSetMode={handleSetMode}
            onNavigateToTab={onNavigateToTab}
            onBack={onGoBack}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
    </div>
  );
}