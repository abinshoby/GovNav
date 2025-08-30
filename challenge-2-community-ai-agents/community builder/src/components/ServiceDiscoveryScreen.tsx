import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Globe, Accessibility, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import BackButton from './BackButton';
import AutoSuggestDropdown from './AutoSuggestDropdown';
import { useAccessibility } from './AccessibilityProvider';

interface ServiceDiscoveryScreenProps {
  onNavigateToResults: (query: string, filters: any) => void;
  onBack?: () => void;
}

export default function ServiceDiscoveryScreen({ onNavigateToResults, onBack }: ServiceDiscoveryScreenProps) {
  const { settings, speakText, announceToScreenReader, triggerHapticFeedback } = useAccessibility();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    distance: 'any',
    language: 'any',
    accessibility: false
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Find nearest food bank",
    "I need help with housing", 
    "Looking for mental health support",
    "Need legal advice",
    "Want to join a lacrosse club",
    "Emergency food assistance",
    "Housing crisis support",
    "Mental health counselling"
  ];

  const distanceOptions = [
    { value: 'any', label: 'Any distance' },
    { value: '2km', label: 'Within 2km' },
    { value: '5km', label: 'Within 5km' },
    { value: '10km', label: 'Within 10km' }
  ];

  const languageOptions = [
    { value: 'any', label: 'Any language', flag: '🌐' },
    { value: 'en', label: 'English', flag: '🇦🇺' },
    { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
    { value: 'zh', label: 'Mandarin', flag: '🇨🇳' },
    { value: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'vi', label: 'Vietnamese', flag: '🇻🇳' }
  ];

  // Handle clicks outside the dropdown to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input changes and show/hide suggestions
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length >= 2);
    
    if (value.length >= 2) {
      announceToScreenReader(`Suggestions available for: ${value}`);
    }
  };

  // Handle organization selection from dropdown
  const handleOrganizationSelect = (organization: any) => {
    const selectedQuery = `Contact ${organization.name} for ${organization.services[0]}`;
    setQuery(selectedQuery);
    setShowSuggestions(false);
    
    triggerHapticFeedback('medium');
    speakText(`Selected ${organization.name}`);
    announceToScreenReader(`Selected organization: ${organization.name}. ${organization.services[0]}`);
    
    // Navigate to results with organization-specific search
    onNavigateToResults(selectedQuery, { ...filters, selectedOrganization: organization });
  };

  const handleSearch = () => {
    if (query.trim()) {
      triggerHapticFeedback('medium');
      speakText(`Searching for ${query}`);
      announceToScreenReader(`Searching for services: ${query}`);
      onNavigateToResults(query, filters);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setQuery(prompt);
    setShowSuggestions(prompt.length >= 2); // Show suggestions for the prompt
    triggerHapticFeedback('light');
    speakText(`Selected: ${prompt}`);
    announceToScreenReader(`Quick search selected: ${prompt}. Suggestions are now available.`);
    
    // Focus the input field after selecting a prompt
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showSuggestions) {
        // If suggestions are showing, close them and perform search
        setShowSuggestions(false);
      }
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      announceToScreenReader("Suggestions closed");
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      // Focus will be handled by the dropdown component
      announceToScreenReader("Navigating suggestions. Use arrow keys to select.");
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'any' && v !== false).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {onBack && (
          <BackButton 
            onBack={onBack} 
            label="Back to Community Agent"
            className="mb-6"
          />
        )}
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-heading text-gov-navy mb-4">
            What service are you looking for?
          </h1>
          <p className="text-lg text-gray-600">
            Type to search for community services
          </p>
        </div>

        {/* Search Input */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="flex space-x-3">
              <div className="flex-1 relative" ref={dropdownRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <Input
                  ref={inputRef}
                  placeholder="Hello! What do you need help with today? You can ask for food, sports, housing, and more."
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                  className="pl-10 pr-4 py-3 text-lg border-2 focus:border-nav-teal relative z-0"
                  aria-expanded={showSuggestions}
                  aria-haspopup="listbox"
                  aria-describedby="search-suggestions"
                />
                {showSuggestions && (
                  <AutoSuggestDropdown
                    query={query}
                    onSelect={handleOrganizationSelect}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setShowSuggestions(false);
                        inputRef.current?.focus();
                      }
                    }}
                    className="transition-all duration-300 ease-out"
                  />
                )}
              </div>
              
              <Button
                size="lg"
                className="bg-nav-teal hover:bg-nav-teal/90 px-8"
                onClick={handleSearch}
                disabled={!query.trim()}
              >
                Search
              </Button>
            </div>

            {/* Accessibility announcement for suggestions */}
            <div id="search-suggestions" className="sr-only" aria-live="polite">
              {showSuggestions && query.length >= 2 && 
                "Suggestions are available. Use arrow keys to navigate and Enter to select."
              }
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter Results</span>
                {activeFiltersCount > 0 && (
                  <Badge className="bg-nav-teal text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </CardHeader>
          
          {showFilters && (
            <CardContent className="space-y-6">
              {/* Distance Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Distance</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {distanceOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.distance === option.value ? "default" : "outline"}
                      size="sm"
                      className={filters.distance === option.value ? 'bg-nav-teal' : ''}
                      onClick={() => setFilters({...filters, distance: option.value})}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Language Support</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters.language === option.value ? "default" : "outline"}
                      size="sm"
                      className={`${filters.language === option.value ? 'bg-nav-teal' : ''} flex items-center space-x-1`}
                      onClick={() => setFilters({...filters, language: option.value})}
                    >
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Accessibility Filter */}
              <div>
                <label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                  <Accessibility className="w-4 h-4" />
                  <span>Accessibility Features</span>
                </label>
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={filters.accessibility}
                    onCheckedChange={(checked) => setFilters({...filters, accessibility: checked})}
                  />
                  <span className="text-sm text-gray-600">
                    Only show services with wheelchair access and accessibility features
                  </span>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                    onClick={() => setFilters({ distance: 'any', language: 'any', accessibility: false })}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear all filters
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>

      </div>
    </div>
  );
}