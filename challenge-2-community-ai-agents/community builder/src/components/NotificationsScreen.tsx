import React, { useState } from 'react';
import { Bell, Calendar, CheckCircle, Clock, AlertTriangle, Phone, MapPin, Edit, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Notification {
  id: number;
  type: 'appointment' | 'reminder' | 'task' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedService?: string;
  appointmentDetails?: {
    service: string;
    location: string;
    time: string;
    date: string;
  };
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'appointment',
      title: "Food Bank Appointment Confirmed",
      message: "Your food bank slot is booked for Thursday 2PM at Community Food Hub",
      timestamp: "2 hours ago",
      isRead: false,
      priority: 'medium',
      actionable: true,
      relatedService: "Community Food Hub",
      appointmentDetails: {
        service: "Food Bank Pickup",
        location: "123 Main Street, Anytown",
        time: "2:00 PM",
        date: "Thursday, January 4th"
      }
    },
    {
      id: 2,
      type: 'reminder',
      title: "Centrelink Appointment Tomorrow",
      message: "Don't forget your 10:30 AM appointment at Centrelink. Bring ID and bank statements.",
      timestamp: "6 hours ago",
      isRead: false,
      priority: 'high',
      actionable: true,
      relatedService: "Centrelink Service Centre",
      appointmentDetails: {
        service: "JobSeeker Payment Review",
        location: "456 Government Plaza, Anytown",
        time: "10:30 AM",
        date: "Tomorrow, January 3rd"
      }
    },
    {
      id: 3,
      type: 'task',
      title: "Medicare Application Submitted",
      message: "Your Medicare card application has been successfully submitted. You'll receive your card in 7-10 business days.",
      timestamp: "Yesterday",
      isRead: true,
      priority: 'low',
      actionable: false,
      relatedService: "Medicare"
    },
    {
      id: 4,
      type: 'alert',
      title: "Document Upload Required",
      message: "Your housing application needs additional documents. Upload proof of income by Friday.",
      timestamp: "2 days ago",
      isRead: false,
      priority: 'high',
      actionable: true,
      relatedService: "Housing Connect"
    },
    {
      id: 5,
      type: 'reminder',
      title: "Volunteer Call Scheduled",
      message: "Sarah Chen will call you at 3:00 PM today to help with your tax questions.",
      timestamp: "This morning",
      isRead: true,
      priority: 'medium',
      actionable: true,
      relatedService: "Volunteer Support"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const todayNotifications = notifications.filter(n => 
    n.timestamp.includes('hour') || n.timestamp.includes('morning')
  );
  const upcomingAppointments = notifications.filter(n => 
    n.type === 'appointment' && n.actionable
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'reminder': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'task': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleChangeAppointment = (notification: Notification) => {
    // In a real app, this would navigate to appointment rescheduling
    console.log('Changing appointment:', notification.id);
  };

  const handleAddVolunteerAssistance = (notification: Notification) => {
    // In a real app, this would navigate to volunteer matching
    console.log('Adding volunteer assistance for:', notification.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading text-gov-navy mb-2 flex items-center space-x-3">
            <Bell className="w-8 h-8" />
            <span>Notifications & Reminders</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-lg text-gray-600">
            Stay updated on your appointments, tasks, and important reminders
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="today">
              Today ({todayNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="appointments">
              Appointments ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.isRead ? 'shadow-md' : 'opacity-75'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        {notification.appointmentDetails && (
                          <div className="bg-white rounded-lg p-4 border mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Appointment Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Service:</span>
                                <p className="font-medium">{notification.appointmentDetails.service}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Date & Time:</span>
                                <p className="font-medium">
                                  {notification.appointmentDetails.date} at {notification.appointmentDetails.time}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Location:</span>
                                <p className="font-medium">{notification.appointmentDetails.location}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{notification.timestamp}</span>
                          
                          {notification.actionable && (
                            <div className="flex space-x-2">
                              {notification.type === 'appointment' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChangeAppointment(notification);
                                    }}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Change Appointment
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddVolunteerAssistance(notification);
                                    }}
                                  >
                                    Add Volunteer Assistance
                                  </Button>
                                </>
                              )}
                              
                              {notification.type === 'alert' && (
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  Take Action
                                </Button>
                              )}
                              
                              {notification.type === 'reminder' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Call Service
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {todayNotifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`border-l-4 ${getPriorityColor(notification.priority)}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-700 mb-2">
                        {notification.message}
                      </p>
                      <span className="text-sm text-gray-500">{notification.timestamp}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            {upcomingAppointments.map((notification) => (
              <Card key={notification.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Calendar className="w-6 h-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {notification.title}
                      </h3>
                      {notification.appointmentDetails && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700 font-medium">When:</span>
                              <p className="text-blue-900">
                                {notification.appointmentDetails.date} at {notification.appointmentDetails.time}
                              </p>
                            </div>
                            <div>
                              <span className="text-blue-700 font-medium">Where:</span>
                              <p className="text-blue-900">{notification.appointmentDetails.location}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex space-x-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <MapPin className="w-4 h-4 mr-1" />
                          Get Directions
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.isRead).map((notification) => (
              <Card 
                key={notification.id}
                className={`border-l-4 ${getPriorityColor(notification.priority)} shadow-md`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      <span className="text-sm text-gray-500">{notification.timestamp}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}