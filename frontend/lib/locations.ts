export interface Location {
  id: string;
  name: string;
  type: "city" | "station" | "airport" | "landmark" | "terminal";
  state: string;
  stateCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  aliases: string[];
  timezone: string;
  isMajorHub: boolean;
}

export interface TransportCoverage {
  locationId: string;
  locationName: string;
  locationKnown: boolean;
  routeSupported: boolean;
  scheduleVerified: boolean;
  fareVerified: boolean;
  liveSeatsSupported: boolean;
  bookingIntegrationSupported: boolean;
  supportedModes: ("bus" | "train" | "flight" | "metro")[];
  lastUpdated: string;
  notes?: string;
}

export interface RouteCoverage {
  originId: string;
  destinationId: string;
  hasDirectRoute: boolean;
  hasMultiLegRoute: boolean;
  supportedModes: ("bus" | "train" | "flight" | "metro")[];
  estimatedDurationMin?: number;
  estimatedFareRange?: { min: number; max: number };
  coverageLevel: "full" | "partial" | "none";
  notes?: string;
}

export interface LocationSearchResult {
  locations: Location[];
  total: number;
  query: string;
  tookMs: number;
}

export interface LocationOption {
  id: string;
  name: string;
  type: "city" | "station" | "airport" | "landmark";
  state?: string;
  aliases?: string[];
}

export const INDIAN_STATES = [
  { code: "AN", name: "Andaman and Nicobar Islands" },
  { code: "AP", name: "Andhra Pradesh" },
  { code: "AR", name: "Arunachal Pradesh" },
  { code: "AS", name: "Assam" },
  { code: "BR", name: "Bihar" },
  { code: "CH", name: "Chandigarh" },
  { code: "CT", name: "Chhattisgarh" },
  { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "DL", name: "Delhi" },
  { code: "GA", name: "Goa" },
  { code: "GJ", name: "Gujarat" },
  { code: "HR", name: "Haryana" },
  { code: "HP", name: "Himachal Pradesh" },
  { code: "JK", name: "Jammu and Kashmir" },
  { code: "JH", name: "Jharkhand" },
  { code: "KA", name: "Karnataka" },
  { code: "KL", name: "Kerala" },
  { code: "LA", name: "Ladakh" },
  { code: "LD", name: "Lakshadweep" },
  { code: "MP", name: "Madhya Pradesh" },
  { code: "MH", name: "Maharashtra" },
  { code: "MN", name: "Manipur" },
  { code: "ML", name: "Meghalaya" },
  { code: "MZ", name: "Mizoram" },
  { code: "NL", name: "Nagaland" },
  { code: "OR", name: "Odisha" },
  { code: "PB", name: "Punjab" },
  { code: "PY", name: "Puducherry" },
  { code: "RJ", name: "Rajasthan" },
  { code: "SK", name: "Sikkim" },
  { code: "TN", name: "Tamil Nadu" },
  { code: "TG", name: "Telangana" },
  { code: "TR", name: "Tripura" },
  { code: "UP", name: "Uttar Pradesh" },
  { code: "UK", name: "Uttarakhand" },
  { code: "WB", name: "West Bengal" },
] as const;

export type StateCode = (typeof INDIAN_STATES)[number]["code"];

/**
 * All-India Major Cities & Regional Capitals covering all 28 States and 8 Union Territories
 */
