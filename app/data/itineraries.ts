export type Stop = {
  time: string;
  name: string;
  category: string;
  note: string;
  duration: string;
  mapUrl: string;
  address: string;
};

export type Itinerary = {
  id: string;
  title: string;
  tagline: string;
  city: string;
  country: string;
  duration: string;
  vibe: string[];
  coverEmoji: string;
  gradient: string;
  days: { label: string; stops: Stop[] }[];
};

export const ITINERARIES: Itinerary[] = [
  {
    id: "tokyo-introvert",
    title: "The Introvert's 48-Hour Tokyo Cafe Run",
    tagline: "Quiet corners, third-wave coffee, and zero tourist traps.",
    city: "Tokyo",
    country: "Japan",
    duration: "2 days",
    vibe: ["Minimal", "Cozy", "Solo"],
    coverEmoji: "🍵",
    gradient: "from-violet-950 to-indigo-900",
    days: [
      {
        label: "Day 1 — Shimokitazawa & Nakameguro",
        stops: [
          {
            time: "09:00",
            name: "Bear Pond Espresso",
            category: "Café",
            note: "Legendary espresso pulled to order. Cash only. Arrive early — they close once beans run out.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Bear+Pond+Espresso+Tokyo",
            address: "2-36-12 Kitazawa, Setagaya",
          },
          {
            time: "10:30",
            name: "Shimokitazawa Vintage Walk",
            category: "Explore",
            note: "Self-guided drift through the narrow lanes. No agenda. Let the record stores and bookshops pull you in.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Shimokitazawa+Tokyo",
            address: "Shimokitazawa, Setagaya-ku",
          },
          {
            time: "12:30",
            name: "Levain Bakery",
            category: "Lunch",
            note: "Natural-yeast loaves and small plates. Queue is worth it. Eat standing at the window.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Levain+Bakery+Shimokitazawa",
            address: "3-5-8 Kitazawa, Setagaya",
          },
          {
            time: "14:30",
            name: "Nakameguro Canal",
            category: "Stroll",
            note: "Walk north along the canal. Cherry blossoms in spring; moody grey reflections any other time. Both are perfect.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Nakameguro+Canal+Tokyo",
            address: "Nakameguro, Meguro-ku",
          },
          {
            time: "16:00",
            name: "Log Road Daikanyama",
            category: "Café",
            note: "Sit at Ivy Place with a flat white. Watch the city at half-speed.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Log+Road+Daikanyama+Tokyo",
            address: "Log Road Daikanyama, Daikanyama",
          },
          {
            time: "19:00",
            name: "Ramen Nagi",
            category: "Dinner",
            note: "Order at the vending machine. The niboshi (sardine) broth is polarising — which is the point.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Ramen+Nagi+Tokyo",
            address: "Golden Gai, Shinjuku-ku",
          },
        ],
      },
      {
        label: "Day 2 — Yanaka & Ueno",
        stops: [
          {
            time: "08:30",
            name: "Yanaka Ginza Morning Walk",
            category: "Explore",
            note: "Tokyo's last intact shitamachi neighbourhood. Cats on rooftops. Old women sweeping doorsteps. Zero tourists at this hour.",
            duration: "75 min",
            mapUrl: "https://maps.google.com/?q=Yanaka+Ginza+Tokyo",
            address: "Yanaka, Taito-ku",
          },
          {
            time: "10:00",
            name: "Kayaba Coffee",
            category: "Café",
            note: "Retro kissaten in a 1938 townhouse. Get the egg toast and a hot milk coffee. Sit for as long as you like.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Kayaba+Coffee+Yanaka+Tokyo",
            address: "6-1-29 Yanaka, Taito-ku",
          },
          {
            time: "12:00",
            name: "Yanaka Cemetery",
            category: "Wander",
            note: "Sounds morbid. It's serene. Pagodas, moss, silence. A genuinely good place to think.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Yanaka+Cemetery+Tokyo",
            address: "7-5-24 Yanaka, Taito-ku",
          },
          {
            time: "14:00",
            name: "Tokyo National Museum",
            category: "Culture",
            note: "Go straight to the Honkan building. Japanese antiquities only. Skip the rest.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Tokyo+National+Museum",
            address: "13-9 Uenokoen, Taito-ku",
          },
          {
            time: "17:00",
            name: "Fuglen Tokyo",
            category: "Café",
            note: "Oslo-imported coffee shop. Best pour-over in the city. Transitions to cocktail bar at night.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Fuglen+Tokyo",
            address: "1-16-11 Tomigaya, Shibuya-ku",
          },
        ],
      },
    ],
  },
  {
    id: "berlin-brutalist",
    title: "Brutalist Architecture & Street Food in Berlin",
    tagline: "Raw concrete, döner at midnight, and the city's obsession with the ugly-beautiful.",
    city: "Berlin",
    country: "Germany",
    duration: "2 days",
    vibe: ["Urban", "Edgy", "Architecture"],
    coverEmoji: "🏗️",
    gradient: "from-zinc-900 to-stone-900",
    days: [
      {
        label: "Day 1 — Mitte & Alexanderplatz",
        stops: [
          {
            time: "10:00",
            name: "Palace of the Republic (ruins site)",
            category: "Architecture",
            note: "The demolition site and the Humboldt Forum that replaced it. Study both. Argue about which was right.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Humboldt+Forum+Berlin",
            address: "Schloßplatz, 10178 Berlin",
          },
          {
            time: "11:30",
            name: "Alexanderplatz & Fernsehturm",
            category: "Architecture",
            note: "GDR urbanism at maximum scale. The TV tower is 368m of pure state ambition. Don't go up — look up.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Alexanderplatz+Berlin",
            address: "Alexanderplatz, 10178 Berlin",
          },
          {
            time: "13:00",
            name: "Mustafa's Gemüse Kebap",
            category: "Lunch",
            note: "The queue is real. It's worth it. The vegetable döner changed what döner could be.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Mustafa's+Gemuse+Kebap+Berlin",
            address: "Mehringdamm 32, 10961 Berlin",
          },
          {
            time: "15:00",
            name: "Modulor Kaufhaus",
            category: "Shop",
            note: "Five floors of art supplies, architecture books, and model materials. A legitimate pilgrimage.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Modulor+Berlin",
            address: "Prinzenstraße 85, 10969 Berlin",
          },
          {
            time: "17:00",
            name: "East Side Gallery",
            category: "Culture",
            note: "1.3km of original Wall sections. Go at golden hour. The murals hit differently when the light is low.",
            duration: "75 min",
            mapUrl: "https://maps.google.com/?q=East+Side+Gallery+Berlin",
            address: "Mühlenstraße 3-100, 10243 Berlin",
          },
          {
            time: "20:00",
            name: "Hops & Barley",
            category: "Dinner",
            note: "Prenzlauer Berg craft brewery in a former butcher's shop. Drink the dark wheat. Eat the pretzels.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Hops+and+Barley+Berlin",
            address: "Wühlischstraße 22/23, 10245 Berlin",
          },
        ],
      },
      {
        label: "Day 2 — Märkisches Viertel & Tempelhof",
        stops: [
          {
            time: "10:00",
            name: "Märkisches Viertel Estate",
            category: "Architecture",
            note: "60,000-resident social housing megaproject from the 1960s. Bring a camera. Most tourists never find this.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Markisches+Viertel+Berlin",
            address: "Märkisches Viertel, 13435 Berlin",
          },
          {
            time: "13:00",
            name: "Tempelhof Airport Field",
            category: "Explore",
            note: "A decommissioned Nazi-era airport that is now a park. The runway still exists. You can cycle it.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Tempelhofer+Feld+Berlin",
            address: "Tempelhofer Damm, 12101 Berlin",
          },
          {
            time: "15:30",
            name: "Vollpension",
            category: "Café",
            note: "Grandma-run café — literally staffed by senior citizens. The cake counter makes no compromises.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Vollpension+Berlin",
            address: "Sophienstraße 24, 10178 Berlin",
          },
          {
            time: "18:00",
            name: "Kulturbrauerei",
            category: "Architecture",
            note: "A 19th-century brewery complex repurposed as a cultural campus. The redbrick against a purple sky.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Kulturbrauerei+Berlin",
            address: "Schönhauser Allee 36, 10435 Berlin",
          },
        ],
      },
    ],
  },
  {
    id: "bali-digital-nomad",
    title: "Bali for the Laptop-Free Weekend",
    tagline: "Canggu without the coworking spaces. Actually switch off.",
    city: "Bali",
    country: "Indonesia",
    duration: "2 days",
    vibe: ["Tropical", "Slow", "Aesthetic"],
    coverEmoji: "🌴",
    gradient: "from-emerald-950 to-teal-900",
    days: [
      {
        label: "Day 1 — Ubud Interior",
        stops: [
          {
            time: "06:30",
            name: "Campuhan Ridge Walk",
            category: "Nature",
            note: "Do this at sunrise before the heat. The ridge cuts between two river valleys. Pure green silence.",
            duration: "75 min",
            mapUrl: "https://maps.google.com/?q=Campuhan+Ridge+Walk+Ubud+Bali",
            address: "Jl. Raya Sanggingan, Ubud",
          },
          {
            time: "08:30",
            name: "Seniman Coffee Studio",
            category: "Café",
            note: "Best single-origin in Ubud. Order the Kintamani natural process. Sit outside on the rice field terrace.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Seniman+Coffee+Studio+Ubud",
            address: "Jl. Sri Wedari No.5, Ubud",
          },
          {
            time: "11:00",
            name: "Tegalalang Rice Terraces",
            category: "Nature",
            note: "Go mid-morning on a weekday. The famous swing photos are a trap — walk down into the terraces instead.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Tegalalang+Rice+Terraces+Bali",
            address: "Tegalalang, Gianyar Regency",
          },
          {
            time: "14:00",
            name: "Warung Babi Guling Ibu Oka",
            category: "Lunch",
            note: "Ubud's institution. Suckling pig on rice with crackling and lawar. Plastic chairs. Perfection.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Babi+Guling+Ibu+Oka+Ubud",
            address: "Jl. Suweta No.2, Ubud",
          },
          {
            time: "16:00",
            name: "Pura Tirta Empul",
            category: "Culture",
            note: "Holy spring temple. Participate in the purification ritual if you're open to it. Respectful dress required.",
            duration: "75 min",
            mapUrl: "https://maps.google.com/?q=Pura+Tirta+Empul+Bali",
            address: "Jl. Tirta, Tampaksiring",
          },
          {
            time: "19:30",
            name: "Locavore",
            category: "Dinner",
            note: "Indonesia's best restaurant. Book three weeks ahead. 7-course tasting menu of hyper-local ingredients.",
            duration: "120 min",
            mapUrl: "https://maps.google.com/?q=Locavore+Restaurant+Ubud",
            address: "Jl. Dewisita No.10, Ubud",
          },
        ],
      },
      {
        label: "Day 2 — Canggu Coast",
        stops: [
          {
            time: "07:00",
            name: "Batu Bolong Beach Sunrise",
            category: "Nature",
            note: "The one beach in Canggu that still has some soul in the morning. Surfers, fishermen, temple smoke.",
            duration: "60 min",
            mapUrl: "https://maps.google.com/?q=Batu+Bolong+Beach+Canggu+Bali",
            address: "Jl. Pantai Batu Bolong, Canggu",
          },
          {
            time: "09:00",
            name: "Revolver Espresso",
            category: "Café",
            note: "Laneway café, Melbourne-coded. Order a long black. Watch Canggu wake up.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Revolver+Espresso+Bali",
            address: "Gang Tonggol No.8, Seminyak",
          },
          {
            time: "11:00",
            name: "Pura Tanah Lot",
            category: "Culture",
            note: "Go at low tide. The sea temple on the rock is everything. Arrive before noon before the tour buses.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Tanah+Lot+Temple+Bali",
            address: "Beraban, Kediri, Tabanan Regency",
          },
          {
            time: "14:30",
            name: "Ji Restaurant",
            category: "Lunch",
            note: "Padang-style food, self-serve. Point at what you want. Sambal matah changes everything.",
            duration: "45 min",
            mapUrl: "https://maps.google.com/?q=Ji+Restaurant+Canggu+Bali",
            address: "Jl. Pantai Berawa, Canggu",
          },
          {
            time: "17:30",
            name: "Old Man's Sunset",
            category: "Social",
            note: "Reliably good sunset view. Order a Bintang. Watch the surfers on the last waves. You earned this.",
            duration: "90 min",
            mapUrl: "https://maps.google.com/?q=Old+Man's+Canggu+Bali",
            address: "Jl. Pantai Batu Bolong, Canggu",
          },
        ],
      },
    ],
  },
];

export const FEATURED_ID = "tokyo-introvert";
