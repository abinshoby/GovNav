import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, Check, Clock, Bell, Baby, Briefcase, Heart, Home, TrendingUp, Brain, Shield, Eye, Users, Lock, ExternalLink, Languages, MessageSquare, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import RealTimeVoiceAgent from './RealTimeVoiceAgent';

// Language support system
type SupportedLanguage = 'en' | 'zh' | 'ar' | 'es' | 'vi' | 'it' | 'el' | 'hi' | 'ko' | 'th' | 'kau';

interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  voice?: string;
  rtl?: boolean;
}

const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', voice: 'en-AU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', voice: 'zh-CN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', voice: 'ar-SA', rtl: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', voice: 'es-ES' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', voice: 'vi-VN' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', voice: 'it-IT' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', voice: 'el-GR' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', voice: 'hi-IN' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', voice: 'ko-KR' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', voice: 'th-TH' },
  { code: 'kau', name: 'Kaurna', nativeName: 'Kaurna', voice: 'en-AU' },
];

// Translation system
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    placeholder: "Type your question...",
    sendMessage: "Send",
    startListening: "Start voice input",
    stopListening: "Stop voice input",
    toggleSpeech: "Toggle speech output",
    aiAgentTitle: "Australian Government Services Assistant",
    aiResponse: "I matched the 'Job loss' life event. Here are services you may be eligible for.",
    checkEligibility: "Check Eligibility",
    compareServices: "Compare Services",
    setReminder: "Set Reminder",
    progressChecklist: "Progress Checklist",
    lifeEventMatched: "Life event matched",
    servicesRetrieved: "Services retrieved from Data.gov.au",
    checkingEligibility: "Checking eligibility",
    reminderCreated: "Reminder created",
    navigateByLifeEvents: "Navigate by Life Events",
    useLifeEvent: "Use this life event",
    cantFindWhat: "Can't find what you're looking for?",
    aiCanHelp: "Our AI Assistant can help you discover services based on your specific situation and needs.",
    tryAiInstead: "Try AI Assistant Instead",
    dataSources: "Data sources: Data.gov.au, Transparency.gov.au",
    aiAligned: "AI aligned to Australian AI Technical Standard",
    chatMode: "Text Chat",
    voiceMode: "Voice Chat",
    switchToVoice: "Switch to Voice",
    switchToChat: "Switch to Chat"
  },
  // Abbreviated translations for other languages - you can add more as needed
  zh: {
    placeholder: "输入您的问题...",
    sendMessage: "发送",
    aiAgentTitle: "澳大利亚政府服务助手",
    chatMode: "文字聊天",
    voiceMode: "语音聊天",
    switchToVoice: "切换到语音",
    switchToChat: "切换到聊天"
  }
};

