import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Navigation, Bot, Building, Users, Shield, Zap, FileText, MapPin, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  onNavigateToNavigator: () => void;
  onNavigateToAI: () => void;
}

export default function HomeScreen({ onNavigateToNavigator, onNavigateToAI }: HomeScreenProps) {
  const features = [
    {
      icon: Navigation,
      title: "Regulation Finder",
      description: "Multi-step form to identify all your regulatory obligations across jurisdictions",
      color: "text-gov-navy",
      action: onNavigateToNavigator
    },
    {
      icon: CheckCircle,
      title: "Results & Checklist",
      description: "Get organized compliance roadmaps with progress tracking and plain-language summaries",
      color: "text-nav-teal",
      action: onNavigateToNavigator
    },
    {
      icon: MapPin,
      title: "Interactive Visualization",
      description: "See regulatory relationships and conflicts mapped across jurisdictions",
      color: "text-accent-yellow",
      action: onNavigateToNavigator
    },
    {
      icon: Bot,
      title: "AI Document Analysis",
      description: "Upload regulatory documents for instant AI-powered analysis and summaries",
      color: "text-purple-600",
      action: onNavigateToAI
    }
  ];

  const problemAreas = [
    "Overlapping federal, state, and local requirements",
    "Conflicting regulations across jurisdictions", 
    "Complex compliance procedures and timelines",
    "Difficulty finding the right regulator to contact",
    "Understanding plain-English summaries of legal obligations"
  ];

  const exampleScenarios = [
    {
      icon: "🍽️",
      title: "Opening a Café in Sydney",
      description: "Navigate food safety, council permits, and employment law",
      jurisdictions: ["Local", "NSW State", "Federal"]
    },
    {
      icon: "🛡️", 
      title: "Cybersecurity Start-up in Canberra",
      description: "Handle privacy laws, security clearances, and procurement",
      jurisdictions: ["ACT Territory", "Federal"]
    },
    {
      icon: "🏗️",
      title: "Residential Construction in Brisbane", 
      description: "Manage building codes, WHS, and environmental requirements",
      jurisdictions: ["Local", "QLD State", "Federal"]
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
                  GovNav
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gov-navy to-nav-teal">
                    Cut through the maze of overlapping rules
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Navigate Australia's complex regulatory landscape with confidence. Identify overlapping obligations, detect conflicts, and get plain-language guidance across local, state, and federal jurisdictions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onNavigateToNavigator}
                  size="lg"
                  className="bg-gov-navy hover:bg-gov-navy/90 text-white px-8 py-3 rounded-lg flex items-center space-x-2"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Get Started</span>
                </Button>
                <Button 
                  onClick={onNavigateToNavigator}
                  variant="outline"
                  size="lg"
                  className="border-nav-teal text-nav-teal hover:bg-nav-teal/10 px-8 py-3 rounded-lg flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>See Examples</span>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-accent-yellow" />
                  <span>Instant Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Government Data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-gov-navy" />
                  <span>Multi-Jurisdiction</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-yellow/20 to-nav-teal/20 rounded-3xl transform rotate-3"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWd1bGF0aW9uJTIwbmF2aWdhdGlvbnxlbnwxfHx8fDE3NTY0MzczMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Regulation and navigation concept"
                className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Challenge: Navigating Australia's Regulatory Maze
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            For businesses and individuals, understanding 'who regulates what' can be frustrating and time-consuming—especially when regulations overlap, duplicate each other, or conflict across agencies.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800">Common Problems We Solve</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problemAreas.map((problem, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-red-800">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Solution: Smart Regulation Navigation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powered by Commonwealth datasets and AI, we make regulation transparent, navigable, and user-friendly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={feature.action}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="flex items-center space-x-2 text-nav-teal">
                    <span className="text-sm font-medium">Try it now</span>
                    <Navigation className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Example Scenarios */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real-World Examples
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how the Navigator helps with common Australian business scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exampleScenarios.map((scenario, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="text-4xl mb-4">{scenario.icon}</div>
                  <h3 className="font-semibold text-gray-900">{scenario.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{scenario.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.jurisdictions.map((jurisdiction, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                      >
                        {jurisdiction}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={onNavigateToNavigator}
              size="lg"
              className="bg-nav-teal hover:bg-nav-teal/90 text-white px-8 py-3 rounded-lg flex items-center space-x-2 mx-auto"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Start Your Compliance Journey</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-gov-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Powered by Official Government Data
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Built using authoritative Commonwealth datasets for accurate, up-to-date regulatory information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-4 text-accent-yellow" />
              <h3 className="font-semibold mb-2">Commonwealth Statute Book</h3>
              <p className="text-sm text-blue-100">Complete collection of all Commonwealth Acts and Statutory Rules</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <Scale className="w-8 h-8 mx-auto mb-4 text-accent-yellow" />
              <h3 className="font-semibold mb-2">Federal Register of Legislation</h3>
              <p className="text-sm text-blue-100">Official register with full text of Commonwealth legislation</p>
            </div>
            <div className="bg-white/10 rounded-lg p-6 text-center">
              <Building className="w-8 h-8 mx-auto mb-4 text-accent-yellow" />
              <h3 className="font-semibold mb-2">Government Organisations Register</h3>
              <p className="text-sm text-blue-100">Authoritative list of all Australian Government bodies</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-accent-yellow/20 px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5 text-accent-yellow" />
              <span className="text-accent-yellow font-medium">GovHack 2025 Challenge Entry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}