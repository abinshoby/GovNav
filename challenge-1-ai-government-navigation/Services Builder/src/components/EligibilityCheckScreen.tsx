import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface EligibilityCheckScreenProps {
  onBack: () => void;
}

export default function EligibilityCheckScreen({ onBack }: EligibilityCheckScreenProps) {
  const [age, setAge] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [incomeLevel, setIncomeLevel] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCheckEligibility = () => {
    if (!age || !employmentStatus || !incomeLevel) {
      return;
    }

    // Simple eligibility logic for demo
    let eligibilityResult = '';
    
    if (age === 'under-22') {
      eligibilityResult = 'not-eligible-age';
    } else if (employmentStatus === 'employed-fulltime') {
      eligibilityResult = 'not-eligible-employed';
    } else if (incomeLevel === 'high') {
      eligibilityResult = 'not-eligible-income';
    } else if (age === '22-plus' && (employmentStatus === 'unemployed' || employmentStatus === 'employed-parttime') && (incomeLevel === 'low' || incomeLevel === 'medium')) {
      eligibilityResult = 'eligible';
    } else {
      eligibilityResult = 'check-required';
    }

    setResult(eligibilityResult);
    setShowResult(true);
  };

  const renderResult = () => {
    if (!showResult || !result) return null;

    switch (result) {
      case 'eligible':
        return (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div className="space-y-3">
                  <h3 className="font-medium text-green-900">
                    ✅ You likely qualify for JobSeeker Payment
                  </h3>
                  <p className="text-sm text-green-800">
                    Based on your responses, you appear to meet the basic eligibility criteria for JobSeeker Payment. 
                    The next step is to complete a full application with Services Australia.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-900">What happens next:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Complete your online application</li>
                      <li>• Attend a phone or in-person appointment</li>
                      <li>• Provide required documents</li>
                      <li>• Begin your Job Plan</li>
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Continue to Services Australia
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                      Download Checklist
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'not-eligible-age':
        return (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
                <div className="space-y-3">
                  <h3 className="font-medium text-orange-900">
                    Age requirement not met
                  </h3>
                  <p className="text-sm text-orange-800">
                    JobSeeker Payment is available to people aged 22 and over. If you're under 22, 
                    you may be eligible for Youth Allowance instead.
                  </p>
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                    Check Youth Allowance
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'not-eligible-employed':
        return (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
                <div className="space-y-3">
                  <h3 className="font-medium text-orange-900">
                    Employment status may affect eligibility
                  </h3>
                  <p className="text-sm text-orange-800">
                    JobSeeker Payment is primarily for people who are unemployed or working less than 
                    25 hours per week. Full-time employees are generally not eligible.
                  </p>
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                    Explore Other Support
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'not-eligible-income':
        return (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
                <div className="space-y-3">
                  <h3 className="font-medium text-orange-900">
                    Income may be too high
                  </h3>
                  <p className="text-sm text-orange-800">
                    JobSeeker Payment has income and assets tests. High income levels may affect your eligibility. 
                    A detailed assessment is required to determine your exact eligibility.
                  </p>
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                    Get Detailed Assessment
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-blue-600 mt-1" />
                <div className="space-y-3">
                  <h3 className="font-medium text-blue-900">
                    ⚠️ Please verify with official assessment
                  </h3>
                  <p className="text-sm text-blue-800">
                    Your situation requires a more detailed assessment to determine eligibility. 
                    Services Australia can provide a comprehensive review of your circumstances.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      Contact Services Australia
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to service results
          </Button>
          
          <h1 className="text-heading text-gray-900 mb-4">
            Check your eligibility: JobSeeker Payment
          </h1>
          <p className="text-subheading text-gray-600">
            Answer a few quick questions to check if you might be eligible for JobSeeker Payment.
          </p>
        </div>

        {/* Eligibility Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Eligibility Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Age Question */}
            <div className="space-y-2">
              <Label htmlFor="age">What is your age range?</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-22">Under 22 years</SelectItem>
                  <SelectItem value="22-plus">22 years or older</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Employment Status Question */}
            <div className="space-y-2">
              <Label htmlFor="employment">What is your current employment status?</Label>
              <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="employed-parttime">Employed part-time (less than 25 hours/week)</SelectItem>
                  <SelectItem value="employed-fulltime">Employed full-time (25+ hours/week)</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Income Level Question */}
            <div className="space-y-2">
              <Label htmlFor="income">What is your current income level?</Label>
              <Select value={incomeLevel} onValueChange={setIncomeLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your income level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No income</SelectItem>
                  <SelectItem value="low">Low income (under $300/week)</SelectItem>
                  <SelectItem value="medium">Medium income ($300-$600/week)</SelectItem>
                  <SelectItem value="high">High income (over $600/week)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Check Button */}
            <Button
              onClick={handleCheckEligibility}
              disabled={!age || !employmentStatus || !incomeLevel}
              className="w-full bg-nav-teal hover:bg-nav-teal/90 text-white"
            >
              Check Now
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {renderResult()}

        {/* Important Notice */}
        <Card className="mt-6 border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Important Notice</h4>
            <p className="text-sm text-gray-600">
              This is a preliminary eligibility check only. Final eligibility determination is made by Services Australia 
              based on a comprehensive assessment of your individual circumstances, including income, assets, residency status, 
              and other factors not covered in this simplified check.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}