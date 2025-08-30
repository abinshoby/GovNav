import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, MapPin, Phone, Globe, Star, Shield } from 'lucide-react';
import { enhancedSearch, SearchableOrganization, SearchResult } from './utils/searchUtils';

interface Organization {
  name: string;
  type: string;
  location: string;
  phone?: string;
  website?: string;
  services: string[];
}

interface AutoSuggestDropdownProps {
  query: string;
  onSelect: (organization: Organization) => void;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export default function AutoSuggestDropdown({ query, onSelect, className = '', onKeyDown }: AutoSuggestDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Comprehensive organization database from DatasetsScreen
  const organizations: SearchableOrganization[] = [
    {
      id: 1,
      name: "Aboriginal Family Support Services",
      type: "Aboriginal & Torres Strait Islander Services",
      description: "Cultural support, family services, advocacy, emergency relief",
      distance: "1.5 km",
      address: "Adelaide",
      phone: "08 8235 4121",
      website: "http://www.afss.org.au",
      hours: { today: "Monday-Friday 9AM-5PM", status: "open" },
      rating: 4.5,
      reviewCount: 45,
      verified: true,
      accessibility: true,
      languages: ["English", "Aboriginal languages"],
      services: ["Cultural support", "Family services", "Advocacy", "Emergency relief", "indigenous", "cultural", "family support", "emergency", "advocacy", "accessible"]
    },
    {
      id: 2,
      name: "Adelaide City Mission",
      type: "Emergency Relief",
      description: "Emergency accommodation, food relief, support services, community programs",
      distance: "0.8 km",
      address: "Adelaide",
      phone: "08 8210 7600",
      website: "http://www.adelaidecitymission.org.au",
      hours: { today: "24/7", status: "open" },
      rating: 4.7,
      reviewCount: 156,
      verified: true,
      accessibility: true,
      languages: ["English", "Arabic", "Mandarin"],
      services: ["Emergency accommodation", "Food relief", "Support services", "Community programs", "emergency", "24/7", "food", "accommodation", "community", "support", "accessible", "arabic speaking", "mandarin speaking"]
    },
    {
      id: 3,
      name: "Adelaide Community Healthcare Alliance",
      type: "Health Services",
      description: "Primary healthcare, mental health, dental services, community health programs",
      distance: "1.2 km",
      address: "Adelaide",
      phone: "08 8237 3000",
      website: "http://www.acha.org.au",
      hours: { today: "Monday-Friday 8AM-6PM", status: "open" },
      rating: 4.3,
      reviewCount: 89,
      verified: true,
      accessibility: true,
      languages: ["English", "Vietnamese", "Hindi"],
      services: ["Primary healthcare", "Mental health", "Dental services", "Community health programs", "health", "medical", "dental", "mental health", "primary care", "community health", "accessible", "vietnamese speaking", "hindi speaking"]
    },
    {
      id: 4,
      name: "Foodbank SA",
      type: "Food Relief",
      description: "Food distribution, school programs, community pantries",
      distance: "8.5 km",
      address: "Pooraka",
      phone: "08 8351 1136",
      website: "http://www.foodbanksa.org.au",
      hours: { today: "Monday-Friday 8AM-4PM", status: "open" },
      rating: 4.9,
      reviewCount: 245,
      verified: true,
      accessibility: true,
      languages: ["English", "Arabic", "Italian"],
      services: ["Food distribution", "School programs", "Community pantries", "food", "emergency", "school programs", "pantries", "distribution", "relief", "accessible", "arabic speaking", "italian speaking"]
    },
    {
      id: 5,
      name: "Hutt St Centre",
      type: "Homelessness Services",
      description: "Meals, accommodation, health services, case management",
      distance: "1.1 km",
      address: "Adelaide",
      phone: "08 8218 2400",
      website: "http://www.huttstcentre.org.au",
      hours: { today: "Daily 7AM-5PM", status: "open" },
      rating: 4.4,
      reviewCount: 112,
      verified: true,
      accessibility: true,
      languages: ["English", "Mandarin", "Vietnamese"],
      services: ["Meals", "Accommodation", "Health services", "Case management", "homelessness", "meals", "accommodation", "health", "case management", "support", "accessible", "mandarin speaking", "vietnamese speaking"]
    },
    {
      id: 6,
      name: "Mental Health Coalition of SA",
      type: "Mental Health",
      description: "Mental health advocacy, support, information, training",
      distance: "1.9 km",
      address: "Adelaide",
      phone: "08 8382 3100",
      website: "http://www.mhcsa.org.au",
      hours: { today: "Monday-Friday 9AM-5PM", status: "open" },
      rating: 4.2,
      reviewCount: 54,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Mental health advocacy", "Support", "Information", "Training", "mental health", "advocacy", "support", "information", "training", "education", "accessible"]
    },
    {
      id: 7,
      name: "Lacrosse SA",
      type: "Sports Association",
      description: "Coordination and promotion of lacrosse in South Australia",
      distance: "5.2 km",
      address: "West Beach",
      phone: "08 8355 3350",
      website: "www.lacrossesa.com.au",
      hours: { today: "Mon - Fri 8am - 4pm", status: "open" },
      rating: 4.1,
      reviewCount: 23,
      verified: true,
      accessibility: false,
      languages: ["English"],
      services: ["Lacrosse", "Sports coordination", "Development programs", "lacrosse", "sports", "coordination", "development", "programs", "recreation", "club information"]
    },
    {
      id: 8,
      name: "Glenelg Lacrosse Club",
      type: "Sports Club",
      description: "Lacrosse - junior, Under 18 and senior teams, men and women",
      distance: "8.3 km",
      address: "West Beach",
      phone: "08 8355 5011",
      website: "www.glenelglacrosse.com.au",
      hours: { today: "Not specified", status: "unknown" },
      rating: 4.0,
      reviewCount: 18,
      verified: false,
      accessibility: false,
      languages: ["English"],
      services: ["Junior lacrosse", "Senior lacrosse", "Men's teams", "Women's teams", "lacrosse", "sports", "junior", "senior", "men", "women", "teams", "recreation"]
    }
  ];

  // Use enhanced search to get relevant results
  const searchResults: SearchResult[] = useMemo(() => {
    return enhancedSearch(query, organizations, 6);
  }, [query]);

  // Convert SearchResult back to Organization format for onSelect
  const convertToOrganization = (result: SearchResult): Organization => ({
    name: result.name,
    type: result.type,
    location: result.address,
    phone: result.phone,
    website: result.website,
    services: result.services.slice(0, 3) // Take first 3 services for display
  });

  // Don't show dropdown if query is empty or too short
  if (!query || query.length < 2) {
    return null;
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const resultCount = searchResults.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < resultCount - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < resultCount) {
          onSelect(convertToOrganization(searchResults[selectedIndex]));
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (onKeyDown) onKeyDown(e);
        break;
    }
  };

