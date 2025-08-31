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
      title: "Public Transit Ridership Data",
      description: "Daily and monthly ridership statistics for buses, trains, and metro systems across the city",
      category: "Transportation",
      format: "CSV",
      size: "2.3 MB",
      lastUpdated: "2024-12-28",
      downloads: 1234,
      tags: ["transit", "public transport", "ridership", "statistics"],
      featured: true
    },
    {
      id: 2,
      title: "Property Tax Assessment Records",
      description: "Comprehensive database of property assessments, tax rates, and valuations",
      category: "Finance",
      format: "JSON",
      size: "15.7 MB",
      lastUpdated: "2024-12-25",
      downloads: 892,
      tags: ["property", "tax", "assessment", "real estate"],
      featured: false
    },
    {
      id: 3,
      title: "Building Permits Database",
      description: "Records of all building permits issued, including residential and commercial projects",
      category: "Planning",
      format: "XML",
      size: "8.9 MB",
      lastUpdated: "2024-12-27",
      downloads: 567,
      tags: ["building", "permits", "construction", "development"],
      featured: true
    },
    {
      id: 4,
      title: "Crime Statistics Report",
      description: "Monthly crime statistics by neighborhood, including incident types and trends",
      category: "Public Safety",
      format: "PDF",
      size: "4.2 MB",
      lastUpdated: "2024-12-26",
      downloads: 2156,
      tags: ["crime", "safety", "statistics", "neighborhood"],
      featured: false
    },
    {
      id: 5,
      title: "Environmental Monitoring Data",
      description: "Air quality, water quality, and noise level measurements from monitoring stations",
      category: "Environment",
      format: "CSV",
      size: "12.4 MB",
      lastUpdated: "2024-12-28",
      downloads: 445,
      tags: ["environment", "air quality", "water", "monitoring"],
      featured: true
    },
    {
      id: 6,
      title: "Budget and Expenditure Reports",
      description: "Annual and quarterly government budget allocations and spending reports",
      category: "Finance",
      format: "Excel",
      size: "6.8 MB",
      lastUpdated: "2024-12-20",
      downloads: 789,
      tags: ["budget", "spending", "finance", "government"],
      featured: false
    }
  ];

  const categories = ["all", "Transportation", "Finance", "Planning", "Public Safety", "Environment"];
  const formats = ["all", "CSV", "JSON", "XML", "PDF", "Excel"];

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
      "Transportation": "bg-blue-100 text-blue-800",
      "Finance": "bg-green-100 text-green-800", 
      "Planning": "bg-purple-100 text-purple-800",
      "Public Safety": "bg-red-100 text-red-800",
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
      "Excel": "bg-cyan-100 text-cyan-800"
    };
    return colors[format as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span>Government Datasets</span>
          </h1>
          <p className="text-lg text-gray-600">
            Access open government data, reports, and statistics for research and analysis
          </p>
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

                    <div className="flex space-x-3 pt-2">
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
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

                    <div className="flex space-x-3 pt-2">
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
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