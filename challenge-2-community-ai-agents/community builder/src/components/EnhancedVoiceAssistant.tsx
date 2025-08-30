import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Wifi, WifiOff, Zap, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAccessibility } from './AccessibilityProvider';
import { useActionFeedback } from './ActionFeedback';

interface VoiceCommand {
  pattern: RegExp;
  intent: string;
  confidence: number;
  action: (matches: RegExpMatchArray) => void;
}

interface VoiceAssistantProps {
  onNavigateToTab?: (tab: string) => void;
  onExecuteCommand?: (command: string, intent: string) => void;
  language?: string;
  isEnabled?: boolean;
  className?: string;
}

export default function EnhancedVoiceAssistant({
  onNavigateToTab,
  onExecuteCommand,
  language = 'en-AU',
  isEnabled = true,
  className = ''
}: VoiceAssistantProps) {
  const { settings, speakText, announceToScreenReader } = useAccessibility();
  const { showFeedback } = useActionFeedback();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'limited'>('online');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastCommand, setLastCommand] = useState<string>('');
  
  const recognitionRef = useRef<any>(null);
  const commandHistoryRef = useRef<string[]>([]);
  const confidenceThreshold = 0.7;

  // Enhanced voice commands with regex patterns
  const voiceCommands: VoiceCommand[] = [
    {
      pattern: /(?:go to|open|show|navigate to)\s+(home|main|start)/i,
      intent: 'navigate',
      confidence: 0.9,
      action: () => handleNavigation('home')
    },
    {
      pattern: /(?:go to|open|show)\s+(?:services?|red tape|navigator|regulations?)/i,
      intent: 'navigate',
      confidence: 0.9,
      action: () => handleNavigation('navigator')
    },
    {
      pattern: /(?:go to|open|show)\s+(?:community|agent|assistant)/i,
      intent: 'navigate',
      confidence: 0.9,
      action: () => handleNavigation('ai-assistant')
    },
    {
      pattern: /(?:go to|open|show)\s+(?:data|datasets?|information)/i,
      intent: 'navigate',
      confidence: 0.9,
      action: () => handleNavigation('datasets')
    },
    {
      pattern: /(?:go to|open|show)\s+(?:help|support|assistance)/i,
      intent: 'navigate',
      confidence: 0.9,
      action: () => handleNavigation('help')
    },
    {
      pattern: /(?:find|search|look for|locate)\s+(?:food bank|food assistance|emergency food)/i,
      intent: 'search_service',
      confidence: 0.85,
      action: (matches) => handleServiceSearch('food bank', matches[0])
    },
    {
      pattern: /(?:book|schedule|make)\s+(?:appointment|meeting)/i,
      intent: 'book_appointment',
      confidence: 0.85,
      action: (matches) => handleBooking('appointment', matches[0])
    },
    {
      pattern: /(?:call|contact|phone)\s+(?:volunteer|helper|support)/i,
      intent: 'contact_volunteer',
      confidence: 0.8,
      action: (matches) => handleVolunteerContact(matches[0])
    },
    {
      pattern: /(?:check|show|view)\s+(?:my\s+)?(?:tasks?|progress|status)/i,
      intent: 'view_tasks',
      confidence: 0.8,
      action: () => handleTaskView()
    },
    {
      pattern: /(?:what can you do|help|commands?|options?)/i,
      intent: 'help',
      confidence: 0.75,
      action: () => handleHelp()
    }
  ];

  // Check browser support and network status
  useEffect(() => {
    const checkSupport = () => {
      const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const hasTextToSpeech = 'speechSynthesis' in window;
      
      if (!hasWebSpeech || !hasTextToSpeech) {
        setConnectionStatus('limited');
        setErrorMessage('Voice features are limited in this browser. Please use Chrome or Edge for the best experience.');
      }
    };

    const checkNetwork = () => {
      if ('navigator' in window && 'onLine' in navigator) {
        setConnectionStatus(navigator.onLine ? 'online' : 'offline');
      }
    };

    checkSupport();
    checkNetwork();

    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);

    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return null;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMessage(null);
      announceToScreenReader('Voice recognition started. Speak your command.');
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.toLowerCase().trim();
      const confidence = result[0].confidence || 0;
      
      setConfidence(confidence * 100);
      
      if (result.isFinal) {
        setLastCommand(transcript);
        processVoiceCommand(transcript, confidence);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setIsProcessing(false);
      
      let errorMsg = 'Voice recognition error occurred.';
      
      switch (event.error) {
        case 'network':
          errorMsg = 'Network error. Please check your internet connection.';
          setConnectionStatus('offline');
          break;
        case 'not-allowed':
          errorMsg = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'no-speech':
          errorMsg = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMsg = 'No microphone found. Please connect a microphone.';
          break;
        default:
          errorMsg = `Voice recognition error: ${event.error}`;
      }
      
      setErrorMessage(errorMsg);
      speakText(errorMsg);
    };

    recognition.onend = () => {
      setIsListening(false);
      setConfidence(0);
    };

    return recognition;
  }, [language, speakText, announceToScreenReader]);

  const processVoiceCommand = useCallback((transcript: string, confidence: number) => {
    setIsProcessing(true);
    
    // Add to command history
    commandHistoryRef.current = [...commandHistoryRef.current.slice(-9), transcript];
    
    // Find matching command
    let bestMatch: { command: VoiceCommand; matches: RegExpMatchArray; score: number } | null = null;
    
    for (const command of voiceCommands) {
      const matches = transcript.match(command.pattern);
      if (matches) {
        const score = command.confidence * confidence;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { command, matches, score };
        }
      }
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (bestMatch && bestMatch.score >= confidenceThreshold) {
        try {
          bestMatch.command.action(bestMatch.matches);
          onExecuteCommand?.(transcript, bestMatch.command.intent);
          
          showFeedback({
            type: 'success',
            action: 'voice_command',
            message: 'Voice command executed successfully',
            details: `Command: "${transcript}"`,
            duration: 3000
          });
        } catch (error) {
          handleCommandError(transcript, error);
        }
      } else {
        handleUnrecognizedCommand(transcript, confidence);
      }
    }, 500);
  }, [onExecuteCommand, showFeedback, confidenceThreshold]);

  const handleNavigation = (tab: string) => {
    const tabNames = {
      'home': 'Home',
      'navigator': 'Red Tape Navigator',
      'ai-assistant': 'Community Agent',
      'datasets': 'Datasets',
      'help': 'Help & Support'
    };
    
    const tabName = tabNames[tab as keyof typeof tabNames] || tab;
    speakText(`Navigating to ${tabName}`);
    onNavigateToTab?.(tab);
  };

  const handleServiceSearch = (service: string, command: string) => {
    speakText(`Searching for ${service} services near you`);
    // Implementation would trigger service search
  };

  const handleBooking = (type: string, command: string) => {
    speakText(`Opening appointment booking for ${type}`);
    // Implementation would trigger booking flow
  };

  const handleVolunteerContact = (command: string) => {
    speakText('Connecting you with available volunteers');
    // Implementation would trigger volunteer matching
  };

  const handleTaskView = () => {
    speakText('Showing your current tasks and progress');
    // Implementation would navigate to tasks view
  };

  const handleHelp = () => {
    const helpText = 'I can help you navigate the app, find services, book appointments, and connect with volunteers. Try saying "go to services" or "find food bank".';
    speakText(helpText);
  };

  const handleCommandError = (command: string, error: any) => {
    const errorMsg = 'Sorry, there was an error processing your command. Please try again.';
    speakText(errorMsg);
    setErrorMessage(errorMsg);
    
    showFeedback({
      type: 'error',
      action: 'voice_command',
      message: 'Command execution failed',
      details: command,
      duration: 4000
    });
  };

  const handleUnrecognizedCommand = (command: string, confidence: number) => {
    const response = confidence < 0.5 
      ? "I didn't understand that clearly. Please try speaking more clearly."
      : "I understood what you said, but I don't know how to help with that. Try saying 'help' to see available commands.";
    
    speakText(response);
    
    showFeedback({
      type: 'warning',
      action: 'voice_command',
      message: 'Command not recognized',
      details: `"${command}" (confidence: ${Math.round(confidence * 100)}%)`,
      duration: 4000,
      actionButtons: [
        {
          label: 'Show Help',
          action: handleHelp,
          variant: 'outline'
        }
      ]
    });
  };

  const startListening = () => {
    if (!isEnabled || connectionStatus === 'offline') {
      speakText('Voice assistant is currently unavailable.');
      return;
    }

    const recognition = initializeSpeechRecognition();
    if (!recognition) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const getStatusIcon = () => {
    if (connectionStatus === 'offline') return <WifiOff className="w-4 h-4 text-red-500" />;
    if (connectionStatus === 'limited') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <Wifi className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'offline': return 'Offline';
      case 'limited': return 'Limited';
      case 'online': return 'Online';
      default: return 'Unknown';
    }
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`voice-assistant ${className}`}>
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Voice Assistant</h3>
              <Badge variant="outline" className="text-xs">
                {getStatusIcon()}
                <span className="ml-1">{getStatusText()}</span>
              </Badge>
            </div>
            
            {settings.voiceGuidance && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speakText('Voice assistant is ready. Press the microphone button to start.')}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Voice Control Button */}
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              className={`flex-1 h-16 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : isProcessing
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={isListening ? stopListening : startListening}
              disabled={connectionStatus === 'offline' || isProcessing}
            >
              <div className="flex items-center space-x-3">
                {isListening ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
                <span className="font-medium">
                  {isListening 
                    ? 'Listening...' 
                    : isProcessing 
                      ? 'Processing...' 
                      : 'Press to Speak'
                  }
                </span>
              </div>
            </Button>
          </div>

          {/* Confidence Indicator */}
          {isListening && confidence > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-blue-700 mb-1">
                <span>Voice Clarity</span>
                <span>{Math.round(confidence)}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>
          )}

          {/* Last Command */}
          {lastCommand && (
            <div className="mt-3 p-2 bg-white rounded border">
              <p className="text-sm text-gray-600">Last command:</p>
              <p className="text-sm font-medium text-gray-900">"{lastCommand}"</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <Alert className="mt-3 border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Commands */}
          <div className="mt-4 text-xs text-blue-700">
            <p className="font-medium mb-1">Try saying:</p>
            <div className="flex flex-wrap gap-1">
              {[
                '"Go to services"',
                '"Find food bank"', 
                '"Book appointment"',
                '"Help"'
              ].map((command, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {command}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}