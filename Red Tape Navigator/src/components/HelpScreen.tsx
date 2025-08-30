import React, { useState } from 'react';
import { Search, Phone, Mail, MessageCircle, Book, Video, FileText, Clock, Users, MapPin, ExternalLink, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const supportOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "(555) 123-HELP (4357)",
      hours: "Mon-Fri 8AM-6PM",
      availability: "Available now"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email",
      contact: "support@govnav.gov",
      hours: "24/7 response",
      availability: "Response within 24 hours"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant messaging with support agents",
      contact: "Click to start chat",
      hours: "Mon-Fri 9AM-5PM",
      availability: "Available now"
    },
    {
      icon: MapPin,
      title: "In-Person Help",
      description: "Visit our help desk at City Hall",
      contact: "123 Government Plaza",
      hours: "Mon-Fri 8AM-5PM",
      availability: "Walk-ins welcome"
    }
  ];

  const faqs = [
    {
      question: "How do I search for regulations that apply to my business?",
      answer: "Use the Navigator tab to search by your business activity or industry. Enter what you're trying to do (like 'open restaurant' or 'hire employees') and we'll show you relevant regulations, permits, and requirements."
    },
    {
      question: "What's the difference between local, state, and federal regulations?",
      answer: "Local regulations are set by your city or county (like building permits), state regulations are set by your state government (like business licenses), and federal regulations apply nationwide (like employment laws). Our system clearly labels each type."
    },
    {
      question: "How current is the regulation information?",
      answer: "We update our regulation database daily from official government sources. Each regulation shows when it was last updated. If you notice outdated information, please report it using the feedback button."
    },
    {
      question: "Can I save or bookmark regulations for later?",
      answer: "Yes! Create an account to save regulations, get updates when they change, and build custom compliance checklists for your specific situation."
    },
    {
      question: "How do I know if regulations conflict with each other?",
      answer: "Our AI system automatically detects potential conflicts and highlights them with warning icons. When conflicts are found, we provide guidance on how to resolve them or who to contact for clarification."
    },
    {
      question: "Is there a cost to use GovNav?",
      answer: "Basic GovNav services are free for all users. Premium features like personalized compliance tracking and priority support are available with a subscription."
    },
    {
      question: "How accurate is the AI Assistant?",
      answer: "Our AI Assistant is trained on official government data and provides accurate general guidance. However, for legal compliance questions, we always recommend consulting with the relevant government office or a qualified professional."
    },
    {
      question: "What if I can't find the regulation I'm looking for?",
      answer: "Try different search terms or contact our support team. We're continuously adding new regulations to our database. You can also request specific regulations to be added."
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with GovNav",
      duration: "5 min",
      type: "Video",
      description: "Learn the basics of navigating the platform and finding information"
    },
    {
      title: "Using the GovNav Navigator",
      duration: "8 min", 
      type: "Video",
      description: "Master the search and filtering features to find relevant regulations"
    },
    {
      title: "AI Assistant Best Practices",
      duration: "6 min",
      type: "Video", 
      description: "Tips for getting the most helpful responses from our AI Assistant"
    },
    {
      title: "Understanding Government Data",
      duration: "10 min",
      type: "Article",
      description: "How to interpret and use government datasets effectively"
    },
    {
      title: "Compliance Checklist Creation",
      duration: "7 min",
      type: "Video",
      description: "Build custom checklists to track your compliance requirements"
    },
    {
      title: "Staying Updated on Regulation Changes",
      duration: "4 min",
      type: "Article",
      description: "Set up alerts and notifications for regulation updates"
    }
  ];

  const resources = [
    {
      title: "Government Contact Directory",
      description: "Complete contact information for all government offices and departments",
      type: "Directory",
      link: "#"
    },
    {
      title: "Small Business Resource Guide",
      description: "Comprehensive guide for entrepreneurs and small business owners",
      type: "PDF Guide",
      link: "#"
    },
    {
      title: "Regulatory Calendar",
      description: "Important dates, deadlines, and upcoming regulation changes",
      type: "Calendar",
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Developer resources for accessing GovNav data programmatically",
      type: "Documentation",
      link: "#"
    },
    {
      title: "Compliance Templates",
      description: "Downloadable templates for common compliance requirements",
      type: "Templates",
      link: "#"
    },
    {
      title: "Legal Disclaimer",
      description: "Important information about using GovNav for compliance decisions",
      type: "Legal",
      link: "#"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <span>Help & Support</span>
          </h1>
          <p className="text-lg text-gray-600">
            Get help using GovNav, find answers to common questions, and access support resources
          </p>
        </div>

        {/* Quick Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-gray-600">{option.description}</p>
                  <p className="font-medium text-gray-900">{option.contact}</p>
                  <p className="text-xs text-gray-500">{option.hours}</p>
                  <Badge className="bg-green-100 text-green-800">
                    {option.availability}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {/* FAQ Search */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFaqs.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No matching questions found</h3>
                    <p className="text-gray-600 mb-4">Try different search terms or contact support</p>
                    <Button>Contact Support</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tutorials & Guides</CardTitle>
                <p className="text-gray-600">Step-by-step guides to help you master GovNav</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {tutorial.type === 'Video' ? (
                            <Video className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{tutorial.duration}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {tutorial.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
                <p className="text-gray-600">Helpful documents, tools, and external resources</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 ml-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <p className="text-gray-600">Multiple ways to reach our support team</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">(555) 123-HELP (4357)</p>
                        <p className="text-xs text-gray-500">Mon-Fri 8AM-6PM EST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">support@govnav.gov</p>
                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">In-Person Support</p>
                        <p className="text-sm text-gray-600">123 Government Plaza, Suite 100</p>
                        <p className="text-xs text-gray-500">Mon-Fri 8AM-5PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Emergency Support</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      For urgent issues outside business hours:
                    </p>
                    <p className="text-sm font-medium">(555) 123-URGENT</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <p className="text-gray-600">We'll get back to you as soon as possible</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Subject</label>
                    <Input placeholder="What can we help you with?" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg resize-none h-32" 
                      placeholder="Describe your question or issue in detail..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Contact Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>

                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>

                  <p className="text-xs text-gray-500">
                    By sending this message, you agree to our privacy policy and terms of service.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Send({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}