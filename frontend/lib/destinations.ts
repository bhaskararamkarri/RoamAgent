/**
 * Complete India-Wide Destination Catalogue
 * Representing all 28 States and 8 Union Territories of India (all 36 state/UT entities)
 * Organized across 6 Tourism Regions: North, South, East, West, Central, Northeast
 */

export type TourismRegion = "north" | "south" | "east" | "west" | "central" | "northeast";

export type DestinationCategory = 
  | "Heritage & Culture"
  | "Metro Hub"
  | "Nature & Hills"
  | "Coastal & Beach"
  | "Spiritual & Pilgrimage"
  | "Wildlife & Safari";

export interface Destination {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  isUnionTerritory: boolean;
  region: TourismRegion;
  category: DestinationCategory;
  description: string;
  image: string;
  alt: string;
  hubStation: string;
  routeCount: number;
  trending?: boolean;
  suggestedOrigin: string; // pre-fills origin when destination is selected
  attractions: string[];
}

export const DESTINATIONS: Destination[] = [
  // ---------------- NORTH INDIA (10) ----------------
  {
    id: "delhi",
    name: "New Delhi",
    state: "Delhi",
    stateCode: "DL",
    isUnionTerritory: true,
    region: "north",
    category: "Metro Hub",
    description: "National capital with historic Mughal monuments, bustling bazaars, and India's busiest transit interchange.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    alt: "India Gate monument in New Delhi against sunset sky",
    hubStation: "New Delhi Railway Station (NDLS)",
    routeCount: 120,
    trending: true,
    suggestedOrigin: "Jaipur",
    attractions: ["India Gate", "Red Fort", "Qutub Minar", "Humayun's Tomb"]
  },
  {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    stateCode: "UP",
    isUnionTerritory: false,
    region: "north",
    category: "Heritage & Culture",
    description: "Home to the Taj Mahal, Agra Fort, and Mughal architectural marvels along the Yamuna river.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    alt: "Taj Mahal marble mausoleum in Agra reflection in pool",
    hubStation: "Agra Cantt (AGC)",
    routeCount: 48,
    trending: true,
    suggestedOrigin: "New Delhi",
    attractions: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"]
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    stateCode: "RJ",
    isUnionTerritory: false,
    region: "north",
    category: "Heritage & Culture",
    description: "The Pink City showcasing majestic hill forts, royal palaces, and vibrant artisanal markets.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    alt: "Hawa Mahal Palace of Winds terracotta facade in Jaipur",
    hubStation: "Jaipur Junction (JP)",
    routeCount: 52,
    trending: true,
    suggestedOrigin: "New Delhi",
    attractions: ["Hawa Mahal", "Amer Fort", "City Palace", "Jantar Mantar"]
  },
  {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    stateCode: "PB",
    isUnionTerritory: false,
    region: "north",
    category: "Spiritual & Pilgrimage",
    description: "Spiritual center of Sikhism with the revered Golden Temple, historic Jallianwala Bagh, and rich culinary tradition.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    alt: "Golden Temple reflected on the sacred pool in Amritsar",
    hubStation: "Amritsar Junction (ASR)",
    routeCount: 36,
    suggestedOrigin: "New Delhi",
    attractions: ["Harmandir Sahib (Golden Temple)", "Wagah Border", "Jallianwala Bagh"]
  },
  {
    id: "srinagar",
    name: "Srinagar",
    state: "Jammu and Kashmir",
    stateCode: "JK",
    isUnionTerritory: true,
    region: "north",
    category: "Nature & Hills",
    description: "Paradise valley celebrated for Dal Lake houseboats, Mughal gardens, and snow-capped Himalayan panoramas.",
    image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
    alt: "Shikara boats on Dal Lake surrounded by Himalayan mountains in Srinagar",
    hubStation: "Srinagar Railway Station / TRC Bus Stand",
    routeCount: 28,
    trending: true,
    suggestedOrigin: "Jammu",
    attractions: ["Dal Lake", "Mughal Gardens", "Shankaracharya Temple", "Gulmarg Gateway"]
  },
  {
    id: "leh",
    name: "Leh Ladakh",
    state: "Ladakh",
    stateCode: "LA",
    isUnionTerritory: true,
    region: "north",
    category: "Nature & Hills",
    description: "High-altitude desert wonderland featuring ancient Tibetan monasteries, Pangong Tso, and mountain passes.",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    alt: "High altitude landscape and mountain monastery in Leh Ladakh",
    hubStation: "Leh Bus Stand / Kushok Bakula Airport",
    routeCount: 16,
    suggestedOrigin: "Srinagar",
    attractions: ["Pangong Tso", "Nubra Valley", "Thiksey Monastery", "Khardung La"]
  },
  {
    id: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    stateCode: "HP",
    isUnionTerritory: false,
    region: "north",
    category: "Nature & Hills",
    description: "Colonial summer capital set amidst pine-forested ridges, connected by the historic Kalka-Shimla toy train.",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80",
    alt: "Scenic mountain hills and colonial church on Shimla ridge",
    hubStation: "Shimla Old Bus Stand / Railway Station",
    routeCount: 34,
    suggestedOrigin: "Chandigarh",
    attractions: ["The Ridge", "Mall Road", "Jakhu Temple", "Kalka-Shimla Toy Train"]
  },
  {
    id: "rishikesh",
    name: "Rishikesh & Haridwar",
    state: "Uttarakhand",
    stateCode: "UK",
    isUnionTerritory: false,
    region: "north",
    category: "Spiritual & Pilgrimage",
    description: "Yoga capital of the world and holy Ganges gateway at the Himalayan foothills.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00fa00021c?auto=format&fit=crop&w=800&q=80",
    alt: "Ganges river valley with suspension bridge in Rishikesh",
    hubStation: "Yog Nagari Rishikesh (YNRK)",
    routeCount: 38,
    suggestedOrigin: "New Delhi",
    attractions: ["Ram Jhula & Laxman Jhula", "Triveni Ghat Aarti", "Beatles Ashram", "Shivpuri"]
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    state: "Chandigarh",
    stateCode: "CH",
    isUnionTerritory: true,
    region: "north",
    category: "Metro Hub",
    description: "India's first modern planned city designed by Le Corbusier, with urban gardens and seamless transit grids.",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
    alt: "Sukhna Lake waterfront surrounded by greenery in Chandigarh",
    hubStation: "Chandigarh Junction (CDG) / ISBT-43",
    routeCount: 42,
    suggestedOrigin: "New Delhi",
    attractions: ["Rock Garden", "Sukhna Lake", "Rose Garden", "Capitol Complex"]
  },
  {
    id: "gurugram",
    name: "Gurugram",
    state: "Haryana",
    stateCode: "HR",
    isUnionTerritory: false,
    region: "north",
    category: "Metro Hub",
    description: "Leading corporate technology and financial hub in the National Capital Region with express metro connectivity.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    alt: "Modern architecture and metro viaduct in NCR Gurugram",
    hubStation: "Gurgaon Railway Station (GGN) / IFFCO Chowk",
    routeCount: 65,
    suggestedOrigin: "New Delhi",
    attractions: ["Cyber Hub", "Sultanpur National Park", "Kingdom of Dreams"]
  },

  // ---------------- SOUTH INDIA (10) ----------------
  {
    id: "vizag",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    stateCode: "AP",
    isUnionTerritory: false,
    region: "south",
    category: "Coastal & Beach",
    description: "Port city where eastern ghats meet the Bay of Bengal, featuring pristine beaches and naval heritage.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    alt: "Curved coastal beach and lush hills of Visakhapatnam",
    hubStation: "Vizag RTC Complex / Visakhapatnam Junction (VSKP)",
    routeCount: 45,
    trending: true,
    suggestedOrigin: "Hyderabad",
    attractions: ["RK Beach", "Kailasagiri Hill", "Submarine Museum", "Araku Valley Gateway"]
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    stateCode: "TG",
    isUnionTerritory: false,
    region: "south",
    category: "Metro Hub",
    description: "City of Pearls blending Nizam heritage with HITEC City innovation, legendary biryani, and express metro lines.",
    image: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=800&q=80",
    alt: "Historic Charminar monument illuminated at dusk in Hyderabad",
    hubStation: "Secunderabad (SC) / Miyapur Intermodal",
    routeCount: 85,
    trending: true,
    suggestedOrigin: "Visakhapatnam",
    attractions: ["Charminar", "Golconda Fort", "Hussain Sagar Lake", "HITEC City"]
  },
  {
    id: "bangalore",
    name: "Bengaluru",
    state: "Karnataka",
    stateCode: "KA",
    isUnionTerritory: false,
    region: "south",
    category: "Metro Hub",
    description: "India's Silicon Valley renowned for tree-lined parks, craft breweries, and tech innovation corridors.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    alt: "Vidhana Soudha illuminated palace in Bengaluru",
    hubStation: "KSR Bengaluru City (SBC) / Majestic",
    routeCount: 95,
    trending: true,
    suggestedOrigin: "Chennai",
    attractions: ["Lalbagh Botanical Garden", "Cubbon Park", "Bangalore Palace", "Vidhana Soudha"]
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    stateCode: "TN",
    isUnionTerritory: false,
    region: "south",
    category: "Coastal & Beach",
    description: "Cultural capital of South India known for classical Carnatic music, ancient Dravidian temples, and Marina Beach.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    alt: "Colorful gopuram temple tower in Chennai",
    hubStation: "Chennai Central (MAS) / CMBT Koyambedu",
    routeCount: 78,
    suggestedOrigin: "Bengaluru",
    attractions: ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "San Thome Cathedral"]
  },
  {
    id: "kochi",
    name: "Kochi",
    state: "Kerala",
    stateCode: "KL",
    isUnionTerritory: false,
    region: "south",
    category: "Coastal & Beach",
    description: "Queen of the Arabian Sea with Chinese fishing nets, colonial spice warehouses, and water metro connectivity.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    alt: "Traditional Kerala houseboat cruising along palm-fringed backwaters",
    hubStation: "Ernakulam Junction (ERS) / Vyttila Mobility Hub",
    routeCount: 42,
    trending: true,
    suggestedOrigin: "Bengaluru",
    attractions: ["Fort Kochi", "Chinese Fishing Nets", "Mattancherry Palace", "Alleppey Backwaters"]
  },
  {
    id: "puducherry",
    name: "Puducherry",
    state: "Puducherry",
    stateCode: "PY",
    isUnionTerritory: true,
    region: "south",
    category: "Coastal & Beach",
    description: "Charming seaside union territory boasting French colonial villas, serene promenades, and Auroville.",
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    alt: "French Quarter streetscape with pastel buildings and bougainvillea in Puducherry",
    hubStation: "Puducherry Railway Station (PDY)",
    routeCount: 24,
    suggestedOrigin: "Chennai",
    attractions: ["Promenade Beach", "French Quarter (White Town)", "Auroville", "Sri Aurobindo Ashram"]
  },
  {
    id: "portblair",
    name: "Port Blair",
    state: "Andaman and Nicobar Islands",
    stateCode: "AN",
    isUnionTerritory: true,
    region: "south",
    category: "Coastal & Beach",
    description: "Tropical island capital famous for the historic Cellular Jail, emerald beaches, and coral reef diving.",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
    alt: "Turquoise ocean waters and tropical sandy beach in Andaman Islands",
    hubStation: "Haddo Wharf / Veer Savarkar Airport (IXZ)",
    routeCount: 14,
    suggestedOrigin: "Chennai",
    attractions: ["Cellular Jail", "Radhanagar Beach (Havelock)", "Ross Island", "Elephant Beach"]
  },
  {
    id: "kavaratti",
    name: "Kavaratti",
    state: "Lakshadweep",
    stateCode: "LD",
    isUnionTerritory: true,
    region: "south",
    category: "Coastal & Beach",
    description: "Coral archipelago capital in the Arabian Sea with crystalline lagoons and marine biodiversity.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    alt: "Pristine turquoise lagoon and coral reefs in Lakshadweep",
    hubStation: "Kavaratti Jetty / Agatti Airport",
    routeCount: 8,
    suggestedOrigin: "Kochi",
    attractions: ["Kavaratti Lagoon", "Marine Aquarium", "Urjra Mosque", "Scuba Reefs"]
  },
  {
    id: "mysuru",
    name: "Mysuru",
    state: "Karnataka",
    stateCode: "KA",
    isUnionTerritory: false,
    region: "south",
    category: "Heritage & Culture",
    description: "City of Palaces celebrated for illuminated royal architecture, sandalwood artisans, and grand Dasara festivals.",
    image: "https://images.unsplash.com/photo-1514222134-b575899ea22e?auto=format&fit=crop&w=800&q=80",
    alt: "Mysore Palace illuminated with thousands of golden lights at night",
    hubStation: "Mysuru Junction (MYS)",
    routeCount: 36,
    suggestedOrigin: "Bengaluru",
    attractions: ["Mysore Palace", "Chamundi Hill", "Brindavan Gardens", "St. Philomena's Cathedral"]
  },
  {
    id: "tirupati",
    name: "Tirupati",
    state: "Andhra Pradesh",
    stateCode: "AP",
    isUnionTerritory: false,
    region: "south",
    category: "Spiritual & Pilgrimage",
    description: "Sacred foothill pilgrimage hub leading to the world-renowned Sri Venkateswara Temple atop the Tirumala Hills.",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",
    alt: "Ancient temple tower and holy stairs in Tirupati hills",
    hubStation: "Tirupati Main (TPTY) / Central Bus Station",
    routeCount: 42,
    suggestedOrigin: "Chennai",
    attractions: ["Tirumala Venkateswara Temple", "Silathoranam", "Kapila Theertham", "Chandragiri Fort"]
  },

  // ---------------- EAST INDIA (6) ----------------
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    stateCode: "WB",
    isUnionTerritory: false,
    region: "east",
    category: "Heritage & Culture",
    description: "City of Joy celebrated for grand Victorian architecture, literary salons, Durga Puja, and the iconic Howrah Bridge.",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
    alt: "Historic Howrah Bridge crossing Hooghly river in Kolkata",
    hubStation: "Howrah Junction (HWH) / Sealdah (SDAH)",
    routeCount: 72,
    trending: true,
    suggestedOrigin: "Bhubaneswar",
    attractions: ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Temple", "Park Street"]
  },
  {
    id: "bhubaneswar",
    name: "Bhubaneswar & Puri",
    state: "Odisha",
    stateCode: "OR",
    isUnionTerritory: false,
    region: "east",
    category: "Heritage & Culture",
    description: "Temple City of India paired with coastal Puri and Konark's 13th-century Sun Temple chariot.",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    alt: "Konark Sun Temple stone wheel carving in Odisha",
    hubStation: "Bhubaneswar Railway Station (BBS)",
    routeCount: 38,
    suggestedOrigin: "Kolkata",
    attractions: ["Lingaraj Temple", "Konark Sun Temple", "Puri Jagannath Temple", "Udayagiri Caves"]
  },
  {
    id: "patna",
    name: "Patna & Bodh Gaya",
    state: "Bihar",
    stateCode: "BR",
    isUnionTerritory: false,
    region: "east",
    category: "Spiritual & Pilgrimage",
    description: "Ancient Pataliputra on the Ganges connected to Bodh Gaya, birthplace of Buddhist enlightenment under the Bodhi tree.",
    image: "https://images.unsplash.com/photo-1622308643198-d8f8d9595863?auto=format&fit=crop&w=800&q=80",
    alt: "Mahabodhi Temple spire in Bodh Gaya Bihar",
    hubStation: "Patna Junction (PNBE)",
    routeCount: 44,
    suggestedOrigin: "Kolkata",
    attractions: ["Mahabodhi Temple (Bodh Gaya)", "Golghar", "Nalanda Ruins Gateway", "Takht Sri Patna Sahib"]
  },
  {
    id: "ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    stateCode: "JH",
    isUnionTerritory: false,
    region: "east",
    category: "Nature & Hills",
    description: "City of Waterfalls set on the Chota Nagpur plateau, boasting cascading falls and mineral-rich hills.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Lush waterfall cascading down rocks in Jharkhand hills",
    hubStation: "Ranchi Junction (RNC)",
    routeCount: 26,
    suggestedOrigin: "Kolkata",
    attractions: ["Hundru Falls", "Dassam Falls", "Jonha Falls", "Tagore Hill"]
  },
  {
    id: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    stateCode: "WB",
    isUnionTerritory: false,
    region: "east",
    category: "Nature & Hills",
    description: "Queen of the Hills nestled beneath Mt Kanchenjunga, famous worldwide for aromatic tea estates and toy trains.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    alt: "Tea plantations with Himalayan peaks in background in Darjeeling",
    hubStation: "New Jalpaiguri (NJP) / Darjeeling Station",
    routeCount: 22,
    suggestedOrigin: "Kolkata",
    attractions: ["Tiger Hill Sunrise", "Batasia Loop", "Happy Valley Tea Estate", "Himalayan Mountaineering Institute"]
  },
  {
    id: "gangtok",
    name: "Gangtok",
    state: "Sikkim",
    stateCode: "SK",
    isUnionTerritory: false,
    region: "east",
    category: "Nature & Hills",
    description: "Capital of Sikkim commanding dramatic views of Kanchenjunga with Buddhist monasteries and Tsomgo Lake.",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
    alt: "Tibetan monastery prayer flags flutter on mountain ridge in Gangtok",
    hubStation: "Siliguri / SNT Bus Terminus Gangtok",
    routeCount: 18,
    suggestedOrigin: "Kolkata",
    attractions: ["Rumtek Monastery", "Tsomgo Lake", "Nathula Pass Gateway", "MG Marg Promenade"]
  },

  // ---------------- WEST INDIA (7) ----------------
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    stateCode: "MH",
    isUnionTerritory: false,
    region: "west",
    category: "Metro Hub",
    description: "India's financial heartbeat and entertainment capital, famous for Marine Drive, colonial gateways, and fast local trains.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    alt: "Gateway of India monument beside Mumbai harbour",
    hubStation: "Chhatrapati Shivaji Maharaj Terminus (CSMT) / Mumbai Central",
    routeCount: 140,
    trending: true,
    suggestedOrigin: "Pune",
    attractions: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Colaba Causeway"]
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    stateCode: "MH",
    isUnionTerritory: false,
    region: "west",
    category: "Metro Hub",
    description: "Oxford of the East combining Maratha heritage forts with automobile engineering and tech campuses.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    alt: "Historic Shaniwar Wada fortification gates in Pune",
    hubStation: "Pune Junction (PUNE) / Swargate Bus Station",
    routeCount: 68,
    suggestedOrigin: "Mumbai",
    attractions: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort", "Koregaon Park"]
  },
  {
    id: "goa",
    name: "Goa (Panaji & Madgaon)",
    state: "Goa",
    stateCode: "GA",
    isUnionTerritory: false,
    region: "west",
    category: "Coastal & Beach",
    description: "Sun-drenched coastal haven featuring golden Arabian Sea beaches, Portuguese baroque basilicas, and nightlife.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    alt: "Palm trees hanging over golden sandy beach in Goa at sunset",
    hubStation: "Madgaon Junction (MAO) / Kadamba Bus Stand",
    routeCount: 55,
    trending: true,
    suggestedOrigin: "Mumbai",
    attractions: ["Calangute & Baga Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fort Aguada"]
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    stateCode: "GJ",
    isUnionTerritory: false,
    region: "west",
    category: "Heritage & Culture",
    description: "UNESCO World Heritage city with intricate stepwells, Sabarmati Ashram, textile legacy, and food streets.",
    image: "https://images.unsplash.com/photo-1576487247738-4e4b52ff1ff2?auto=format&fit=crop&w=800&q=80",
    alt: "Ancient carved stepwell architecture in Gujarat",
    hubStation: "Ahmedabad Junction (ADI) / Kalupur",
    routeCount: 60,
    suggestedOrigin: "Mumbai",
    attractions: ["Sabarmati Ashram", "Adalaj Stepwell", "Sidi Saiyyed Mosque", "Atal Bridge"]
  },
  {
    id: "daman",
    name: "Daman & Silvassa",
    state: "Dadra and Nagar Haveli and Daman and Diu",
    stateCode: "DN",
    isUnionTerritory: true,
    region: "west",
    category: "Coastal & Beach",
    description: "Peaceful coastal enclave with 16th-century Portuguese battlements, beach promenades, and tribal art.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    alt: "Coastal fortress walls and beach in Daman",
    hubStation: "Vapi Junction (VAPI)",
    routeCount: 18,
    suggestedOrigin: "Surat",
    attractions: ["Moti Daman Fort", "Jampore Beach", "Devka Beach", "Silvassa Tribal Museum"]
  },
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    stateCode: "RJ",
    isUnionTerritory: false,
    region: "west",
    category: "Heritage & Culture",
    description: "City of Lakes framed by the Aravalli hills, whitewashed marble palaces, and tranquil boat rides on Lake Pichola.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    alt: "Lake Palace gleaming white over water in Udaipur",
    hubStation: "Udaipur City (UDZ)",
    routeCount: 36,
    suggestedOrigin: "Jaipur",
    attractions: ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon-ki-Bari"]
  },
  {
    id: "nashik",
    name: "Nashik",
    state: "Maharashtra",
    stateCode: "MH",
    isUnionTerritory: false,
    region: "west",
    category: "Spiritual & Pilgrimage",
    description: "Spiritual destination on the sacred Godavari river hosting the Kumbh Mela, alongside India's premier wine valleys.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Lush green vineyard rows in Nashik valley",
    hubStation: "Nashik Road (NK)",
    routeCount: 32,
    suggestedOrigin: "Mumbai",
    attractions: ["Trimbakeshwar Shiva Temple", "Sula Vineyards", "Panchavati", "Pandavleni Caves"]
  },

  // ---------------- CENTRAL INDIA (5) ----------------
  {
    id: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    stateCode: "MP",
    isUnionTerritory: false,
    region: "central",
    category: "Heritage & Culture",
    description: "City of Lakes rich in history, situated next to Sanchi's UNESCO Great Stupa and Bhimbetka rock art.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00fa00021c?auto=format&fit=crop&w=800&q=80",
    alt: "Sanchi Buddhist Great Stupa hemisphere in Madhya Pradesh",
    hubStation: "Bhopal Junction (BPL) / Rani Kamlapati (RKMP)",
    routeCount: 46,
    suggestedOrigin: "Indore",
    attractions: ["Upper Lake (Bhojtal)", "Sanchi Stupa", "Bhimbetka Rock Shelters", "Taj-ul-Masajid"]
  },
  {
    id: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    stateCode: "MP",
    isUnionTerritory: false,
    region: "central",
    category: "Metro Hub",
    description: "Cleanest city in India celebrated as a culinary haven with Sarafa night bazaar and Holkar palaces.",
    image: "https://images.unsplash.com/photo-1576487247738-4e4b52ff1ff2?auto=format&fit=crop&w=800&q=80",
    alt: "Historic Holkar Rajwada Palace facade in Indore",
    hubStation: "Indore Junction (INDB)",
    routeCount: 42,
    suggestedOrigin: "Bhopal",
    attractions: ["Rajwada Palace", "Sarafa Night Food Bazaar", "Lal Bagh Palace", "Chappan Dukan"]
  },
  {
    id: "khajuraho",
    name: "Khajuraho",
    state: "Madhya Pradesh",
    stateCode: "MP",
    isUnionTerritory: false,
    region: "central",
    category: "Heritage & Culture",
    description: "UNESCO World Heritage site displaying exquisite medieval sandstone temple sculptures of the Chandela dynasty.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    alt: "Intricately sculpted Hindu temple towers in Khajuraho",
    hubStation: "Khajuraho Railway Station (KURJ)",
    routeCount: 20,
    suggestedOrigin: "Bhopal",
    attractions: ["Kandariya Mahadeva Temple", "Lakshmana Temple", "Raneh Falls", "Panna National Park Gateway"]
  },
  {
    id: "raipur",
    name: "Raipur",
    state: "Chhattisgarh",
    stateCode: "CT",
    isUnionTerritory: false,
    region: "central",
    category: "Metro Hub",
    description: "Rapidly growing capital of Chhattisgarh and gateway to ancient tribal craft corridors and Chitrakote Falls.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Chitrakote horseshoe waterfall in Chhattisgarh",
    hubStation: "Raipur Junction (R)",
    routeCount: 30,
    suggestedOrigin: "Nagpur",
    attractions: ["Swami Vivekananda Sarovar", "Chitrakote Falls Gateway", "Nandan Van Zoo", "Purkhauti Muktangan"]
  },
  {
    id: "gwalior",
    name: "Gwalior",
    state: "Madhya Pradesh",
    stateCode: "MP",
    isUnionTerritory: false,
    region: "central",
    category: "Heritage & Culture",
    description: "Historic stronghold dominated by the hilltop Gwalior Fort, Jai Vilas Palace, and classical musical roots.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    alt: "Hilltop sandstone fort ramparts of Gwalior",
    hubStation: "Gwalior Junction (GWL)",
    routeCount: 35,
    suggestedOrigin: "New Delhi",
    attractions: ["Gwalior Fort", "Jai Vilas Palace", "Teli Ka Mandir", "Tomb of Tansen"]
  },

  // ---------------- NORTHEAST INDIA (8) ----------------
  {
    id: "guwahati",
    name: "Guwahati",
    state: "Assam",
    stateCode: "AS",
    isUnionTerritory: false,
    region: "northeast",
    category: "Metro Hub",
    description: "Gateway to Northeast India flanking the mighty Brahmaputra river, revered for Kamakhya Temple.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    alt: "Broad Brahmaputra river with sunset skies in Guwahati",
    hubStation: "Guwahati Railway Station (GHY) / ISBT Betkuchi",
    routeCount: 38,
    trending: true,
    suggestedOrigin: "Kolkata",
    attractions: ["Kamakhya Temple", "Brahmaputra River Cruise", "Umananda Island", "Kaziranga Gateway"]
  },
  {
    id: "shillong",
    name: "Shillong & Cherrapunji",
    state: "Meghalaya",
    stateCode: "ML",
    isUnionTerritory: false,
    region: "northeast",
    category: "Nature & Hills",
    description: "Scotland of the East renowned for living root bridges, misty cloud canyons, and crystal-clear Dawki river.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Living root bridge suspended over pristine green forest stream in Meghalaya",
    hubStation: "Guwahati (transfer) / Shillong Bus Station",
    routeCount: 22,
    trending: true,
    suggestedOrigin: "Guwahati",
    attractions: ["Double Decker Living Root Bridge", "Nohkalikai Falls", "Umiam Lake", "Dawki River"]
  },
  {
    id: "kaziranga",
    name: "Kaziranga",
    state: "Assam",
    stateCode: "AS",
    isUnionTerritory: false,
    region: "northeast",
    category: "Wildlife & Safari",
    description: "UNESCO World Heritage national park sanctuary home to two-thirds of the world's great one-horned rhinoceroses.",
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
    alt: "One horned rhinoceros grazing in the tall grasslands of Kaziranga",
    hubStation: "Furkating (FKG) / Kohora Bus Stand",
    routeCount: 16,
    suggestedOrigin: "Guwahati",
    attractions: ["Elephant Safari", "Jeep Safari", "Kaziranga Orchid Park", "Brahmaputra Floodplains"]
  },
  {
    id: "tawang",
    name: "Tawang",
    state: "Arunachal Pradesh",
    stateCode: "AR",
    isUnionTerritory: false,
    region: "northeast",
    category: "Nature & Hills",
    description: "Breathtaking Himalayan high valley crowned by India's largest Buddhist monastery and Sela Pass.",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    alt: "Snow-covered Buddhist monastery perched high on a ridge in Tawang",
    hubStation: "Tezpur (transfer) / Tawang Bus Stand",
    routeCount: 12,
    suggestedOrigin: "Guwahati",
    attractions: ["Tawang Monastery", "Sela Pass", "Madhuri Lake", "Nuranang Falls"]
  },
  {
    id: "kohima",
    name: "Kohima",
    state: "Nagaland",
    stateCode: "NL",
    isUnionTerritory: false,
    region: "northeast",
    category: "Heritage & Culture",
    description: "Scenic capital of Nagaland hosting the renowned Hornbill Festival, Dzukou Valley trekking, and WW2 memorial.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Rolling green hills of Dzukou Valley near Kohima",
    hubStation: "Dimapur Railway Station (DMV) / Kohima Bus Stand",
    routeCount: 14,
    suggestedOrigin: "Guwahati",
    attractions: ["Hornbill Festival (Kisama)", "Dzukou Valley", "Kohima War Cemetery", "Khonoma Green Village"]
  },
  {
    id: "imphal",
    name: "Imphal",
    state: "Manipur",
    stateCode: "MN",
    isUnionTerritory: false,
    region: "northeast",
    category: "Heritage & Culture",
    description: "Cradle of Manipuri classical dance, Loktak Lake's floating phumdis, and Ima Keithel women's market.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    alt: "Scenic Loktak Lake with circular floating islands in Manipur",
    hubStation: "Imphal Bus Terminus / Bir Tikendrajit Airport",
    routeCount: 14,
    suggestedOrigin: "Guwahati",
    attractions: ["Loktak Lake & Keibul Lamjao", "Kangla Fort", "Ima Keithel Market", "INA Memorial"]
  },
  {
    id: "aizawl",
    name: "Aizawl",
    state: "Mizoram",
    stateCode: "MZ",
    isUnionTerritory: false,
    region: "northeast",
    category: "Nature & Hills",
    description: "Citadel of the hill people situated on towering ridges with distinct Mizo tribal hospitality and bamboo forests.",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80",
    alt: "Tiered hill city of Aizawl perched above mist-covered valleys",
    hubStation: "Silchar (transfer) / Aizawl Bus Terminal",
    routeCount: 12,
    suggestedOrigin: "Guwahati",
    attractions: ["Solomon's Temple", "Durtlang Hills", "Reiek Heritage Village", "Vantawng Falls"]
  },
  {
    id: "agartala",
    name: "Agartala",
    state: "Tripura",
    stateCode: "TR",
    isUnionTerritory: false,
    region: "northeast",
    category: "Heritage & Culture",
    description: "Royal capital of Tripura boasting Ujjayanta Palace, Neermahal lake palace, and rock-cut carvings at Unakoti.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    alt: "White grand palace of Ujjayanta reflected in palace lake in Agartala",
    hubStation: "Agartala Railway Station (AGTL)",
    routeCount: 16,
    suggestedOrigin: "Kolkata",
    attractions: ["Ujjayanta Palace", "Neermahal Water Palace", "Unakoti Rock Carvings", "Sepahijala Wildlife Sanctuary"]
  }
];

