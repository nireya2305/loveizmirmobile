export type Boat = {
  key: string;
  title: string;
  type: string;
  capacity: string;
  location: string;
  priceFrom: string;
  features: string[];
  image: number;
};

export const BOATS: Boat[] = [
  {
    key: "yacht-cesme",
    title: "Premium Motor Yat",
    type: "Motor Yat · 22m",
    capacity: "12 kişi · Günlük",
    location: "Çeşme Marina",
    priceFrom: "€1.800/gün",
    features: ["Kaptan dahil", "Yakıt hariç", "İkindi turu", "Sun-deck"],
    image: 0,
  },
  {
    key: "gulet-foca",
    title: "Geleneksel Gulet",
    type: "Tipik Bodrum guleti · 18m",
    capacity: "10 kişi · Günlük/Hafta",
    location: "Foça Limanı",
    priceFrom: "€950/gün",
    features: ["Mavi tur", "Aşçı dahil", "Snorkel ekipmanı", "3-7 gün"],
    image: 1,
  },
  {
    key: "sailing-urla",
    title: "Yelkenli Charter",
    type: "Beneteau yelkenli · 14m",
    capacity: "6 kişi · Günlük",
    location: "Urla Marina",
    priceFrom: "€680/gün",
    features: ["Skipper opsiyonel", "Bareboat", "Rüzgar Karaburun rotası"],
    image: 0,
  },
  {
    key: "speed-cesme",
    title: "Sürat Teknesi",
    type: "Sürat teknesi · 8m",
    capacity: "8 kişi · Saatlik",
    location: "Alaçatı",
    priceFrom: "€180/saat",
    features: ["Saatlik kira", "Koy turu", "Sportif", "Su sporları"],
    image: 1,
  },
];

export type Car = {
  key: string;
  title: string;
  segment: string;
  transmission: string;
  fuel: string;
  priceFrom: string;
  features: string[];
};

export const CARS: Car[] = [
  {
    key: "economy",
    title: "Ekonomik Sınıf",
    segment: "Fiat Egea / Renault Clio",
    transmission: "Manuel/Otomatik",
    fuel: "Dizel",
    priceFrom: "€28/gün",
    features: ["Sınırsız km", "Klima", "Tam kasko", "ADB teslim"],
  },
  {
    key: "compact-suv",
    title: "Kompakt SUV",
    segment: "Dacia Duster / VW T-Roc",
    transmission: "Otomatik",
    fuel: "Dizel/Benzin",
    priceFrom: "€45/gün",
    features: ["Cam tavan", "Geniş bagaj", "Tam kasko", "GPS"],
  },
  {
    key: "premium",
    title: "Premium Sedan",
    segment: "BMW 3 / Mercedes C",
    transmission: "Otomatik",
    fuel: "Dizel hybrid",
    priceFrom: "€95/gün",
    features: ["Deri döşeme", "Adaptive cruise", "VIP teslim", "Şoför opsiyonel"],
  },
  {
    key: "convertible",
    title: "Cabrio Yaz Aracı",
    segment: "Mini Cabrio / BMW 4 Cabrio",
    transmission: "Otomatik",
    fuel: "Benzin",
    priceFrom: "€130/gün",
    features: ["Açık tavan", "Çeşme sahil yolu", "Yaz teması", "Apple CarPlay"],
  },
  {
    key: "minivan",
    title: "Aile Minivan",
    segment: "VW Caravelle / Mercedes Vito",
    transmission: "Otomatik",
    fuel: "Dizel",
    priceFrom: "€110/gün",
    features: ["7-9 kişilik", "Çocuk koltuğu", "Bagaj geniş", "Grup transfer"],
  },
  {
    key: "vip-transfer",
    title: "VIP Şoförlü Transfer",
    segment: "Mercedes V-Class / S-Class",
    transmission: "Otomatik",
    fuel: "Hybrid",
    priceFrom: "€85/transfer",
    features: ["İngilizce şoför", "ADB → Çeşme", "Karşılama", "Wi-Fi"],
  },
];

export type Stay = {
  key: string;
  title: string;
  type: string;
  location: string;
  beds: string;
  priceFrom: string;
  features: string[];
  image: number;
};

export const STAYS: Stay[] = [
  {
    key: "kordon-loft",
    title: "Kordon Sahil Loft",
    type: "Daire · 75 m²",
    location: "Alsancak · Kordon",
    beds: "2 yatak · 4 misafir",
    priceFrom: "€85/gece",
    features: ["Deniz manzaralı balkon", "Yürüyerek sahil", "Klima", "Hızlı Wi-Fi"],
    image: 0,
  },
  {
    key: "alacati-stone",
    title: "Alaçatı Taş Ev",
    type: "Müstakil ev · 110 m²",
    location: "Alaçatı merkez",
    beds: "3 yatak · 6 misafir",
    priceFrom: "€220/gece",
    features: ["Avlu & barbekü", "Bisiklet dahil", "Otantik dekor", "Yürüyerek bar sokağı"],
    image: 1,
  },
  {
    key: "cesme-villa-pool",
    title: "Çeşme Havuzlu Villa",
    type: "Villa · 250 m²",
    location: "Çeşme · Reisdere",
    beds: "4 yatak · 8 misafir",
    priceFrom: "€480/gece",
    features: ["Özel havuz", "Sea view", "BBQ deck", "Temizlik dahil"],
    image: 2,
  },
  {
    key: "urla-vineyard-house",
    title: "Urla Bağ Evi",
    type: "Köy evi · 90 m²",
    location: "Urla · Kuşçular",
    beds: "2 yatak · 4 misafir",
    priceFrom: "€140/gece",
    features: ["Bağ manzarası", "Şömine", "Şarap tadımı", "Sessiz çevre"],
    image: 1,
  },
  {
    key: "konak-historic",
    title: "Konak Tarihi Daire",
    type: "Daire · 60 m²",
    location: "Konak · Kemeraltı yakın",
    beds: "1 yatak · 2 misafir",
    priceFrom: "€55/gece",
    features: ["Çarşı yanı", "Tramvay/Metro", "Bütçe dostu", "Tarihi bina"],
    image: 0,
  },
  {
    key: "karsiyaka-marina",
    title: "Karşıyaka Marina Suite",
    type: "Rezidans · 85 m²",
    location: "Karşıyaka · Bostanlı",
    beds: "2 yatak · 4 misafir",
    priceFrom: "€95/gece",
    features: ["Marina manzarası", "Site spa & havuz", "Vapur iskelesi yanı", "Family"],
    image: 0,
  },
];

export type ListingCategory =
  | "boat"
  | "car"
  | "stay"
  | "tour"
  | "real-estate"
  | "restaurant"
  | "service";

export const LISTING_CATEGORIES: { key: ListingCategory; label: string }[] = [
  { key: "boat", label: "Tekne Kiralama" },
  { key: "car", label: "Araç Kiralama" },
  { key: "stay", label: "Günlük Konaklama" },
  { key: "tour", label: "Tur Operatörü" },
  { key: "real-estate", label: "Emlak / Satılık" },
  { key: "restaurant", label: "Restoran / Mekan" },
  { key: "service", label: "Diğer Hizmet" },
];
