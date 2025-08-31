import React from 'react';
import { ArrowLeft, ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ServiceResultsScreenProps {
  selectedEvent: string;
  onCheckEligibility: (serviceId: string) => void;
  onBack: () => void;
}

export default function ServiceResultsScreen({ selectedEvent, onCheckEligibility, onBack }: ServiceResultsScreenProps) {
  // Mock service data based on Data.gov.au structure
  const getServicesForEvent = (eventId: string) => {
    const serviceData: Record<string, any> = {
      'job-loss': {
        title: 'Job Loss',
        description: 'Support available when you lose your job',
        services: [
          {
            id: 'jobseeker-payment',
            title: 'JobSeeker Payment',
            agency: 'Services Australia',
            level: 'Federal',
            eligibility: 'Income support if you\'re aged 22+ and looking for work. Must meet income and assets tests.',
            amount: '$745.20 per fortnight (maximum)',
            processing: '21-35 days',
            status: 'available',
            requirements: [
              'Aged 22 years or older',
              'Looking for work or undertaking approved activities',
              'Meet income and assets tests',
              'Reside in Australia'
            ],
            datasetId: 'DSS-001-JSP-2025'
          },
          {
            id: 'employment-support',
            title: 'Employment Support Service',
            agency: 'NSW Department of Communities and Justice',
            level: 'State',
            location: 'NSW',
            eligibility: 'Job coaching, training opportunities, and career guidance for unemployed residents.',
            amount: 'Free service',
            processing: '5-10 days',
            status: 'available',
            requirements: [
              'NSW resident',
              'Unemployed or underemployed',
              'Willing to participate in training',
              'Available for work'
            ],
            datasetId: 'NSW-DCJ-ESS-2025'
          },
          {
            id: 'skills-training',
            title: 'JobTrainer Fund',
            agency: 'Department of Employment and Workplace Relations',
            level: 'Federal',
            eligibility: 'Training and reskilling opportunities in high-demand sectors.',
            amount: 'Up to $8,000 funding',
            processing: '14-21 days',
            status: 'limited',
            requirements: [
              'Unemployed or underemployed',
              'Course in eligible skill area',
              'Meet literacy requirements',
              'Commit to course completion'
            ],
            datasetId: 'DEWR-JTF-2025'
          }
        ]
      },
      'birth-of-child': {
        title: 'Birth of a Child',
        description: 'Support for new parents and families',
        services: [
          {
            id: 'parental-leave-pay',
            title: 'Parental Leave Pay',
            agency: 'Services Australia',
            level: 'Federal',
            eligibility: 'Income support for eligible working parents after the birth or adoption of a child.',
            amount: '$812.45 per week (18 weeks)',
            processing: '14-28 days',
            status: 'available',
            requirements: [
              'Work test requirements met',
              'Income test requirements met',
              'Child born or adopted',
              'Primary carer of the child'
            ],
            datasetId: 'SA-PLP-2025'
          }
        ]
      },
      'mental-health': {
        title: 'Mental Health',
        description: 'Mental health support and services',
        services: [
          {
            id: 'mental-health-plan',
            title: 'Mental Health Care Plan',
            agency: 'Department of Health and Aged Care',
            level: 'Federal',
            eligibility: 'Access to subsidised psychological therapy sessions.',
            amount: 'Up to 20 sessions per year',
            processing: 'Same day (via GP)',
            status: 'available',
            requirements: [
              'GP referral required',
              'Medicare card',
              'Mental health assessment',
              'Ongoing review'
            ],
            datasetId: 'DHAC-MHCP-2025'
          }
        ]
      }
    };

    return serviceData[eventId] || {
      title: 'Services',
      description: 'Government services and support',
      services: []
    };
  };

  const eventData = getServicesForEvent(selectedEvent);

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'Federal':
        return 'bg-gov-navy text-white';
      case 'State':
        return 'bg-nav-teal text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'limited':
        return 'text-yellow-600';
      case 'unavailable':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'limited':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'unavailable':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to life events
          </Button>
          
          <h1 className="text-heading text-gray-900 mb-2">
            Services for: {eventData.title}
          </h1>
          <p className="text-subheading text-gray-600">
            {eventData.description}
          </p>
        </div>

        {/* Service Cards */}
        <div className="space-y-6">
          {eventData.services.map((service: any) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getBadgeStyle(service.level)}>
                        {service.level}
                      </Badge>
                      <Badge variant="outline">
                        {service.agency}
                      </Badge>
                      {service.location && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {service.location}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(service.status)}
                    <span className={`text-sm font-medium ${getStatusStyle(service.status)}`}>
                      {service.status === 'available' && 'Available'}
                      {service.status === 'limited' && 'Limited availability'}
                      {service.status === 'unavailable' && 'Currently unavailable'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Eligibility */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Eligibility</h4>
                  <p className="text-sm text-gray-600 mb-3">{service.eligibility}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">Payment Amount</div>
                    <div className="text-sm text-gray-600">{service.amount}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">Processing Time</div>
                    <div className="text-sm text-gray-600">{service.processing}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={() => onCheckEligibility(service.id)}
                    className="bg-nav-teal hover:bg-nav-teal/90 text-white"
                  >
                    Check Eligibility
                  </Button>
                  <Button variant="outline">
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Set Reminder
                  </Button>
                </div>

                {/* Source Information */}
                <div className="border-t pt-3 text-xs text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Source: Data.gov.au · Dataset ID: {service.datasetId}</span>
                    <span>Updated August 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer with Data Sources */}
        <div className="mt-12 bg-white rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-3">Data Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-900">Data.gov.au</div>
              <div>Government service listings, eligibility criteria, and payment rates</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">Transparency.gov.au</div>
              <div>Program funding, performance reports, and service delivery metrics</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-3 pt-3 border-t">
            Last updated from Data.gov.au · Transparency.gov.au on {new Date().toLocaleDateString('en-AU')}
          </div>
        </div>
      </div>
    </div>
  );
}