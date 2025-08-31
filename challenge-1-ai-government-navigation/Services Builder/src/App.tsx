import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import NavigatorScreen from './components/NavigatorScreen';
import AIAgentScreen from './components/AIAgentScreen';
import EnhancedAIAgentScreen from './components/EnhancedAIAgentScreen';
import GovServicesAIScreen from './components/GovServicesAIScreen';
import DatasetsScreen from './components/DatasetsScreen';
import HelpScreen from './components/HelpScreen';
import AIAssistantSlide from './components/AIAssistantSlide';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigateToNavigator = () => {
    setActiveTab('navigator');
  };

  const handleNavigateToAI = () => {
    setActiveTab('ai-assistant');
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
        return <EnhancedAIAgentScreen />;
      case 'gov-services-ai':
        return <GovServicesAIScreen />;
      case 'datasets':
        return <DatasetsScreen />;
      case 'help':
        return <HelpScreen />;
      case 'ai-slide':
        return <AIAssistantSlide />;
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
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderActiveScreen()}
    </div>
  );
}