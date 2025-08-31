import React, { useState } from 'react';
import { ArrowLeft, Mic, MicOff, Users, Calendar, MapPin, Phone, Volume2, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';

interface KioskModeScreenProps {
  onBack: () => void;
}

export default function KioskModeScreen({ onBack }: KioskModeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenQuery, setSpokenQuery] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      title: "Welcome",
      instruction: "Press the microphone button or touch a service below to get started",
      action: "start"
    },
    {
      title: "Listening",
      instruction: "Please speak your request clearly into the microphone",
      action: "listen"
    },
    {
      title: "Processing",
      instruction: "Finding services that match your request...",
      action: "process"
    },
    {
      title: "Results",
      instruction: "Here are the services I found. Touch one to continue.",
      action: "results"
    }
  ];

  const quickServices = [
    {
      icon: Users,
      title: "FIND FOOD BANK",
      subtitle: "Emergency food assistance",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: Calendar,
      title: "BOOK APPOINTMENT",
      subtitle: "Government services",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: MapPin,
      title: "FIND LOCATION",
      subtitle: "Service locations near you",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      icon: Phone,
      title: "CALL FOR HELP",
      subtitle: "Speak to someone now",
      color: "bg-red-600 hover:bg-red-700"
    }
  ];

  const mockResults = [
    {
      title: "COMMUNITY FOOD HUB",
      subtitle: "0.8 km away • Open now",
      action: "GET DIRECTIONS"
    },
    {
      title: "CENTRELINK OFFICE", 
      subtitle: "1.2 km away • Book appointment",
      action: "BOOK NOW"
    },
    {
      title: "VOLUNTEER HELPER",
      subtitle: "Available now • Speaks your language",
      action: "CONNECT"
    }
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      setCurrentStep(1);
      // Simulate voice recognition
      setTimeout(() => {
        setSpokenQuery("Find nearest food bank");
        setCurrentStep(2);
        setShowProgress(true);
        
        // Simulate processing
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += 10;
          setProgress(currentProgress);
          if (currentProgress >= 100) {
            clearInterval(interval);
            setShowProgress(false);
            setCurrentStep(3);
            setIsListening(false);
          }
        }, 200);
      }, 3000);
    }
  };

  const handleServiceSelect = (service: any) => {
    setCurrentStep(2);
    setSpokenQuery(`Help with ${service.title.toLowerCase()}`);
    setShowProgress(true);
    
    // Simulate processing
    setTimeout(() => {
      setShowProgress(false);
      setCurrentStep(3);
    }, 2000);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const restartSession = () => {
    setCurrentStep(0);
    setIsListening(false);
    setSpokenQuery('');
    setShowProgress(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gov-navy p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button 
              variant="outline" 
              size="lg"
              className="text-white border-white hover:bg-white hover:text-gov-navy"
              onClick={onBack}
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              EXIT KIOSK MODE
            </Button>
            <h1 className="text-3xl font-bold">GOVNAV KIOSK</h1>
          </div>
          
          <Button 
            variant="outline"
            size="lg"
            className="text-white border-white hover:bg-white hover:text-gov-navy"
            onClick={() => speak(steps[currentStep].instruction)}
          >
            <Volume2 className="w-6 h-6 mr-3" />
            REPEAT INSTRUCTIONS
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8 mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  index <= currentStep 
                    ? 'bg-nav-teal text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    index < currentStep ? 'bg-nav-teal' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">{steps[currentStep].title}</h2>
            <p className="text-2xl text-gray-300">{steps[currentStep].instruction}</p>
          </div>
        </div>

        {/* Current Step Content */}
        {currentStep === 0 && (
          <div className="space-y-12">
            {/* Voice Button */}
            <div className="text-center">
              <Button
                size="lg"
                className={`w-64 h-64 rounded-full text-3xl font-bold ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                    : 'bg-nav-teal hover:bg-nav-teal/90'
                }`}
                onClick={handleVoiceToggle}
              >
                <div className="flex flex-col items-center space-y-4">
                  {isListening ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
                  <span>{isListening ? 'STOP' : 'SPEAK'}</span>
                </div>
              </Button>
              <p className="text-xl text-gray-400 mt-6">
                Touch the microphone and speak your request
              </p>
            </div>

            {/* Or divider */}
            <div className="flex items-center justify-center space-x-6">
              <div className="h-px bg-gray-700 flex-1" />
              <span className="text-2xl text-gray-400 font-bold">OR CHOOSE A SERVICE</span>
              <div className="h-px bg-gray-700 flex-1" />
            </div>

            {/* Quick Service Buttons */}
            <div className="grid grid-cols-2 gap-8">
              {quickServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Button
                    key={index}
                    size="lg"
                    className={`${service.color} h-32 text-2xl font-bold transition-all transform hover:scale-105`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Icon className="w-12 h-12" />
                      <div className="text-center">
                        <div>{service.title}</div>
                        <div className="text-lg opacity-90">{service.subtitle}</div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="text-center space-y-12">
            <Button
              size="lg"
              className="w-64 h-64 rounded-full text-3xl font-bold bg-red-600 hover:bg-red-700 animate-pulse"
              onClick={handleVoiceToggle}
            >
              <div className="flex flex-col items-center space-y-4">
                <MicOff className="w-16 h-16" />
                <span>LISTENING...</span>
              </div>
            </Button>
            
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-4 h-12 bg-nav-teal rounded animate-pulse`} 
                       style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-xl text-gray-300">Speak clearly into the microphone</p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center space-y-12">
            <div className="w-32 h-32 bg-nav-teal rounded-full mx-auto flex items-center justify-center animate-spin">
              <Settings className="w-16 h-16" />
            </div>
            
            {spokenQuery && (
              <div className="bg-gray-800 p-8 rounded-2xl max-w-2xl mx-auto">
                <p className="text-xl text-gray-400 mb-2">You said:</p>
                <p className="text-3xl font-bold">{spokenQuery}</p>
              </div>
            )}
            
            {showProgress && (
              <div className="max-w-2xl mx-auto">
                <Progress value={progress} className="h-4 mb-4" />
                <p className="text-xl text-gray-300">{progress}% complete</p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            {spokenQuery && (
              <div className="bg-gray-800 p-6 rounded-2xl text-center">
                <p className="text-xl text-gray-400 mb-2">Results for:</p>
                <p className="text-2xl font-bold">{spokenQuery}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
              {mockResults.map((result, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">{result.title}</h3>
                        <p className="text-xl text-gray-300">{result.subtitle}</p>
                      </div>
                      <Button 
                        size="lg"
                        className="bg-nav-teal hover:bg-nav-teal/90 text-xl font-bold px-8 py-4"
                      >
                        {result.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <Button 
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black text-xl px-8 py-4"
            onClick={restartSession}
          >
            START OVER
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black text-xl px-8 py-4"
            onClick={() => speak("Press the microphone button to speak your request, or choose a service from the options above")}
          >
            <Volume2 className="w-6 h-6 mr-3" />
            HELP
          </Button>
        </div>
      </div>
    </div>
  );
}