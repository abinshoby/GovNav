import React, { useState } from 'react';
import { Search, Download, Database, BarChart3, FileText, Calendar, Filter, TrendingUp, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function DatasetsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [format, setFormat] = useState('all');

  const datasets = [
    {
      id: 1,
      title: "Commonwealth Statute Book",
      description: "Body of all Commonwealth legislation (Acts, regulations and other legislative instruments) providing the complete legal framework for federal regulation. Maintained by the Australian Law Reform Commission as the authoritative source of current Commonwealth laws.",
      category: "Legal Framework",
      format: "XML/API",
      size: "125.7 MB",
      lastUpdated: "2024-12-28",
      downloads: 8934,
      tags: ["commonwealth", "legislation", "acts", "statutory rules", "federal law"],
      featured: true,
      govhackDataset: true,
      datasetUrl: "https://hackerspace.govhack.org/visits?visit%5Bvisitable_id%5D=1743&visit%5Bvisitable_type%5D=DataSet",
      apiEndpoint: "https://www.legislation.gov.au/api/",
      officialUrl: "https://www.alrc.gov.au/datahub/the-commonwealth-statute-book/",
      jurisdiction: "Commonwealth"
    },
    {
      id: 2,
      title: "Federal Register of Legislation",
      description: "Authorised whole-of-government website containing the full text of Commonwealth legislation and details of each law's lifecycle. The official register maintained by the Attorney-General's Department with real-time updates and comprehensive search capabilities.",
      category: "Legal Framework", 
      format: "JSON/XML",
      size: "89.3 MB",
      lastUpdated: "2024-12-28",
      downloads: 6789,
      tags: ["federal register", "legislation", "regulatory instruments", "legal notices", "commonwealth"],
      featured: true,
      govhackDataset: true,
      datasetUrl: "https://hackerspace.govhack.org/visits?visit%5Bvisitable_id%5D=1776&visit%5Bvisitable_type%5D=DataSet",
      apiEndpoint: "https://www.legislation.gov.au/Browse/ByTitle/Acts/InForce",
      officialUrl: "https://www.legislation.gov.au/",
      jurisdiction: "Commonwealth"
    },
    {
      id: 3,
      title: "Australian Government Organisations Register",
      description: "Lists Australian government bodies, describing their function, composition and origins. Updated continuously by the Department of Finance as the authoritative source for all Australian Government organisations, agencies, and entities with regulatory responsibilities.",
      category: "Government Entities",
      format: "CSV/JSON",
      size: "12.4 MB",
      lastUpdated: "2024-12-27",
      downloads: 4567,
      tags: ["government organisations", "agencies", "entities", "regulatory bodies", "contact"],
      featured: true,
      govhackDataset: true,
      datasetUrl: "https://hackerspace.govhack.org/visits?visit%5Bvisitable_id%5D=1710&visit%5Bvisitable_type%5D=DataSet",
      apiEndpoint: "https://data.gov.au/api/",
      officialUrl: "https://www.directory.gov.au/",
      jurisdiction: "Commonwealth"
    },
    {
      id: 4,
      title: "NSW Consolidated Legislation",
      description: "Complete database of consolidated legislation for New South Wales, maintained by the Parliamentary Counsel's Office. Includes current and historical versions of NSW Acts and Regulations with advanced search capabilities.",
      category: "State Legislation",
      format: "HTML/XML",
      size: "67.2 MB",
      lastUpdated: "2024-12-26",
      downloads: 3421,
      tags: ["NSW", "state legislation", "acts", "regulations", "New South Wales"],
      featured: true,
      govhackDataset: false,
      officialUrl: "https://legislation.nsw.gov.au/",
      jurisdiction: "NSW"
    },
    {
      id: 5,
      title: "SA Consolidated Legislation",
      description: "South Australian legislation database providing access to current Acts and Regulations. Maintained by the Office of Parliamentary Counsel with regular updates and comprehensive legal search functionality.",
      category: "State Legislation",
      format: "HTML/PDF",
      size: "45.8 MB",
      lastUpdated: "2024-12-25",
      downloads: 2890,
      tags: ["SA", "south australia", "state legislation", "acts", "regulations"],
      featured: true,
      govhackDataset: false,
      officialUrl: "https://www.legislation.sa.gov.au/",
      jurisdiction: "SA"
    },
    {
      id: 6,
      title: "Work Health and Safety Regulations",
      description: "National WHS regulations, codes of practice, and safety standards across federal, state, and territory jurisdictions",
      category: "Workplace Safety",
      format: "PDF/CSV",
      size: "45.6 MB",
      lastUpdated: "2024-12-24",
      downloads: 5678,
      tags: ["WHS", "workplace safety", "codes of practice", "safety standards", "multi-jurisdiction"],
      featured: true,
      govhackDataset: false,
      jurisdiction: "Multi-jurisdiction"
    },
    {
      id: 7,
      title: "State Planning Regulations Database",
      description: "Compilation of planning and development regulations from all Australian states and territories, identifying overlaps and conflicts",
      category: "Planning & Development",
      format: "JSON/XML",
      size: "78.9 MB",
      lastUpdated: "2024-12-23",
      downloads: 4234,
      tags: ["planning", "development", "state regulations", "zoning", "conflicts"],
      featured: true,
      govhackDataset: false,
      jurisdiction: "Multi-jurisdiction"
    },
    {
      id: 8,
      title: "Environmental Protection Regulations",
      description: "Federal and state environmental protection laws, impact assessment requirements, and regulatory conflicts analysis",
      category: "Environment",
      format: "CSV/JSON",
      size: "92.1 MB",
      lastUpdated: "2024-12-22",
      downloads: 3567,
      tags: ["environment", "protection", "impact assessment", "EPA", "regulatory conflicts"],
      featured: false,
      govhackDataset: false,
      jurisdiction: "Multi-jurisdiction"
    }
  ];

  const categories = ["all", "Legal Framework", "Government Entities", "State Legislation", "Competition & Consumer", "Financial Services", "Workplace Safety", "Planning & Development", "Environment"];
  const formats = ["all", "CSV", "JSON", "XML", "PDF", "Excel", "JSON/XML", "XML/API", "PDF/XML", "PDF/CSV", "CSV/JSON"];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = category === 'all' || dataset.category === category;
    const matchesFormat = format === 'all' || dataset.format === format;
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const featuredDatasets = datasets.filter(dataset => dataset.featured);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Legal Framework": "bg-gov-navy/10 text-gov-navy",
      "Government Entities": "bg-nav-teal/10 text-nav-teal", 
      "State Legislation": "bg-accent-yellow/20 text-orange-800",
      "Competition & Consumer": "bg-purple-100 text-purple-800",
      "Financial Services": "bg-green-100 text-green-800",
      "Workplace Safety": "bg-red-100 text-red-800",
      "Planning & Development": "bg-blue-100 text-blue-800",
      "Environment": "bg-teal-100 text-teal-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getFormatColor = (format: string) => {
    const colors = {
      "CSV": "bg-orange-100 text-orange-800",
      "JSON": "bg-indigo-100 text-indigo-800",
      "XML": "bg-yellow-100 text-yellow-800",
      "PDF": "bg-pink-100 text-pink-800",
      "Excel": "bg-cyan-100 text-cyan-800",
      "JSON/XML": "bg-purple-100 text-purple-800",
      "XML/API": "bg-blue-100 text-blue-800",
      "PDF/XML": "bg-rose-100 text-rose-800",
      "PDF/CSV": "bg-amber-100 text-amber-800",
      "CSV/JSON": "bg-emerald-100 text-emerald-800"
    };
    return colors[format as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
            <span>Australian Government Datasets</span>
          </h1>
          <p className="text-lg text-gray-600">
            Access Commonwealth, state, and local government datasets for regulatory navigation and compliance analysis
          </p>
          
          {/* GovHack Challenge Banner */}
          <div className="mt-4 bg-gradient-to-r from-accent-yellow/20 to-nav-teal/20 border border-accent-yellow/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent-yellow rounded-full flex items-center justify-center">
                <span className="text-gov-navy font-bold text-sm">GH</span>
              </div>
              <div>
                <h3 className="font-semibold text-gov-navy">GovHack 2024 Challenge: GovNav</h3>
                <p className="text-sm text-gray-700">
                  Featuring required Commonwealth datasets to help navigate Australia's regulatory landscape
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search datasets, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map(fmt => (
                  <SelectItem key={fmt} value={fmt}>
                    {fmt === 'all' ? 'All Formats' : fmt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredDatasets.length} datasets found</span>
            <div className="flex items-center space-x-4">
              <span>Sort by:</span>
              <Button variant="ghost" size="sm">Most Recent</Button>
              <Button variant="ghost" size="sm">Most Downloaded</Button>
              <Button variant="ghost" size="sm">A-Z</Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Datasets</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDatasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg leading-tight">{dataset.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(dataset.category)}>
                            {dataset.category}
                          </Badge>
                          <Badge className={getFormatColor(dataset.format)}>
                            {dataset.format}
                          </Badge>
                          {dataset.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          )}
                          {(dataset as any).govhackDataset && (
                            <Badge className="bg-accent-yellow/20 text-gov-navy">
                              GovHack Dataset
                            </Badge>
                          )}
                          {(dataset as any).jurisdiction && (
                            <Badge variant="outline" className="text-xs">
                              {(dataset as any).jurisdiction}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{dataset.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Size:</span>
                        <p className="text-gray-600">{dataset.size}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Updated:</span>
                        <p className="text-gray-600">{dataset.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{dataset.downloads.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Trending</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {dataset.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        {(dataset as any).govhackDataset ? 'Access Dataset' : 'Download'}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      {(dataset as any).officialUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open((dataset as any).officialUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read More
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredDatasets.map((dataset) => (
                <Card key={dataset.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg leading-tight flex items-center space-x-2">
                          <span>{dataset.title}</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(dataset.category)}>
                            {dataset.category}
                          </Badge>
                          <Badge className={getFormatColor(dataset.format)}>
                            {dataset.format}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{dataset.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Size:</span>
                        <p className="text-gray-600">{dataset.size}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Updated:</span>
                        <p className="text-gray-600">{dataset.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      {(dataset as any).officialUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open((dataset as any).officialUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read More
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Total Downloads</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">6,083</div>
                  <p className="text-sm text-gray-600">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Database className="w-5 h-5 text-green-600" />
                    <span>Active Datasets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{datasets.length}</div>
                  <p className="text-sm text-gray-600">Regularly updated</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>API Calls</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">12,456</div>
                  <p className="text-sm text-gray-600">This week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Popular Datasets This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {datasets
                    .sort((a, b) => b.downloads - a.downloads)
                    .slice(0, 5)
                    .map((dataset, index) => (
                      <div key={dataset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{dataset.title}</h4>
                            <p className="text-sm text-gray-600">{dataset.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">{dataset.downloads.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">downloads</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}