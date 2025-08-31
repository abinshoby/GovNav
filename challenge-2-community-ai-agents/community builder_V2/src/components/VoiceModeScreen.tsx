import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Settings, Users, Calendar, MapPin, Phone, ExternalLink, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface VoiceModeScreenProps {
  onBack: () => void;
  onNavigateToTab?: (tab: string) => void;
  language?: string;
}

export default function VoiceModeScreen({ onBack, onNavigateToTab, language = 'en-AU' }: VoiceModeScreenProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<Array<{type: 'user' | 'agent', text: string, timestamp: Date, suggestions?: Array<{text: string, action: string}>, actionCompleted?: boolean}>>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [suggestions, setSuggestions] = useState<Array<{text: string, action: string}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const voiceCommands = {
    'en-AU': {
      welcome: 'Welcome to Voice Mode. You can speak naturally to find services, book appointments, or get help. Say "help" for available commands.',
      commands: [
        { phrase: 'find food bank', action: 'search', description: 'Search for nearby food banks' },
        { phrase: 'book appointment', action: 'book', description: 'Schedule government appointments' },
        { phrase: 'my tasks', action: 'tasks', description: 'Check your current tasks' },
        { phrase: 'call volunteer', action: 'volunteer', description: 'Connect with a volunteer helper' },
        { phrase: 'go to home', action: 'navigate:home', description: 'Navigate to home screen' },
        { phrase: 'go to services', action: 'navigate:navigator', description: 'Navigate to services tab' },
        { phrase: 'show datasets', action: 'navigate:datasets', description: 'Navigate to datasets tab' },
        { phrase: 'get help', action: 'navigate:help', description: 'Navigate to help section' },
        { phrase: 'open red tape', action: 'navigate:navigator', description: 'Open red tape navigator' },
        { phrase: 'show community', action: 'navigate:ai-assistant', description: 'Open community agent' },
        { phrase: 'help', action: 'help', description: 'List available voice commands' },
        { phrase: 'settings', action: 'settings', description: 'Adjust voice settings' },
        { phrase: 'go back', action: 'back', description: 'Return to main menu' }
      ],
      listening: 'I\'m listening. Please speak your request.',
      processing: 'Processing your request...',
      notUnderstood: 'I didn\'t understand that. Please try saying it differently or say "help" for available commands.'
    },
    'ar-SA': {
      welcome: 'مرحباً بك في الوضع الصوتي. يمكنك التحدث بشكل طبيعي للعثور على الخدمات أو حجز المواعيد أو الحصول على المساعدة. قل "مساعدة" للأوامر المتاحة.',
      commands: [
        { phrase: 'البحث عن بنك الطعام', action: 'search', description: 'البحث عن بنوك الطعام القريبة' },
        { phrase: 'حجز موعد', action: 'book', description: 'جدولة المواعيد الحكومية' },
        { phrase: 'مهامي', action: 'tasks', description: 'فحص مهامك الحالية' },
        { phrase: 'اتصال بمتطوع', action: 'volunteer', description: 'التواصل مع مساعد متطوع' },
        { phrase: 'مساعدة', action: 'help', description: 'قائمة أوامر الصوت المتاحة' },
        { phrase: 'الإعدادات', action: 'settings', description: 'ضبط إعدادات الصوت' },
        { phrase: 'عودة', action: 'back', description: 'العودة إلى القائمة الرئيسية' }
      ],
      listening: 'أنا أستمع. يرجى التحدث بطلبك.',
      processing: 'معالجة طلبك...',
      notUnderstood: 'لم أفهم ذلك. يرجى المحاولة بطريقة مختلفة أو قل "مساعدة" للأوامر المتاحة.'
    }
  };

  const currentLangData = voiceCommands[language as keyof typeof voiceCommands] || voiceCommands['en-AU'];

  useEffect(() => {
    // Welcome message when component loads
    setTimeout(() => {
      speakText(currentLangData.welcome);
    }, 500);

    // Simulate voice level animation when listening
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setVoiceLevel(Math.random() * 100);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      speakText('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      speakText(currentLangData.listening);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setCurrentCommand(transcript);
      
      // Add to conversation history
      setConversationHistory(prev => [...prev, {
        type: 'user',
        text: transcript,
        timestamp: new Date()
      }]);

      processVoiceCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      speakText(currentLangData.notUnderstood);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Enhanced NLU processing
  const processVoiceCommand = (command: string) => {
    setIsProcessing(true);
    speakText(currentLangData.processing);
    
    // Enhanced pattern matching with fuzzy logic
    const normalizedCommand = command.toLowerCase().trim();
    
    // Intent classification with multiple patterns
    const intents = {
      search: ['find', 'search', 'look for', 'locate', 'where is', 'food bank', 'service'],
      book: ['book', 'schedule', 'appointment', 'reserve', 'make appointment'],
      tasks: ['tasks', 'my tasks', 'what do i have', 'check tasks', 'status'],
      volunteer: ['volunteer', 'helper', 'talk to someone', 'connect', 'help me'],
      navigation: ['go to', 'open', 'show', 'navigate', 'take me to'],
      help: ['help', 'what can you do', 'commands', 'options']
    };

    // Find best matching intent
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [intent, patterns] of Object.entries(intents)) {
      const score = patterns.reduce((acc, pattern) => {
        return acc + (normalizedCommand.includes(pattern) ? 1 : 0);
      }, 0);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    }

    // Navigation detection
    if (bestMatch === 'navigation' || normalizedCommand.includes('go to') || normalizedCommand.includes('open')) {
      const navTargets = {
        'home': ['home', 'main', 'start'],
        'navigator': ['services', 'red tape', 'navigator', 'regulations'],
        'datasets': ['data', 'datasets', 'information'],
        'help': ['help', 'support', 'assistance'],
        'ai-assistant': ['community', 'agent', 'assistant', 'ai']
      };
      
      for (const [tab, keywords] of Object.entries(navTargets)) {
        if (keywords.some(keyword => normalizedCommand.includes(keyword))) {
          handleNavigationCommand(tab);
          setIsProcessing(false);
          return;
        }
      }
    }

    setTimeout(() => {
      setIsProcessing(false);
      let response = '';
      let newSuggestions: Array<{text: string, action: string}> = [];
      
      switch (bestMatch) {
        case 'search':
          response = 'I found 3 food banks near you. The closest is Community Food Hub, 0.8 kilometers away.';
          newSuggestions = [
            { text: 'Get Directions', action: 'directions' },
            { text: 'Call Location', action: 'call' },
            { text: 'Book Visit', action: 'book' }
          ];
          break;
        case 'book':
          response = 'I found available appointment slots this week. Tuesday at 10:30 AM and Thursday at 2:00 PM are available.';
          newSuggestions = [
            { text: 'Book Tuesday 10:30 AM', action: 'book:tuesday' },
            { text: 'Book Thursday 2:00 PM', action: 'book:thursday' },
            { text: 'See More Times', action: 'more_times' }
          ];
          break;
        case 'tasks':
          response = 'You have 2 active tasks: Medicare application in progress, and food bank appointment confirmed for Thursday 2 PM.';
          newSuggestions = [
            { text: 'View Task Details', action: 'task_details' },
            { text: 'Add New Task', action: 'new_task' },
            { text: 'Set Reminder', action: 'reminder' }
          ];
          break;
        case 'volunteer':
          response = 'I found 3 volunteers available now. Sarah speaks English and Mandarin, Ahmed speaks Arabic, and Maria speaks Spanish.';
          newSuggestions = [
            { text: 'Connect with Sarah', action: 'volunteer:sarah' },
            { text: 'Connect with Ahmed', action: 'volunteer:ahmed' },
            { text: 'Connect with Maria', action: 'volunteer:maria' }
          ];
          break;
        case 'help':
          response = 'I can help you find services, book appointments, check tasks, connect with volunteers, or navigate the app. Try saying "find food bank" or "go to services tab".';
          newSuggestions = [
            { text: 'Find Services', action: 'search' },
            { text: 'Book Appointment', action: 'book' },
            { text: 'Check Tasks', action: 'tasks' },
            { text: 'Connect with Volunteer', action: 'volunteer' }
          ];
          break;
        default:
          response = currentLangData.notUnderstood + ' Try saying "find food bank", "book appointment", or "go to services tab".';
          newSuggestions = [
            { text: 'Find Food Bank', action: 'search' },
            { text: 'Book Appointment', action: 'book' },
            { text: 'Go to Services', action: 'navigate:navigator' }
          ];
      }
      
      setSuggestions(newSuggestions);
      speakText(response);
      
      // Add to conversation history with suggestions
      setConversationHistory(prev => [...prev, {
        type: 'agent',
        text: response,
        timestamp: new Date(),
        suggestions: newSuggestions
      }]);
    }, 1000);
  };

  const handleNavigationCommand = (tab: string) => {
    const responses = {
      'home': 'Navigating to home screen.',
      'navigator': 'Opening the Red Tape Navigator to help you find government regulations and services.',
      'datasets': 'Opening the datasets section where you can access government data.',
      'help': 'Opening the help section for support and documentation.',
      'ai-assistant': 'You are already in the Community Agent section.'
    };
    
    const response = responses[tab as keyof typeof responses] || 'Navigating to the requested section.';
    speakText(response);
    
    // Add completion feedback to conversation
    setConversationHistory(prev => [...prev, {
      type: 'agent',
      text: response,
      timestamp: new Date(),
      actionCompleted: true
    }]);
    
    if (onNavigateToTab && tab !== 'ai-assistant') {
      setTimeout(() => {
        onNavigateToTab(tab);
      }, 1500);
    }
  };

  const handleSuggestionClick = (suggestion: {text: string, action: string}) => {
    // Process the suggestion action
    setCurrentCommand(suggestion.text);
    
    if (suggestion.action.startsWith('navigate:')) {
      const tab = suggestion.action.replace('navigate:', '');
      handleNavigationCommand(tab);
    } else {
      processVoiceCommand(suggestion.text.toLowerCase());
    }
    
    // Clear current suggestions
    setSuggestions([]);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Voice Mode
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              Voice Mode Active
            </Badge>
            
            {isSpeaking && (
              <Button size="sm" variant="outline" onClick={stopSpeaking}>
                <VolumeX className="w-4 h-4 mr-2" />
                Stop Speaking
              </Button>
            )}
          </div>
        </div>

        {/* Main Voice Interface */}
        <div className="text-center mb-12">
          <h1 className="text-heading text-gov-navy mb-6">
            Voice Assistant Mode
          </h1>
          
          {/* Voice Activation Button */}
          <div className="relative mb-8">
            <Button
              size="lg"
              className={`w-48 h-48 rounded-full text-2xl font-bold transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={isListening ? () => setIsListening(false) : startListening}
              disabled={isSpeaking}
            >
              <div className="flex flex-col items-center space-y-4">
                {isListening ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
                <span className="text-lg">
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to Speak'}
                </span>
              </div>
            </Button>

            {/* Voice Level Indicator */}
            {isListening && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32">
                <Progress value={voiceLevel} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">Voice Level</p>
              </div>
            )}
          </div>

          {/* Current Command Display */}
          {currentCommand && (
            <Card className="mb-8 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <p className="text-sm text-blue-600 mb-1">You said:</p>
                <p className="text-lg font-medium text-blue-900">"{currentCommand}"</p>
                {isProcessing && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-blue-600 ml-2">Processing...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Interactive Suggestions */}
          {suggestions.length > 0 && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 text-left hover:bg-green-100 hover:border-green-300 transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{suggestion.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-green-600 mt-3">
                  💡 Click any suggestion or say it out loud
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Voice Commands */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-subheading mb-4 flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Quick Voice Commands</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLangData.commands.slice(0, 6).map((command, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setCurrentCommand(command.phrase);
                    processVoiceCommand(command.phrase);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {command.action === 'search' && <MapPin className="w-5 h-5 text-blue-500" />}
                    {command.action === 'book' && <Calendar className="w-5 h-5 text-green-500" />}
                    {command.action === 'tasks' && <Settings className="w-5 h-5 text-purple-500" />}
                    {command.action === 'volunteer' && <Users className="w-5 h-5 text-orange-500" />}
                    {command.action === 'help' && <Phone className="w-5 h-5 text-red-500" />}
                    {command.action === 'settings' && <Settings className="w-5 h-5 text-gray-500" />}
                    
                    <div>
                      <p className="font-medium text-gray-900">"{command.phrase}"</p>
                      <p className="text-sm text-gray-600">{command.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-subheading mb-4">Conversation History</h2>
              
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {conversationHistory.slice(-5).map((message, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-100 ml-8' 
                        : message.actionCompleted 
                          ? 'bg-green-100 mr-8 border-l-4 border-green-500'
                          : 'bg-gray-100 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {message.type === 'user' ? 'You' : 'Assistant'}
                        </span>
                        {message.actionCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                    
                    {/* Show suggestions from conversation history */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, suggestionIndex) => (
                            <Button
                              key={suggestionIndex}
                              size="sm"
                              variant="outline"
                              className="h-auto py-1 px-2 text-xs"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConversationHistory([])}
                >
                  Clear History
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Instructions */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            💡 <strong>Tips:</strong> Speak clearly and naturally. You can interrupt me by tapping the microphone again.
          </p>
          <p>
            🎤 Say "help" to hear all available commands, or tap any quick command above to try it.
          </p>
        </div>
      </div>
    </div>
  );
}