// ---------------- Helper Query Functions ----------------

export function getAllDestinations(): Destination[] {
  return DESTINATIONS;
}

export function getDestinationsByRegion(region: TourismRegion): Destination[] {
  return DESTINATIONS.filter((d) => d.region === region);
}

export function getDestinationsByState(stateCode: string): Destination[] {
  return DESTINATIONS.filter((d) => d.stateCode === stateCode);
}

export function searchDestinations(
  query: string,
  region?: TourismRegion | "all",
  stateCode?: string | "all",
  category?: DestinationCategory | "all"
): Destination[] {
  const q = query.toLowerCase().trim();

  return DESTINATIONS.filter((d) => {
    // Region filter
    if (region && region !== "all" && d.region !== region) return false;
    // State filter
    if (stateCode && stateCode !== "all" && d.stateCode !== stateCode) return false;
    // Category filter
    if (category && category !== "all" && d.category !== category) return false;

    // Search query match
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.hubStation.toLowerCase().includes(q) ||
      d.attractions.some((a) => a.toLowerCase().includes(q))
    );
  });
}

/**
 * Returns exact audit statistics for destinations in the catalogue
 */
export function getDestinationStats() {
  const uniqueStates = new Set<string>();
  const uniqueUTs = new Set<string>();

  DESTINATIONS.forEach((d) => {
    if (d.isUnionTerritory) {
      uniqueUTs.add(d.stateCode);
    } else {
      uniqueStates.add(d.stateCode);
    }
  });

  return {
    totalDestinations: DESTINATIONS.length,
    statesRepresented: uniqueStates.size,
    unionTerritoriesRepresented: uniqueUTs.size,
    totalEntitiesRepresented: uniqueStates.size + uniqueUTs.size, // 36 / 36
    all36Represented: uniqueStates.size === 28 && uniqueUTs.size === 8,
  };
}
