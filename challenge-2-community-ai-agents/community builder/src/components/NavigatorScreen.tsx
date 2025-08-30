import React, { useState } from 'react';
import { Search, Building, Scale, AlertTriangle, Filter, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function NavigatorScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState('all');
  const [showMap, setShowMap] = useState(false);

  const regulations = [
    {
      id: 1,
      title: "Food Service Permit",
      jurisdiction: "local",
      description: "Required permit for operating any food service establishment including cafes, restaurants, and food trucks.",
      complexity: "medium",
      timeframe: "2-4 weeks",
      cost: "$150-300",
      conflicts: false,
      requirements: ["Health inspection", "Zoning approval", "Fire safety clearance"]
    },
    {
      id: 2,
      title: "Business Registration",
      jurisdiction: "state",
      description: "Official registration of your business entity with state government for tax and legal purposes.",
      complexity: "low",
      timeframe: "1-2 weeks", 
      cost: "$50-100",
      conflicts: false,
      requirements: ["Business name search", "Articles of incorporation", "Tax ID number"]
    },
    {
      id: 3,
      title: "Building Permit",
      jurisdiction: "local",
      description: "Permit required for any structural modifications, renovations, or new construction projects.",
      complexity: "high",
      timeframe: "4-8 weeks",
      cost: "$500-2000",
      conflicts: true,
      requirements: ["Architectural plans", "Engineering report", "Environmental assessment"]
    },
    {
      id: 4,
      title: "Employment Standards",
      jurisdiction: "federal",
      description: "Federal regulations governing minimum wage, working hours, safety standards, and employee rights.",
      complexity: "high",
      timeframe: "Ongoing",
      cost: "Compliance costs vary",
      conflicts: false,
      requirements: ["Safety training", "Record keeping", "Insurance coverage"]
    },
    {
      id: 5,
      title: "Liquor License",
      jurisdiction: "state",
      description: "License required to serve or sell alcoholic beverages on your premises.",
      complexity: "high",
      timeframe: "6-12 weeks",
      cost: "$1000-5000",
      conflicts: true,
      requirements: ["Background check", "Community notice", "Premises inspection"]
    }
  ];

  const filteredRegulations = regulations.filter(reg => {
    const matchesSearch = reg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction = jurisdiction === 'all' || reg.jurisdiction === jurisdiction;
    return matchesSearch && matchesJurisdiction;
  });

  const getJurisdictionColor = (jurisdiction: string) => {
    switch (jurisdiction) {
      case 'local': return 'bg-blue-100 text-blue-800';
      case 'state': return 'bg-green-100 text-green-800';
      case 'federal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Red Tape Navigator</h1>
          <p className="text-lg text-gray-600">
            Navigate regulations and compliance requirements for your business or project
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="What activity are you doing? (e.g., open café, build house, hire staff)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={jurisdiction} onValueChange={setJurisdiction}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jurisdictions</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="state">State</SelectItem>
                <SelectItem value="federal">Federal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{filteredRegulations.length} regulations found</span>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>{filteredRegulations.filter(r => r.conflicts).length} potential conflicts detected</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setShowMap(!showMap)}
              className="flex items-center space-x-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{showMap ? 'Hide' : 'Show'} Regulation Map</span>
            </Button>
          </div>
        </div>

        {/* Regulation Map Visualization */}
        {showMap && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Interactive Regulation Map</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white">
                      <Building className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold">Local Requirements</h3>
                    <p className="text-sm text-gray-600">Permits, zoning, health codes</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-green-600 rounded-full mx-auto flex items-center justify-center text-white">
                      <Scale className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold">State Regulations</h3>
                    <p className="text-sm text-gray-600">Licensing, registration, taxes</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto flex items-center justify-center text-white">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold">Federal Compliance</h3>
                    <p className="text-sm text-gray-600">Employment, safety, environment</p>
                  </div>
                </div>
                <div className="mt-6 text-sm text-gray-500">
                  Interactive regulation dependency map - Click cards below to see detailed connections
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regulations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRegulations.map((regulation) => (
            <Card key={regulation.id} className={`hover:shadow-lg transition-shadow ${regulation.conflicts ? 'border-red-200' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{regulation.title}</span>
                      {regulation.conflicts && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getJurisdictionColor(regulation.jurisdiction)}>
                        {regulation.jurisdiction.toUpperCase()}
                      </Badge>
                      <span className={`text-sm font-medium ${getComplexityColor(regulation.complexity)}`}>
                        {regulation.complexity.toUpperCase()} COMPLEXITY
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600">{regulation.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Timeframe:</span>
                    <p className="text-gray-600">{regulation.timeframe}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Cost:</span>
                    <p className="text-gray-600">{regulation.cost}</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-900 text-sm">Key Requirements:</span>
                  <ul className="mt-2 space-y-1">
                    {regulation.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Compare Regulations
                  </Button>
                </div>

                {regulation.conflicts && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-red-800">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Potential Conflict Detected</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">
                      This regulation may conflict with other requirements in your area. Review carefully.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRegulations.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No regulations found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}