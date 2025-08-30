import React, { useState, useCallback, useEffect } from 'react';
import { Search, Building, Scale, AlertTriangle, Filter, MapPin, CheckCircle, XCircle, Upload, FileText, NavigationIcon, Plus, ExternalLink, BookOpen, Send, Settings, Download, Utensils, Shield, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Progress } from './ui/progress';
import { openAIService, updateOpenAIService } from './OpenAIService';
import { toast } from 'sonner@2.0.3';
import APIKeyConfig from './APIKeyConfig';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [activeTab, setActiveTab] = useState('finder');
  const [procedureQuery, setProcedureQuery] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<{ [key: number]: boolean }>({});
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showSolutionSteps, setShowSolutionSteps] = useState(true);
  
  // Visualization search state
  const [visualizationQuery, setVisualizationQuery] = useState('');
  
  // Multi-step form state
  const [formStep, setFormStep] = useState(1);
  const [formLocation, setFormLocation] = useState({ state: '', council: '' });
  const [formIndustry, setFormIndustry] = useState('');
  const [formEmployees, setFormEmployees] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Text analysis state
  const [textInput, setTextInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAPIConfig, setShowAPIConfig] = useState(false);
  const [currentAPIKey, setCurrentAPIKey] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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

  const currentExample = selectedExample ? regulationExamples.find(ex => ex.id === selectedExample) : null;

  const regulations = [
    {
      id: 1,
      title: "Australian Business Number (ABN)",
      jurisdiction: "federal",
      description: "Required federal registration for all businesses operating in Australia, managed by the Australian Taxation Office.",
      complexity: "low",
      timeframe: "5-28 days",
      cost: "Free",
      conflicts: false,
      requirements: ["Business structure decision", "Operating location", "Tax registration"],
      datasetRef: "Commonwealth Statute Book",
      legislation: "A New Tax System (Australian Business Number) Act 1999"
    },
    {
      id: 2,
      title: "Food Business License",
      jurisdiction: "state",
      description: "State-regulated license for food service establishments with varying requirements across jurisdictions.",
      complexity: "medium",
      timeframe: "2-8 weeks",
      cost: "$100-800",
      conflicts: true,
      requirements: ["Food safety training", "Premises inspection", "Public liability insurance"],
      datasetRef: "State Planning Regulations Database",
      conflictNote: "Requirements vary significantly between states - potential compliance conflicts"
    },
    {
      id: 3,
      title: "Work Health and Safety Compliance",
      jurisdiction: "multi",
      description: "Multi-jurisdictional WHS requirements with overlapping federal, state, and industry-specific obligations.",
      complexity: "high",
      timeframe: "Ongoing",
      cost: "$500-5000+",
      conflicts: true,
      requirements: ["Safety procedures", "Worker consultation", "Incident reporting", "Risk assessments"],
      datasetRef: "Work Health and Safety Regulations",
      conflictNote: "Federal WHS Act overlaps with state-specific regulations and industry codes"
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

  // Dynamic visualization filtering
  const getVisualizationData = () => {
    if (!visualizationQuery.trim()) {
      return {
        relevantRegulations: [],
        relevantRequirements: [],
        detectedConflicts: [],
        jurisdictionBreakdown: { local: 0, state: 0, federal: 0 }
      };
    }

    const query = visualizationQuery.toLowerCase();
    
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
      if (example.title.toLowerCase().includes(query) || 
          example.industry.toLowerCase().includes(query) ||
          example.description.toLowerCase().includes(query)) {
        
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
      if (example.title.toLowerCase().includes(query) || 
          example.industry.toLowerCase().includes(query)) {
        detectedConflicts.push(...example.conflictsDetected);
      }
    });

    // Calculate jurisdiction breakdown
    const jurisdictionBreakdown = combinedRequirements.reduce((acc, req) => {
      acc[req.jurisdiction] = (acc[req.jurisdiction] || 0) + 1;
      return acc;
    }, { local: 0, state: 0, federal: 0 });

    return {
      relevantRegulations,
      relevantRequirements: combinedRequirements,
      detectedConflicts,
      jurisdictionBreakdown
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
            <span>Red Tape Navigator</span>
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
                GovHack 2024
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="finder" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Regulation Finder</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Results & Checklist</span>
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Visualization</span>
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Example Flows</span>
            </TabsTrigger>
            <TabsTrigger value="text-analysis" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Text Analysis</span>
            </TabsTrigger>
          </TabsList>

          {/* Empty state tabs - implemented separately */}
          <TabsContent value="finder" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Regulation Finder</h3>
                <p className="text-gray-600">Multi-step form to identify regulatory obligations</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Results & Checklist</h3>
                <p className="text-gray-600">Compliance roadmaps and progress tracking</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dynamic Visualization Tab */}
          <TabsContent value="visualization" className="space-y-6">
            <DynamicVisualization
              visualizationQuery={visualizationQuery}
              setVisualizationQuery={setVisualizationQuery}
              visualizationData={visualizationData}
              getCategoryColor={getCategoryColor}
              getJurisdictionColor={getJurisdictionColor}
              getConflictSeverityColor={getConflictSeverityColor}
            />
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Example Flows</h3>
                <p className="text-gray-600">Pre-configured scenarios for common situations</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text-analysis" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Text Analysis</h3>
                <p className="text-gray-600">AI-powered document analysis for regulations</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}