import React, { useState } from "react";
import { Calendar, ChevronDown, Search, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Organization {
  id: number;
  orgName: string;
  suburb: string;
  primaryCategory: string;
  phone: string;
  website: string;
  services: string;
  lastUpdated: string;
  hasWheelchairAccess: boolean;
  venueHire: boolean;
  openingHours: string;
}

interface AppointmentBookingProps {
  organizations: Organization[];
}

export default function AppointmentBooking({ organizations }: AppointmentBookingProps) {
  const [selectedOrg, setSelectedOrg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Filter organizations based on search query
  const filteredOrganizations = organizations.filter((org) =>
    org.orgName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOrgData = organizations.find((org) => org.orgName === selectedOrg);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appointment booking submission
    console.log("Booking submitted:", {
      organization: selectedOrg,
      date: appointmentDate,
      time: appointmentTime,
      purpose,
      name,
      email,
      phone,
    });
    alert("Appointment booking request submitted! You will receive confirmation shortly.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h2>
        <p className="text-gray-600">
          Schedule an appointment with one of our 46 community organizations for services and support.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Appointment Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            {/* Organization Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Organization *
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search from 46 organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              {searchQuery && (
                <div className="border rounded-md bg-white shadow-lg max-h-64 overflow-y-auto">
                  {filteredOrganizations.length > 0 ? (
                    filteredOrganizations.map((org) => (
                      <div
                        key={org.id}
                        className="p-3 border-b cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSelectedOrg(org.orgName);
                          setSearchQuery(org.orgName);
                        }}
                      >
                        <div className="font-medium text-gray-900">{org.orgName}</div>
                        <div className="text-sm text-gray-600 flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{org.suburb}</span>
                          </span>
                          <span>{org.primaryCategory}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">No organizations found</div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Organization Details */}
            {selectedOrgData && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedOrgData.orgName}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedOrgData.suburb}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedOrgData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedOrgData.openingHours}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Services:</span> {selectedOrgData.services}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Preferred Date *
                </label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Preferred Time *
                </label>
                <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="09:30">9:30 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="11:30">11:30 AM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="13:30">1:30 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="14:30">2:30 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="15:30">3:30 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Purpose of Visit */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Purpose of Visit *
              </label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">General Consultation</SelectItem>
                  <SelectItem value="support-services">Support Services</SelectItem>
                  <SelectItem value="emergency-relief">Emergency Relief</SelectItem>
                  <SelectItem value="health-services">Health Services</SelectItem>
                  <SelectItem value="housing-assistance">Housing Assistance</SelectItem>
                  <SelectItem value="employment-support">Employment Support</SelectItem>
                  <SelectItem value="youth-services">Youth Services</SelectItem>
                  <SelectItem value="mental-health">Mental Health Support</SelectItem>
                  <SelectItem value="disability-support">Disability Support</SelectItem>
                  <SelectItem value="aged-care">Aged Care Services</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address (optional)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!selectedOrg || !appointmentDate || !appointmentTime || !purpose || !name || !phone}
            >
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Information */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-2">
            If you need assistance with booking an appointment or have questions about services:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Call our helpline: <span className="font-medium">1800 123 456</span></li>
            <li>• Email us: <span className="font-medium">appointments@govnav.sa.gov.au</span></li>
            <li>• Visit our help center for frequently asked questions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}