  // Reset selected index when search results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults.length]);

  return (
    <Card 
      className={`absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-2 ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="listbox"
      aria-label="Service suggestions"
    >
      <div className="p-4">
        {searchResults.length > 0 ? (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="font-medium text-gov-navy">🔍 Search Results</h3>
              <Badge variant="secondary" className="text-xs">
                {searchResults.length} found
              </Badge>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => onSelect(convertToOrganization(result))}
                  className={`w-full text-left p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-nav-teal focus:ring-offset-2 ${
                    selectedIndex === index 
                      ? 'bg-nav-teal/10 border-2 border-nav-teal' 
                      : 'hover:bg-gray-50'
                  }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-nav-teal mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gov-navy truncate">{result.name}</h4>
                        {result.verified && (
                          <Shield className="w-3 h-3 text-green-600" title="Government Verified" />
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{result.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{result.type}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{result.address} • {result.distance}</span>
                        </div>
                        {result.phone && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{result.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.matchedTerms.slice(0, 3).map((term, termIndex) => (
                          <Badge key={termIndex} variant="outline" className="text-xs bg-nav-teal/10 text-nav-teal border-nav-teal">
                            {term}
                          </Badge>
                        ))}
                        {result.services.filter(service => 
                          !result.matchedTerms.some(term => service.toLowerCase().includes(term.toLowerCase()))
                        ).slice(0, 2).map((service, serviceIndex) => (
                          <Badge key={`service-${serviceIndex}`} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {result.relevanceScore > 0 && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            {Math.round(result.relevanceScore)}% match
                          </Badge>
                        )}
                      </div>
                      {result.accessibility && (
                        <div className="text-xs text-green-600 mt-1">
                          ♿ Wheelchair accessible
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">No results found. Try searching for:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => onSelect({ name: "food support", type: "suggestion", location: "", services: [] })}>food support</Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => onSelect({ name: "housing help", type: "suggestion", location: "", services: [] })}>housing help</Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => onSelect({ name: "mental health", type: "suggestion", location: "", services: [] })}>mental health</Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => onSelect({ name: "emergency support", type: "suggestion", location: "", services: [] })}>emergency support</Badge>
              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => onSelect({ name: "lacrosse club", type: "suggestion", location: "", services: [] })}>lacrosse club</Badge>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}