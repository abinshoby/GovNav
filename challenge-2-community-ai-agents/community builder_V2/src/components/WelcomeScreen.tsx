import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, CheckSquare, Users, Phone, Volume2, VolumeX, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import BackButton from './BackButton';
import { useAccessibility } from './AccessibilityProvider';
import { useActionFeedback } from './ActionFeedback';
import { useTranslation } from './TranslationProvider';

interface WelcomeScreenProps {
  onNavigateToService: (service: string) => void;
  onSetMode: (mode: string) => void;
  onNavigateToTab?: (tab: string) => void;
  onBack?: () => void;
}

export default function WelcomeScreen({ 
  onNavigateToService, 
  onSetMode, 
  onNavigateToTab,
  onBack 
}: WelcomeScreenProps) {
  const { settings, speakText, announceToScreenReader, triggerHapticFeedback } = useAccessibility();
  const { showFeedback } = useActionFeedback();
  const { t, currentLanguage, setLanguage, availableLanguages } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // Remove the old language configurations - now handled by TranslationProvider

  // Check for voice synthesis support
  useEffect(() => {
    setVoiceSupported('speechSynthesis' in window);
  }, []);

  const getCurrentLanguage = () => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];
  };

  const speakLocalText = (text: string, language: string = currentLanguage) => {
    if (!voiceSupported) return;

    // Stop any current speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    speechSynthesis.speak(utterance);
  };

  const speakWelcomeMessage = () => {
    const welcomeText = `${t('welcomeScreen.greeting')}. ${t('welcomeScreen.howCanHelp')}`;
    speakLocalText(welcomeText);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };
  const mainOptions = [
    {
      icon: MessageSquare,
      title: t('welcomeScreen.discoverServices'),
      description: t('welcomeScreen.discoverServicesDesc'),
      action: () => onNavigateToService('discovery')
    },
    {
      icon: Calendar,
      title: t('welcomeScreen.bookAppointment'),
      description: t('welcomeScreen.bookAppointmentDesc'),
      action: () => onNavigateToService('booking')
    },
    {
      icon: CheckSquare,
      title: t('welcomeScreen.checkTasks'),
      description: t('welcomeScreen.checkTasksDesc'),
      action: () => onNavigateToService('tasks')
    },
    {
      icon: Users,
      title: t('welcomeScreen.talkToVolunteer'),
      description: t('welcomeScreen.talkToVolunteerDesc'),
      action: () => onNavigateToService('volunteer')
    }
  ];

  // Remove access modes section as requested



  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    triggerHapticFeedback('light');
    speakText(`Language changed to ${availableLanguages.find(l => l.code === newLanguage)?.nativeName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nav-teal/10 via-white to-gov-navy/5">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      

      
      <div id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Agent Greeting */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-nav-teal to-gov-navy rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Users className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-heading text-gov-navy mb-4">
            {t('welcomeScreen.greeting')}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {t('welcomeScreen.howCanHelp')}
          </p>

          {/* Voice and Language Controls */}
          <div className="flex justify-center items-center space-x-6 mb-8">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('welcomeScreen.language')} />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center space-x-2">
                        <span>{language.flag}</span>
                        <span>{language.nativeName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Read Aloud Button */}
            {voiceSupported && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={speakWelcomeMessage}
                  disabled={isPlaying}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isPlaying ? t('welcomeScreen.speaking') : 'Read Aloud'}
                </Button>
                
                {isPlaying && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopSpeaking}
                  >
                    <VolumeX className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {!voiceSupported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 max-w-md mx-auto">
              <p className="text-sm text-yellow-800">
                Voice guidance is not supported in your browser. Please use a modern browser for the best experience.
              </p>
            </div>
          )}
        </div>

        {/* Main Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mainOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 border-2 hover:border-nav-teal"
                onClick={option.action}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-nav-teal/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-nav-teal" />
                  </div>
                  <h3 className="text-subheading text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>



        {/* Remove the entire "Choose Your Preferred Way to Interact" section as requested */}

        {/* Quick Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            {t('welcomeScreen.needHelp')}
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="sm" 
              className="bg-gov-navy hover:bg-gov-navy/90"
              onClick={() => {
                triggerHapticFeedback('light');
                speakText('Calling government help line');
                showFeedback({
                  type: 'info',
                  action: 'call',
                  message: 'Connecting to Help Line',
                  details: 'Calling (555) 123-HELP',
                  duration: 4000
                });
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              {t('welcomeScreen.callHelp')}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                triggerHapticFeedback('light');
                speakText('Redirecting to volunteer chat');
                onNavigateToService('volunteer');
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {t('welcomeScreen.liveChat')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}