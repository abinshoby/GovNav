import React, { useState, useCallback, useEffect } from 'react';
import { Scale, Utensils, Shield, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import DynamicVisualization from './DynamicVisualization';

interface RegulationExample {
  id: string;
  title: string;
  location: string;
  industry: string;
  description: string;
  icon: React.ReactNode;
  localRequirements: Array<{
    title: string;
    description: string;
    category: string;
    regulator: string;
    progress: number;
  }>;
  stateRequirements: Array<{
    title: string;
    description: string;
    category: string;
    regulator: string;
    progress: number;
  }>;
  federalRequirements: Array<{
    title: string;
    description: string;
    category: string;
    regulator: string;
    progress: number;
  }>;
  complianceSteps: Array<{
    step: number;
    title: string;
    description: string;
    timeframe: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
  conflictsDetected: Array<{
    title: string;
    description: string;
    jurisdictions: string[];
    severity: 'low' | 'medium' | 'high';
  }>;
}

export default function NavigatorScreen() {
  // Visualization search state
  const [visualizationQuery, setVisualizationQuery] = useState('');

  const regulationExamples: RegulationExample[] = [
    {
      id: 'cafe-sydney',
      title: 'Café in Sydney',
      location: 'Sydney, NSW',
      industry: 'Food Service',
      description: 'A small café wanting to operate in Sydney CBD with seating for 20 customers',
      icon: <Utensils className="w-6 h-6" />,
      localRequirements: [
        {
          title: 'Food Business Registration',
          description: 'Register food business with Sydney City Council',
          category: 'Food Safety',
          regulator: 'City of Sydney Council',
          progress: 100
        },
        {
          title: 'Health Inspection',
          description: 'Pass initial health inspection for food premises',
          category: 'Food Safety',
          regulator: 'NSW Health (Local)',
          progress: 75
        },
        {
          title: 'Waste Management Plan',
          description: 'Submit commercial waste management strategy',
          category: 'Environment',
          regulator: 'City of Sydney Council',
          progress: 50
        }
      ],
      stateRequirements: [
        {
          title: 'NSW Food Safety Standards',
          description: 'Comply with Food Act 2003 (NSW) requirements',
          category: 'Food Safety',
          regulator: 'NSW Food Authority',
          progress: 80
        },
        {
          title: 'WorkCover NSW Registration',
          description: 'Register for workers compensation insurance',
          category: 'Workplace Safety',
          regulator: 'SafeWork NSW',
          progress: 100
        },
        {
          title: 'Liquor License (if applicable)',
          description: 'Apply for on-premises liquor license if serving alcohol',
          category: 'Licensing',
          regulator: 'Liquor & Gaming NSW',
          progress: 25
        }
      ],
      federalRequirements: [
        {
          title: 'Australian Business Number (ABN)',
          description: 'Register for ABN with Australian Taxation Office',
          category: 'Business Registration',
          regulator: 'Australian Taxation Office',
          progress: 100
        },
        {
          title: 'Fair Work Act Compliance',
          description: 'Meet minimum wage and workplace rights obligations',
          category: 'Employment',
          regulator: 'Fair Work Ombudsman',
          progress: 60
        },
        {
          title: 'GST Registration',
          description: 'Register for GST if turnover exceeds $75,000',
          category: 'Tax',
          regulator: 'Australian Taxation Office',
          progress: 90
        }
      ],
      complianceSteps: [
        {
          step: 1,
          title: 'Register Business',
          description: 'Obtain ABN and register business structure',
          timeframe: '1-2 weeks',
          status: 'completed'
        },
        {
          step: 2,
          title: 'Food Business Registration',
          description: 'Register food business with local council',
          timeframe: '2-4 weeks',
          status: 'completed'
        },
        {
          step: 3,
          title: 'Premises Setup',
          description: 'Fit out premises to health standards',
          timeframe: '4-8 weeks',
          status: 'in-progress'
        },
        {
          step: 4,
          title: 'Staff Training & WHS',
          description: 'Complete food safety training and WHS setup',
          timeframe: '1-2 weeks',
          status: 'pending'
        },
        {
          step: 5,
          title: 'Final Inspections',
          description: 'Pass all required health and safety inspections',
          timeframe: '1-2 weeks',
          status: 'pending'
        }
      ],
      conflictsDetected: [
        {
          title: 'Food Safety Standards Overlap',
          description: 'NSW Food Authority standards may duplicate some local council requirements',
          jurisdictions: ['Local Council', 'NSW State'],
          severity: 'low'
        }
      ]
    },
    {
      id: 'cybersecurity-canberra',
      title: 'Cybersecurity Start-up',
      location: 'Canberra, ACT',
      industry: 'Cybersecurity',
      description: 'A cybersecurity consultancy providing services to government and private sector',
      icon: <Shield className="w-6 h-6" />,
      localRequirements: [
        {
          title: 'ACT Business License',
          description: 'Register business with ACT Revenue Office',
          category: 'Business Registration',
          regulator: 'ACT Revenue Office',
          progress: 100
        },
        {
          title: 'Professional Indemnity Insurance',
          description: 'Obtain adequate professional indemnity coverage',
          category: 'Insurance',
          regulator: 'ACT Business License Office',
          progress: 80
        }
      ],
      stateRequirements: [
        {
          title: 'ACT Procurement Framework',
          description: 'Register for government procurement opportunities',
          category: 'Procurement',
          regulator: 'ACT Government Procurement',
          progress: 60
        },
        {
          title: 'ACT Privacy Legislation',
          description: 'Comply with Information Privacy Act 2014 (ACT)',
          category: 'Privacy',
          regulator: 'ACT Human Rights Commission',
          progress: 70
        }
      ],
      federalRequirements: [
        {
          title: 'Privacy Act 1988 Compliance',
          description: 'Implement privacy framework under Commonwealth Privacy Act',
          category: 'Privacy',
          regulator: 'Office of the Australian Information Commissioner',
          progress: 85
        },
        {
          title: 'Australian Cyber Security Centre Guidelines',
          description: 'Adhere to Essential Eight security framework',
          category: 'Cybersecurity',
          regulator: 'Australian Cyber Security Centre',
          progress: 90
        },
        {
          title: 'Export Control Considerations',
          description: 'Check Defence Trade Controls Act 2012 requirements',
          category: 'Export Control',
          regulator: 'Department of Foreign Affairs and Trade',
          progress: 40
        },
        {
          title: 'Security Clearances',
          description: 'Obtain required security clearances for government contracts',
          category: 'Security',
          regulator: 'Australian Government Security Vetting Agency',
          progress: 30
        }
      ],
      complianceSteps: [
        {
          step: 1,
          title: 'Business Setup',
          description: 'Complete business registration and ABN',
          timeframe: '1-2 weeks',
          status: 'completed'
        },
        {
          step: 2,
          title: 'Privacy Framework',
          description: 'Implement privacy policies and procedures',
          timeframe: '3-4 weeks',
          status: 'in-progress'
        },
        {
          step: 3,
          title: 'Security Clearances',
          description: 'Apply for required security clearances',
          timeframe: '12-26 weeks',
          status: 'pending'
        },
        {
          step: 4,
          title: 'Procurement Registration',
          description: 'Register with government procurement systems',
          timeframe: '2-4 weeks',
          status: 'pending'
        }
      ],
      conflictsDetected: [
        {
          title: 'Privacy Law Overlap',
          description: 'ACT and Commonwealth privacy laws have overlapping requirements',
          jurisdictions: ['ACT Territory', 'Commonwealth'],
          severity: 'medium'
        },
        {
          title: 'Procurement Framework Duplication',
          description: 'State procurement and federal digital service standards may conflict',
          jurisdictions: ['ACT Territory', 'Commonwealth'],
          severity: 'medium'
        }
      ]
    },
    {
      id: 'construction-brisbane',
      title: 'Residential Construction',
      location: 'Brisbane, QLD',
      industry: 'Construction',
      description: 'A residential construction company building single-family homes in Brisbane suburbs',
      icon: <Home className="w-6 h-6" />,
      localRequirements: [
        {
          title: 'Development Application',
          description: 'Submit DA to Brisbane City Council',
          category: 'Planning',
          regulator: 'Brisbane City Council',
          progress: 75
        },
        {
          title: 'Building Permit',
          description: 'Obtain building approval from council',
          category: 'Building',
          regulator: 'Brisbane City Council',
          progress: 60
        },
        {
          title: 'Environmental Planning',
          description: 'Address local environmental planning requirements',
          category: 'Environment',
          regulator: 'Brisbane City Council',
          progress: 80
        }
      ],
      stateRequirements: [
        {
          title: 'QBCC License',
          description: 'Hold valid Queensland Building and Construction Commission license',
          category: 'Licensing',
          regulator: 'Queensland Building and Construction Commission',
          progress: 100
        },
        {
          title: 'Queensland Building Codes',
          description: 'Comply with Queensland Development Code',
          category: 'Building Standards',
          regulator: 'Queensland Building and Construction Commission',
          progress: 90
        },
        {
          title: 'WorkSafe Queensland',
          description: 'Meet workplace health and safety requirements',
          category: 'Workplace Safety',
          regulator: 'WorkSafe Queensland',
          progress: 85
        }
      ],
      federalRequirements: [
        {
          title: 'National Construction Code',
          description: 'Comply with Building Code of Australia standards',
          category: 'Building Standards',
          regulator: 'Australian Building Codes Board',
          progress: 95
        },
        {
          title: 'Environmental Protection Laws',
          description: 'Meet Commonwealth environmental requirements',
          category: 'Environment',
          regulator: 'Department of Climate Change, Energy, the Environment and Water',
          progress: 70
        },
        {
          title: 'Fair Work Building Code',
          description: 'Comply with federal building industry requirements',
          category: 'Employment',
          regulator: 'Fair Work Building and Construction',
          progress: 80
        }
      ],
      complianceSteps: [
        {
          step: 1,
          title: 'QBCC License Verification',
          description: 'Ensure current and valid building license',
          timeframe: 'Immediate',
          status: 'completed'
        },
        {
          step: 2,
          title: 'Development Application',
          description: 'Submit and receive approval for development',
          timeframe: '6-12 weeks',
          status: 'in-progress'
        },
        {
          step: 3,
          title: 'Building Permit',
          description: 'Obtain final building approval',
          timeframe: '4-8 weeks',
          status: 'pending'
        },
        {
          step: 4,
          title: 'WHS Implementation',
          description: 'Establish site safety systems and training',
          timeframe: '2-3 weeks',
          status: 'pending'
        },
        {
          step: 5,
          title: 'Construction Compliance',
          description: 'Maintain ongoing compliance during build',
          timeframe: 'Throughout project',
          status: 'pending'
        }
      ],
      conflictsDetected: [
        {
          title: 'Building Code Overlap',
          description: 'Local council codes may exceed National Construction Code requirements',
          jurisdictions: ['Brisbane Council', 'Commonwealth'],
          severity: 'low'
        },
        {
          title: 'Environmental Assessment Duplication',
          description: 'State and federal environmental assessments may overlap',
          jurisdictions: ['Queensland State', 'Commonwealth'],
          severity: 'high'
        }
      ]
    }
  ];



  const regulations = [
    {
      id: 1,
      title: "Australian Business Number (ABN)",
      jurisdiction: "federal",
      description: "Required federal registration for all businesses operating in Australia, managed by the Australian Taxation Office. Apply online at business.gov.au or directly through the ATO portal.",
      complexity: "low",
      timeframe: "5-28 days",
      cost: "Free",
      conflicts: false,
      requirements: ["Business structure decision", "Operating location", "Tax registration"],
      datasetRef: "Commonwealth Statute Book",
      legislation: "A New Tax System (Australian Business Number) Act 1999",
      governmentWebsite: "https://business.gov.au/registrations/business-registration/australian-business-number-abn",
      regulatorWebsite: "https://www.ato.gov.au/business/registration/abn",
      applicationLink: "https://www.abr.business.gov.au/",
      officialUrl: "https://www.alrc.gov.au/datahub/the-commonwealth-statute-book/",
      officialSource: "Commonwealth Statute Book - Australian Law Reform Commission"
    },
    {
      id: 2,
      title: "Food Business License",
      jurisdiction: "state",
      description: "State-regulated license for food service establishments with varying requirements across jurisdictions. Check your local council website and state food authority for specific requirements.",
      complexity: "medium",
      timeframe: "2-8 weeks",
      cost: "$100-800",
      conflicts: true,
      requirements: ["Food safety training", "Premises inspection", "Public liability insurance"],
      datasetRef: "State Planning Regulations Database",
      conflictNote: "Requirements vary significantly between states - potential compliance conflicts",
      governmentWebsites: {
        "NSW": "https://www.foodauthority.nsw.gov.au/retail/registering-food-business",
        "VIC": "https://www2.health.vic.gov.au/public-health/food-safety/food-businesses",
        "QLD": "https://www.health.qld.gov.au/system-governance/licences/businesses/food-business",
        "WA": "https://www.wa.gov.au/service/business-and-industry/business-registration-and-licensing/register-food-business",
        "SA": "https://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/protecting+public+health/food+safety/food+business+registration+and+licensing",
        "TAS": "https://www.health.tas.gov.au/health-topics/environmental-health/food-safety",
        "ACT": "https://www.health.act.gov.au/about-our-health-system/planning-policy/act-health-regulations/food-act-2001",
        "NT": "https://nt.gov.au/industry/hospitality/food-business-compliance"
      },
      stateOfficialSources: {
        "NSW": { url: "https://legislation.nsw.gov.au/", name: "NSW Consolidated Legislation" },
        "SA": { url: "https://www.legislation.sa.gov.au/", name: "SA Consolidated Legislation" }
      }
    },
    {
      id: 3,
      title: "Work Health and Safety Compliance",
      jurisdiction: "multi",
      description: "Multi-jurisdictional WHS requirements with overlapping federal, state, and industry-specific obligations. Visit SafeWork Australia for national guidance and your state SafeWork authority for specific requirements.",
      complexity: "high",
      timeframe: "Ongoing",
      cost: "$500-5000+",
      conflicts: true,
      requirements: ["Safety procedures", "Worker consultation", "Incident reporting", "Risk assessments"],  
      datasetRef: "Work Health and Safety Regulations", 
      conflictNote: "Federal WHS Act overlaps with state-specific regulations and industry codes",
      governmentWebsite: "https://www.safeworkaustralia.gov.au/",
      stateWebsites: {
        "NSW": "https://www.safework.nsw.gov.au/",
        "VIC": "https://www.worksafe.vic.gov.au/",
        "QLD": "https://www.worksafe.qld.gov.au/",
        "WA": "https://www.dmirs.wa.gov.au/safety",
        "SA": "https://www.safework.sa.gov.au/",
        "TAS": "https://worksafe.tas.gov.au/",
        "ACT": "https://www.worksafe.act.gov.au/",
        "NT": "https://worksafe.nt.gov.au/"
      },
      officialUrl: "https://www.legislation.gov.au/",
      officialSource: "Federal Register of Legislation"
    }
  ];

  const getJurisdictionColor = (jurisdiction: string) => {
    switch (jurisdiction) {
      case 'local': return 'bg-blue-100 text-blue-800';
      case 'state': return 'bg-green-100 text-green-800';
      case 'federal': return 'bg-gov-navy/10 text-gov-navy';
      case 'multi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Food Safety': 'bg-orange-100 text-orange-800',
      'Workplace Safety': 'bg-red-100 text-red-800',
      'Environment': 'bg-green-100 text-green-800',
      'Business Registration': 'bg-blue-100 text-blue-800',
      'Licensing': 'bg-purple-100 text-purple-800',
      'Privacy': 'bg-indigo-100 text-indigo-800',
      'Cybersecurity': 'bg-slate-100 text-slate-800',
      'Planning': 'bg-teal-100 text-teal-800',
      'Building Standards': 'bg-amber-100 text-amber-800',
      'Employment': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Dynamic visualization filtering with keyword mapping and location support
  const getVisualizationData = () => {
    if (!visualizationQuery.trim()) {
      return {
        relevantRegulations: [],
        relevantRequirements: [],
        detectedConflicts: [],
        complianceSteps: [],
        jurisdictionBreakdown: { local: 0, state: 0, federal: 0 },
        locationContext: null
      };
    }

    // Apply keyword mapping and location detection
    let query = visualizationQuery.toLowerCase();
    
    // Location mappings for Australian cities and regions
    const locationMappings: { [key: string]: { state: string; type: string } } = {
      'sydney': { state: 'NSW', type: 'city' },
      'melbourne': { state: 'VIC', type: 'city' },
      'brisbane': { state: 'QLD', type: 'city' },
      'perth': { state: 'WA', type: 'city' },
      'adelaide': { state: 'SA', type: 'city' },
      'canberra': { state: 'ACT', type: 'city' },
      'darwin': { state: 'NT', type: 'city' },
      'hobart': { state: 'TAS', type: 'city' },
      'gold coast': { state: 'QLD', type: 'city' },
      'newcastle': { state: 'NSW', type: 'city' },
      'wollongong': { state: 'NSW', type: 'city' },
      'geelong': { state: 'VIC', type: 'city' },
      'townsville': { state: 'QLD', type: 'city' },
      'cairns': { state: 'QLD', type: 'city' },
      'nsw': { state: 'NSW', type: 'state' },
      'new south wales': { state: 'NSW', type: 'state' },
      'vic': { state: 'VIC', type: 'state' },
      'victoria': { state: 'VIC', type: 'state' },
      'qld': { state: 'QLD', type: 'state' },
      'queensland': { state: 'QLD', type: 'state' },
      'wa': { state: 'WA', type: 'state' },
      'western australia': { state: 'WA', type: 'state' },
      'sa': { state: 'SA', type: 'state' },
      'south australia': { state: 'SA', type: 'state' },
      'tas': { state: 'TAS', type: 'state' },
      'tasmania': { state: 'TAS', type: 'state' },
      'act': { state: 'ACT', type: 'territory' },
      'australian capital territory': { state: 'ACT', type: 'territory' },
      'nt': { state: 'NT', type: 'territory' },
      'northern territory': { state: 'NT', type: 'territory' }
    };

    // Business type keyword mappings
    const keywordMappings: { [key: string]: string } = {
      'cafe': 'food',
      'cafes': 'food', 
      'coffee': 'food',
      'restaurant': 'food',
      'dining': 'food',
      'bakery': 'food',
      'takeaway': 'food',
      'building': 'construction',
      'buildings': 'construction',
      'builder': 'construction',
      'home': 'construction',
      'house': 'construction',
      'property': 'construction',
      'developer': 'construction',
      'renovation': 'construction',
      'tech': 'cybersecurity',
      'technology': 'cybersecurity',
      'software': 'cybersecurity',
      'startup': 'cybersecurity',
      'it': 'cybersecurity'
    };

    // Detect location context
    let locationContext = null;
    for (const [location, details] of Object.entries(locationMappings)) {
      if (query.includes(location)) {
        locationContext = { location: location, ...details };
        // Don't remove location from query to allow combined location + business searches
        break;
      }
    }
    
    // Apply business type keyword mappings
    Object.entries(keywordMappings).forEach(([original, mapped]) => {
      query = query.replace(new RegExp(`\\b${original}\\b`, 'g'), mapped);
    });
    
    // Filter regulations by search query
    const relevantRegulations = regulations.filter(reg => 
      reg.title.toLowerCase().includes(query) ||
      reg.description.toLowerCase().includes(query) ||
      reg.requirements.some(req => req.toLowerCase().includes(query))
    );

    // Find relevant requirements from examples
    const relevantRequirements: Array<{
      title: string;
      description: string;
      category: string;
      regulator: string;
      jurisdiction: 'local' | 'state' | 'federal';
      progress: number;
    }> = [];

    regulationExamples.forEach(example => {
      // Check if example matches query (business type) or location
      const matchesQuery = example.title.toLowerCase().includes(query) || 
                          example.industry.toLowerCase().includes(query) ||
                          example.description.toLowerCase().includes(query);
      
      const matchesLocation = !locationContext || 
                             example.location.toLowerCase().includes(locationContext.location) ||
                             example.location.toLowerCase().includes(locationContext.state.toLowerCase());
      
      if (matchesQuery || (locationContext && matchesLocation)) {
        example.localRequirements.forEach(req => 
          relevantRequirements.push({...req, jurisdiction: 'local' as const})
        );
        example.stateRequirements.forEach(req => 
          relevantRequirements.push({...req, jurisdiction: 'state' as const})
        );
        example.federalRequirements.forEach(req => 
          relevantRequirements.push({...req, jurisdiction: 'federal' as const})
        );
      }
    });

    // Filter by category/regulator/jurisdiction matching the query
    const categoryFiltered = relevantRequirements.filter(req =>
      req.category.toLowerCase().includes(query) ||
      req.regulator.toLowerCase().includes(query) ||
      req.title.toLowerCase().includes(query) ||
      req.description.toLowerCase().includes(query)
    );

    const combinedRequirements = [...relevantRequirements, ...categoryFiltered]
      .filter((req, index, arr) => 
        arr.findIndex(r => r.title === req.title && r.regulator === req.regulator) === index
      )
      .slice(0, 12); // Limit to 12 most relevant

    // Find conflicts
    const detectedConflicts: Array<{
      title: string;
      description: string;
      jurisdictions: string[];
      severity: 'low' | 'medium' | 'high';
    }> = [];

    regulationExamples.forEach(example => {
      // Check if example matches query (business type) or location for conflicts
      const matchesQuery = example.title.toLowerCase().includes(query) || 
                          example.industry.toLowerCase().includes(query);
      
      const matchesLocation = !locationContext || 
                             example.location.toLowerCase().includes(locationContext.location) ||
                             example.location.toLowerCase().includes(locationContext.state.toLowerCase());
      
      if (matchesQuery || (locationContext && matchesLocation)) {
        detectedConflicts.push(...example.conflictsDetected);
      }
    });

    // Calculate jurisdiction breakdown
    const jurisdictionBreakdown = combinedRequirements.reduce((acc, req) => {
      acc[req.jurisdiction] = (acc[req.jurisdiction] || 0) + 1;
      return acc;
    }, { local: 0, state: 0, federal: 0 });

    // Find compliance steps from matching examples
    const complianceSteps: Array<{
      step: number;
      title: string;
      description: string;
      timeframe: string;
      status: 'pending' | 'in-progress' | 'completed';
      exampleType?: string;
    }> = [];

    regulationExamples.forEach(example => {
      // Check if example matches query (business type) or location for steps
      const matchesQuery = example.title.toLowerCase().includes(query) || 
                          example.industry.toLowerCase().includes(query) ||
                          example.description.toLowerCase().includes(query);
      
      const matchesLocation = !locationContext || 
                             example.location.toLowerCase().includes(locationContext.location) ||
                             example.location.toLowerCase().includes(locationContext.state.toLowerCase());
      
      if (matchesQuery || (locationContext && matchesLocation)) {
        example.complianceSteps.forEach(step => 
          complianceSteps.push({
            ...step,
            exampleType: example.title
          })
        );
      }
    });

    return {
      relevantRegulations,
      relevantRequirements: combinedRequirements,
      detectedConflicts,
      complianceSteps: complianceSteps.slice(0, 10), // Limit to most relevant steps
      jurisdictionBreakdown,
      locationContext
    };
  };

  const visualizationData = getVisualizationData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gov-navy to-nav-teal rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span>GovNav</span>
          </h1>
          <p className="text-lg text-gray-600">
            Cut through the maze of overlapping rules - Navigate Australia's regulatory landscape with confidence
          </p>
          
          {/* GovHack Challenge Info */}
          <div className="mt-4 bg-gradient-to-r from-accent-yellow/10 to-nav-teal/10 border border-accent-yellow/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-accent-yellow rounded-full flex items-center justify-center">
                  <span className="text-gov-navy font-bold text-xs">GH</span>
                </div>
                <span className="text-sm font-medium text-gov-navy">
                  Powered by Commonwealth datasets from the Federal Register of Legislation
                </span>
              </div>
              <Badge className="bg-nav-teal/10 text-nav-teal border-nav-teal">
                GovHack 2025
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content - Direct Visualization Interface */}
        <DynamicVisualization
          visualizationQuery={visualizationQuery}
          setVisualizationQuery={setVisualizationQuery}
          visualizationData={visualizationData}
          getCategoryColor={getCategoryColor}
          getJurisdictionColor={getJurisdictionColor}
          getConflictSeverityColor={getConflictSeverityColor}
        />
      </div>
    </div>
  );
}