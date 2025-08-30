import React, { useState, useEffect } from 'react';
import { Search, Building, Scale, AlertTriangle, MapPin, Users, FileText, BookOpen, X, NavigationIcon, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface DynamicVisualizationProps {
  visualizationQuery: string;
  setVisualizationQuery: (query: string) => void;
  visualizationData: {
    relevantRegulations: Array<{
      id: number;
      title: string;
      jurisdiction: string;
      description: string;
      complexity: string;
      conflicts: boolean;
      governmentWebsite?: string;
      regulatorWebsite?: string;
      applicationLink?: string;
      governmentWebsites?: { [key: string]: string };
      stateWebsites?: { [key: string]: string };
    }>;
    relevantRequirements: Array<{
      title: string;
      description: string;
      category: string;
      regulator: string;
      jurisdiction: 'local' | 'state' | 'federal';
      progress: number;
    }>;
    detectedConflicts: Array<{
      title: string;
      description: string;
      jurisdictions: string[];
      severity: 'low' | 'medium' | 'high';
    }>;
    complianceSteps: Array<{
      step: number;
      title: string;
      description: string;
      timeframe: string;
      status: 'pending' | 'in-progress' | 'completed';
      exampleType?: string;
    }>;
    jurisdictionBreakdown: { local: number; state: number; federal: number };
    locationContext?: {
      location: string;
      state: string;
      type: string;
    } | null;
  };
  getCategoryColor: (category: string) => string;
  getJurisdictionColor: (jurisdiction: string) => string;
  getConflictSeverityColor: (severity: string) => string;
}

export default function DynamicVisualization({
  visualizationQuery,
  setVisualizationQuery,
  visualizationData,
  getCategoryColor,
  getJurisdictionColor,
  getConflictSeverityColor
}: DynamicVisualizationProps) {

  const [selectedRegulation, setSelectedRegulation] = useState<any>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [selectedConflict, setSelectedConflict] = useState<any>(null);
  const [sidePanelType, setSidePanelType] = useState<'regulation' | 'requirement' | 'conflict' | 'steps' | null>(null);
  const [showSteps, setShowSteps] = useState(true);

  // Handler functions for opening side panels
  const openRegulationPanel = (regulation: any) => {
    setSelectedRegulation(regulation);
    setSidePanelType('regulation');
    setSelectedRequirement(null);
    setSelectedConflict(null);
  };

  const openRequirementPanel = (requirement: any) => {
    setSelectedRequirement(requirement);
    setSidePanelType('requirement');
    setSelectedRegulation(null);
    setSelectedConflict(null);
  };

  const openConflictPanel = (conflict: any) => {
    setSelectedConflict(conflict);
    setSidePanelType('conflict');
    setSelectedRegulation(null);
    setSelectedRequirement(null);
  };

  const openStepsPanel = () => {
    setSidePanelType('steps');
    setSelectedRegulation(null);
    setSelectedRequirement(null);
    setSelectedConflict(null);
  };

  const closeSidePanel = () => {
    setSidePanelType(null);
    setSelectedRegulation(null);
    setSelectedRequirement(null);
    setSelectedConflict(null);
  };

  // Auto-open steps panel when steps are available
  useEffect(() => {
    if (visualizationData.complianceSteps.length > 0 && !sidePanelType) {
      openStepsPanel();
    }
  }, [visualizationData.complianceSteps.length, sidePanelType]);

  // Enhanced keyword and location mapping function
  const mapSearchKeywords = (query: string) => {
    const keywordMappings: { [key: string]: string } = {
      'cafe': 'food',
      'cafes': 'food',
      'coffee': 'food',
      'restaurant': 'food',
      'dining': 'food',
      'building': 'construction',
      'buildings': 'construction',
      'builder': 'construction',
      'home': 'construction',
      'house': 'construction',
      'property': 'construction'
    };
    
    // Location mappings for Australian states and territories
    const locationMappings: { [key: string]: string } = {
      'nsw': 'new south wales',
      'vic': 'victoria', 
      'qld': 'queensland',
      'wa': 'western australia',
      'sa': 'south australia',
      'tas': 'tasmania',
      'act': 'australian capital territory',
      'nt': 'northern territory',
      'sydney': 'nsw sydney',
      'melbourne': 'vic melbourne',
      'brisbane': 'qld brisbane',
      'perth': 'wa perth',
      'adelaide': 'sa adelaide',
      'darwin': 'nt darwin',
      'canberra': 'act canberra',
      'hobart': 'tas hobart'
    };
    
    let mappedQuery = query.toLowerCase();
    
    // Apply keyword mappings first
    Object.entries(keywordMappings).forEach(([original, mapped]) => {
      mappedQuery = mappedQuery.replace(new RegExp(`\\b${original}\\b`, 'g'), mapped);
    });
    
    // Apply location mappings
    Object.entries(locationMappings).forEach(([original, mapped]) => {
      mappedQuery = mappedQuery.replace(new RegExp(`\\b${original}\\b`, 'g'), mapped);
    });
    
    return mappedQuery;
  };

  // Location detection function
  const detectLocation = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    const statePatterns = {
      'NSW': ['nsw', 'new south wales', 'sydney'],
      'VIC': ['vic', 'victoria', 'melbourne'],
      'QLD': ['qld', 'queensland', 'brisbane'], 
      'WA': ['wa', 'western australia', 'perth'],
      'SA': ['sa', 'south australia', 'adelaide'],
      'TAS': ['tas', 'tasmania', 'hobart'],
      'ACT': ['act', 'australian capital territory', 'canberra'],
      'NT': ['nt', 'northern territory', 'darwin']
    };
    
    for (const [state, patterns] of Object.entries(statePatterns)) {
      if (patterns.some(pattern => lowerQuery.includes(pattern))) {
        return {
          state,
          detected: true,
          pattern: patterns.find(pattern => lowerQuery.includes(pattern))
        };
      }
    }
    
    return { state: null, detected: false, pattern: null };
  };

  // Enhanced search that includes keyword mapping
  const handleSearch = (value: string) => {
    const mappedValue = mapSearchKeywords(value);
    setVisualizationQuery(mappedValue);
  };

  // Get government source links based on location
  const getGovernmentSources = (requirement: any) => {
    const location = detectLocation(visualizationQuery);
    const sources = [];
    
    if (location.detected) {
      if (location.state === 'NSW') {
        sources.push({
          name: 'NSW Legislation',
          url: 'https://legislation.nsw.gov.au/',
          description: 'Official NSW consolidated legislation'
        });
      } else if (location.state === 'SA') {
        sources.push({
          name: 'SA Legislation',
          url: 'https://www.legislation.sa.gov.au/',
          description: 'Official SA consolidated legislation'
        });
      }
    }
    
    // Add federal sources for federal jurisdiction requirements
    if (requirement.jurisdiction === 'federal') {
      sources.push({
        name: 'Commonwealth Statute Book',
        url: 'https://www.alrc.gov.au/datahub/the-commonwealth-statute-book/',
        description: 'Complete federal legislation framework'
      });
      sources.push({
        name: 'Federal Register of Legislation',
        url: 'https://www.legislation.gov.au/',
        description: 'Official federal legislation database'
      });
    }
    
    return sources;
  };

  // Regulation summaries in simple language
  const getRegulationSummary = (regulation: any) => {
    const summaries: { [key: number]: any } = {
      1: {
        title: "Australian Business Number (ABN)",
        simpleTitle: "Business Registration Number",
        summary: "Every business in Australia needs an ABN - it's like a business ID number. It's free to get and you need it to:",
        benefits: [
          "Invoice other businesses",
          "Claim business expenses",
          "Register for GST if needed",
          "Open a business bank account"
        ],
        steps: [
          "Choose your business structure",
          "Apply online at business.gov.au",
          "Usually approved within 5-28 days",
          "Keep your details up to date"
        ],
        plainLanguage: "Think of an ABN like a driver's license for your business. Without it, you can't legally operate most businesses in Australia.",
        whoNeeds: "Anyone running a business, freelancing, or earning income as a sole trader",
        cost: "Free",
        timeToGet: "5-28 days",
        officialSources: [
          {
            name: "Commonwealth Statute Book",
            url: "https://www.alrc.gov.au/datahub/the-commonwealth-statute-book/",
            description: "A New Tax System (Australian Business Number) Act 1999"
          },
          {
            name: "ATO Business Registration",
            url: "https://www.ato.gov.au/business/registration/abn",
            description: "Official ABN registration portal"
          }
        ]
      },
      2: {
        title: "Food Business License", 
        simpleTitle: "Permission to Sell Food",
        summary: "If you want to sell food to customers, you need permission from your local council and state government. This keeps food safe for everyone.",
        benefits: [
          "Legal permission to serve food",
          "Customers trust your business more",
          "Protection from liability issues",
          "Required for insurance"
        ],
        steps: [
          "Complete food safety training",
          "Register with your local council",
          "Get premises inspected",
          "Obtain public liability insurance",
          "Follow ongoing food safety rules"
        ],
        plainLanguage: "Just like you need a license to drive, you need a license to sell food. Each state has different rules, which can be confusing.",
        whoNeeds: "Cafes, restaurants, food trucks, catering businesses, market stalls",
        cost: "$100-$800 depending on your state",
        timeToGet: "2-8 weeks",
        officialSources: [
          {
            name: "NSW Food Authority",
            url: "https://www.foodauthority.nsw.gov.au/retail/registering-food-business",
            description: "NSW food business registration"
          },
          {
            name: "SA Health Food Safety",
            url: "https://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/protecting+public+health/food+safety/food+business+registration+and+licensing",
            description: "SA food business licensing"
          }
        ]
      },
      3: {
        title: "Work Health and Safety Compliance",
        simpleTitle: "Workplace Safety Rules", 
        summary: "Every workplace must be safe for workers. There are rules from federal, state, and industry levels that all apply at the same time.",
        benefits: [
          "Prevents workplace injuries",
          "Avoids heavy fines",
          "Protects your business reputation",
          "Required by law"
        ],
        steps: [
          "Identify workplace hazards",
          "Create safety procedures",
          "Train all workers",
          "Keep records of incidents",
          "Regular safety reviews"
        ],
        plainLanguage: "Imagine trying to follow three different sets of traffic rules at the same time - that's what workplace safety is like with overlapping federal, state, and industry requirements.",
        whoNeeds: "Every business with employees or contractors",
        cost: "$500-$5000+ depending on business size",
        timeToGet: "Ongoing responsibility",
        officialSources: [
          {
            name: "SafeWork Australia",
            url: "https://www.safeworkaustralia.gov.au/",
            description: "National workplace safety guidance"
          },
          {
            name: "Federal Register of Legislation",
            url: "https://www.legislation.gov.au/",
            description: "Work Health and Safety Act 2011"
          }
        ]
      }
    };
    
    return summaries[regulation.id] || {
      title: regulation.title,
      simpleTitle: regulation.title,
      summary: regulation.description,
      benefits: ["Ensures legal compliance"],
      steps: ["Contact relevant regulator for guidance"],
      plainLanguage: regulation.description,
      whoNeeds: "Check with regulator",
      cost: "Contact regulator",
      timeToGet: regulation.timeframe || "Unknown",
      officialSources: []
    };
  };

  // Conflict summaries for tooltips
  const getConflictTooltip = (conflict: any) => {
    const tooltips: { [key: string]: string } = {
      'Food Safety Standards Overlap': 'NSW Food Authority and local councils sometimes have duplicate requirements for food safety training and inspections, creating confusion about which standards to follow.',
      'Privacy Law Overlap': 'ACT privacy laws and Commonwealth Privacy Act both apply to the same activities, requiring separate compliance processes that often duplicate each other.',
      'Procurement Framework Duplication': 'Different government levels have their own procurement requirements that can conflict, making it unclear which standards take precedence.',
      'Building Code Overlap': 'Local council building codes often add extra requirements on top of the National Construction Code, creating layers of compliance.',
      'Environmental Assessment Duplication': 'Both state and federal governments require separate environmental assessments for the same project, leading to double the paperwork and time.'
    };
    
    return tooltips[conflict.title] || 'This conflict involves overlapping requirements between different levels of government that may create compliance confusion.';
  };

  // Detailed conflict information for right panel
  const getConflictDetails = (conflict: any) => {
    const conflictDetails: { [key: string]: any } = {
      'Food Safety Standards Overlap': {
        title: 'Food Safety Standards Overlap',
        description: 'Multiple government levels regulate food safety with overlapping and sometimes conflicting requirements.',
        impact: 'High compliance costs, confusion about which standards to follow, potential for non-compliance due to conflicting requirements.',
        affectedBusinesses: 'Cafes, restaurants, food trucks, catering businesses, food manufacturers',
        jurisdictionsInvolved: ['NSW Food Authority', 'Local Councils', 'Federal Health Department'],
        riskLevel: 'Medium',
        actionPlan: [
          {
            step: 1,
            action: 'Identify Primary Regulator',
            description: 'Contact your local council to determine which agency has primary responsibility for your specific food business type.',
            timeframe: '1-2 days'
          },
          {
            step: 2,
            action: 'Create Compliance Matrix',
            description: 'Document all applicable requirements from each level of government in a single spreadsheet to identify overlaps.',
            timeframe: '3-5 days'
          },
          {
            step: 3,
            action: 'Engage Professional Consultant',
            description: 'Hire a food safety consultant familiar with multi-jurisdictional requirements to develop a unified compliance strategy.',
            timeframe: '1-2 weeks'
          },
          {
            step: 4,
            action: 'Implement Highest Standard',
            description: 'When in doubt, comply with the highest standard among conflicting requirements to ensure full compliance.',
            timeframe: 'Ongoing'
          },
          {
            step: 5,
            action: 'Regular Review Process',
            description: 'Establish quarterly reviews to monitor changes in regulations across all jurisdictions.',
            timeframe: 'Every 3 months'
          }
        ],
        preventionStrategies: [
          'Join industry associations for regulatory updates',
          'Subscribe to government regulatory alerts',
          'Maintain relationships with regulators at all levels',
          'Use compliance management software'
        ],
        estimatedCost: '$2,000-$5,000 for professional consultation',
        estimatedTimeReduction: '40-60% reduction in compliance confusion',
        officialSources: [
          {
            name: 'NSW Food Authority',
            url: 'https://www.foodauthority.nsw.gov.au/',
            description: 'NSW food safety regulations'
          },
          {
            name: 'NSW Legislation',
            url: 'https://legislation.nsw.gov.au/',
            description: 'Food Act 2003 (NSW)'
          }
        ]
      },
      'Privacy Law Overlap': {
        title: 'Privacy Law Overlap',
        description: 'ACT Territory Privacy Act and Commonwealth Privacy Act create dual obligations with different notification and consent requirements.',
        impact: 'Duplicate privacy assessments, conflicting breach notification timeframes, potential legal liability from non-compliance.',
        affectedBusinesses: 'Tech companies, healthcare providers, financial services, any business collecting personal information',
        jurisdictionsInvolved: ['ACT Government', 'Office of the Australian Information Commissioner (OAIC)', 'Industry Regulators'],
        riskLevel: 'High',
        actionPlan: [
          {
            step: 1,
            action: 'Privacy Impact Assessment',
            description: 'Conduct comprehensive privacy impact assessment covering both ACT and Commonwealth requirements.',
            timeframe: '2-3 weeks'
          },
          {
            step: 2,
            action: 'Legal Mapping Exercise',
            description: 'Engage privacy lawyers to map overlapping obligations and identify conflict areas.',
            timeframe: '1-2 weeks'
          },
          {
            step: 3,
            action: 'Unified Privacy Policy',
            description: 'Develop single privacy policy that meets the highest standards of both jurisdictions.',
            timeframe: '1 week'
          },
          {
            step: 4,
            action: 'Breach Response Protocol',
            description: 'Create incident response plan that satisfies both ACT (72 hours) and Commonwealth (30 days) notification requirements.',
            timeframe: '3-5 days'
          },
          {
            step: 5,
            action: 'Staff Training Program',
            description: 'Train all staff on unified privacy procedures and dual jurisdiction requirements.',
            timeframe: '1-2 weeks'
          }
        ],
        preventionStrategies: [
          'Implement privacy by design principles',
          'Regular privacy compliance audits',
          'Monitor regulatory changes in both jurisdictions',
          'Engage with privacy professional associations'
        ],
        estimatedCost: '$5,000-$15,000 for legal consultation and system updates',
        estimatedTimeReduction: '50-70% reduction in duplicate compliance processes',
        officialSources: [
          {
            name: 'Office of the Australian Information Commissioner',
            url: 'https://www.oaic.gov.au/',
            description: 'Commonwealth Privacy Act guidance'
          },
          {
            name: 'Federal Register of Legislation',
            url: 'https://www.legislation.gov.au/',
            description: 'Privacy Act 1988'
          }
        ]
      }
    };
    
    return conflictDetails[conflict.title] || {
      title: conflict.title,
      description: conflict.description,
      impact: 'Overlapping regulatory requirements may cause compliance complexity.',
      affectedBusinesses: 'Various business types',
      jurisdictionsInvolved: conflict.jurisdictions,
      riskLevel: conflict.severity,
      actionPlan: [
        {
          step: 1,
          action: 'Identify Conflicting Requirements',
          description: 'Document all applicable requirements from each jurisdiction.',
          timeframe: '1-2 weeks'
        },
        {
          step: 2,
          action: 'Seek Professional Guidance',
          description: 'Consult with regulatory experts familiar with multi-jurisdictional compliance.',
          timeframe: '1 week'
        }
      ],
      preventionStrategies: ['Regular regulatory monitoring', 'Professional consultation'],
      estimatedCost: 'Contact regulatory consultant for estimate',
      estimatedTimeReduction: 'Varies by situation',
      officialSources: []
    };
  };

  // Side Panel Component
  const SidePanel = () => {
    if (!sidePanelType) return null;

    return (
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">
              {sidePanelType === 'regulation' && 'Regulation Details'}
              {sidePanelType === 'requirement' && 'Requirement Details'}
              {sidePanelType === 'conflict' && 'Conflict Resolution'}
              {sidePanelType === 'steps' && 'Compliance Steps'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={closeSidePanel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {sidePanelType === 'regulation' && selectedRegulation && (
              <RegulationDetailsPanel regulation={selectedRegulation} />
            )}
            {sidePanelType === 'requirement' && selectedRequirement && (
              <RequirementDetailsPanel requirement={selectedRequirement} />
            )}
            {sidePanelType === 'conflict' && selectedConflict && (
              <ConflictDetailsPanel conflict={selectedConflict} />
            )}
            {sidePanelType === 'steps' && (
              <StepsDetailsPanel steps={visualizationData.complianceSteps} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Regulation Details Panel
  const RegulationDetailsPanel = ({ regulation }: { regulation: any }) => {
    const summary = getRegulationSummary(regulation);
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gov-navy">{summary.simpleTitle}</h3>
          <p className="text-sm text-gray-600 mt-1">{summary.summary}</p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Plain Language Summary</h4>
          <p className="text-sm text-gray-700">{summary.plainLanguage}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Key Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Who needs this:</span> {summary.whoNeeds}</div>
            <div><span className="font-medium">Cost:</span> {summary.cost}</div>
            <div><span className="font-medium">Time to get:</span> {summary.timeToGet}</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Why you need it</h4>
          <ul className="text-sm space-y-1">
            {summary.benefits.map((benefit: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Steps to get it</h4>
          <ol className="text-sm space-y-2">
            {summary.steps.map((step: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-gov-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {summary.officialSources.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Official Sources</h4>
            <div className="space-y-2">
              {summary.officialSources.map((source: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{source.name}</div>
                      <div className="text-xs text-gray-600">{source.description}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Read More</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Requirement Details Panel
  const RequirementDetailsPanel = ({ requirement }: { requirement: any }) => {
    const sources = getGovernmentSources(requirement);
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gov-navy">{requirement.title}</h3>
          <Badge className={getJurisdictionColor(requirement.jurisdiction)} size="sm">
            {requirement.jurisdiction.toUpperCase()}
          </Badge>
        </div>

        <div>
          <p className="text-sm text-gray-600">{requirement.description}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completion Status</span>
            <span className="text-sm text-gray-600">{requirement.progress}%</span>
          </div>
          <Progress value={requirement.progress} className="h-2" />
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Regulatory Details</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Category:</span> {requirement.category}</div>
            <div><span className="font-medium">Regulator:</span> {requirement.regulator}</div>
            <div><span className="font-medium">Jurisdiction:</span> {requirement.jurisdiction}</div>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${getCategoryColor(requirement.category)} bg-opacity-50`}>
          <h4 className="font-medium text-sm mb-1">Category: {requirement.category}</h4>
          <p className="text-xs">This requirement falls under {requirement.category.toLowerCase()} regulations.</p>
        </div>

        {sources.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Government Sources</h4>
            <div className="space-y-2">
              {sources.map((source: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{source.name}</div>
                      <div className="text-xs text-gray-600">{source.description}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Read More</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Next Steps</h4>
          <p className="text-xs text-gray-700">
            Contact {requirement.regulator} for specific guidance on this requirement. 
            Consider seeking professional advice for complex compliance matters.
          </p>
        </div>
      </div>
    );
  };

  // Steps Details Panel
  const StepsDetailsPanel = ({ steps }: { steps: any[] }) => {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gov-navy">Step-by-Step Compliance Process</h3>
          <p className="text-sm text-gray-600 mt-1">
            Follow this sequential process to ensure full regulatory compliance
          </p>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                step.status === 'completed' ? 'bg-green-600' :
                step.status === 'in-progress' ? 'bg-yellow-600' :
                'bg-gray-400'
              }`}>
                {step.status === 'completed' ? '✓' : step.step}
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                  <div className="ml-2">
                    <Badge className={
                      step.status === 'completed' ? 'bg-green-100 text-green-800' :
                      step.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    } size="sm">
                      {step.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {step.timeframe}
                  </Badge>
                  {step.exampleType && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      {step.exampleType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 text-sm">💡 Compliance Tips</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Complete steps in order - some depend on previous approvals</li>
            <li>• Start early - approval times can vary significantly</li>
            <li>• Keep detailed records of all applications and correspondence</li>
            <li>• Consider engaging professional consultants for complex requirements</li>
          </ul>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total Steps:</span>
            <span className="font-medium">{steps.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Completed:</span>
            <span className="text-green-600 font-medium">
              {steps.filter(s => s.status === 'completed').length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">In Progress:</span>
            <span className="text-yellow-600 font-medium">
              {steps.filter(s => s.status === 'in-progress').length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Pending:</span>
            <span className="text-gray-500 font-medium">
              {steps.filter(s => s.status === 'pending').length}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Conflict Details Panel
  const ConflictDetailsPanel = ({ conflict }: { conflict: any }) => {
    const details = getConflictDetails(conflict);
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gov-navy">{details.title}</h3>
          <Badge className={getConflictSeverityColor(details.riskLevel)} size="sm">
            {details.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        <div>
          <p className="text-sm text-gray-600">{details.description}</p>
        </div>

        <div className="bg-red-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Impact on Business</h4>
          <p className="text-sm text-red-800">{details.impact}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Affected Business Types</h4>
          <p className="text-sm text-gray-600">{details.affectedBusinesses}</p>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Jurisdictions Involved</h4>
          <div className="flex flex-wrap gap-1">
            {details.jurisdictionsInvolved.map((jurisdiction: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {jurisdiction}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Action Plan</h4>
          <div className="space-y-3">
            {details.actionPlan.map((action: any, idx: number) => (
              <div key={idx} className="border-l-2 border-blue-500 pl-3">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {action.step}
                  </div>
                  <span className="font-medium text-sm">{action.action}</span>
                </div>
                <p className="text-xs text-gray-600">{action.description}</p>
                <p className="text-xs text-blue-600 mt-1">⏱️ {action.timeframe}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Prevention Strategies</h4>
          <ul className="text-sm space-y-1">
            {details.preventionStrategies.map((strategy: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span>{strategy}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Cost & Time Estimates</h4>
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Estimated Cost:</span> {details.estimatedCost}</div>
            <div><span className="font-medium">Time Savings:</span> {details.estimatedTimeReduction}</div>
          </div>
        </div>

        {details.officialSources && details.officialSources.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Related Official Sources</h4>
            <div className="space-y-2">
              {details.officialSources.map((source: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{source.name}</div>
                      <div className="text-xs text-gray-600">{source.description}</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Read More</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Interactive Regulation Visualization</span>
          </CardTitle>
          <p className="text-gray-600">
            Enter keywords to visualize relevant regulations, conflicts, and relationships across jurisdictions
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by industry, activity, or regulation type (e.g., 'cafe', 'building', 'employment')"
              value={visualizationQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 text-lg h-12"
            />
          </div>
          {visualizationQuery && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Showing results for:</span>
                <Badge variant="outline" className="bg-blue-50">
                  "{visualizationQuery}"
                </Badge>
              </div>
              {(() => {
                const location = detectLocation(visualizationQuery);
                if (location.detected) {
                  return (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">Location detected:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {location.state}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Including {location.state}-specific regulations
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {visualizationQuery.trim() ? (
        <div className={`grid grid-cols-1 ${sidePanelType ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
          {/* Main Content */}
          <div className={sidePanelType ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <div className="space-y-6">
              {/* Quick Access to Steps */}
              {visualizationData.complianceSteps.length > 0 && sidePanelType !== 'steps' && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <NavigationIcon className="w-5 h-5 text-gov-navy" />
                        <span className="font-medium">Step-by-Step Process Available</span>
                      </div>
                      <Button 
                        onClick={openStepsPanel}
                        size="sm"
                        className="bg-gov-navy hover:bg-gov-navy/90 text-white"
                      >
                        View Steps
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {visualizationData.complianceSteps.length} compliance steps found for your scenario
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Jurisdiction Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Regulatory Landscape Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white">
                        <Building className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold">Local Government</h3>
                      <div className="text-2xl font-bold text-blue-600">
                        {visualizationData.jurisdictionBreakdown.local}
                      </div>
                      <p className="text-sm text-gray-600">Requirements</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-green-600 rounded-full mx-auto flex items-center justify-center text-white">
                        <Scale className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold">State/Territory</h3>
                      <div className="text-2xl font-bold text-green-600">
                        {visualizationData.jurisdictionBreakdown.state}
                      </div>
                      <p className="text-sm text-gray-600">Requirements</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-gov-navy rounded-full mx-auto flex items-center justify-center text-white">
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold">Federal Government</h3>
                      <div className="text-2xl font-bold text-gov-navy">
                        {visualizationData.jurisdictionBreakdown.federal}
                      </div>
                      <p className="text-sm text-gray-600">Requirements</p>
                    </div>
                  </div>

                  {/* Location Context */}
                  {(() => {
                    const location = detectLocation(visualizationQuery);
                    if (location.detected) {
                      return (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h4 className="font-medium text-blue-800">
                              {location.state} Jurisdiction Context
                            </h4>
                          </div>
                          <p className="text-sm text-blue-700">
                            Results include {location.state}-specific regulations, plus applicable Commonwealth and local government requirements.
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {location.state} Legislation
                            </Badge>
                            <span className="text-xs text-blue-600">
                              Source: {location.state === 'NSW' ? 'legislation.nsw.gov.au' : 
                                      location.state === 'SA' ? 'legislation.sa.gov.au' : 
                                      'state.gov.au'}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {visualizationData.detectedConflicts.length > 0 && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h4 className="font-medium text-red-800">
                          {visualizationData.detectedConflicts.length} Potential Conflicts Detected
                        </h4>
                      </div>
                      <p className="text-sm text-red-700">
                        Overlapping or conflicting requirements found across jurisdictions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Requirements Section */}
              {visualizationData.relevantRequirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Relevant Requirements</CardTitle>
                    <p className="text-gray-600">
                      Click on any requirement to see detailed information and official sources
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visualizationData.relevantRequirements.map((req, index) => (
                        <div 
                          key={index} 
                          className="border rounded-lg p-4 space-y-3 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                          onClick={() => openRequirementPanel(req)}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm hover:text-blue-600">{req.title}</h4>
                            <Badge className={getJurisdictionColor(req.jurisdiction)}>
                              {req.jurisdiction.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-600">{req.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge className={getCategoryColor(req.category)}>
                                {req.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {req.progress}% complete
                              </span>
                            </div>
                            <Progress value={req.progress} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500">
                              <strong>Regulator:</strong> {req.regulator}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openRequirementPanel(req);
                              }}
                              className="flex items-center gap-2"
                            >
                              <BookOpen className="w-4 h-4" />
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Conflicts Section */}
              {visualizationData.detectedConflicts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span>Detected Conflicts</span>
                    </CardTitle>
                    <p className="text-gray-600">
                      Click on any conflict to see resolution strategies and official guidance
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {visualizationData.detectedConflicts.map((conflict, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${getConflictSeverityColor(conflict.severity)}`}
                                onClick={() => openConflictPanel(conflict)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-sm hover:text-blue-600">{conflict.title}</h4>
                                  <Badge className={getConflictSeverityColor(conflict.severity)}>
                                    {conflict.severity.toUpperCase()}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-3">{conflict.description}</p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {conflict.jurisdictions.map((jurisdiction, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {jurisdiction}
                                      </Badge>
                                    ))}
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openConflictPanel(conflict);
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    <BookOpen className="w-4 h-4" />
                                    Resolve
                                  </Button>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getConflictTooltip(conflict)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <SidePanel />
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Start Your Search</h3>
                <p className="text-gray-600">
                  Enter keywords above to visualize regulatory requirements and conflicts
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSearch('cafe')}
                >
                  Try "cafe"
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSearch('building')}
                >
                  Try "building"
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSearch('employment')}
                >
                  Try "employment"
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}