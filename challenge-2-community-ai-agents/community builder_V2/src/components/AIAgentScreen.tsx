import React, { useState } from 'react';
import { Send, Bot, MessageCircle, Users, MapPin, Phone, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

export default function AIAgentScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your GovNav AI Assistant. I can help you find local government services, connect with community resources, and answer questions about civic processes. What can I help you with today?",
      timestamp: new Date(Date.now() - 300000)
    }
  ]);

  const quickActions = [
    { icon: MapPin, text: "Find local services", category: "Location" },
    { icon: Users, text: "Community programs", category: "Social" },
    { icon: Phone, text: "Emergency contacts", category: "Emergency" },
    { icon: Clock, text: "Office hours", category: "Information" }
  ];

  const communityServices = [
    {
      title: "Parks & Recreation",
      description: "Community centers, sports facilities, and outdoor programs",
      status: "Open",
      contact: "(555) 123-4567",
      hours: "Mon-Fri 8AM-6PM"
    },
    {
      title: "Public Library",
      description: "Books, digital resources, community events, and meeting spaces",
      status: "Open",
      contact: "(555) 123-4568", 
      hours: "Mon-Sat 9AM-8PM"
    },
    {
      title: "Social Services",
      description: "Housing assistance, food programs, and welfare support",
      status: "By Appointment",
      contact: "(555) 123-4569",
      hours: "Mon-Fri 9AM-5PM"
    },
    {
      title: "Volunteer Coordination",
      description: "Community volunteering opportunities and civic engagement",
      status: "Open",
      contact: "(555) 123-4570",
      hours: "Mon-Fri 8AM-4PM"
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with that! Let me find the relevant information and services in your area.",
        "Based on your question, I've found several resources that might be helpful. Would you like me to provide more details about any specific service?",
        "That's a great question! Here are the steps you'll need to follow, along with the relevant contact information.",
        "I understand you need assistance with this. Let me connect you with the right department and provide you with the necessary forms and requirements."
      ];
      
      const botResponse = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span>AI Community Assistant</span>
          </h1>
          <p className="text-lg text-gray-600">
            Get instant help with government services, community resources, and civic information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-blue-50">
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <span>Chat with AI Assistant</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {msg.type === 'bot' && (
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">
                                <Bot className="w-3 h-3" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <span className="text-xs text-gray-500">
                            {msg.type === 'bot' ? 'AI Assistant' : 'You'} • {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div className={`rounded-lg px-4 py-2 ${
                          msg.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask about government services, community programs, or civic processes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center space-y-2 hover:bg-teal-50 hover:border-teal-200"
                      onClick={() => setMessage(action.text)}
                    >
                      <Icon className="w-5 h-5 text-teal-600" />
                      <span className="text-xs text-center">{action.text}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Community Services Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Community Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communityServices.map((service, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{service.title}</h4>
                      <Badge 
                        className={
                          service.status === 'Open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{service.contact}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{service.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Need More Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  If you need additional assistance, you can also:
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Call City Hall: (555) 123-4500
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Visit Service Center
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}