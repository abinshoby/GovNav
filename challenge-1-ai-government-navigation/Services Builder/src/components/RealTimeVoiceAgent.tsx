import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Waves, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceAgentProps {
  onVoiceInput?: (text: string) => void;
  onVoiceResponse?: (text: string) => void;
  language?: string;
  speechEnabled?: boolean;
  onSpeechToggle?: (enabled: boolean) => void;
  className?: string;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'thinking';

export default function RealTimeVoiceAgent({
  onVoiceInput,
  onVoiceResponse,
  language = 'en-AU',
  speechEnabled = true,
  onSpeechToggle,
  className = ''
}: VoiceAgentProps) {
  // Voice state management
  const [isActive, setIsActive] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [conversationTurn, setConversationTurn] = useState(0);
  
  // Real-time processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseQueue, setResponseQueue] = useState<string[]>([]);
  const [streamingText, setStreamingText] = useState('');
  
  // Refs for voice services
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Auto-restart and interruption handling
  const autoRestartRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech services
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure recognition for real-time use
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;
      
      // Enhanced recognition events
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceState('listening');
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update current transcript for visual feedback
        setCurrentTranscript(interimTranscript || finalTranscript);
        
        // Process final transcript
        if (finalTranscript.trim()) {
          handleVoiceInput(finalTranscript.trim());
        }
      };
      
      recognition.onerror = (event: any) => {
        console.log('Speech recognition error:', event.error);
        if (event.error !== 'no-speech' && isActive) {
          // Auto-restart on errors except no-speech
          scheduleRestart();
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
        
        // Auto-restart if still active
        if (isActive && voiceState !== 'speaking') {
          scheduleRestart();
        }
      };
      
      recognitionRef.current = recognition;
    }

    // Initialize Audio Context for volume detection
    initializeAudioContext();

    return () => {
      cleanup();
    };
  }, [language, isActive]);

  // Initialize audio context for real-time audio analysis
  const initializeAudioContext = async () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyserRef.current = analyser;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  };

  // Start microphone access and voice activity detection
  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      
      if (audioContextRef.current && analyserRef.current) {
        const microphone = audioContextRef.current.createMediaStreamSource(stream);
        microphoneRef.current = microphone;
        microphone.connect(analyserRef.current);
        
        // Start volume monitoring
        monitorVoiceActivity();
      }
      
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
  };

  // Monitor voice activity for visual feedback
  const monitorVoiceActivity = () => {
    if (!analyserRef.current || !isActive) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const checkVolume = () => {
      if (!analyserRef.current || !isActive) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      setVoiceVolume(Math.min(volume / 2, 100)); // Normalize to 0-100
      
      if (isActive) {
        requestAnimationFrame(checkVolume);
      }
    };
    
    checkVolume();
  };

  // Handle voice input processing
  const handleVoiceInput = useCallback((transcript: string) => {
    if (!transcript.trim()) return;
    
    setCurrentTranscript(transcript);
    setVoiceState('processing');
    setIsProcessing(true);
    
    // Stop current speech if speaking
    if (isSpeaking && synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    
    // Call the callback with the transcript
    if (onVoiceInput) {
      onVoiceInput(transcript);
    }
    
    // Auto-generate response (simulate AI processing)
    simulateAIResponse(transcript);
  }, [onVoiceInput, isSpeaking]);

  // Simulate AI response for demonstration
  const simulateAIResponse = async (input: string) => {
    setVoiceState('thinking');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate contextual response based on input
    let response = '';
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('help') || lowerInput.includes('assistance')) {
      response = "I'm here to help you navigate Australian government services. What specific support are you looking for today?";
    } else if (lowerInput.includes('job') || lowerInput.includes('unemployment')) {
      response = "I can help you find employment services and income support. Would you like me to check your eligibility for JobSeeker Payment or explore job training programs?";
    } else if (lowerInput.includes('health') || lowerInput.includes('medical')) {
      response = "I can help you find healthcare services and mental health support. Are you looking for Medicare information or mental health resources?";
    } else if (lowerInput.includes('family') || lowerInput.includes('child')) {
      response = "I can assist with family services and child support. Are you looking for parenting payments, childcare assistance, or family tax benefits?";
    } else {
      response = `I understand you mentioned ${input}. Let me help you find the most relevant government services for your situation. Could you tell me more about what you need?`;
    }
    
    setIsProcessing(false);
    
    // Call callback and speak response
    if (onVoiceResponse) {
      onVoiceResponse(response);
    }
    
    await speakResponse(response);
    setConversationTurn(prev => prev + 1);
  };

  // Enhanced text-to-speech with better control
  const speakResponse = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthesisRef.current || !speechEnabled || !text.trim()) {
        resolve();
        return;
      }
      
      setVoiceState('speaking');
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        currentUtteranceRef.current = utterance;
        setStreamingText(text);
      };
      
      utterance.onend = () => {
        currentUtteranceRef.current = null;
        setIsSpeaking(false);
        setStreamingText('');
        setVoiceState('idle');
        setCurrentTranscript('');
        resolve();
      };
      
      utterance.onerror = () => {
        currentUtteranceRef.current = null;
        setIsSpeaking(false);
        setStreamingText('');
        setVoiceState('idle');
        resolve();
      };
      
      synthesisRef.current.speak(utterance);
    });
  };

  // Schedule automatic restart of recognition
  const scheduleRestart = () => {
    if (autoRestartRef.current) {
      clearTimeout(autoRestartRef.current);
    }
    
    autoRestartRef.current = setTimeout(() => {
      if (isActive && recognitionRef.current && !isListening && voiceState !== 'speaking') {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.log('Recognition restart failed:', error);
        }
      }
    }, 1000);
  };

  // Toggle voice agent activation
  const toggleVoiceAgent = async () => {
    if (!isActive) {
      const micPermission = await startMicrophone();
      if (micPermission) {
        setIsActive(true);
        setConversationTurn(0);
        // Start recognition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('Recognition start failed:', error);
          }
        }
      }
    } else {
      setIsActive(false);
      setVoiceState('idle');
      cleanup();
    }
  };

  // Interrupt current speech
  const interruptSpeech = () => {
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      setStreamingText('');
      setVoiceState('listening');
    }
  };

  // Cleanup function
  const cleanup = () => {
    // Stop recognition
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    // Stop speech synthesis
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    
    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear timers
    if (autoRestartRef.current) clearTimeout(autoRestartRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    
    // Reset state
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setCurrentTranscript('');
    setStreamingText('');
    setVoiceVolume(0);
  };

  // Get status text based on current state
  const getStatusText = () => {
    switch (voiceState) {
      case 'listening': return 'Listening...';
      case 'processing': return 'Processing...';
      case 'thinking': return 'Thinking...';
      case 'speaking': return 'Speaking...';
      default: return isActive ? 'Ready' : 'Voice Agent Off';
    }
  };

  // Get status color based on state
  const getStatusColor = () => {
    switch (voiceState) {
      case 'listening': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'thinking': return 'bg-purple-500';
      case 'speaking': return 'bg-green-500';
      default: return isActive ? 'bg-gray-500' : 'bg-gray-300';
    }
  };

  return (
    <Card className={`${className} relative overflow-hidden`}>
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} transition-colors`} />
            <h3 className="font-medium">Real-Time Voice Agent</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSpeechToggle && onSpeechToggle(!speechEnabled)}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        {/* Status and Controls */}
        <div className="space-y-4">
          <div className="text-center">
            <Badge variant={isActive ? 'default' : 'secondary'} className="mb-2">
              {getStatusText()}
            </Badge>
            {conversationTurn > 0 && (
              <p className="text-sm text-muted-foreground">
                Turn {conversationTurn}
              </p>
            )}
          </div>

          {/* Voice Activity Visualization */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center space-x-1"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1 rounded-full ${
                      voiceState === 'listening' ? 'bg-blue-500' :
                      voiceState === 'speaking' ? 'bg-green-500' :
                      'bg-gray-300'
                    }`}
                    animate={{
                      height: [8, 16 + (voiceVolume / 10), 8],
                      opacity: voiceState === 'listening' || voiceState === 'speaking' ? [0.3, 1, 0.3] : 0.3
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: voiceState === 'listening' || voiceState === 'speaking' ? Infinity : 0,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Activity Display */}
          {(currentTranscript || streamingText) && (
            <div className="bg-muted rounded-lg p-3 min-h-[60px]">
              {currentTranscript && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">You said:</p>
                  <p className="text-sm">{currentTranscript}</p>
                </div>
              )}
              {streamingText && (
                <div className={currentTranscript ? 'mt-3' : ''}>
                  <p className="text-xs text-muted-foreground mb-1">AI response:</p>
                  <p className="text-sm">{streamingText}</p>
                </div>
              )}
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center gap-2">
            <Button
              onClick={toggleVoiceAgent}
              variant={isActive ? 'destructive' : 'default'}
              className="flex items-center gap-2"
            >
              {isActive ? (
                <>
                  <PhoneOff className="w-4 h-4" />
                  End Session
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  Start Voice Chat
                </>
              )}
            </Button>
            
            {isActive && isSpeaking && (
              <Button
                onClick={interruptSpeech}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <MicOff className="w-4 h-4" />
                Interrupt
              </Button>
            )}
          </div>

          {/* Quick Tips */}
          {isActive && (
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Speak naturally - I'll respond automatically</p>
              <p>Say "help" to get started or ask about government services</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}