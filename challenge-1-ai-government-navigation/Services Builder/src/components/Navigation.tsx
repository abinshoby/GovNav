import React from "react";
import {
  Compass,
  Home,
  Navigation as NavigationIcon,
  Bot,
  Database,
  HelpCircle,
  Settings,
  Presentation,
} from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
}: NavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    {
      id: "navigator",
      label: "Navigator",
      icon: NavigationIcon,
    },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot },
    {
      id: "gov-services-ai",
      label: "Services Agent",
      icon: Settings,
    },
    { id: "datasets", label: "Datasets", icon: Database },
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "ai-slide", label: "AI Presentation", icon: Presentation },
  ];

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-teal-600 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              GovNav
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={
                    activeTab === tab.id ? "default" : "ghost"
                  }
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    activeTab === tab.id
                      ? "bg-blue-900 text-white hover:bg-blue-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <NavigationIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}