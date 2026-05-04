export type DealType = "buy" | "rent";
export type PropertyType = "apartment" | "house" | "townhouse" | "penthouse" | "commercial" | "land";
export type Status = "available" | "reserved" | "sold";
export type DistrictKey =
  | "arcadia" | "center" | "fontan" | "tairova" | "cheryomushki"
  | "moldavanka" | "frenchBlvd" | "lanzheron" | "otrada" | "sovinyon"
  | "kotovskoho" | "nearSea";

export type FeatureKey = "seaview" | "parking" | "balcony" | "renovation" | "furnished" | "elevator" | "newBuild" | "resale";
export type PurposeKey = "living" | "family" | "investment" | "rental" | "sea" | "business";
export type BadgeKey = "new" | "premium" | "seaview" | "investment" | "nearSea";

export interface Property {
  id: string;
  titleKey: { uk: string; en: string; ro: string };
  deal: DealType;
  type: PropertyType;
  district: DistrictKey;
  price: number;        // EUR (rent = monthly)
  currency: "EUR";
  rooms: number;        // 0 = studio
  area: number;         // m²
  floor?: number;
  totalFloors?: number;
  status: Status;
  badges: BadgeKey[];
  features: FeatureKey[];
  purpose: PurposeKey[];
  description: { uk: string; en: string; ro: string };
  images: string[];
  createdAt: string;    // ISO
}

export const ALL_DISTRICTS: DistrictKey[] = [
  "arcadia", "center", "fontan", "tairova", "cheryomushki",
  "moldavanka", "frenchBlvd", "lanzheron", "otrada", "sovinyon",
  "kotovskoho", "nearSea",
];

export const ALL_TYPES: PropertyType[] = ["apartment", "house", "townhouse", "penthouse", "commercial", "land"];

const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Curated Unsplash photo IDs (real estate / interiors / architecture)
const IMG = {
  living1:  img("1502672260266-1c1ef2d93688"),
  living2:  img("1505691938895-1758d7feb511"),
  apt1:     img("1568605114967-8130f3a36994"),
  apt2:     img("1493809842364-78817add7ffb"),
  bedroom:  img("1560448204-e02f11c3d0e2"),
  kitchen:  img("1556909114-f6e7ad7d3136"),
  house1:   img("1600585154340-be6161a56a0c"),
  house2:   img("1564013799919-ab600027ffc6"),
  villa:    img("1613490493576-7fde63acd811"),
  modern:   img("1600596542815-ffad4c1539a9"),
  loft:     img("1493809842364-78817add7ffb"),
  pent:     img("1600607687939-ce8a6c25118c"),
  terrace:  img("1600210492486-724fe5c67fb0"),
  commerc:  img("1497366216548-37526070297c"),
  office:   img("1497366811353-6870744d04b2"),
  land:     img("1500382017468-9049fed747ef"),
  town:     img("1605276374104-dee2a0ed3cd6"),
  sea:      img("1507525428034-b723cf961d3e"),
  bright:   img("1502005229762-cf1b2da7c5d6"),
};

const make = (
  id: string,
  uk: string, en: string, ro: string,
  deal: DealType, type: PropertyType, district: DistrictKey,
  price: number, rooms: number, area: number,
  opts: Partial<Property> = {}
): Property => ({
  id,
  titleKey: { uk, en, ro },
  deal, type, district, price, currency: "EUR", rooms, area,
  status: opts.status ?? "available",
  badges: opts.badges ?? [],
  features: opts.features ?? [],
  purpose: opts.purpose ?? ["living"],
  description: opts.description ?? {
    uk: "Сучасний об’єкт у затребуваному районі Одеси з продуманим плануванням і якісним оздобленням.",
    en: "A well-planned property in a sought-after Odesa district with quality finishes and comfortable layout.",
    ro: "Proprietate bine gândită într-o zonă căutată din Odesa, cu finisaje de calitate și un plan confortabil.",
  },
  images: opts.images ?? [IMG.living1, IMG.bedroom, IMG.kitchen],
  createdAt: opts.createdAt ?? "2026-04-15",
  floor: opts.floor,
  totalFloors: opts.totalFloors,
});

