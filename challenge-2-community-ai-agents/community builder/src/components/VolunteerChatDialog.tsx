import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Video, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface Message {
  id: number;
  sender: 'volunteer' | 'user';
  content: string;
  timestamp: Date;
}

interface Volunteer {
  id: number;
  name: string;
  avatar?: string;
  languages: string[];
  specialties: string[];
  availability: 'available' | 'busy' | 'offline';
}

interface VolunteerChatDialogProps {
  volunteer: Volunteer;
  isOpen: boolean;
  onClose: () => void;
}

export default function VolunteerChatDialog({ volunteer, isOpen, onClose }: VolunteerChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'volunteer',
      content: `Hello! I'm ${volunteer.name}. Welcome to GovNav Community Support! How can I help you today? I specialize in ${volunteer.specialties.slice(0, 2).join(' and ')} and can assist you in ${volunteer.languages.join(' or ')}.`,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        content: newMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Simulate volunteer response after a short delay
      setTimeout(() => {
        const responses = [
          "I understand your concern. Let me help you with that. Can you provide me with a bit more detail about your specific situation?",
          "That's a great question! I can definitely assist you with this. Let me walk you through the process step by step.",
          "I see what you're looking for. I've helped many people with similar situations. Here's what I recommend...",
          "Thank you for sharing that information. Based on what you've told me, I think the best approach would be to...",
          "I'm here to help! This is definitely something I can assist you with. Let me explain your options..."
        ];

        const volunteerResponse: Message = {
          id: messages.length + 2,
          sender: 'volunteer',
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, volunteerResponse]);
      }, 1500);
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={volunteer.avatar} />
                <AvatarFallback className="bg-nav-teal text-white">
                  {volunteer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{volunteer.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Available now
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {volunteer.specialties.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-nav-teal text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-nav-teal-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-nav-teal hover:bg-nav-teal/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This conversation is encrypted and monitored for safety
          </p>
        </div>
      </Card>
    </div>
  );
}