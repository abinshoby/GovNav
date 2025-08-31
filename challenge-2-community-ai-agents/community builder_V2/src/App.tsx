import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import NavigatorScreen from './components/NavigatorScreen';
import CommunityAgentScreen from './components/CommunityAgentScreen';
import DatasetsScreen from './components/DatasetsScreen';
import HelpScreen from './components/HelpScreen';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { TranslationProvider } from './components/TranslationProvider';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['home']);

  const handleNavigateToNavigator = () => {
    setActiveTab('navigator');
    addToHistory('navigator');
  };

  const handleNavigateToAI = () => {
    setActiveTab('ai-assistant');
    addToHistory('ai-assistant');
  };

  const handleTabChange = (tab: string) => {
    // If Community Agent is clicked, always redirect to ai-assistant
    if (tab === 'ai-assistant') {
      setActiveTab('ai-assistant');
      addToHistory('ai-assistant');
    } else {
      setActiveTab(tab);
      addToHistory(tab);
    }
  };

  const addToHistory = (tab: string) => {
    setNavigationHistory(prev => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== tab) {
        newHistory.push(tab);
      }
      return newHistory.slice(-10); // Keep last 10 navigation items
    });
  };

  const handleGoBack = () => {
    // Always redirect back button to community agent page
    setActiveTab('ai-assistant');
    addToHistory('ai-assistant');
  };

  const handleGoHome = () => {
    setActiveTab('home');
    setNavigationHistory(['home']);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            onNavigateToNavigator={handleNavigateToNavigator}
            onNavigateToAI={handleNavigateToAI}
          />
        );
      case 'navigator':
        return <NavigatorScreen />;
      case 'ai-assistant':
        return (
          <CommunityAgentScreen 
            onNavigateToTab={handleTabChange}
            onGoBack={handleGoBack}
            onGoHome={handleGoHome}
          />
        );
      case 'datasets':
        return <DatasetsScreen />;
      case 'help':
        return <HelpScreen />;
      default:
        return (
          <HomeScreen 
            onNavigateToNavigator={handleNavigateToNavigator}
            onNavigateToAI={handleNavigateToAI}
          />
        );
    }
  };

  return (
    <TranslationProvider>
      <AccessibilityProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            onGoHome={handleGoHome}
          />
          {renderActiveScreen()}
        </div>
      </AccessibilityProvider>
    </TranslationProvider>
  );
}