import React, { useMemo } from "react";
import {
  Phone,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Star,
  Navigation,
  ExternalLink,
  Accessibility,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { enhancedSearch, SearchableOrganization, SearchResult, highlightMatches } from "./utils/searchUtils";

interface ServiceResult {
  id: number;
  name: string;
  type: string;
  description: string;
  distance: string;
  address: string;
  phone: string;
  website?: string;
  hours: {
    today: string;
    status: "open" | "closed" | "closing-soon" | "unknown";
  };
  rating: number;
  reviewCount: number;
  verified: boolean;
  accessibility: boolean;
  languages: string[];
  services: string[];
}

interface ServiceResultsScreenProps {
  query: string;
  onBookAppointment: (serviceId: number) => void;
  onGetDirections: (serviceId: number) => void;
  filters?: any;
  onBack?: () => void;
}

export default function ServiceResultsScreen({
  query,
  onBookAppointment,
  onGetDirections,
  filters = {},
  onBack,
}: ServiceResultsScreenProps) {
  // Real Adelaide organizations from DatasetsScreen
  const adelaideOrganizations: SearchableOrganization[] = [
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
      name: "Baptist Care SA",
      type: "Community Support",
      description: "Aged care, disability support, family services, housing, employment",
      distance: "3.2 km",
      address: "Multiple Locations",
      phone: "08 8273 7300",
      website: "http://www.baptistcaresa.org.au",
      hours: { today: "Monday-Friday 9AM-5PM", status: "open" },
      rating: 4.6,
      reviewCount: 203,
      verified: true,
      accessibility: true,
      languages: ["English", "Spanish", "Cantonese"],
      services: ["Aged care", "Disability support", "Family services", "Housing", "Employment", "aged care", "disability", "family", "housing", "employment", "community support", "accessible", "spanish speaking", "cantonese speaking"]
    },
    {
      id: 5,
      name: "Catherine House Inc",
      type: "Women's Services",
      description: "Crisis accommodation, support services for women experiencing homelessness",
      distance: "1.7 km",
      address: "Adelaide",
      phone: "08 8364 2499",
      website: "http://www.catherinehouse.org.au",
      hours: { today: "24/7 Crisis Support", status: "open" },
      rating: 4.8,
      reviewCount: 78,
      verified: true,
      accessibility: false,
      languages: ["English", "Arabic", "Farsi"],
      services: ["Crisis accommodation", "Support services", "women", "crisis", "emergency", "accommodation", "homelessness", "support", "24/7", "arabic speaking", "farsi speaking"]
    },
    {
      id: 6,
      name: "City of Adelaide",
      type: "Local Government",
      description: "Council services, permits, community programs, city planning",
      distance: "0.5 km",
      address: "Adelaide",
      phone: "08 8203 7203",
      website: "http://www.cityofadelaide.com.au",
      hours: { today: "Monday-Friday 8:30AM-5PM", status: "open" },
      rating: 4.0,
      reviewCount: 312,
      verified: true,
      accessibility: true,
      languages: ["English", "Mandarin", "Italian"],
      services: ["Council services", "Permits", "Community programs", "City planning", "government", "council", "permits", "planning", "community programs", "local services", "accessible", "mandarin speaking", "italian speaking"]
    },
    {
      id: 7,
      name: "Community Centres SA",
      type: "Community Programs",
      description: "Community programs, education, training, social activities",
      distance: "2.1 km",
      address: "Multiple Locations",
      phone: "08 8245 4222",
      website: "http://www.communitycentressa.org.au",
      hours: { today: "Varies by location", status: "unknown" },
      rating: 4.2,
      reviewCount: 67,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Community programs", "Education", "Training", "Social activities", "community", "education", "training", "social", "programs", "activities", "accessible"]
    },
    {
      id: 8,
      name: "Drug & Alcohol Services SA",
      type: "Drug & Alcohol Services",
      description: "Treatment, counselling, rehabilitation, support services",
      distance: "1.8 km",
      address: "Adelaide",
      phone: "1300 131 340",
      website: "http://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/health+services/mental+health+and+drugs+and+alcohol+services/drug+and+alcohol+services",
      hours: { today: "24/7 Support Line", status: "open" },
      rating: 4.4,
      reviewCount: 134,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Treatment", "Counselling", "Rehabilitation", "Support services", "drug", "alcohol", "rehab", "treatment", "counselling", "rehabilitation", "24/7", "accessible"]
    },
    {
      id: 9,
      name: "Emergency Relief Network",
      type: "Emergency Relief",
      description: "Food parcels, vouchers, financial assistance, referrals",
      distance: "2.3 km",
      address: "Adelaide Metro",
      phone: "08 8212 3999",
      website: "http://www.emergencyrelief.org.au",
      hours: { today: "Monday-Friday 9AM-4PM", status: "open" },
      rating: 4.5,
      reviewCount: 89,
      verified: true,
      accessibility: true,
      languages: ["English", "Arabic", "Vietnamese"],
      services: ["Food parcels", "Vouchers", "Financial assistance", "Referrals", "emergency", "food", "vouchers", "financial", "referrals", "relief", "accessible", "arabic speaking", "vietnamese speaking"]
    },
    {
      id: 10,
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
      id: 11,
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
      id: 12,
      name: "Junction Australia",
      type: "Youth Services",
      description: "Youth programs, education, employment, housing support",
      distance: "4.3 km",
      address: "Multiple Locations",
      phone: "08 8354 1844",
      website: "http://www.junctionaustralia.org.au",
      hours: { today: "Monday-Friday 9AM-5PM", status: "open" },
      rating: 4.3,
      reviewCount: 76,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Youth programs", "Education", "Employment", "Housing support", "youth", "education", "employment", "housing", "support", "programs", "accessible"]
    },
    {
      id: 13,
      name: "Lifeline Adelaide",
      type: "Crisis Support",
      description: "Crisis counselling, suicide prevention, community programs",
      distance: "1.5 km",
      address: "Adelaide",
      phone: "13 11 14",
      website: "http://www.lifeline.org.au",
      hours: { today: "24/7 Crisis Line", status: "open" },
      rating: 4.8,
      reviewCount: 456,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Crisis counselling", "Suicide prevention", "Community programs", "crisis", "24/7", "suicide prevention", "counselling", "mental health", "support", "accessible"]
    },
    {
      id: 14,
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
      id: 15,
      name: "Multicultural Communities Council of SA",
      type: "Multicultural Services",
      description: "Settlement services, advocacy, cultural programs, translation",
      distance: "2.2 km",
      address: "Adelaide",
      phone: "08 8345 5266",
      website: "http://www.mccsa.org.au",
      hours: { today: "Monday-Friday 9AM-5PM", status: "open" },
      rating: 4.6,
      reviewCount: 98,
      verified: true,
      accessibility: true,
      languages: ["English", "Arabic", "Mandarin", "Vietnamese", "Italian"],
      services: ["Settlement services", "Advocacy", "Cultural programs", "Translation", "multicultural", "cultural", "translation", "settlement", "advocacy", "community", "accessible", "arabic speaking", "mandarin speaking", "vietnamese speaking", "italian speaking"]
    },
    {
      id: 16,
      name: "Salvation Army Adelaide",
      type: "Emergency Relief",
      description: "Emergency relief, accommodation, meals, support services",
      distance: "1.3 km",
      address: "Multiple Locations",
      phone: "08 8202 0250",
      website: "http://www.salvationarmy.org.au",
      hours: { today: "Daily services available", status: "open" },
      rating: 4.7,
      reviewCount: 287,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Emergency relief", "Accommodation", "Meals", "Support services", "emergency", "relief", "accommodation", "meals", "support", "24/7", "salvos", "accessible"]
    },
    {
      id: 17,
      name: "St Vincent de Paul Society SA",
      type: "Community Support",
      description: "Emergency relief, home visitation, support services, shops",
      distance: "1.4 km",
      address: "Multiple Locations",
      phone: "08 8215 7300",
      website: "http://www.vinnies.org.au",
      hours: { today: "Monday-Friday 9AM-5PM", status: "open" },
      rating: 4.5,
      reviewCount: 201,
      verified: true,
      accessibility: true,
      languages: ["English", "Spanish"],
      services: ["Emergency relief", "Home visitation", "Support services", "emergency", "relief", "home visitation", "support", "vinnies", "community", "accessible", "spanish speaking"]
    },
    {
      id: 18,
      name: "Uniting Communities",
      type: "Community Support",
      description: "Family services, housing, disability support, aged care",
      distance: "1.6 km",
      address: "Multiple Locations",
      phone: "08 8202 5110",
      website: "http://www.unitingcommunities.org",
      hours: { today: "Monday-Friday 9AM-5PM", status: "open" },
      rating: 4.4,
      reviewCount: 132,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Family services", "Housing", "Disability support", "Aged care", "family", "housing", "disability", "aged care", "support", "community", "accessible"]
    },
    {
      id: 19,
      name: "Women's Safety Services SA",
      type: "Women's Services",
      description: "Domestic violence support, crisis accommodation, counselling",
      distance: "2.0 km",
      address: "Adelaide",
      phone: "1800 188 158",
      website: "http://www.womenssafetyservices.com.au",
      hours: { today: "24/7 Support Line", status: "open" },
      rating: 4.9,
      reviewCount: 167,
      verified: true,
      accessibility: true,
      languages: ["English", "Arabic", "Farsi"],
      services: ["Domestic violence support", "Crisis accommodation", "Counselling", "women", "domestic violence", "crisis", "accommodation", "counselling", "24/7", "support", "accessible", "arabic speaking", "farsi speaking"]
    },
    {
      id: 20,
      name: "YMCA Adelaide",
      type: "Recreation & Fitness",
      description: "Recreation programs, fitness, childcare, community programs",
      distance: "2.5 km",
      address: "Multiple Locations",
      phone: "08 8100 1322",
      website: "http://www.ymca.org.au",
      hours: { today: "Early morning to late evening", status: "open" },
      rating: 4.1,
      reviewCount: 189,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Recreation programs", "Fitness", "Childcare", "Community programs", "recreation", "fitness", "childcare", "community programs", "sports", "activities", "accessible"]
    },
    {
      id: 21,
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
      id: 22,
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
    },
    {
      id: 23,
      name: "North Adelaide Lacrosse Club Inc.",
      type: "Sports Club",
      description: "Senior and junior lacrosse teams, coaching available",
      distance: "6.1 km",
      address: "Gepps Cross",
      phone: "08 8260 4561",
      website: "https://www.nalc.com.au",
      hours: { today: "Not specified", status: "unknown" },
      rating: 4.2,
      reviewCount: 16,
      verified: true,
      accessibility: true,
      languages: ["English"],
      services: ["Senior lacrosse teams", "Junior lacrosse teams", "Coaching", "lacrosse", "sports", "coaching", "teams", "junior", "senior", "accessible"]
    }
  ];

  // Use enhanced search to get relevant results with filters applied
  const searchResults: SearchResult[] = useMemo(() => {
    return enhancedSearch(query, adelaideOrganizations, 20, filters);
  }, [query, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-green-600";
      case "closed":
        return "text-red-600";
      case "closing-soon":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return "🟢";
      case "closed":
        return "🔴";
      case "closing-soon":
        return "🟡";
      default:
        return "⚫";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-gov-navy hover:bg-gov-navy/10"
          >
            ← Back to Search
          </Button>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-nav-teal to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-heading text-gov-navy">
                Search Results
              </h1>
              <p className="text-gray-600">
                {query ? `Results for "${query}"` : "All services"}
              </p>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Found <span className="font-medium text-gov-navy">{searchResults.length}</span> matching services
            </div>
            {searchResults.length > 0 && query && (
              <div className="text-sm text-gray-600">
                Sorted by relevance
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {searchResults.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <MapPin className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600 mb-4">
                {query 
                  ? `No services match your search for "${query}". Try using different keywords.`
                  : "No services are available with the current filters."
                }
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="text-xs">food support</Badge>
                <Badge variant="outline" className="text-xs">housing help</Badge>
                <Badge variant="outline" className="text-xs">mental health</Badge>
                <Badge variant="outline" className="text-xs">emergency support</Badge>
                <Badge variant="outline" className="text-xs">lacrosse club</Badge>
              </div>
            </Card>
          ) : (
            searchResults.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    {/* Main Content */}
                    <div className="flex-1 lg:mr-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gov-navy">
                              {result.name}
                            </h3>
                            {result.verified && (
                              <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                                <Shield className="w-3 h-3" />
                                <span>Verified</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 font-medium">{result.type}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{result.rating}</span>
                          <span className="text-gray-500 text-sm">({result.reviewCount})</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p 
                        className="text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(result.description, result.matchedTerms)
                        }}
                      />

                      {/* Services and Keywords */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {result.matchedTerms.slice(0, 3).map((term, index) => (
                            <Badge key={index} className="bg-nav-teal/10 text-nav-teal border-nav-teal">
                              {term}
                            </Badge>
                          ))}
                          {result.services.filter(service => 
                            !result.matchedTerms.some(term => service.toLowerCase().includes(term.toLowerCase()))
                          ).slice(0, 3).map((service, index) => (
                            <Badge key={`service-${index}`} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {result.relevanceScore > 0 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              {Math.round(result.relevanceScore)}% match
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{result.address} • {result.distance}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{result.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span className={`${getStatusColor(result.hours.status)}`}>
                            {getStatusIcon(result.hours.status)} {result.hours.today}
                          </span>
                        </div>
                        {result.website && (
                          <div className="flex items-center space-x-2 text-sm text-blue-600">
                            <ExternalLink className="w-4 h-4" />
                            <a 
                              href={result.website.startsWith('http') ? result.website : `http://${result.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline truncate"
                            >
                              Visit website
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {result.accessibility && (
                          <div className="flex items-center space-x-1 text-xs text-green-600">
                            <Accessibility className="w-4 h-4" />
                            <span>Wheelchair accessible</span>
                          </div>
                        )}
                        {result.languages.length > 1 && (
                          <div className="text-xs text-gray-600">
                            Languages: {result.languages.slice(0, 3).join(", ")}
                            {result.languages.length > 3 && ` +${result.languages.length - 3} more`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 lg:flex-shrink-0">
                      <Button
                        onClick={() => onBookAppointment(result.id)}
                        className="bg-nav-teal hover:bg-nav-teal/90"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onGetDirections(result.id)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}