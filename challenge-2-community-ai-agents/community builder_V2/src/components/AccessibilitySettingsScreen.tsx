import React, { useState } from 'react';
import { ArrowLeft, Type, Volume2, Eye, Keyboard, Globe, Palette, Contrast } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';

interface AccessibilitySettingsScreenProps {
  onBack: () => void;
}

export default function AccessibilitySettingsScreen({ onBack }: AccessibilitySettingsScreenProps) {
  const [settings, setSettings] = useState({
    largeText: false,
    voiceGuidance: false,
    highContrast: false,
    screenReader: false,
    reducedMotion: false,
    keyboardNavigation: false,
    fontSize: [16],
    language: 'en',
    voiceRate: [1],
    colorScheme: 'default'
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇦🇺' },
    { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'zh', name: '中文 (Mandarin)', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷' }
  ];

  const colorSchemes = [
    { value: 'default', name: 'Default', description: 'Standard colors' },
    { value: 'high-contrast', name: 'High Contrast', description: 'Black and white for better visibility' },
    { value: 'dark', name: 'Dark Mode', description: 'Dark background, light text' },
    { value: 'sepia', name: 'Sepia', description: 'Warm, eye-friendly colors' }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setSettings({
      largeText: false,
      voiceGuidance: false,
      highContrast: false,
      screenReader: false,
      reducedMotion: false,
      keyboardNavigation: false,
      fontSize: [16],
      language: 'en',
      voiceRate: [1],
      colorScheme: 'default'
    });
  };

  const applySettings = () => {
    // In a real app, this would apply the accessibility settings
    console.log('Applying accessibility settings:', settings);
    
    // Apply font size changes
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize[0]}px`);
    
    // Apply high contrast mode
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply color scheme
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (settings.colorScheme !== 'default') {
      document.body.classList.add(`theme-${settings.colorScheme}`);
    }
    
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <h1 className="text-heading text-gov-navy mb-4 flex items-center space-x-3">
            <Eye className="w-8 h-8" />
            <span>Accessibility & Language Settings</span>
          </h1>
          <p className="text-lg text-gray-600">
            Customize your experience to meet your accessibility needs and language preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Visual Accessibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Large Text Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Large Text</h3>
                  <p className="text-sm text-gray-600">Increase text size throughout the app</p>
                </div>
                <Switch
                  checked={settings.largeText}
                  onCheckedChange={(checked) => handleSettingChange('largeText', checked)}
                />
              </div>

              {/* Font Size Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Font Size</h3>
                  <span className="text-sm text-gray-600">{settings.fontSize[0]}px</span>
                </div>
                <Slider
                  value={settings.fontSize}
                  onValueChange={(value) => handleSettingChange('fontSize', value)}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Small (12px)</span>
                  <span>Large (24px)</span>
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">High Contrast</h3>
                  <p className="text-sm text-gray-600">Improve text visibility with higher contrast</p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                />
              </div>

              {/* Color Scheme */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Color Scheme</h3>
                <Select 
                  value={settings.colorScheme} 
                  onValueChange={(value) => handleSettingChange('colorScheme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorSchemes.map((scheme) => (
                      <SelectItem key={scheme.value} value={scheme.value}>
                        <div>
                          <div className="font-medium">{scheme.name}</div>
                          <div className="text-sm text-gray-500">{scheme.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Reduce Motion</h3>
                  <p className="text-sm text-gray-600">Minimize animations and transitions</p>
                </div>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => handleSettingChange('reducedMotion', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio & Voice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <span>Audio & Voice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Guidance Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Voice Guidance</h3>
                  <p className="text-sm text-gray-600">Spoken instructions and feedback</p>
                </div>
                <Switch
                  checked={settings.voiceGuidance}
                  onCheckedChange={(checked) => handleSettingChange('voiceGuidance', checked)}
                />
              </div>

              {/* Voice Rate Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Voice Speed</h3>
                  <span className="text-sm text-gray-600">{settings.voiceRate[0]}x</span>
                </div>
                <Slider
                  value={settings.voiceRate}
                  onValueChange={(value) => handleSettingChange('voiceRate', value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                  disabled={!settings.voiceGuidance}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow (0.5x)</span>
                  <span>Fast (2x)</span>
                </div>
              </div>

              {/* Screen Reader Support */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Screen Reader Support</h3>
                  <p className="text-sm text-gray-600">Optimize for screen reading software</p>
                </div>
                <Switch
                  checked={settings.screenReader}
                  onCheckedChange={(checked) => handleSettingChange('screenReader', checked)}
                />
              </div>

              {/* Test Voice Button */}
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!settings.voiceGuidance}
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance("This is a test of the voice guidance feature.");
                    utterance.rate = settings.voiceRate[0];
                    speechSynthesis.speak(utterance);
                  }
                }}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Voice Guidance
              </Button>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Language</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Interface Language</h3>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleSettingChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        <div className="flex items-center space-x-2">
                          <span>{language.flag}</span>
                          <span>{language.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Language Support</h4>
                <p className="text-sm text-blue-800 mb-3">
                  When you select a language, the interface will be translated and you'll be matched 
                  with volunteers and services that support your language.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Interface translation</li>
                  <li>• Language-matched volunteers</li>
                  <li>• Document translation assistance</li>
                  <li>• Culturally appropriate services</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Input & Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Keyboard className="w-5 h-5" />
                <span>Input & Navigation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900">Keyboard Navigation</h3>
                  <p className="text-sm text-gray-600">Navigate using Tab, Enter, and arrow keys</p>
                </div>
                <Switch
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(checked) => handleSettingChange('keyboardNavigation', checked)}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Navigate elements:</span>
                    <code className="bg-gray-200 px-2 py-1 rounded">Tab / Shift+Tab</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Activate button:</span>
                    <code className="bg-gray-200 px-2 py-1 rounded">Enter / Space</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Go back:</span>
                    <code className="bg-gray-200 px-2 py-1 rounded">Esc</code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button 
              className="bg-nav-teal hover:bg-nav-teal/90"
              onClick={applySettings}
            >
              Apply Settings
            </Button>
          </div>
        </div>

        {/* Preview */}
        <Card className="mt-8 border-2 border-dashed border-gray-300">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <p className="text-sm text-gray-600">See how your settings will affect the interface</p>
          </CardHeader>
          <CardContent style={{ fontSize: `${settings.fontSize[0]}px` }}>
            <div className={`p-4 rounded-lg ${settings.highContrast ? 'bg-black text-white' : 'bg-gray-50'}`}>
              <h3 className="font-medium mb-2">Sample Text</h3>
              <p className="leading-relaxed">
                This is how text will appear with your current accessibility settings. 
                You can adjust font size, contrast, and other options above.
              </p>
              <Button size="sm" className="mt-3">
                Sample Button
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}