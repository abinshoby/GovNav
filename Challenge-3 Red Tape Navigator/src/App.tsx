import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomeScreen from './components/HomeScreen';
import NavigatorScreen from './components/NavigatorScreen';
import AIAgentScreen from './components/AIAgentScreen';
import DatasetsScreen from './components/DatasetsScreen';
import HelpScreen from './components/HelpScreen';
import AboutDataScreen from './components/AboutDataScreen';
import { Toaster } from './components/ui/sonner';




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
        return <AIAgentScreen />;
      case 'datasets':
        return <DatasetsScreen />;
      case 'about':
        return <AboutDataScreen />;
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
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderActiveScreen()}
      <Toaster />
    </div>
  );
}