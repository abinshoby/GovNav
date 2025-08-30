import React, { useState } from 'react';
import { ExternalLink, Calendar, Database, FileText, Building, Scale, Users, MapPin, Shield, Download, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

export default function AboutDataScreen() {
  const datasets = [
    {
      title: "Commonwealth Statute Book",
      description: "Body of all Commonwealth legislation (Acts, regulations and other legislative instruments) providing the complete legal framework for federal regulation. Maintained by the Australian Law Reform Commission as the authoritative source of current Commonwealth laws.",
      authority: "Australian Law Reform Commission",
      url: "alrc.gov.au/datahub",
      fullUrl: "https://www.alrc.gov.au/datahub/the-commonwealth-statute-book/",
      format: "XML/API",
      size: "125.7 MB",
      lastUpdated: "2024-12-28",
      updateFrequency: "Daily",
      coverage: "All Commonwealth Acts and Statutory Rules currently in force in Australia",
      keyFeatures: [
        "Complete legislative framework for federal regulation",
        "Historical versions and amendments tracked",
        "Cross-referenced with related legislation", 
        "Machine-readable XML format",
        "Real-time updates from Parliament House"
      ],
      icon: <Scale className="w-6 h-6" />,
      color: "bg-gov-navy/10 text-gov-navy"
    },
    {
      title: "Federal Register of Legislation",
      description: "Authorised whole-of-government website containing the full text of Commonwealth legislation and details of each law's lifecycle. The official register maintained by the Attorney-General's Department with real-time updates and comprehensive search capabilities.",
      authority: "Attorney-General's Department",
      url: "legislation.gov.au",
      fullUrl: "https://www.legislation.gov.au/",
      format: "HTML/XML/PDF",
      size: "89.3 MB",
      lastUpdated: "2024-12-28",
      updateFrequency: "Real-time",
      coverage: "Comprehensive database of consolidated legislation including current and historical versions",
      keyFeatures: [
        "Full text of Commonwealth legislation",
        "Legislative history and amendments",
        "Advanced search capabilities",
        "Citation tools and permalinks",
        "Download in multiple formats"
      ],
      icon: <FileText className="w-6 h-6" />,
      color: "bg-nav-teal/10 text-nav-teal"
    },
    {
      title: "Australian Government Organisations Register",
      description: "Lists Australian government bodies, describing their function, composition and origins. Updated continuously by the Department of Finance as the authoritative source for all Australian Government organisations, agencies, and entities with regulatory responsibilities.",
      authority: "Department of Finance",
      url: "directory.gov.au", 
      fullUrl: "https://www.directory.gov.au/",
      format: "JSON/CSV",
      size: "12.4 MB",
      lastUpdated: "2024-12-27",
      updateFrequency: "Continuous",
      coverage: "All Australian Government organisations, agencies, and entities with regulatory responsibilities",
      keyFeatures: [
        "Authoritative register of government bodies",
        "Contact information and responsibilities",
        "Organizational structure and reporting lines",
        "Historical records of changes",
        "API access for developers"
      ],
      icon: <Building className="w-6 h-6" />,
      color: "bg-accent-yellow/20 text-orange-800"
    },
    {
      title: "NSW Consolidated Legislation",
      description: "Complete database of consolidated legislation for New South Wales, maintained by the Parliamentary Counsel's Office. Includes current and historical versions of NSW Acts and Regulations with advanced search capabilities.",
      authority: "NSW Parliamentary Counsel's Office",
      url: "legislation.nsw.gov.au",
      fullUrl: "https://legislation.nsw.gov.au/",
      format: "HTML/XML",
      size: "67.2 MB", 
      lastUpdated: "2024-12-26",
      updateFrequency: "Weekly",
      coverage: "New South Wales consolidated legislation including Acts and Regulations",
      keyFeatures: [
        "NSW-specific legislation database",
        "Historical versions maintained",
        "Cross-linked with related documents",
        "Advanced search and filtering",
        "Legal research tools included"
      ],
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-800",
      optional: false
    },
    {
      title: "SA Consolidated Legislation",
      description: "South Australian legislation database providing access to current Acts and Regulations. Maintained by the Office of Parliamentary Counsel with regular updates and comprehensive legal search functionality.",
      authority: "SA Office of Parliamentary Counsel",
      url: "legislation.sa.gov.au",
      fullUrl: "https://www.legislation.sa.gov.au/",
      format: "HTML/PDF",
      size: "45.8 MB", 
      lastUpdated: "2024-12-25",
      updateFrequency: "Weekly",
      coverage: "South Australian consolidated legislation including Acts and Regulations",
      keyFeatures: [
        "SA-specific legislation database",
        "Historical versions maintained",
        "Cross-referenced with related documents",
        "Advanced search capabilities",
        "PDF and HTML formats available"
      ],
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-800",
      optional: false
    }
  ];

  const technicalSpecs = {
    architecture: "Microservices-based with REST APIs",
    dataFormat: "JSON, XML, CSV with schema validation",
    updateMechanism: "Automated ETL pipelines with change detection",
    availability: "99.9% uptime SLA with redundant systems",
    security: "End-to-end encryption, OAuth 2.0 authentication",
    compliance: "WCAG 2.1 AA compliant, Privacy Act 1988 compliant"
  };

  const usageStats = {
    totalRecords: "127,500+",
    dailyUpdates: "2,350",
    apiCalls: "45,200/day",
    accuracy: "99.7%"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gov-navy to-nav-teal rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span>About & Data Sources</span>
          </h1>
          <p className="text-lg text-gray-600">
            Learn about GovNav and the authoritative government datasets that power our platform
          </p>
        </div>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="datasets">Data Sources</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="download">Downloads</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-gov-navy" />
                    <span>What is GovNav?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    GovNav is a modern, responsive web application designed to help businesses and individuals identify and navigate overlapping regulatory obligations across local, state/territory, and federal levels in Australia.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Key Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-gov-navy rounded-full mt-2"></div>
                        <span>Multi-step regulation finder with location and industry filtering</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-nav-teal rounded-full mt-2"></div>
                        <span>Conflict and duplication detection across jurisdictions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-accent-yellow rounded-full mt-2"></div>
                        <span>Plain-language summaries of complex regulations</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                        <span>Interactive visualization of regulatory relationships</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                        <span>Downloadable compliance roadmaps and checklists</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-nav-teal" />
                    <span>GovHack 2025 Challenge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-accent-yellow/20 border border-accent-yellow/30 rounded-lg p-4">
                    <h4 className="font-medium text-gov-navy mb-2">Challenge Focus</h4>
                    <p className="text-sm text-gray-700">
                      "How might we help businesses and individuals identify and navigate overlapping or conflicting regulations within and/or across local, state, and federal levels of government?"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Our Solution Addresses:</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span>Complex regulatory environment with overlapping jurisdictions</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                        <span>Time-consuming compliance discovery process</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span>Lack of transparency in regulatory requirements</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Difficulty identifying the right regulatory contacts</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gov-navy">{usageStats.totalRecords}</div>
                    <div className="text-sm text-gray-600">Regulation Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nav-teal">{usageStats.dailyUpdates}</div>
                    <div className="text-sm text-gray-600">Daily Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-yellow">{usageStats.apiCalls}</div>
                    <div className="text-sm text-gray-600">Daily API Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{usageStats.accuracy}</div>
                    <div className="text-sm text-gray-600">Data Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Datasets Tab */}
          <TabsContent value="datasets" className="space-y-6">
            <div className="space-y-6">
              {datasets.map((dataset, index) => (
                <Card key={index} className={dataset.optional ? 'border-dashed' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dataset.color}`}>
                          {dataset.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{dataset.title}</CardTitle>
                          {dataset.optional && (
                            <Badge variant="outline" className="mt-1">Optional Dataset</Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={() => window.open(dataset.fullUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit {dataset.url}</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{dataset.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Authority:</span>
                        <p className="text-gray-600">{dataset.authority}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Format:</span>
                        <p className="text-gray-600">{dataset.format}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Size:</span>
                        <p className="text-gray-600">{dataset.size}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Updates:</span>
                        <p className="text-gray-600">{dataset.updateFrequency}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-900 text-sm">Coverage:</span>
                      <p className="text-sm text-gray-600 mt-1">{dataset.coverage}</p>
                    </div>

                    <div>
                      <span className="font-medium text-gray-900 text-sm">Key Features:</span>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        {dataset.keyFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Last updated: {dataset.lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Live</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Quality Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Data Quality & Accuracy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-blue-800">
                  <p className="text-sm">
                    All datasets are sourced directly from official Australian Government authorities and are updated according to their respective maintenance schedules. GovNav processes this data to identify relationships, conflicts, and provide plain-language summaries while maintaining the integrity of the original information.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">99.7%</div>
                      <div className="text-xs">Data Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">Daily</div>
                      <div className="text-xs">Update Frequency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">Real-time</div>
                      <div className="text-xs">Federal Register Sync</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Details Tab */}
          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Architecture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(technicalSpecs).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium text-gray-900 capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <p className="text-sm text-gray-600">{value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Processing Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gov-navy rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                      <div>
                        <h4 className="font-medium text-sm">Data Ingestion</h4>
                        <p className="text-xs text-gray-600">Automated collection from government APIs and data feeds</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-nav-teal rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                      <div>
                        <h4 className="font-medium text-sm">Data Validation</h4>
                        <p className="text-xs text-gray-600">Schema validation and integrity checks</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center text-gray-800 font-bold text-sm">3</div>
                      <div>
                        <h4 className="font-medium text-sm">Relationship Mapping</h4>
                        <p className="text-xs text-gray-600">AI-powered analysis to identify conflicts and overlaps</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                      <div>
                        <h4 className="font-medium text-sm">User Interface</h4>
                        <p className="text-xs text-gray-600">Responsive web application with search and visualization</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Information */}
            <Card>
              <CardHeader>
                <CardTitle>Developer API Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Endpoints Available</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• GET /api/regulations</li>
                      <li>• GET /api/jurisdictions</li>
                      <li>• GET /api/conflicts</li>
                      <li>• POST /api/analyze</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Authentication</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• OAuth 2.0 with PKCE</li>
                      <li>• API Key authentication</li>
                      <li>• Rate limiting: 1000/hour</li>
                      <li>• CORS enabled</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Response Formats</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• JSON (default)</li>
                      <li>• XML available</li>
                      <li>• CSV for bulk data</li>
                      <li>• JSONLD for linked data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="download" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Downloads</CardTitle>
                <p className="text-gray-600">
                  Export compliance roadmaps, checklists, and data in various formats
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Compliance Resources</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm">Compliance Roadmap Template</h5>
                          <p className="text-xs text-gray-600">PDF template for tracking obligations</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm">Regulatory Checklist</h5>
                          <p className="text-xs text-gray-600">Excel spreadsheet for compliance tracking</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Excel
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm">Jurisdiction Contact List</h5>
                          <p className="text-xs text-gray-600">CSV file with regulatory contacts</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          CSV
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Developer Resources</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm">API Documentation</h5>
                          <p className="text-xs text-gray-600">OpenAPI 3.0 specification</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          JSON
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm">Sample Data Export</h5>
                          <p className="text-xs text-gray-600">JSON dataset sample for testing</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          JSON
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm">Integration Guide</h5>
                          <p className="text-xs text-gray-600">PDF guide for system integration</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Export */}
            <Card>
              <CardHeader>
                <CardTitle>Bulk Data Export</CardTitle>
                <p className="text-gray-600">
                  Export large datasets for research and analysis purposes
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="flex items-center justify-center space-x-2 h-12">
                    <Download className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-sm font-medium">All Regulations</div>
                      <div className="text-xs">Complete dataset (JSON)</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                    <Download className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Conflict Analysis</div>
                      <div className="text-xs">Identified conflicts (CSV)</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center space-x-2 h-12">
                    <Download className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Contact Directory</div>
                      <div className="text-xs">Regulator contacts (Excel)</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}