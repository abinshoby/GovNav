import React, { useState } from "react";
import {
  Search,
  Download,
  Database,
  BarChart3,
  FileText,
  Calendar,
  Filter,
  TrendingUp,
  Eye,
  Building2,
  Phone,
  Globe,
  MapPin,
  Clock,
  Accessibility,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import AppointmentBooking from "./AppointmentBooking";

export default function DatasetsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [format, setFormat] = useState("all");
  const [orgSearchQuery, setOrgSearchQuery] = useState("");
  const [orgCategory, setOrgCategory] = useState("all");

  const datasets = [
    {
      id: 1,
      title: "Public Transit Ridership Data",
      description:
        "Daily and monthly ridership statistics for buses, trains, and metro systems across the city",
      category: "Transportation",
      format: "CSV",
      size: "2.3 MB",
      lastUpdated: "2024-12-28",
      downloads: 1234,
      tags: [
        "transit",
        "public transport",
        "ridership",
        "statistics",
      ],
      featured: true,
    },
    {
      id: 2,
      title: "Property Tax Assessment Records",
      description:
        "Comprehensive database of property assessments, tax rates, and valuations",
      category: "Finance",
      format: "JSON",
      size: "15.7 MB",
      lastUpdated: "2024-12-25",
      downloads: 892,
      tags: ["property", "tax", "assessment", "real estate"],
      featured: false,
    },
    {
      id: 3,
      title: "Building Permits Database",
      description:
        "Records of all building permits issued, including residential and commercial projects",
      category: "Planning",
      format: "XML",
      size: "8.9 MB",
      lastUpdated: "2024-12-27",
      downloads: 567,
      tags: [
        "building",
        "permits",
        "construction",
        "development",
      ],
      featured: true,
    },
    {
      id: 4,
      title: "Crime Statistics Report",
      description:
        "Monthly crime statistics by neighborhood, including incident types and trends",
      category: "Public Safety",
      format: "PDF",
      size: "4.2 MB",
      lastUpdated: "2024-12-26",
      downloads: 2156,
      tags: ["crime", "safety", "statistics", "neighborhood"],
      featured: false,
    },
    {
      id: 5,
      title: "Environmental Monitoring Data",
      description:
        "Air quality, water quality, and noise level measurements from monitoring stations",
      category: "Environment",
      format: "CSV",
      size: "12.4 MB",
      lastUpdated: "2024-12-28",
      downloads: 445,
      tags: [
        "environment",
        "air quality",
        "water",
        "monitoring",
      ],
      featured: true,
    },
    {
      id: 6,
      title: "Budget and Expenditure Reports",
      description:
        "Annual and quarterly government budget allocations and spending reports",
      category: "Finance",
      format: "Excel",
      size: "6.8 MB",
      lastUpdated: "2024-12-20",
      downloads: 789,
      tags: ["budget", "spending", "finance", "government"],
      featured: false,
    },
  ];

  const categories = [
    "all",
    "Transportation",
    "Finance",
    "Planning",
    "Public Safety",
    "Environment",
    "Community Services",
  ];
  const formats = ["all", "CSV", "JSON", "XML", "PDF", "Excel"];

  // Community Organizations Data from the provided spreadsheet
  const organizations = [
    {
      id: 1,
      orgName: "Aboriginal Family Support Services",
      suburb: "Adelaide",
      primaryCategory:
        "Aboriginal & Torres Strait Islander Services",
      phone: "08 8235 4121",
      website: "http://www.afss.org.au",
      services:
        "Cultural support, family services, advocacy, emergency relief",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Monday-Friday 9AM-5PM",
    },
    {
      id: 2,
      orgName: "Adelaide City Mission",
      suburb: "Adelaide",
      primaryCategory: "Emergency Relief",
      phone: "08 8210 7600",
      website: "http://www.adelaidecitymission.org.au",
      services:
        "Emergency accommodation, food relief, support services, community programs",
      lastUpdated: "2024-12-27",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "24/7",
    },
    {
      id: 3,
      orgName: "Adelaide Community Healthcare Alliance",
      suburb: "Adelaide",
      primaryCategory: "Health Services",
      phone: "08 8237 3000",
      website: "http://www.acha.org.au",
      services:
        "Primary healthcare, mental health, dental services, community health programs",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Monday-Friday 8AM-6PM",
    },
    {
      id: 4,
      orgName: "Baptist Care SA",
      suburb: "Multiple Locations",
      primaryCategory: "Community Support",
      phone: "08 8273 7300",
      website: "http://www.baptistcaresa.org.au",
      services:
        "Aged care, disability support, family services, housing, employment",
      lastUpdated: "2024-12-26",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Monday-Friday 9AM-5PM",
    },
    {
      id: 5,
      orgName: "Catherine House Inc",
      suburb: "Adelaide",
      primaryCategory: "Women's Services",
      phone: "08 8364 2499",
      website: "http://www.catherinehouse.org.au",
      services:
        "Crisis accommodation, support services for women experiencing homelessness",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "24/7 Crisis Support",
    },
    {
      id: 6,
      orgName: "City of Adelaide",
      suburb: "Adelaide",
      primaryCategory: "Local Government",
      phone: "08 8203 7203",
      website: "http://www.cityofadelaide.com.au",
      services:
        "Council services, permits, community programs, city planning",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Monday-Friday 8:30AM-5PM",
    },
    {
      id: 7,
      orgName: "Community Centres SA",
      suburb: "Multiple Locations",
      primaryCategory: "Community Programs",
      phone: "08 8245 4222",
      website: "http://www.communitycentressa.org.au",
      services:
        "Community programs, education, training, social activities",
      lastUpdated: "2024-12-27",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Varies by location",
    },
    {
      id: 8,
      orgName: "Drug & Alcohol Services SA",
      suburb: "Adelaide",
      primaryCategory: "Drug & Alcohol Services",
      phone: "1300 131 340",
      website:
        "http://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/health+services/mental+health+and+drugs+and+alcohol+services/drug+and+alcohol+services",
      services:
        "Treatment, counselling, rehabilitation, support services",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "24/7 Support Line",
    },
    {
      id: 9,
      orgName: "Emergency Relief Network",
      suburb: "Adelaide Metro",
      primaryCategory: "Emergency Relief",
      phone: "08 8212 3999",
      website: "http://www.emergencyrelief.org.au",
      services:
        "Food parcels, vouchers, financial assistance, referrals",
      lastUpdated: "2024-12-27",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Monday-Friday 9AM-4PM",
    },
    {
      id: 10,
      orgName: "Foodbank SA",
      suburb: "Pooraka",
      primaryCategory: "Food Relief",
      phone: "08 8351 1136",
      website: "http://www.foodbanksa.org.au",
      services:
        "Food distribution, school programs, community pantries",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Monday-Friday 8AM-4PM",
    },
    {
      id: 11,
      orgName: "Hutt St Centre",
      suburb: "Adelaide",
      primaryCategory: "Homelessness Services",
      phone: "08 8218 2400",
      website: "http://www.huttstcentre.org.au",
      services:
        "Meals, accommodation, health services, case management",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Daily 7AM-5PM",
    },
    {
      id: 12,
      orgName: "Junction Australia",
      suburb: "Multiple Locations",
      primaryCategory: "Youth Services",
      phone: "08 8354 1844",
      website: "http://www.junctionaustralia.org.au",
      services:
        "Youth programs, education, employment, housing support",
      lastUpdated: "2024-12-27",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Monday-Friday 9AM-5PM",
    },
    {
      id: 13,
      orgName: "Lifeline Adelaide",
      suburb: "Adelaide",
      primaryCategory: "Crisis Support",
      phone: "13 11 14",
      website: "http://www.lifeline.org.au",
      services:
        "Crisis counselling, suicide prevention, community programs",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "24/7 Crisis Line",
    },
    {
      id: 14,
      orgName: "Mental Health Coalition of SA",
      suburb: "Adelaide",
      primaryCategory: "Mental Health",
      phone: "08 8382 3100",
      website: "http://www.mhcsa.org.au",
      services:
        "Mental health advocacy, support, information, training",
      lastUpdated: "2024-12-27",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Monday-Friday 9AM-5PM",
    },
    {
      id: 15,
      orgName: "Multicultural Communities Council of SA",
      suburb: "Adelaide",
      primaryCategory: "Multicultural Services",
      phone: "08 8345 5266",
      website: "http://www.mccsa.org.au",
      services:
        "Settlement services, advocacy, cultural programs, translation",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Monday-Friday 9AM-5PM",
    },
    {
      id: 16,
      orgName: "Salvation Army Adelaide",
      suburb: "Multiple Locations",
      primaryCategory: "Emergency Relief",
      phone: "08 8202 0250",
      website: "http://www.salvationarmy.org.au",
      services:
        "Emergency relief, accommodation, meals, support services",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Daily services available",
    },
    {
      id: 17,
      orgName: "St Vincent de Paul Society SA",
      suburb: "Multiple Locations",
      primaryCategory: "Community Support",
      phone: "08 8215 7300",
      website: "http://www.vinnies.org.au",
      services:
        "Emergency relief, home visitation, support services, shops",
      lastUpdated: "2024-12-27",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Monday-Friday 9AM-5PM",
    },
    {
      id: 18,
      orgName: "Uniting Communities",
      suburb: "Multiple Locations",
      primaryCategory: "Community Support",
      phone: "08 8202 5110",
      website: "http://www.unitingcommunities.org",
      services:
        "Family services, housing, disability support, aged care",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Monday-Friday 9AM-5PM",
    },
    {
      id: 19,
      orgName: "Women's Safety Services SA",
      suburb: "Adelaide",
      primaryCategory: "Women's Services",
      phone: "1800 188 158",
      website: "http://www.womenssafetyservices.com.au",
      services:
        "Domestic violence support, crisis accommodation, counselling",
      lastUpdated: "2024-12-28",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "24/7 Support Line",
    },
    {
      id: 20,
      orgName: "YMCA Adelaide",
      suburb: "Multiple Locations",
      primaryCategory: "Recreation & Fitness",
      phone: "08 8100 1322",
      website: "http://www.ymca.org.au",
      services:
        "Recreation programs, fitness, childcare, community programs",
      lastUpdated: "2024-12-27",
      hasWheelchairAccess: true,
      venueHire: true,
      openingHours: "Early morning to late evening",
    },
    {
      id: 21,
      orgName: "RSL Ardrossan Sub Branch",
      suburb: "Ardrossan",
      primaryCategory: "Recreation",
      phone: "08 8837 3596",
      website: "rslsa.org.au/stores/ardrossan",
      services: "Recreation",
      lastUpdated: "2019-10-13",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 22,
      orgName: "RSL Barmera Sub Branch",
      suburb: "Barmera",
      primaryCategory: "Recreation",
      phone: "08 8588 2699",
      website: "www.rslsa.org.au",
      services: "Recreation",
      lastUpdated: "2018-08-02",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 23,
      orgName: "RSL Berri Sub Branch",
      suburb: "Berri",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8582 2936",
      website: "rslsa.org.au/stores/berri/#",
      services: "Community Organisation, Development",
      lastUpdated: "2018-04-30",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 24,
      orgName: "RSL Blanchetown Sub Branch",
      suburb: "Blanchetown",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8540 5212",
      website: "rslsa.org.au/stores/blanchetown",
      services: "Community Organisation, Development",
      lastUpdated: "2019-04-17",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours:
        "Sat 4pm - 8pm, Sun and public holidays 2pm - 8pm",
    },
    {
      id: 25,
      orgName: "RSL Brighton Sub Branch",
      suburb: "Brighton",
      primaryCategory: "Recreation",
      phone: "08 8296 8303",
      website: "www.brightonrsladelaide.com.au",
      services: "Recreation",
      lastUpdated: "2018-10-29",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 26,
      orgName: "RSL Ceduna Sub Branch",
      suburb: "Ceduna",
      primaryCategory: "Recreation",
      phone: "08 8625 2670",
      website: "www.rslsa.org.au",
      services: "Recreation",
      lastUpdated: "2018-08-31",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 27,
      orgName: "RSL Edithburgh Sub Branch",
      suburb: "Edithburgh",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8852 6400",
      website: "rslsa.org.au/stores/edithburgh",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 28,
      orgName: "RSL Elizabeth Sub Branch",
      suburb: "Elizabeth East",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8255 7670",
      website: "www.elizabeth.rslsa.org.au",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 29,
      orgName: "RSL Eudunda Sub Branch",
      suburb: "Eudunda",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8581 1340",
      website: "eudundarsl.com",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 30,
      orgName: "RSL Freeling Sub Branch",
      suburb: "Freeling",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8525 2154",
      website: "rslsa.org.au/stores/freeling",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 31,
      orgName: "RSL Glynde Sub Branch",
      suburb: "Glynde",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8337 8136",
      website: "rslsa.org.au/stores/glynde",
      services: "Community Organisation, Development",
      lastUpdated: "2020-07-22",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 32,
      orgName: "RSL Jamestown Sub Branch",
      suburb: "Jamestown",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8664 1009",
      website: "rslsa.org.au/stores/jamestown",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 33,
      orgName: "RSL Kadina Sub Branch",
      suburb: "Kadina",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8821 1185",
      website: "rslsa.org.au/stores/kadina",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 34,
      orgName: "RSL Keith Sub Branch",
      suburb: "Keith",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8755 3384",
      website: "www.rslsa.org.au",
      services: "Community Organisation, Development",
      lastUpdated: "2020-12-16",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 35,
      orgName: "RSL Kimba Sub Branch",
      suburb: "Kimba",
      primaryCategory: "Personal & Family Support",
      phone: "08 8100 7300",
      website: "www.rslsa.org.au",
      services: "Personal, Family Support",
      lastUpdated: "2021-02-06",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 36,
      orgName: "RSL Kingston Sub Branch",
      suburb: "Kingston",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8100 7300",
      website: "www.rslsa.org.au",
      services: "Community Organisation, Development",
      lastUpdated: "2021-01-06",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 37,
      orgName: "RSL Loxton Sub Branch",
      suburb: "Loxton",
      primaryCategory: "Recreation",
      phone: "08 8584 6553",
      website: "rslsa.org.au",
      services: "Recreation",
      lastUpdated: "2020-09-11",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Memorial Room open Wed 9.30am - 4pm",
    },
    {
      id: 38,
      orgName: "RSL Millicent Sub Branch",
      suburb: "Millicent",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8733 3857",
      website: "rslsa.org.au/stores/millicent-rsl",
      services: "Community Organisation, Development",
      lastUpdated: "2018-08-20",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 39,
      orgName: "RSL Meningie Sub Branch",
      suburb: "Meningie",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8573 3156",
      website: "rslsa.org.au/stores/meningie-rsl",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 40,
      orgName: "RSL Moonta Sub Branch",
      suburb: "Moonta",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8825 1240",
      website: "rslsa.org.au/stores/moonta-rsl",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Tues - Fri  12pm - 4pm",
    },
    {
      id: 41,
      orgName: "RSL Morgan Sub Branch",
      suburb: "Morgan",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8540 2169",
      website: "rslsa.org.au/stores/morgan-rsl",
      services: "Community Organisation, Development",
      lastUpdated: "2018-03-23",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 42,
      orgName: "RSL Peterborough Sub Branch",
      suburb: "Peterborough",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8651 3055",
      website: "rslsa.org.au/stores/peterborough-rsl",
      services: "Community Organisation, Development",
      lastUpdated: "2019-07-26",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours:
        "Thurs - Fri 4pm - 7pm\r\nClosed Public Holidays",
    },
    {
      id: 43,
      orgName: "RSL Port Lincoln Sub Branch",
      suburb: "Port Lincoln",
      primaryCategory: "Community Organisation & Development",
      phone: "08 8682 3594",
      website: "rslportlincoln.com.au",
      services: "Community Organisation, Development",
      lastUpdated: "2018-09-17",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours:
        "Information centre and display: Mon, Wed, Fri 9am - 3pm\r\nClubrooms: Fri 3pm - 7pm,  Sun trading hours  by arrangement.",
    },
    {
      id: 44,
      orgName: "Lacrosse SA",
      suburb: "West Beach",
      primaryCategory: "Recreation",
      phone: "08 8355 3350",
      website: "www.lacrossesa.com.au",
      services:
        "Coordination and promotion of lacrosse in South Australia\r\nInformation about local clubs",
      lastUpdated: "2018-10-22",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Office Hours:\r\nMon - Fri 8am - 4pm",
    },
    {
      id: 45,
      orgName: "Glenelg Lacrosse Club",
      suburb: "West Beach",
      primaryCategory: "Recreation",
      phone: "08 8355 5011",
      website: "www.glenelglacrosse.com.au",
      services:
        "Lacrosse - junior, Under 18 and senior teams, men and women\r\nFunction room for hire",
      lastUpdated: "2021-03-31",
      hasWheelchairAccess: false,
      venueHire: false,
      openingHours: "Not specified",
    },
    {
      id: 46,
      orgName: "North Adelaide Lacrosse Club Inc.",
      suburb: "Gepps Cross",
      primaryCategory: "Recreation",
      phone: "08 8260 4561",
      website: "https://www.nalc.com.au",
      services:
        "Senior and junior lacrosse teams\r\nCoaching available",
      lastUpdated: "2020-05-24",
      hasWheelchairAccess: true,
      venueHire: false,
      openingHours: "Not specified",
    },
  ];

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      dataset.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      dataset.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      dataset.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      category === "all" || dataset.category === category;
    const matchesFormat =
      format === "all" || dataset.format === format;
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const orgCategories = [
    "all",
    ...Array.from(
      new Set(organizations.map((org) => org.primaryCategory)),
    ),
  ];

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.orgName
        .toLowerCase()
        .includes(orgSearchQuery.toLowerCase()) ||
      org.services
        .toLowerCase()
        .includes(orgSearchQuery.toLowerCase()) ||
      org.suburb
        .toLowerCase()
        .includes(orgSearchQuery.toLowerCase());
    const matchesCategory =
      orgCategory === "all" ||
      org.primaryCategory === orgCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredDatasets = datasets.filter(
    (dataset) => dataset.featured,
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      Transportation: "bg-blue-100 text-blue-800",
      Finance: "bg-green-100 text-green-800",
      Planning: "bg-purple-100 text-purple-800",
      "Public Safety": "bg-red-100 text-red-800",
      Environment: "bg-teal-100 text-teal-800",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getFormatColor = (format: string) => {
    const colors = {
      CSV: "bg-orange-100 text-orange-800",
      JSON: "bg-indigo-100 text-indigo-800",
      XML: "bg-yellow-100 text-yellow-800",
      PDF: "bg-pink-100 text-pink-800",
      Excel: "bg-cyan-100 text-cyan-800",
    };
    return (
      colors[format as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
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
            Access open government data, reports, and statistics to support research, decision-making, and transparency.
          </p>
        </div>

        <Tabs defaultValue="datasets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="datasets" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Open Data</span>
            </TabsTrigger>
            <TabsTrigger
              value="organizations"
              className="flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Community Organizations</span>
            </TabsTrigger>
            <TabsTrigger
              value="booking"
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Services</span>
            </TabsTrigger>
          </TabsList>

          {/* Datasets Tab */}
          <TabsContent value="datasets" className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search datasets by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((fmt) => (
                        <SelectItem key={fmt} value={fmt}>
                          {fmt === "all" ? "All Formats" : fmt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Featured Datasets */}
            {searchQuery === "" && category === "all" && format === "all" && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Featured Datasets</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredDatasets.map((dataset) => (
                    <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{dataset.title}</CardTitle>
                          <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                            Featured
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {dataset.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={getCategoryColor(dataset.category)}>
                            {dataset.category}
                          </Badge>
                          <Badge className={getFormatColor(dataset.format)}>
                            {dataset.format}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{dataset.lastUpdated}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{dataset.downloads.toLocaleString()}</span>
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Download ({dataset.size})
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Datasets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery || category !== "all" || format !== "all"
                    ? `Search Results (${filteredDatasets.length})`
                    : "All Datasets"}
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? "s" : ""} found
                </div>
              </div>
              <div className="space-y-4">
                {filteredDatasets.map((dataset) => (
                  <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 lg:mr-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {dataset.title}
                            </h3>
                            {dataset.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{dataset.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className={getCategoryColor(dataset.category)}>
                              {dataset.category}
                            </Badge>
                            <Badge className={getFormatColor(dataset.format)}>
                              {dataset.format}
                            </Badge>
                            {dataset.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Updated {dataset.lastUpdated}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Download className="w-4 h-4" />
                              <span>{dataset.downloads.toLocaleString()} downloads</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{dataset.size}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4 lg:mt-0 lg:flex-col lg:space-x-0 lg:space-y-2">
                          <Button size="sm" className="flex-1 lg:flex-none">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search by service type (e.g., food support, housing, counselling)..."
                      value={orgSearchQuery}
                      onChange={(e) => setOrgSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={orgCategory} onValueChange={setOrgCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Service Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "All Categories" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Organizations Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Community Organizations
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? "s" : ""} found
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOrganizations.map((org) => (
                  <Card key={org.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{org.orgName}</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {org.primaryCategory}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{org.suburb}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{org.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <a 
                            href={org.website.startsWith('http') ? org.website : `http://${org.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            {org.website}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{org.openingHours}</span>
                        </div>
                        <div className="pt-2">
                          <p className="text-sm font-medium text-gray-900 mb-1">Services:</p>
                          <p className="text-sm text-gray-600">{org.services}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex items-center space-x-3">
                            {org.hasWheelchairAccess && (
                              <div className="flex items-center space-x-1 text-xs text-green-600">
                                <Accessibility className="w-4 h-4" />
                                <span>Wheelchair Access</span>
                              </div>
                            )}
                            {org.venueHire && (
                              <div className="flex items-center space-x-1 text-xs text-blue-600">
                                <Users className="w-4 h-4" />
                                <span>Venue Hire</span>
                              </div>
                            )}
                          </div>
                          <Button size="sm" variant="outline">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Booking Tab */}
          <TabsContent value="booking">
            <AppointmentBooking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}