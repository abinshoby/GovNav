import React, { useState } from 'react';
import { MessageCircle, Phone, Star, Shield, Globe, Heart, Clock, MapPin, User, Video, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import BackButton from './BackButton';
import VolunteerChatDialog from './VolunteerChatDialog';

interface Volunteer {
  id: number;
  name: string;
  avatar?: string;
  languages: string[];
  specialties: string[];
  trustLevel: number;
  rating: number;
  reviewCount: number;
  availability: 'available' | 'busy' | 'offline';
  location: string;
  distance: string;
  responseTime: string;
  verified: boolean;
  experience: string;
  helpedCount: number;
}

interface VolunteerMatchingScreenProps {
  onBack?: () => void;
}

export default function VolunteerMatchingScreen({ onBack }: VolunteerMatchingScreenProps = {}) {
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<number | null>(null);
  const [chatVolunteer, setChatVolunteer] = useState<Volunteer | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const mockVolunteers: Volunteer[] = [
    {
      id: 1,
      name: "Sarah Chen",
      languages: ["English", "Mandarin"],
      specialties: ["Housing", "Government Services", "Translation"],
      trustLevel: 95,
      rating: 4.9,
      reviewCount: 127,
      availability: "available",
      location: "Downtown",
      distance: "1.2 km",
      responseTime: "Usually responds within 5 minutes",
      verified: true,
      experience: "5 years helping community members",
      helpedCount: 340
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      languages: ["English", "Arabic"],
      specialties: ["Centrelink", "Medicare", "Job Search"],
      trustLevel: 88,
      rating: 4.7,
      reviewCount: 89,
      availability: "available",
      location: "West End",
      distance: "2.1 km", 
      responseTime: "Usually responds within 10 minutes",
      verified: true,
      experience: "3 years community volunteer",
      helpedCount: 156
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      languages: ["English", "Spanish"],
      specialties: ["Healthcare", "Education", "Family Services"],
      trustLevel: 92,
      rating: 4.8,
      reviewCount: 203,
      availability: "busy",
      location: "South Side", 
      distance: "3.4 km",
      responseTime: "Usually responds within 20 minutes",
      verified: true,
      experience: "7 years social work background",
      helpedCount: 445
    },
    {
      id: 4,
      name: "David Kumar",
      languages: ["English", "Hindi", "Telugu"],
      specialties: ["Tax Help", "Business Services", "Technology"],
      trustLevel: 85,
      rating: 4.6,
      reviewCount: 67,
      availability: "available",
      location: "North District",
      distance: "4.2 km",
      responseTime: "Usually responds within 15 minutes", 
      verified: true,
      experience: "2 years volunteer, accountant by profession",
      helpedCount: 89
    },
    {
      id: 5,
      name: "Lisa Nguyen",
      languages: ["English", "Vietnamese"],
      specialties: ["Immigration", "Legal Aid", "Document Help"],
      trustLevel: 90,
      rating: 4.9,
      reviewCount: 156,
      availability: "offline",
      location: "East Side",
      distance: "5.1 km",
      responseTime: "Usually responds within 30 minutes",
      verified: true,
      experience: "4 years, paralegal background",
      helpedCount: 267
    }
  ];

  const languages = ["all", "English", "Arabic", "Mandarin", "Hindi", "Spanish", "Vietnamese", "Telugu"];
  const specialties = ["all", "Housing", "Government Services", "Centrelink", "Medicare", "Healthcare", "Immigration", "Tax Help"];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available now';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getTrustLevelColor = (trustLevel: number) => {
    if (trustLevel >= 90) return 'text-green-600';
    if (trustLevel >= 80) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const filteredVolunteers = mockVolunteers.filter(volunteer => {
    const matchesLanguage = filterLanguage === 'all' || volunteer.languages.includes(filterLanguage);
    const matchesSpecialty = filterSpecialty === 'all' || volunteer.specialties.some(s => s.includes(filterSpecialty));
    return matchesLanguage && matchesSpecialty;
  });

  const handleConnect = (volunteerId: number, method: 'chat' | 'call' | 'video') => {
    const volunteer = mockVolunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;

    if (method === 'chat') {
      setChatVolunteer(volunteer);
      setIsChatOpen(true);
    } else {
      // In a real app, this would initiate secure communication for call/video
      console.log(`Connecting to volunteer ${volunteerId} via ${method}`);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setChatVolunteer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            Connect with a Volunteer Helper
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized assistance from trusted community volunteers who speak your language
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Language Support</label>
                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang === 'all' ? 'Any language' : lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Specialty Area</label>
                <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty === 'all' ? 'Any specialty' : specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolunteers.map((volunteer) => (
            <Card 
              key={volunteer.id} 
              className={`hover:shadow-lg transition-all cursor-pointer ${
                selectedVolunteer === volunteer.id ? 'ring-2 ring-nav-teal' : ''
              }`}
              onClick={() => setSelectedVolunteer(volunteer.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={volunteer.avatar} />
                    <AvatarFallback className="bg-nav-teal text-white">
                      {volunteer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{volunteer.name}</h3>
                      {volunteer.verified && (
                        <Shield className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <Badge className={getAvailabilityColor(volunteer.availability)}>
                      {getAvailabilityText(volunteer.availability)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating & Trust */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{volunteer.rating}</span>
                    <span className="text-sm text-gray-500">({volunteer.reviewCount})</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getTrustLevelColor(volunteer.trustLevel)}`}>
                      {volunteer.trustLevel}% Trust Level
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Languages:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Specialties:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.specialties.slice(0, 2).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {volunteer.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{volunteer.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Location & Response Time */}
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{volunteer.location} • {volunteer.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{volunteer.responseTime}</span>
                  </div>
                </div>

                {/* Experience */}
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-1 mb-1">
                    <User className="w-3 h-3" />
                    <span>{volunteer.experience}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Helped {volunteer.helpedCount} community members
                  </div>
                </div>

                {/* Connect Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 hover:bg-nav-teal/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(volunteer.id, 'chat');
                    }}
                    disabled={volunteer.availability === 'offline'}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 hover:bg-nav-teal/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(volunteer.id, 'call');
                    }}
                    disabled={volunteer.availability !== 'available'}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2 hover:bg-nav-teal/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(volunteer.id, 'video');
                    }}
                    disabled={volunteer.availability !== 'available'}
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </div>

                {volunteer.availability === 'available' && (
                  <Button
                    className="w-full bg-nav-teal hover:bg-nav-teal/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(volunteer.id, 'chat');
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVolunteers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No volunteers found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your language or specialty filters
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setFilterLanguage('all');
                  setFilterSpecialty('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Secure Communication</h3>
                <p className="text-sm text-blue-800">
                  All communications with volunteers are encrypted and monitored for safety. 
                  Volunteers are background-checked and trained community members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Dialog */}
      {chatVolunteer && (
        <VolunteerChatDialog
          volunteer={chatVolunteer}
          isOpen={isChatOpen}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}