import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilitySettings {
  // Visual accessibility
  highContrast: boolean;
  largeText: boolean;
  fontSize: number;
  reducedMotion: boolean;
  colorScheme: 'default' | 'high-contrast' | 'dark' | 'sepia';
  
  // Motor accessibility
  keyboardNavigation: boolean;
  clickToFocus: boolean;
  longPressDelay: number;
  
  // Cognitive accessibility
  simplifiedInterface: boolean;
  showInstructions: boolean;
  autoSave: boolean;
  
  // Audio accessibility
  voiceGuidance: boolean;
  voiceRate: number;
  voiceVolume: number;
  soundEffects: boolean;
  
  // Screen reader
  screenReader: boolean;
  readAloud: boolean;
  
  // Language and communication
  language: string;
  signLanguage: boolean;
  hapticFeedback: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  applySettings: () => void;
  speakText: (text: string) => void;
  announceToScreenReader: (text: string) => void;
  triggerHapticFeedback: (type: 'light' | 'medium' | 'heavy') => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  fontSize: 16,
  reducedMotion: false,
  colorScheme: 'default',
  keyboardNavigation: false,
  clickToFocus: false,
  longPressDelay: 500,
  simplifiedInterface: false,
  showInstructions: true,
  autoSave: true,
  voiceGuidance: false,
  voiceRate: 1,
  voiceVolume: 0.8,
  soundEffects: true,
  screenReader: false,
  readAloud: false,
  language: 'en-AU',
  signLanguage: false,
  hapticFeedback: false
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('govnav-accessibility-settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch (e) {
          console.warn('Failed to parse accessibility settings:', e);
        }
      }
    }
    return defaultSettings;
  });

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const applySettings = () => {
    // Apply font size
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
    
    // Apply color scheme
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (settings.colorScheme !== 'default') {
      document.body.classList.add(`theme-${settings.colorScheme}`);
    }
    
    // Apply high contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    // Apply large text
    if (settings.largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
    
    // Apply keyboard navigation
    if (settings.keyboardNavigation) {
      document.body.classList.add('keyboard-navigation');
    } else {
      document.body.classList.remove('keyboard-navigation');
    }
    
    // Apply simplified interface
    if (settings.simplifiedInterface) {
      document.body.classList.add('simplified-interface');
    } else {
      document.body.classList.remove('simplified-interface');
    }
  };

  const speakText = (text: string) => {
    if (!settings.voiceGuidance || !('speechSynthesis' in window)) return;

    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.language;
    utterance.rate = settings.voiceRate;
    utterance.volume = settings.voiceVolume;
    
    speechSynthesis.speak(utterance);
  };

  const announceToScreenReader = (text: string) => {
    // Create a live region for screen reader announcements
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    announcement.textContent = text;
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!settings.hapticFeedback || !('navigator' in window) || !('vibrate' in navigator)) return;
    
    const patterns = {
      light: [10],
      medium: [50],
      heavy: [100]
    };
    
    navigator.vibrate(patterns[type]);
  };

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('govnav-accessibility-settings', JSON.stringify(settings));
    }
    applySettings();
  }, [settings]);

  // Apply settings on mount
  useEffect(() => {
    applySettings();
  }, []);

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    applySettings,
    speakText,
    announceToScreenReader,
    triggerHapticFeedback
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}