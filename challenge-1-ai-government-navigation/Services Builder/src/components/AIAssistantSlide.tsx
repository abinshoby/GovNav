import React from 'react';
import { MessageCircle, Users, CheckCircle, FileText, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';

export default function AIAssistantSlide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-heading text-gov-navy mb-4">
            Chat with AI Assistant – Making Government Services Simple
          </h1>
          <div className="w-24 h-1 bg-nav-teal mx-auto rounded"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Problem */}
            <Card className="p-6 border-l-4 border-red-400 bg-red-50">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-subheading text-gray-800 mb-2">The Problem</h3>
                  <p className="text-body text-gray-700">
                    Government services can feel overwhelming and confusing.
                  </p>
                </div>
              </div>
            </Card>

            {/* Solution */}
            <Card className="p-6 border-l-4 border-nav-teal bg-teal-50">
              <div className="flex items-start gap-4">
                <div className="bg-nav-teal p-2 rounded-full">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-subheading text-gray-800 mb-2">Our Solution</h3>
                  <p className="text-body text-gray-700">
                    A friendly AI assistant you can chat with, just like texting a friend.
                  </p>
                </div>
              </div>
            </Card>

            {/* How it helps */}
            <Card className="p-6 border-l-4 border-accent-yellow bg-yellow-50">
              <h3 className="text-subheading text-gray-800 mb-4">How it helps:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-body text-gray-700">
                    Understands your situation in plain language (e.g. "I lost my job")
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-body text-gray-700">
                    Suggests the right services and support available
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-body text-gray-700">
                    Shows eligibility rules and application links
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-body text-gray-700">
                    Explains where the information came from (Data.gov.au, Transparency.gov.au)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Visual Mockup */}
          <div className="flex justify-center">
            <Card className="bg-white p-8 shadow-xl max-w-md w-full">
              {/* Chat Interface Mockup */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="bg-nav-teal p-3 rounded-full">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">GovNav AI Assistant</h4>
                    <p className="text-sm text-gray-500">Always here to help</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-gov-navy text-white p-3 rounded-lg rounded-br-sm max-w-xs">
                      <p className="text-sm">I lost my job and need help with benefits</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-sm max-w-xs">
                      <p className="text-sm mb-2">I understand this is a difficult time. Here are the support services available to you:</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>JobSeeker Payment</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>Employment Services</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-3 h-3 text-blue-600" />
                          <span>Source: Services Australia</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Follow-up */}
                  <div className="flex justify-start">
                    <div className="bg-nav-teal text-white p-3 rounded-lg rounded-bl-sm max-w-xs">
                      <p className="text-sm">Would you like me to check your eligibility or help you apply?</p>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500 flex-1">Type your question...</span>
                    <MessageCircle className="w-5 h-5 text-nav-teal" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="bg-nav-teal p-3 rounded-full w-fit mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Plain Language</h4>
            <p className="text-sm text-gray-600">No government jargon - just clear, simple answers</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-gov-navy p-3 rounded-full w-fit mx-auto mb-4">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Trusted Sources</h4>
            <p className="text-sm text-gray-600">All information from official government sources</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="bg-accent-yellow p-3 rounded-full w-fit mx-auto mb-4">
              <ExternalLink className="w-6 h-6 text-gov-navy" />
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Direct Links</h4>
            <p className="text-sm text-gray-600">Quick access to applications and forms</p>
          </Card>
        </div>

        {/* Tagline */}
        <div className="text-center bg-gov-navy text-white p-8 rounded-lg">
          <h2 className="text-subheading mb-2">
            Your personal guide to government services – clear, simple, and trustworthy.
          </h2>
          <p className="text-body opacity-90">
            Making Australian government services accessible to everyone
          </p>
        </div>
      </div>
    </div>
  );
}