export const PROPERTIES: Property[] = [
  make("ar-201", "Світла 2-кімнатна квартира з виглядом на парк", "Bright 2-room apartment with park view", "Apartament luminos cu 2 camere, vedere la parc",
    "buy", "apartment", "arcadia", 119000, 2, 64,
    { floor: 6, totalFloors: 12, badges: ["premium", "nearSea"], features: ["balcony", "renovation", "elevator", "newBuild"], purpose: ["living", "investment", "sea"],
      images: [IMG.apt1, IMG.living2, IMG.bedroom], createdAt: "2026-04-22" }),
  make("ar-305", "3-кімнатна квартира за 5 хвилин до моря", "3-room apartment 5 minutes from the sea", "Apartament cu 3 camere, 5 minute de mare",
    "buy", "apartment", "arcadia", 165000, 3, 86,
    { floor: 4, totalFloors: 9, badges: ["seaview", "nearSea"], features: ["seaview", "balcony", "elevator", "renovation"], purpose: ["living", "family", "sea"],
      images: [IMG.living1, IMG.kitchen, IMG.bedroom], createdAt: "2026-04-10" }),
  make("ce-101", "Квартира в історичному центрі з високими стелями", "Apartment in the historic center with high ceilings", "Apartament în centrul istoric, cu tavane înalte",
    "buy", "apartment", "center", 98000, 2, 58,
    { floor: 3, totalFloors: 5, badges: ["premium"], features: ["balcony", "renovation"], purpose: ["living", "investment"],
      images: [IMG.bright, IMG.living2, IMG.kitchen], createdAt: "2026-03-28" }),
  make("ce-410", "Студія в самому центрі Одеси", "Studio in the heart of Odesa", "Studio în inima orașului Odesa",
    "rent", "apartment", "center", 480, 0, 32,
    { floor: 4, totalFloors: 6, badges: ["new"], features: ["furnished", "elevator", "renovation"], purpose: ["living", "rental"],
      images: [IMG.modern, IMG.bedroom, IMG.kitchen], createdAt: "2026-04-25" }),
  make("fb-220", "Квартира на Французькому бульварі", "Apartment on French Boulevard", "Apartament pe Bulevardul Francez",
    "buy", "apartment", "frenchBlvd", 189000, 3, 92,
    { floor: 7, totalFloors: 16, badges: ["premium", "seaview"], features: ["seaview", "parking", "balcony", "elevator", "newBuild"], purpose: ["living", "investment", "sea"],
      images: [IMG.pent, IMG.living1, IMG.terrace], createdAt: "2026-04-18" }),
  make("fo-115", "Будинок у Великому Фонтані", "House in Velyky Fontan", "Casă în zona Fontan",
    "buy", "house", "fontan", 320000, 5, 220,
    { badges: ["premium", "nearSea"], features: ["parking", "renovation", "balcony"], purpose: ["family", "living", "sea"],
      images: [IMG.house1, IMG.living2, IMG.house2], createdAt: "2026-04-02" }),
  make("ta-088", "Квартира в новобудові на Таїрова", "New-build apartment in Tairova", "Apartament nou în Tairova",
    "buy", "apartment", "tairova", 72000, 2, 56,
    { floor: 8, totalFloors: 16, badges: ["new"], features: ["elevator", "newBuild", "balcony"], purpose: ["living", "investment", "family"],
      images: [IMG.modern, IMG.kitchen, IMG.bedroom], createdAt: "2026-04-26" }),
  make("ch-145", "Сімейна квартира на Черемушках", "Family apartment in Cheryomushki", "Apartament familial în Cheryomushki",
    "buy", "apartment", "cheryomushki", 64000, 3, 70,
    { floor: 5, totalFloors: 9, features: ["balcony", "elevator", "resale"], purpose: ["family", "living"],
      images: [IMG.apt2, IMG.living2, IMG.bedroom], createdAt: "2026-03-20" }),
  make("mo-070", "Затишна 1-кімнатна на Молдаванці", "Cozy 1-room apartment in Moldavanka", "Apartament cu o cameră în Moldavanka",
    "rent", "apartment", "moldavanka", 320, 1, 38,
    { floor: 2, totalFloors: 4, features: ["furnished", "renovation"], purpose: ["living", "rental"],
      images: [IMG.bright, IMG.kitchen, IMG.bedroom], createdAt: "2026-04-12" }),
  make("la-330", "Пентхаус біля Ланжерону", "Penthouse near Lanzheron", "Penthouse lângă Lanzheron",
    "buy", "penthouse", "lanzheron", 420000, 4, 180,
    { floor: 16, totalFloors: 16, badges: ["premium", "seaview", "nearSea"], features: ["seaview", "parking", "elevator", "balcony", "renovation"], purpose: ["living", "investment", "sea"],
      images: [IMG.pent, IMG.terrace, IMG.living1], createdAt: "2026-04-05" }),
  make("ot-402", "Будинок в Отраді з власним подвір’ям", "House in Otrada with private yard", "Casă în Otrada cu curte privată",
    "buy", "house", "otrada", 540000, 6, 320,
    { badges: ["premium", "nearSea"], features: ["parking", "renovation", "balcony"], purpose: ["family", "living"],
      images: [IMG.villa, IMG.house1, IMG.living1], createdAt: "2026-03-30", status: "reserved" }),
  make("so-501", "Таунхаус у Совіньйоні", "Townhouse in Sovinyon", "Townhouse în Sovinyon",
    "buy", "townhouse", "sovinyon", 285000, 4, 160,
    { badges: ["premium"], features: ["parking", "balcony", "newBuild"], purpose: ["family", "living", "sea"],
      images: [IMG.town, IMG.living2, IMG.kitchen], createdAt: "2026-04-08" }),
  make("ko-090", "Квартира на Селищі Котовського", "Apartment in Kotovskoho area", "Apartament în zona Kotovskoho",
    "rent", "apartment", "kotovskoho", 280, 2, 50,
    { floor: 3, totalFloors: 9, features: ["balcony", "elevator", "furnished"], purpose: ["living", "rental", "family"],
      images: [IMG.apt2, IMG.kitchen, IMG.bedroom], createdAt: "2026-04-14" }),
  make("ce-700", "Комерційне приміщення в центрі", "Commercial space in the city center", "Spațiu comercial în centru",
    "rent", "commercial", "center", 1800, 0, 120,
    { badges: ["investment"], features: ["renovation"], purpose: ["business", "investment"],
      images: [IMG.commerc, IMG.office, IMG.bright], createdAt: "2026-04-19" }),
  make("so-land", "Ділянка під забудову в Совіньйоні", "Buildable land plot in Sovinyon", "Teren pentru construcție în Sovinyon",
    "buy", "land", "sovinyon", 95000, 0, 800,
    { badges: ["investment"], features: [], purpose: ["investment"],
      images: [IMG.land, IMG.house2, IMG.villa], createdAt: "2026-03-12" }),
  make("ar-r10", "2-кімнатна на оренду в Аркадії", "2-room apartment for rent in Arcadia", "Apartament cu 2 camere de închiriat în Arcadia",
    "rent", "apartment", "arcadia", 750, 2, 60,
    { floor: 9, totalFloors: 16, badges: ["nearSea", "new"], features: ["seaview", "balcony", "elevator", "furnished"], purpose: ["living", "rental", "sea"],
      images: [IMG.modern, IMG.bedroom, IMG.living1], createdAt: "2026-04-27" }),
  make("fb-r12", "Квартира на оренду на Французькому", "Apartment for rent on French Boulevard", "Apartament de închiriat pe Bulevardul Francez",
    "rent", "apartment", "frenchBlvd", 950, 3, 88,
    { floor: 6, totalFloors: 12, badges: ["premium"], features: ["balcony", "elevator", "furnished", "renovation"], purpose: ["living", "rental", "family"],
      images: [IMG.living2, IMG.kitchen, IMG.bedroom], createdAt: "2026-04-21" }),
  make("ot-150", "Будинок з виходом до моря", "House with sea access", "Casă cu acces la mare",
    "buy", "house", "nearSea", 690000, 5, 280,
    { badges: ["premium", "seaview", "nearSea"], features: ["seaview", "parking", "balcony", "renovation"], purpose: ["family", "living", "sea", "investment"],
      images: [IMG.villa, IMG.sea, IMG.house1], createdAt: "2026-04-01" }),
  make("ce-205", "Сучасна 1-кімнатна в центрі", "Modern 1-room apartment in center", "Apartament modern cu o cameră în centru",
    "buy", "apartment", "center", 56000, 1, 42,
    { floor: 5, totalFloors: 7, badges: ["new"], features: ["renovation", "balcony", "newBuild"], purpose: ["living", "investment", "rental"],
      images: [IMG.modern, IMG.kitchen, IMG.bright], createdAt: "2026-04-24" }),
];

export const FEATURED_IDS = ["fb-220", "ar-305", "la-330", "fo-115", "ar-201", "so-501"];

export const formatPrice = (p: Property, locale: string) => {
  const fmt = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : locale === "ro" ? "ro-RO" : "en-US", {
    style: "currency", currency: "EUR", maximumFractionDigits: 0,
  });
  const base = fmt.format(p.price);
  return p.deal === "rent" ? `${base}/mo` : base;
};
