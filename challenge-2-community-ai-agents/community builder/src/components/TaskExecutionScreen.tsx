import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Play, Pause, Settings, Shield, FileText, Calendar, Phone, Plus, Building2, MapPin, User, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';

interface Task {
  id: number;
  title: string;
  description: string;
  type: 'booking' | 'form' | 'reminder' | 'document';
  status: 'pending' | 'in-progress' | 'completed' | 'requires-action' | 'booked';
  progress: number;
  steps: TaskStep[];
  estimatedTime: string;
  lastUpdated: string;
  consentRequired: boolean;
  consentGiven: boolean;
  organizationId?: number;
  organizationName?: string;
  category?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  location?: string;
  contactPerson?: string;
  enquiryType?: string;
  isBooked?: boolean;
  bookingDate?: string;
}

interface TaskStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  timestamp?: string;
}

interface TaskExecutionScreenProps {
  selectedOrganization?: {
    id: number;
    name: string;
    type: string;
    services: string[];
  };
  userQuery?: string;
  onBack?: () => void;
}

export default function TaskExecutionScreen({ selectedOrganization, userQuery = "", onBack }: TaskExecutionScreenProps) {
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [selectedTask, setSelectedTask] = useState<number | null>(1);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Generate appropriate tasks based on selected organization and user query
  const generateRelevantTasks = (): Task[] => {
    const baseTasks: Task[] = [
      {
        id: 1,
        title: "Centrelink JobSeeker Appointment",
        description: "JobSeeker payment application appointment",
        type: 'booking',
        status: 'booked',
        progress: 100,
        estimatedTime: "45 minutes",
        lastUpdated: "Booked today",
        consentRequired: true,
        consentGiven: true,
        category: "government services",
        appointmentDate: "2024-09-05",
        appointmentTime: "10:30 AM",
        location: "Centrelink Adelaide, 123 King William Street, Adelaide SA 5000",
        contactPerson: "Sarah Johnson",
        enquiryType: "JobSeeker Payment Application",
        isBooked: true,
        bookingDate: "2024-08-30",
        steps: [
          {
            id: 1,
            title: "Find available appointments",
            description: "Searching Centrelink booking system",
            status: 'completed',
            timestamp: '3 hours ago'
          },
          {
            id: 2,
            title: "Check your calendar",
            description: "Ensuring no conflicts with your schedule",
            status: 'completed', 
            timestamp: '2 hours ago'
          },
          {
            id: 3,
            title: "Select appointment time",
            description: "Selected Thursday 10:30 AM slot",
            status: 'completed',
            timestamp: '1 hour ago'
          },
          {
            id: 4,
            title: "Confirm booking details",
            description: "Appointment confirmed with reference #CL240905-001",
            status: 'completed',
            timestamp: '1 hour ago'
          },
          {
            id: 5,
            title: "Send confirmation",
            description: "Email and SMS confirmation sent",
            status: 'completed',
            timestamp: '45 minutes ago'
          }
        ]
      },
      {
        id: 2,
        title: "Housing SA Consultation",
        description: "Emergency housing assistance consultation",
        type: 'booking',
        status: 'booked',
        progress: 100,
        estimatedTime: "30 minutes",
        lastUpdated: "Booked yesterday",
        consentRequired: true,
        consentGiven: true,
        category: "housing assistance",
        appointmentDate: "2024-09-03",
        appointmentTime: "2:00 PM",
        location: "Housing SA, 33 King William Street, Adelaide SA 5000",
        contactPerson: "Michael Chen",
        enquiryType: "Emergency Housing Assessment",
        isBooked: true,
        bookingDate: "2024-08-29",
        steps: [
          {
            id: 1,
            title: "Submit urgent housing request",
            description: "Priority housing application submitted",
            status: 'completed',
            timestamp: 'Yesterday'
          },
          {
            id: 2,
            title: "Document verification",
            description: "ID and income documents verified",
            status: 'completed',
            timestamp: 'Yesterday'
          },
          {
            id: 3,
            title: "Appointment scheduled",
            description: "Consultation booked for Monday 2:00 PM",
            status: 'completed',
            timestamp: 'Yesterday'
          }
        ]
      },
      {
        id: 3,
        title: "Adelaide Central Community Health",
        description: "Mental health support consultation",
        type: 'booking',
        status: 'pending',
        progress: 25,
        estimatedTime: "60 minutes",
        lastUpdated: "30 minutes ago",
        consentRequired: true,
        consentGiven: false,
        category: "mental health",
        enquiryType: "Mental Health Support Consultation",
        isBooked: false,
        steps: [
          {
            id: 1,
            title: "Initial assessment questionnaire",
            description: "Mental health screening form completed",
            status: 'completed',
            timestamp: '30 minutes ago'
          },
          {
            id: 2,
            title: "Find available appointments",
            description: "Checking counselor availability",
            status: 'pending'
          },
          {
            id: 3,
            title: "Schedule consultation",
            description: "Book appointment with mental health professional",
            status: 'pending'
          }
        ]
      }
    ];

    // Generate organization-specific tasks
    if (selectedOrganization) {
      const orgTasks: Task[] = [];
      const orgId = selectedOrganization.id;
      const orgName = selectedOrganization.name;
      const orgType = selectedOrganization.type.toLowerCase();

      // Food service tasks
      if (orgType.includes('food') || orgType.includes('emergency relief')) {
        orgTasks.push({
          id: orgId + 100,
          title: `Food Pickup - ${orgName}`,
          description: `Weekly food assistance pickup at ${orgName}`,
          type: 'booking',
          status: 'booked',
          progress: 100,
          estimatedTime: "15 minutes",
          lastUpdated: "Booked this week",
          consentRequired: false,
          consentGiven: true,
          organizationId: orgId,
          organizationName: orgName,
          category: "food assistance",
          appointmentDate: "2024-09-06",
          appointmentTime: "11:00 AM",
          location: `${orgName}, Adelaide SA`,
          enquiryType: "Food Assistance Pickup",
          isBooked: true,
          bookingDate: "2024-08-28",
          steps: [
            {
              id: 1,
              title: "Check availability",
              description: `Pickup slots available at ${orgName}`,
              status: 'completed',
              timestamp: '3 days ago'
            },
            {
              id: 2,
              title: "Select pickup slot",
              description: "Friday 11:00 AM slot selected",
              status: 'completed',
              timestamp: '3 days ago'
            },
            {
              id: 3,
              title: "Confirm booking",
              description: "Weekly pickup confirmed",
              status: 'completed',
              timestamp: '3 days ago'
            }
          ]
        });

        orgTasks.push({
          id: orgId + 101,
          title: `Set Food Pickup Reminder - ${orgName}`,
          description: `Weekly reminder for food assistance at ${orgName}`,
          type: 'reminder',
          status: 'pending',
          progress: 0,
          estimatedTime: "1 minute",
          lastUpdated: "Just created",
          consentRequired: false,
          consentGiven: true,
          organizationId: orgId,
          organizationName: orgName,
          category: "food assistance",
          steps: [
            {
              id: 1,
              title: "Set reminder schedule",
              description: "Weekly notification setup",
              status: 'pending'
            },
            {
              id: 2,
              title: "Configure notifications",
              description: "SMS and email alerts",
              status: 'pending'
            }
          ]
        });
      }

      // Health service tasks
      if (orgType.includes('health') || orgType.includes('medical')) {
        orgTasks.push({
          id: orgId + 200,
          title: `Book Healthcare Appointment - ${orgName}`,
          description: `Schedule healthcare appointment at ${orgName}`,
          type: 'booking',
          status: 'pending',
          progress: 0,
          estimatedTime: "4-5 minutes",
          lastUpdated: "Just created",
          consentRequired: true,
          consentGiven: false,
          organizationId: orgId,
          organizationName: orgName,
          category: "healthcare",
          steps: [
            {
              id: 1,
              title: "Check doctor availability",
              description: "Finding available appointments",
              status: 'pending'
            },
            {
              id: 2,
              title: "Select appointment type",
              description: "Choose service needed",
              status: 'pending'
            },
            {
              id: 3,
              title: "Book appointment",
              description: "Confirm booking details",
              status: 'pending'
            },
            {
              id: 4,
              title: "Add to calendar",
              description: "Set appointment reminder",
              status: 'pending'
            }
          ]
        });
      }

      // Housing service tasks
      if (orgType.includes('housing') || orgType.includes('homelessness')) {
        orgTasks.push({
          id: orgId + 300,
          title: `Housing Application - ${orgName}`,
          description: `Submit housing assistance application to ${orgName}`,
          type: 'form',
          status: 'pending',
          progress: 0,
          estimatedTime: "10-15 minutes",
          lastUpdated: "Just created",
          consentRequired: true,
          consentGiven: false,
          organizationId: orgId,
          organizationName: orgName,
          category: "housing",
          steps: [
            {
              id: 1,
              title: "Gather required documents",
              description: "ID, income proof, references",
              status: 'pending'
            },
            {
              id: 2,
              title: "Fill application form",
              description: "Personal and housing details",
              status: 'pending'
            },
            {
              id: 3,
              title: "Upload documents",
              description: "Submit supporting documents",
              status: 'pending'
            },
            {
              id: 4,
              title: "Review and submit",
              description: "Final application review",
              status: 'pending'
            }
          ]
        });
      }

      // Crisis support tasks
      if (orgType.includes('crisis') || orgType.includes('lifeline')) {
        orgTasks.push({
          id: orgId + 400,
          title: `Crisis Support Contact - ${orgName}`,
          description: `Save emergency contact for ${orgName}`,
          type: 'reminder',
          status: 'pending',
          progress: 0,
          estimatedTime: "1 minute",
          lastUpdated: "Just created",
          consentRequired: false,
          consentGiven: true,
          organizationId: orgId,
          organizationName: orgName,
          category: "crisis support",
          steps: [
            {
              id: 1,
              title: "Save contact details",
              description: "Add to emergency contacts",
              status: 'pending'
            },
            {
              id: 2,
              title: "Set quick access",
              description: "Add to phone shortcuts",
              status: 'pending'
            }
          ]
        });
      }

      return [...baseTasks, ...orgTasks];
    }

    return baseTasks;
  };

  const mockTasks = generateRelevantTasks();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'requires-action': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const selectedTaskData = mockTasks.find(t => t.id === selectedTask);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {onBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}
            <h1 className="text-heading text-gov-navy">
              My Appointments & Reminders
            </h1>
          </div>
          
          {/* Autonomous Mode Toggle */}
          <Card className="border-2 border-nav-teal/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-nav-teal" />
                  <div>
                    <h3 className="font-medium text-gray-900">Autonomous Task Execution</h3>
                    <p className="text-sm text-gray-600">
                      Allow the system to complete tasks on your behalf with your consent
                    </p>
                  </div>
                </div>
                <Switch
                  checked={autonomousMode}
                  onCheckedChange={setAutonomousMode}
                />
              </div>
              
              {autonomousMode && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <Shield className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Autonomous mode is active. You'll be asked for approval before any important actions are taken.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-subheading text-gray-900">My Appointments</h2>
              {selectedOrganization && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCreateTask(!showCreateTask)}
                  className="flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Button>
              )}
            </div>

            {selectedOrganization && (
              <Card className="border-nav-teal/30 bg-nav-teal/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building2 className="w-4 h-4 text-nav-teal" />
                    <h3 className="text-sm font-medium text-nav-teal">Selected Organization</h3>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{selectedOrganization.name}</p>
                  <p className="text-xs text-gray-600">{selectedOrganization.type}</p>
                </CardContent>
              </Card>
            )}
            
            {mockTasks.map((task) => (
              <Card
                key={task.id}
                className={`cursor-pointer transition-all ${
                  selectedTask === task.id ? 'ring-2 ring-nav-teal border-nav-teal' : 'hover:shadow-md'
                } ${task.organizationId === selectedOrganization?.id ? 'border-l-4 border-l-nav-teal' : ''}`}
                onClick={() => setSelectedTask(task.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>
                      {task.organizationName && (
                        <p className="text-xs text-nav-teal font-medium mt-1">{task.organizationName}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === 'booked' ? '✓ Booked' : task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{task.description}</p>
                  
                  {/* Appointment Details for Booked items */}
                  {task.isBooked && task.appointmentDate && (
                    <div className="space-y-2 mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-xs">
                        <Calendar className="w-3 h-3 text-green-600" />
                        <span className="font-medium text-green-800">
                          {new Date(task.appointmentDate).toLocaleDateString('en-AU', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Clock className="w-3 h-3 text-green-600" />
                        <span className="text-green-800">{task.appointmentTime}</span>
                      </div>
                      {task.location && (
                        <div className="flex items-start space-x-2 text-xs">
                          <MapPin className="w-3 h-3 text-green-600 mt-0.5" />
                          <span className="text-green-800">{task.location}</span>
                        </div>
                      )}
                      {task.enquiryType && (
                        <div className="flex items-center space-x-2 text-xs">
                          <BookOpen className="w-3 h-3 text-green-600" />
                          <span className="text-green-800">{task.enquiryType}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!task.isBooked && (
                    <div className="space-y-2">
                      <Progress value={task.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{task.progress}% complete</span>
                        <span>{task.lastUpdated}</span>
                      </div>
                    </div>
                  )}
                  
                  {task.isBooked && task.bookingDate && (
                    <div className="text-xs text-gray-500 mt-2">
                      Booked on {new Date(task.bookingDate).toLocaleDateString('en-AU')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Task Detail */}
          <div className="lg:col-span-2">
            {selectedTaskData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      {selectedTaskData.type === 'booking' && <Calendar className="w-6 h-6 text-nav-teal" />}
                      {selectedTaskData.type === 'form' && <FileText className="w-6 h-6 text-nav-teal" />}
                      {selectedTaskData.type === 'reminder' && <Clock className="w-6 h-6 text-nav-teal" />}
                      {selectedTaskData.type === 'document' && <FileText className="w-6 h-6 text-nav-teal" />}
                      <span>{selectedTaskData.title}</span>
                    </CardTitle>
                    
                    <div className="flex items-center space-x-2">
                      {selectedTaskData.status === 'in-progress' && (
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}
                      {selectedTaskData.status === 'requires-action' && (
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                          Action Required
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Estimated time: {selectedTaskData.estimatedTime}</span>
                    <span>•</span>
                    <span>Last updated: {selectedTaskData.lastUpdated}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-gray-700">{selectedTaskData.description}</p>

                  {/* Appointment Details for Booked appointments */}
                  {selectedTaskData.isBooked && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Appointment Confirmed
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">Date</p>
                              <p className="text-green-800">
                                {selectedTaskData.appointmentDate && new Date(selectedTaskData.appointmentDate).toLocaleDateString('en-AU', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">Time</p>
                              <p className="text-green-800">{selectedTaskData.appointmentTime}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {selectedTaskData.location && (
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                              <div>
                                <p className="font-medium text-green-900">Location</p>
                                <p className="text-green-800">{selectedTaskData.location}</p>
                              </div>
                            </div>
                          )}
                          {selectedTaskData.contactPerson && (
                            <div className="flex items-center space-x-3">
                              <User className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="font-medium text-green-900">Contact Person</p>
                                <p className="text-green-800">{selectedTaskData.contactPerson}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedTaskData.enquiryType && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="flex items-center space-x-3">
                            <BookOpen className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">Type of Enquiry</p>
                              <p className="text-green-800">{selectedTaskData.enquiryType}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Progress Overview for non-booked tasks */}
                  {!selectedTaskData.isBooked && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Overall Progress</h3>
                        <span className="text-sm text-gray-600">{selectedTaskData.progress}%</span>
                      </div>
                      <Progress value={selectedTaskData.progress} className="h-3" />
                    </div>
                  )}

                  {/* Consent Section */}
                  {selectedTaskData.consentRequired && (
                    <Alert className={selectedTaskData.consentGiven ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
                      <Shield className={`w-4 h-4 ${selectedTaskData.consentGiven ? 'text-green-600' : 'text-yellow-600'}`} />
                      <AlertDescription>
                        {selectedTaskData.consentGiven ? (
                          <span className="text-green-800">
                            ✓ You have given consent for autonomous execution of this task
                          </span>
                        ) : (
                          <div className="text-yellow-800">
                            <p className="mb-2">This task requires your consent to proceed automatically.</p>
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                              Give Consent
                            </Button>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Step-by-step Progress */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Task Steps</h3>
                    <div className="space-y-4">
                      {selectedTaskData.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getStepIcon(step.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">
                                {step.title}
                              </h4>
                              {step.timestamp && (
                                <span className="text-xs text-gray-500">{step.timestamp}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t">
                    {selectedTaskData.status === 'requires-action' && (
                      <>
                        <Button className="bg-nav-teal hover:bg-nav-teal/90">
                          <Play className="w-4 h-4 mr-2" />
                          Continue Task
                        </Button>
                        <Button variant="outline">
                          Review Details
                        </Button>
                      </>
                    )}
                    {selectedTaskData.status === 'pending' && (
                      <Button 
                        className="bg-nav-teal hover:bg-nav-teal/90"
                        onClick={() => {
                          console.log('Starting task:', selectedTaskData.title);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Booking
                      </Button>
                    )}
                    {selectedTaskData.status === 'in-progress' && (
                      <>
                        <Button variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                        <Button className="bg-nav-teal hover:bg-nav-teal/90">
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      </>
                    )}
                    {(selectedTaskData.status === 'completed' || selectedTaskData.status === 'booked') && (
                      <div className="flex space-x-3">
                        <Button variant="outline" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {selectedTaskData.status === 'booked' ? 'Booked' : 'Completed'}
                        </Button>
                        {selectedTaskData.isBooked && (
                          <>
                            <Button variant="outline">
                              <Calendar className="w-4 h-4 mr-2" />
                              Add to Calendar
                            </Button>
                            <Button variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Contact Office
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create New Appointment Panel */}
            {showCreateTask && selectedOrganization && (
              <Card className="mt-6 border-nav-teal/30">
                <CardHeader>
                  <CardTitle className="text-nav-teal">Book Appointment - {selectedOrganization.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Based on the services offered by {selectedOrganization.name}, we can help you book relevant appointments automatically.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedOrganization.services.slice(0, 4).map((service, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 text-left justify-start hover:border-nav-teal hover:bg-nav-teal/5"
                        onClick={() => {
                          console.log(`Creating appointment for: ${service} at ${selectedOrganization.name}`);
                          setShowCreateTask(false);
                        }}
                      >
                        <div>
                          <p className="font-medium text-sm text-gray-900">Book {service}</p>
                          <p className="text-xs text-gray-600 mt-1">at {selectedOrganization.name}</p>
                        </div>
                      </Button>
                    ))}
                  </div>

                  <div className="flex space-x-3 pt-4 border-t">
                    <Button 
                      variant="outline"
                      onClick={() => setShowCreateTask(false)}
                    >
                      Cancel
                    </Button>
                    <Button className="bg-nav-teal hover:bg-nav-teal/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Custom Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}