export const MAJOR_CITIES: Location[] = [
  // North India
  {
    id: "city-delhi",
    name: "New Delhi",
    type: "city",
    state: "Delhi",
    stateCode: "DL",
    coordinates: { lat: 28.6139, lng: 77.209 },
    aliases: ["Delhi", "Dilli", "NDLS", "NCR", "New Delhi Railway Station"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-jaipur",
    name: "Jaipur",
    type: "city",
    state: "Rajasthan",
    stateCode: "RJ",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    aliases: ["Pink City", "JP", "Jaipur Junction"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-chandigarh",
    name: "Chandigarh",
    type: "city",
    state: "Chandigarh",
    stateCode: "CH",
    coordinates: { lat: 30.7333, lng: 76.7794 },
    aliases: ["CDG", "Mohali", "Panchkula", "The City Beautiful"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-amritsar",
    name: "Amritsar",
    type: "city",
    state: "Punjab",
    stateCode: "PB",
    coordinates: { lat: 31.634, lng: 74.8723 },
    aliases: ["ASR", "Golden Temple", "Amritsar Junction"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-shimla",
    name: "Shimla",
    type: "city",
    state: "Himachal Pradesh",
    stateCode: "HP",
    coordinates: { lat: 31.1048, lng: 77.1734 },
    aliases: ["Simla", "Mall Road Shimla", "SML"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-dehradun",
    name: "Dehradun",
    type: "city",
    state: "Uttarakhand",
    stateCode: "UK",
    coordinates: { lat: 30.3165, lng: 78.0322 },
    aliases: ["DDN", "Doon", "Rishikesh", "Haridwar"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-srinagar",
    name: "Srinagar",
    type: "city",
    state: "Jammu and Kashmir",
    stateCode: "JK",
    coordinates: { lat: 34.0837, lng: 74.7973 },
    aliases: ["Dal Lake", "Kashmir", "SXR"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-jammu",
    name: "Jammu",
    type: "city",
    state: "Jammu and Kashmir",
    stateCode: "JK",
    coordinates: { lat: 32.7266, lng: 74.857 },
    aliases: ["Jammu Tawi", "JAT", "Katra", "Vaishno Devi"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-leh",
    name: "Leh",
    type: "city",
    state: "Ladakh",
    stateCode: "LA",
    coordinates: { lat: 34.1526, lng: 77.5771 },
    aliases: ["Ladakh", "IXL", "Pangong"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-lucknow",
    name: "Lucknow",
    type: "city",
    state: "Uttar Pradesh",
    stateCode: "UP",
    coordinates: { lat: 26.8467, lng: 80.9462 },
    aliases: ["LKO", "Lucknow Charbagh", "Nawab City"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-varanasi",
    name: "Varanasi",
    type: "city",
    state: "Uttar Pradesh",
    stateCode: "UP",
    coordinates: { lat: 25.3176, lng: 82.9739 },
    aliases: ["Banaras", "Kashi", "BSB", "DDU"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-agra",
    name: "Agra",
    type: "city",
    state: "Uttar Pradesh",
    stateCode: "UP",
    coordinates: { lat: 27.1767, lng: 78.0081 },
    aliases: ["Taj Mahal", "AGC", "Agra Cantt"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // West India
  {
    id: "city-mumbai",
    name: "Mumbai",
    type: "city",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 19.076, lng: 72.8777 },
    aliases: ["Bombay", "BOM", "CSMT", "CSTM", "Mumbai Central", "Dadar"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-pune",
    name: "Pune",
    type: "city",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    aliases: ["PNQ", "Pune Junction", "Poona", "Hinjewadi"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-nagpur",
    name: "Nagpur",
    type: "city",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 21.1458, lng: 79.0882 },
    aliases: ["NAG", "Nagpur Junction", "Orange City"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-ahmedabad",
    name: "Ahmedabad",
    type: "city",
    state: "Gujarat",
    stateCode: "GJ",
    coordinates: { lat: 23.0225, lng: 72.5714 },
    aliases: ["AMD", "ADI", "Amdavad", "Gandhinagar", "Sabarmati"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-surat",
    name: "Surat",
    type: "city",
    state: "Gujarat",
    stateCode: "GJ",
    coordinates: { lat: 21.1702, lng: 72.8311 },
    aliases: ["ST", "Diamond City"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-goa",
    name: "Goa",
    type: "city",
    state: "Goa",
    stateCode: "GA",
    coordinates: { lat: 15.2993, lng: 74.124 },
    aliases: ["Panaji", "Madgaon", "Vasco", "Calangute", "GOI", "MOPA"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // South India
  {
    id: "city-bangalore",
    name: "Bengaluru",
    type: "city",
    state: "Karnataka",
    stateCode: "KA",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    aliases: ["Bangalore", "BLR", "SBC", "Majestic", "KSR Bengaluru", "Whitefield"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-hyderabad",
    name: "Hyderabad",
    type: "city",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.385, lng: 78.4867 },
    aliases: ["HYD", "SC", "Cyberabad", "Secunderabad", "Hitech City", "Nampally"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-vizag",
    name: "Visakhapatnam",
    type: "city",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 17.6868, lng: 83.2185 },
    aliases: ["Vizag", "VTZ", "VSKP", "City of Destiny", "Waltair"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-vijayawada",
    name: "Vijayawada",
    type: "city",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 16.5062, lng: 80.648 },
    aliases: ["BZA", "Bezawada", "Amaravati"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-tirupati",
    name: "Tirupati",
    type: "city",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 13.6288, lng: 79.4192 },
    aliases: ["TPTY", "Tirumala", "Balaji"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-chennai",
    name: "Chennai",
    type: "city",
    state: "Tamil Nadu",
    stateCode: "TN",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    aliases: ["Madras", "MAA", "MAS", "Chennai Central", "Egmore"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-coimbatore",
    name: "Coimbatore",
    type: "city",
    state: "Tamil Nadu",
    stateCode: "TN",
    coordinates: { lat: 11.0168, lng: 76.9558 },
    aliases: ["CBE", "Kovai", "Ooty gateway"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-madurai",
    name: "Madurai",
    type: "city",
    state: "Tamil Nadu",
    stateCode: "TN",
    coordinates: { lat: 9.9252, lng: 78.1198 },
    aliases: ["MDU", "Meenakshi Temple", "Temple City"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-kochi",
    name: "Kochi",
    type: "city",
    state: "Kerala",
    stateCode: "KL",
    coordinates: { lat: 9.9312, lng: 76.2673 },
    aliases: ["Cochin", "COK", "ERS", "Ernakulam", "Fort Kochi"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-trivandrum",
    name: "Thiruvananthapuram",
    type: "city",
    state: "Kerala",
    stateCode: "KL",
    coordinates: { lat: 8.5241, lng: 76.9366 },
    aliases: ["Trivandrum", "TVC", "Kovalam"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-puducherry",
    name: "Puducherry",
    type: "city",
    state: "Puducherry",
    stateCode: "PY",
    coordinates: { lat: 11.9416, lng: 79.8083 },
    aliases: ["Pondicherry", "Pondy", "PDY", "Auroville"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // East India
  {
    id: "city-kolkata",
    name: "Kolkata",
    type: "city",
    state: "West Bengal",
    stateCode: "WB",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    aliases: ["Calcutta", "CCU", "HWH", "Howrah", "Sealdah"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-bhubaneswar",
    name: "Bhubaneswar",
    type: "city",
    state: "Odisha",
    stateCode: "OR",
    coordinates: { lat: 20.2961, lng: 85.8245 },
    aliases: ["BBS", "BBI", "Puri", "Cuttack"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-patna",
    name: "Patna",
    type: "city",
    state: "Bihar",
    stateCode: "BR",
    coordinates: { lat: 25.5941, lng: 85.1376 },
    aliases: ["PNBE", "Pataliputra", "Gaya"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-ranchi",
    name: "Ranchi",
    type: "city",
    state: "Jharkhand",
    stateCode: "JH",
    coordinates: { lat: 23.3441, lng: 85.3096 },
    aliases: ["RNC", "Jamshedpur"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Central India
  {
    id: "city-bhopal",
    name: "Bhopal",
    type: "city",
    state: "Madhya Pradesh",
    stateCode: "MP",
    coordinates: { lat: 23.2599, lng: 77.4126 },
    aliases: ["BPL", "City of Lakes"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-indore",
    name: "Indore",
    type: "city",
    state: "Madhya Pradesh",
    stateCode: "MP",
    coordinates: { lat: 22.7196, lng: 75.8577 },
    aliases: ["IDR", "Indore Junction", "Ujjain gateway"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-raipur",
    name: "Raipur",
    type: "city",
    state: "Chhattisgarh",
    stateCode: "CT",
    coordinates: { lat: 21.2514, lng: 81.6296 },
    aliases: ["R", "Bhilai"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Northeast India
  {
    id: "city-guwahati",
    name: "Guwahati",
    type: "city",
    state: "Assam",
    stateCode: "AS",
    coordinates: { lat: 26.1445, lng: 91.7362 },
    aliases: ["GAU", "GHY", "Gateway to Northeast", "Kamakhya"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-shillong",
    name: "Shillong",
    type: "city",
    state: "Meghalaya",
    stateCode: "ML",
    coordinates: { lat: 25.5788, lng: 91.8933 },
    aliases: ["Scotland of the East", "Cherrapunji", "Sohra"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-gangtok",
    name: "Gangtok",
    type: "city",
    state: "Sikkim",
    stateCode: "SK",
    coordinates: { lat: 27.3389, lng: 88.6065 },
    aliases: ["Sikkim", "Kanchenjunga"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-agartala",
    name: "Agartala",
    type: "city",
    state: "Tripura",
    stateCode: "TR",
    coordinates: { lat: 23.8315, lng: 91.2868 },
    aliases: ["AGTL", "Tripura"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-imphal",
    name: "Imphal",
    type: "city",
    state: "Manipur",
    stateCode: "MN",
    coordinates: { lat: 24.817, lng: 93.9368 },
    aliases: ["IMF", "Manipur"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-aizawl",
    name: "Aizawl",
    type: "city",
    state: "Mizoram",
    stateCode: "MZ",
    coordinates: { lat: 23.7271, lng: 92.7176 },
    aliases: ["AJL", "Mizoram"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-kohima",
    name: "Kohima",
    type: "city",
    state: "Nagaland",
    stateCode: "NL",
    coordinates: { lat: 25.6751, lng: 94.1086 },
    aliases: ["Dimapur", "Nagaland"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-itanagar",
    name: "Itanagar",
    type: "city",
    state: "Arunachal Pradesh",
    stateCode: "AR",
    coordinates: { lat: 27.0844, lng: 93.6053 },
    aliases: ["Tawang", "Naharlagun"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "city-port-blair",
    name: "Port Blair",
    type: "city",
    state: "Andaman and Nicobar Islands",
    stateCode: "AN",
    coordinates: { lat: 11.6234, lng: 92.7265 },
    aliases: ["Andaman", "IXZ", "Havelock"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
];

/**
 * Local Hubs, Stations, Terminals, Airports, and Localities for Inter-city and Intra-city Connections
 */
export const MAJOR_TERMINALS: Location[] = [
  // Andhra Pradesh (Visakhapatnam & regional)
  {
    id: "term-vizag-railway",
    name: "Vizag Railway Station",
    type: "station",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 17.698, lng: 83.289 },
    aliases: ["VSKP", "Visakhapatnam Railway Station", "Vizag Main Station"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-vizag-rtc",
    name: "Vizag RTC Complex (Dwaraka)",
    type: "terminal",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 17.706, lng: 83.298 },
    aliases: ["Dwaraka Bus Station", "Vizag Bus Stand", "RTC Complex Vizag", "Dwaraka"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-mvp-colony",
    name: "MVP Colony",
    type: "landmark",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 17.741, lng: 83.332 },
    aliases: ["MVP Sector 1", "MVP Double Road", "Visakhapatnam MVP"],
    timezone: "Asia/Kolkata",
    isMajorHub: false,
  },
  {
    id: "term-gajuwaka",
    name: "Gajuwaka",
    type: "landmark",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 17.689, lng: 83.208 },
    aliases: ["Gajuwaka Junction", "Steel Plant gate", "BHPV"],
    timezone: "Asia/Kolkata",
    isMajorHub: false,
  },
  {
    id: "term-maddilapalem",
    name: "Maddilapalem",
    type: "terminal",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 17.728, lng: 83.318 },
    aliases: ["Maddilapalem Bus Station", "AU Campus"],
    timezone: "Asia/Kolkata",
    isMajorHub: false,
  },
  {
    id: "term-vtz-airport",
    name: "Visakhapatnam Airport (VTZ)",
    type: "airport",
    state: "Andhra Pradesh",
    stateCode: "AP",
    coordinates: { lat: 17.721, lng: 83.224 },
    aliases: ["VTZ", "Vizag Airport"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Telangana (Hyderabad & Secunderabad)
  {
    id: "term-hitech-city",
    name: "Hitech City",
    type: "terminal",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.445, lng: 78.378 },
    aliases: ["Hitech City Metro", "Cyber Towers", "Madhapur", "HITEC"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-secunderabad",
    name: "Secunderabad",
    type: "station",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.439, lng: 78.498 },
    aliases: ["SC", "Secunderabad Junction", "Secunderabad Railway Station", "Twin City"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-gachibowli",
    name: "Gachibowli",
    type: "terminal",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.437, lng: 78.361 },
    aliases: ["Gachibowli Stadium", "Financial District Hyderabad"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-ameerpet",
    name: "Ameerpet",
    type: "terminal",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.437, lng: 78.448 },
    aliases: ["Ameerpet Metro Interchange", "Ameerpet Cross Roads"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-miyapur",
    name: "Miyapur",
    type: "terminal",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.495, lng: 78.358 },
    aliases: ["Miyapur Bus Station", "Miyapur Metro Station", "Miyapur Cross Roads"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-mgbs",
    name: "MGBS (Mahatma Gandhi Bus Station)",
    type: "terminal",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.378, lng: 78.483 },
    aliases: ["MGBS", "Imlibun Bus Station", "Gowliguda", "Hyderabad Bus Stand"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-kukatpally",
    name: "Kukatpally",
    type: "terminal",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.493, lng: 78.398 },
    aliases: ["KPHB", "Kukatpally Housing Board", "JNTU"],
    timezone: "Asia/Kolkata",
    isMajorHub: false,
  },
  {
    id: "term-lb-nagar",
    name: "LB Nagar",
    type: "terminal",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.345, lng: 78.552 },
    aliases: ["LB Nagar Metro", "LB Nagar Ring Road"],
    timezone: "Asia/Kolkata",
    isMajorHub: false,
  },
  {
    id: "term-hyd-airport",
    name: "Rajiv Gandhi International Airport (HYD)",
    type: "airport",
    state: "Telangana",
    stateCode: "TG",
    coordinates: { lat: 17.2403, lng: 78.4294 },
    aliases: ["HYD Airport", "Shamshabad Airport"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Delhi NCR
  {
    id: "term-ndls-railway",
    name: "New Delhi Railway Station (NDLS)",
    type: "station",
    state: "Delhi",
    stateCode: "DL",
    coordinates: { lat: 28.643, lng: 77.219 },
    aliases: ["NDLS", "Paharganj", "Ajmeri Gate"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-delhi-isbt-kashmere",
    name: "Kashmere Gate ISBT",
    type: "terminal",
    state: "Delhi",
    stateCode: "DL",
    coordinates: { lat: 28.667, lng: 77.228 },
    aliases: ["ISBT", "Maharana Pratap ISBT", "Kashmere Gate Metro"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-delhi-anand-vihar",
    name: "Anand Vihar ISBT & Terminal",
    type: "terminal",
    state: "Delhi",
    stateCode: "DL",
    coordinates: { lat: 28.65, lng: 77.315 },
    aliases: ["ANVT", "Anand Vihar Railway Station"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-delhi-nizamuddin",
    name: "Hazrat Nizamuddin Railway Station (NZM)",
    type: "station",
    state: "Delhi",
    stateCode: "DL",
    coordinates: { lat: 28.588, lng: 77.253 },
    aliases: ["NZM", "Nizamuddin", "Sarai Kale Khan"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-delhi-igi",
    name: "Indira Gandhi International Airport (DEL)",
    type: "airport",
    state: "Delhi",
    stateCode: "DL",
    coordinates: { lat: 28.5562, lng: 77.1 },
    aliases: ["DEL", "IGI Terminal 3", "Delhi Airport T3", "T1"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Mumbai
  {
    id: "term-mumbai-csmt",
    name: "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    type: "station",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 18.94, lng: 72.835 },
    aliases: ["CSMT", "CSTM", "VT", "Victoria Terminus"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-mumbai-central",
    name: "Mumbai Central Railway Station",
    type: "station",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 18.969, lng: 72.819 },
    aliases: ["MMCT", "BCT", "Mumbai Central Terminus"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-mumbai-dadar",
    name: "Dadar Terminus",
    type: "station",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 19.018, lng: 72.843 },
    aliases: ["Dadar Western", "Dadar Central", "DR"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-mumbai-bandra",
    name: "Bandra Terminus (BDTS)",
    type: "station",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 19.062, lng: 72.84 },
    aliases: ["BDTS", "Bandra Kurla Complex", "BKC"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-mumbai-airport",
    name: "Chhatrapati Shivaji Maharaj International Airport (BOM)",
    type: "airport",
    state: "Maharashtra",
    stateCode: "MH",
    coordinates: { lat: 19.0896, lng: 72.8656 },
    aliases: ["BOM", "Mumbai T2", "Sahar Airport", "Santacruz"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Bengaluru
  {
    id: "term-blr-sbc",
    name: "KSR Bengaluru City (Majestic SBC)",
    type: "station",
    state: "Karnataka",
    stateCode: "KA",
    coordinates: { lat: 12.978, lng: 77.569 },
    aliases: ["SBC", "Majestic Station", "KSR Bengaluru", "Bangalore City"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-blr-yesvantpur",
    name: "Yesvantpur Junction (YPR)",
    type: "station",
    state: "Karnataka",
    stateCode: "KA",
    coordinates: { lat: 13.023, lng: 77.55 },
    aliases: ["YPR", "Yeshwantpur"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-blr-airport",
    name: "Kempegowda International Airport (BLR)",
    type: "airport",
    state: "Karnataka",
    stateCode: "KA",
    coordinates: { lat: 13.1986, lng: 77.7066 },
    aliases: ["BLR Airport", "KIA Devanahalli"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Chennai
  {
    id: "term-chennai-central",
    name: "Puratchi Thalaivar Dr. M.G.R. Central (MAS)",
    type: "station",
    state: "Tamil Nadu",
    stateCode: "TN",
    coordinates: { lat: 13.083, lng: 80.275 },
    aliases: ["MAS", "Chennai Central", "Central Station Chennai"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-chennai-egmore",
    name: "Chennai Egmore (MS)",
    type: "station",
    state: "Tamil Nadu",
    stateCode: "TN",
    coordinates: { lat: 13.079, lng: 80.261 },
    aliases: ["MS", "Egmore Station"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-chennai-cmbt",
    name: "Chennai Mofussil Bus Terminus (CMBT)",
    type: "terminal",
    state: "Tamil Nadu",
    stateCode: "TN",
    coordinates: { lat: 13.068, lng: 80.205 },
    aliases: ["CMBT Koyambedu", "Koyambedu Bus Stand"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },

  // Kolkata
  {
    id: "term-kolkata-howrah",
    name: "Howrah Junction (HWH)",
    type: "station",
    state: "West Bengal",
    stateCode: "WB",
    coordinates: { lat: 22.583, lng: 88.343 },
    aliases: ["HWH", "Howrah Station", "Howrah Bridge terminal"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
  {
    id: "term-kolkata-sealdah",
    name: "Sealdah Railway Station (SDAH)",
    type: "station",
    state: "West Bengal",
    stateCode: "WB",
    coordinates: { lat: 22.567, lng: 88.371 },
    aliases: ["SDAH", "Sealdah"],
    timezone: "Asia/Kolkata",
    isMajorHub: true,
  },
];

export function getAllLocations(): Location[] {
  return [...MAJOR_CITIES, ...MAJOR_TERMINALS];
}

export function findLocationById(id: string): Location | undefined {
  return getAllLocations().find((loc) => loc.id === id);
}

/**
 * Searches all India locations (cities, terminals, stations, airports, landmarks)
 * Returns ranked Location objects
 */
export function searchLocations(query: string, limit = 15): Location[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery || normalizedQuery.length < 2) return [];

  const locations = getAllLocations();
  const results = locations
    .map((loc) => {
      let score = 0;
      const nameLower = loc.name.toLowerCase();
      const stateLower = loc.state.toLowerCase();
      const nameMatch = nameLower.includes(normalizedQuery);
      const aliasMatch = loc.aliases.some((a) => a.toLowerCase().includes(normalizedQuery));
      const stateMatch = stateLower.includes(normalizedQuery);

      if (nameLower.startsWith(normalizedQuery)) score += 120;
      else if (nameMatch) score += 60;
      
      if (aliasMatch) score += 45;
      if (stateMatch) score += 20;
      if (loc.isMajorHub) score += 10;

      return { location: loc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.location);

  return results;
}

/**
 * High-performance location option mapper specifically for UI Autocomplete components.
 * Formats options cleanly with accurate categories and state badges.
 */
export function searchLocationOptions(query: string, limit = 15): LocationOption[] {
  const found = searchLocations(query, limit);
  return found.map((loc) => ({
    id: loc.id,
    name: loc.name,
    type: loc.type === "terminal" ? "station" : loc.type,
    state: loc.state,
    aliases: loc.aliases,
  }));
}

export function getLocationsByState(stateCode: string): Location[] {
  return getAllLocations().filter((loc) => loc.stateCode === stateCode);
}

export function getMajorHubs(): Location[] {
  return getAllLocations().filter((loc) => loc.isMajorHub);
}

export function getRouteCoverage(originId: string, destinationId: string): RouteCoverage {
  const knownCorridors: Record<string, RouteCoverage> = {
    "city-vizag-city-hyderabad": {
      originId: "city-vizag",
      destinationId: "city-hyderabad",
      hasDirectRoute: true,
      hasMultiLegRoute: true,
      supportedModes: ["bus", "train"],
      estimatedDurationMin: 660,
      estimatedFareRange: { min: 650, max: 1600 },
      coverageLevel: "full",
    },
    "city-delhi-city-mumbai": {
      originId: "city-delhi",
      destinationId: "city-mumbai",
      hasDirectRoute: true,
      hasMultiLegRoute: true,
      supportedModes: ["bus", "train", "flight"],
      estimatedDurationMin: 960,
      estimatedFareRange: { min: 800, max: 4500 },
      coverageLevel: "full",
    },
    "city-bangalore-city-chennai": {
      originId: "city-bangalore",
      destinationId: "city-chennai",
      hasDirectRoute: true,
      hasMultiLegRoute: true,
      supportedModes: ["bus", "train", "flight"],
      estimatedDurationMin: 360,
      estimatedFareRange: { min: 400, max: 3000 },
      coverageLevel: "full",
    },
  };

  const key = `${originId}-${destinationId}`;
  const reverseKey = `${destinationId}-${originId}`;

  return (
    knownCorridors[key] ||
    knownCorridors[reverseKey] ||
    {
      originId,
      destinationId,
      hasDirectRoute: false,
      hasMultiLegRoute: false,
      supportedModes: [],
      coverageLevel: "none",
      notes: "Live schedules not available for this route. We're expanding our coverage!",
    }
  );
}