export default function EnhancedAIAgentScreen() {
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Array<{id: string, type: 'user' | 'agent', content: string, timestamp: Date}>>([]);
  const [activeMode, setActiveMode] = useState<'chat' | 'voice'>('chat');
  
  // Voice assistance state
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const progressItems = [
    {
      status: 'completed',
      textKey: 'lifeEventMatched',
      icon: Check
    },
    {
      status: 'completed',
      textKey: 'servicesRetrieved',
      icon: Check
    },
    {
      status: 'in-progress',
      textKey: 'checkingEligibility',
      icon: Clock
    },
    {
      status: 'pending',
      textKey: 'reminderCreated',
      icon: Bell
    }
  ];

  const serviceCards = [
    {
      title: 'JobSeeker Payment',
      badges: [
        { text: 'Federal', type: 'federal' },
        { text: 'Services Australia', type: 'agency' }
      ],
      summary: 'Income support if you\'re 22+ and unemployed.',
      funding: '$9.2B (Transparency.gov.au 2024)',
      buttons: [
        { text: 'Apply Now', variant: 'default' },
        { text: 'Check Eligibility', variant: 'outline' }
      ],
      source: 'Data.gov.au',
      updated: 'Aug 2025'
    },
    {
      title: 'Disaster Recovery Payment',
      badges: [
        { text: 'Federal', type: 'federal' },
        { text: 'Services Australia', type: 'agency' }
      ],
      summary: 'One-off payment for people affected by declared disasters.',
      funding: '$2.1B (Transparency.gov.au 2024)',
      buttons: [
        { text: 'Learn More', variant: 'outline' },
        { text: 'Set Reminder', variant: 'outline' }
      ],
      source: 'Data.gov.au',
      updated: 'Aug 2025'
    }
  ];

  const lifeEvents = [
    {
      id: 'birth-of-child',
      title: 'Birth of a child',
      icon: Baby
    },
    {
      id: 'job-loss',
      title: 'Job loss',
      icon: Briefcase
    },
    {
      id: 'becoming-carer',
      title: 'Becoming a carer',
      icon: Heart
    },
    {
      id: 'disaster-recovery',
      title: 'Disaster recovery',
      icon: Home
    },
    {
      id: 'starting-business',
      title: 'Starting a business',
      icon: TrendingUp
    },
    {
      id: 'mental-health',
      title: 'Mental health',
      icon: Brain
    }
  ];

  const trustItems = [
    { icon: Shield, label: 'Privacy' },
    { icon: Eye, label: 'Transparency' },
    { icon: Users, label: 'Human-in-the-loop' },
    { icon: Lock, label: 'Accessibility' }
  ];

  // Translation helper function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Get current language config for text direction
  const getCurrentLanguageConfig = (): LanguageConfig => {
    return supportedLanguages.find(l => l.code === language) || supportedLanguages[0];
  };

  // Initialize speech services
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }

      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = supportedLanguages.find(l => l.code === language)?.voice || 'en-AU';
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
        };
        
        recognitionInstance.onresult = (event: any) => {
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setMessage(finalTranscript);
          }
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        recognitionInstance.onerror = (event: any) => {
          console.log('Speech recognition error:', event.error);
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Handle voice input
  const handleVoiceInput = (transcript: string) => {
    console.log('Voice input received:', transcript);
    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: transcript,
      timestamp: new Date()
    };
    setConversations(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'agent' as const,
        content: generateAIResponse(transcript),
        timestamp: new Date()
      };
      setConversations(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Handle voice response (text-to-speech)
  const handleVoiceResponse = (text: string) => {
    console.log('Voice response:', text);
    if (speechSynthesis && speechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langConfig = supportedLanguages.find(l => l.code === language);
      if (langConfig?.voice) {
        utterance.lang = langConfig.voice;
      }
      utterance.rate = 0.95;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Generate AI response based on input
  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('help') || lowerInput.includes('assistance')) {
      return "I'm here to help you navigate Australian government services. What specific support are you looking for today?";
    } else if (lowerInput.includes('job') || lowerInput.includes('unemployment')) {
      return "I can help you find employment services and income support. Would you like me to check your eligibility for JobSeeker Payment or explore job training programs?";
    } else if (lowerInput.includes('health') || lowerInput.includes('medical')) {
      return "I can help you find healthcare services and mental health support. Are you looking for Medicare information or mental health resources?";
    } else if (lowerInput.includes('family') || lowerInput.includes('child')) {
      return "I can assist with family services and child support. Are you looking for parenting payments, childcare assistance, or family tax benefits?";
    } else {
      return `I understand you mentioned "${input}". Let me help you find the most relevant government services for your situation. Could you tell me more about what you need?`;
    }
  };

  // Handle traditional chat message sending
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'agent' as const,
        content: generateAIResponse(message),
        timestamp: new Date()
      };
      setConversations(prev => [...prev, aiResponse]);
    }, 1500);
  };

  // Handle voice recording
  const toggleVoiceRecording = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">{t('aiAgentTitle')}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{t('dataSources')}</span>
              <span>•</span>
              <span>{t('aiAligned')}</span>
            </div>
          </div>
          
          {/* Language selector */}
          <Select value={language} onValueChange={(value: SupportedLanguage) => setLanguage(value)}>
            <SelectTrigger className="w-48">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground">({lang.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat/Voice Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'chat' | 'voice')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t('chatMode')}
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('voiceMode')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Text Chat Interface
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSpeechEnabled(!speechEnabled)}
                      >
                        {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Conversation Display */}
                    <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-background">
                      {conversations.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Start a conversation by typing a message or using voice input</p>
                        </div>
                      )}
                      
                      {conversations.map((conv) => (
                        <div key={conv.id} className={`flex ${conv.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-sm rounded-lg px-4 py-2 ${
                            conv.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{conv.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {conv.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-2 max-w-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('placeholder')}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={toggleVoiceRecording}
                        variant={isListening ? 'destructive' : 'outline'}
                        size="icon"
                        disabled={!recognition}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!message.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice" className="mt-4">
                <RealTimeVoiceAgent
                  onVoiceInput={handleVoiceInput}
                  onVoiceResponse={handleVoiceResponse}
                  language={supportedLanguages.find(l => l.code === language)?.voice || 'en-AU'}
                  speechEnabled={speechEnabled}
                  onSpeechToggle={setSpeechEnabled}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>{t('progressChecklist')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progressItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-green-500 text-white' :
                        item.status === 'in-progress' ? 'bg-yellow-500 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        <IconComponent className="w-3 h-3" />
                      </div>
                      <span className="text-sm">{t(item.textKey)}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Navigate by Life Events */}
            <Card>
              <CardHeader>
                <CardTitle>{t('navigateByLifeEvents')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lifeEvents.map((event) => {
                  const IconComponent = event.icon;
                  return (
                    <Button key={event.id} variant="ghost" className="w-full justify-start">
                      <IconComponent className="w-4 h-4 mr-2" />
                      {event.title}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trust and Transparency */}
            <Card>
              <CardHeader>
                <CardTitle>Trust & Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {trustItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span className="text-xs">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Results */}
        {conversations.length > 0 && (
          <div className="space-y-4">
            <h2>Government Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceCards.map((service, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <div className="flex gap-1">
                        {service.badges.map((badge, badgeIndex) => (
                          <Badge 
                            key={badgeIndex} 
                            variant={badge.type === 'federal' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {badge.text}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{service.summary}</p>
                    <p className="text-sm font-medium">{service.funding}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.buttons.map((button, buttonIndex) => (
                        <Button 
                          key={buttonIndex} 
                          variant={button.variant as any}
                          size="sm"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Source: {service.source}</span>
                      <span>Updated: {service.updated}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}