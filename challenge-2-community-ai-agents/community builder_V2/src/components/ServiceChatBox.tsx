import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useTranslation } from './TranslationProvider';
import { useAccessibility } from './AccessibilityProvider';
import { motion, AnimatePresence } from 'motion/react';

interface ServiceMatch {
  id: string;
  name: string;
  description: string;
  confidence: number;
  redirect: string;
  category: 'service' | 'booking' | 'task' | 'volunteer';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  matches?: ServiceMatch[];
  suggestions?: string[];
}

interface ServiceChatBoxProps {
  onServiceRedirect: (serviceType: string) => void;
  onServiceMatch: (matches: ServiceMatch[]) => void;
  className?: string;
}

export default function ServiceChatBox({
  onServiceRedirect,
  onServiceMatch,
  className = ''
}: ServiceChatBoxProps) {
  const { t, currentLanguage } = useTranslation();
  const { settings, speakText, announceToScreenReader, triggerHapticFeedback } = useAccessibility();
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<{ user: string; agent: string } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Predefined service patterns for matching
  const servicePatterns = [
    {
      patterns: [/food\s+bank/i, /food\s+assistance/i, /hungry/i, /meal/i, /grocery/i],
      matches: [{
        id: 'food-assistance',
        name: 'Food Banks & Assistance',
        description: 'Emergency food support and grocery assistance',
        confidence: 0.9,
        redirect: 'discovery',
        category: 'service' as const
      }]
    },
    {
      patterns: [/housing/i, /shelter/i, /accommodation/i, /rent/i, /homeless/i],
      matches: [{
        id: 'housing-support',
        name: 'Housing Support Services',
        description: 'Emergency housing, rent assistance, and shelter services',
        confidence: 0.9,
        redirect: 'discovery',
        category: 'service' as const
      }]
    },
    {
      patterns: [/appointment/i, /book/i, /schedule/i, /meeting/i],
      matches: [{
        id: 'book-appointment',
        name: 'Appointment Booking',
        description: 'Schedule appointments with government offices',
        confidence: 0.9,
        redirect: 'booking',
        category: 'booking' as const
      }]
    },
    {
      patterns: [/health/i, /medical/i, /doctor/i, /clinic/i, /hospital/i],
      matches: [{
        id: 'healthcare',
        name: 'Healthcare Services',
        description: 'Medical services, clinics, and health support',
        confidence: 0.9,
        redirect: 'discovery',
        category: 'service' as const
      }]
    },
    {
      patterns: [/job/i, /employment/i, /work/i, /career/i, /unemployment/i],
      matches: [{
        id: 'employment',
        name: 'Employment Services',
        description: 'Job search assistance and employment support',
        confidence: 0.9,
        redirect: 'discovery',
        category: 'service' as const
      }]
    },
    {
      patterns: [/volunteer/i, /help\s+me/i, /talk\s+to\s+someone/i, /support/i],
      matches: [{
        id: 'volunteer-help',
        name: 'Volunteer Support',
        description: 'Connect with local volunteers for assistance',
        confidence: 0.85,
        redirect: 'volunteer',
        category: 'volunteer' as const
      }]
    },
    {
      patterns: [/task/i, /application/i, /status/i, /progress/i],
      matches: [{
        id: 'check-tasks',
        name: 'Task Management',
        description: 'Check your application status and manage tasks',
        confidence: 0.85,
        redirect: 'tasks',
        category: 'task' as const
      }]
    }
  ];

  const suggestions = [
    "Find food banks near me",
    "Book a government appointment",
    "Check my application status",
    "Connect with a volunteer",
    "Find housing assistance",
    "Look for healthcare services"
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // Map Kaurna to closest supported language (English) for speech recognition
      const speechLang = currentLanguage === 'kau-AU' ? 'en-AU' : currentLanguage;
      recognitionRef.current.lang = speechLang;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
        announceToScreenReader(`Voice input received: ${transcript}`);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        speakText('Sorry, I couldn\'t understand that. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [currentLanguage, announceToScreenReader, speakText]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeMessage = (input: string): ServiceMatch[] => {
    const matches: ServiceMatch[] = [];
    const normalizedInput = input.toLowerCase();

    for (const pattern of servicePatterns) {
      for (const regex of pattern.patterns) {
        if (regex.test(normalizedInput)) {
          matches.push(...pattern.matches);
          break;
        }
      }
    }

    // Remove duplicates based on ID
    return matches.filter((match, index, self) => 
      index === self.findIndex(m => m.id === match.id)
    );
  };

  const generateResponse = (matches: ServiceMatch[], userInput: string): string => {
    if (matches.length === 0) {
      return `I understand you're looking for "${userInput}". Let me search our database for relevant services. You can also try the service discovery to find what you need.`;
    }

    if (matches.length === 1) {
      const match = matches[0];
      return `I found a perfect match for your request! I can help you with ${match.name}. ${match.description}. Would you like me to take you there?`;
    }

    return `I found ${matches.length} services that might help you. Here are the best matches based on your request.`;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    triggerHapticFeedback('light');

    // Clear input
    const userInput = message.trim();
    setMessage('');
    setShowSuggestions(false);

    // Analyze the message for service matches
    const matches = analyzeMessage(userInput);
    const response = generateResponse(matches, userInput);

    // Simulate processing delay
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date(),
        matches: matches.length > 0 ? matches : undefined,
        suggestions: matches.length === 0 ? ['Try "Find food banks"', 'Try "Book appointment"', 'Try "Get help"'] : undefined
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsProcessing(false);
      
      // Store for voice-over
      setLastResponse({
        user: userInput,
        agent: response
      });

      // Speak response if voice guidance is enabled
      if (settings.voiceGuidance) {
        speakText(response);
      }

      // Trigger service match callback
      if (matches.length > 0) {
        onServiceMatch(matches);
      }

      announceToScreenReader(`Agent response: ${response}`);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      speakText('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      triggerHapticFeedback('medium');
      recognitionRef.current.start();
      speakText('Listening for your request');
    }
  };

  const handleServiceRedirect = (match: ServiceMatch) => {
    triggerHapticFeedback('medium');
    speakText(`Redirecting to ${match.name}`);
    announceToScreenReader(`Navigating to ${match.name} service`);
    onServiceRedirect(match.redirect);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    triggerHapticFeedback('light');
    setShowSuggestions(false);
    // Auto-submit after a short delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleVoiceOver = () => {
    if (!lastResponse) {
      speakText('No recent conversation to read');
      return;
    }

    const textToRead = `You said: ${lastResponse.user}. I responded: ${lastResponse.agent}`;
    speakText(textToRead);
    triggerHapticFeedback('light');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="max-h-64 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  
                  {/* Service Matches */}
                  {msg.matches && msg.matches.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.matches.map((match) => (
                        <Button
                          key={match.id}
                          size="sm"
                          variant="outline"
                          className="w-full text-left h-auto p-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
                          onClick={() => handleServiceRedirect(match)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium text-xs">{match.name}</div>
                              <div className="text-xs text-gray-600">{match.description}</div>
                            </div>
                            <ArrowRight className="w-3 h-3 ml-2 flex-shrink-0" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {msg.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white text-gray-900 border px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing your request...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-left h-auto p-3 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{suggestion}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Chat Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('welcomeScreen.chatPlaceholder')}
                className="pr-12"
                disabled={isProcessing}
              />
              
              {/* Voice Input Button */}
              <Button
                size="sm"
                variant="ghost"
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                  isListening ? 'text-red-500 animate-pulse' : 'text-gray-500'
                }`}
                onClick={handleVoiceInput}
                disabled={isProcessing}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isProcessing}
              className="px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
            
            {/* Voice-over Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceOver}
              disabled={!lastResponse}
              title={t('welcomeScreen.voiceOverButton')}
              className="px-3"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          {isListening && (
            <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening for your request...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}