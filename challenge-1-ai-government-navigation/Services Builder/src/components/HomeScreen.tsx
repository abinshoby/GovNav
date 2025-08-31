import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Navigation, Bot, Building, Users, Shield, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  onNavigateToNavigator: () => void;
  onNavigateToAI: () => void;
}

export default function HomeScreen({ onNavigateToNavigator, onNavigateToAI }: HomeScreenProps) {
  const features = [
    {
      icon: Navigation,
      title: "Red Tape Navigator",
      description: "Cut through complex regulations and compliance requirements",
      color: "text-blue-600"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get instant help accessing local government services",
      color: "text-teal-600"
    },
    {
      icon: Shield,
      title: "Compliance Check",
      description: "Ensure your business meets all regulatory requirements",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Community Connect",
      description: "Connect with local services and volunteer opportunities",
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Navigate Government.
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    Simplified.
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Cut through regulations & access services easily. Whether you're a business navigating compliance or a resident seeking local services, we've got you covered.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onNavigateToNavigator}
                  size="lg"
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg flex items-center space-x-2"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Start Navigator</span>
                </Button>
                <Button 
                  onClick={onNavigateToAI}
                  variant="outline"
                  size="lg"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-lg flex items-center space-x-2"
                >
                  <Bot className="w-5 h-5" />
                  <span>Use AI Assistant</span>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Community Focused</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-teal-100 rounded-3xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1742888827024-6d85caf1d09b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwYnVpbGRpbmclMjBtb2Rlcm58ZW58MXx8fHwxNzU2NDM3Mjk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern government building"
                className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to navigate government
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From business compliance to community services, our platform provides the tools and guidance you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Regulations Mapped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Government Services</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Assistance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}