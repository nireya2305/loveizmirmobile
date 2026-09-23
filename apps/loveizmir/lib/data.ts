export type Transport = {
  key: string;
  title: string;
  titleEn: string;
  code?: string;
  description: string;
  tips: string[];
  icon: "navigation" | "map-pin" | "anchor" | "truck";
};

export const TRANSPORT: Transport[] = [
  {
    key: "adb",
    title: "Adnan Menderes Havalimanı",
    titleEn: "Adnan Menderes Airport",
    code: "ADB",
    description:
      "İzmir'in ana uluslararası havalimanı, şehir merkezine yaklaşık 18 km. İZBAN banliyö treni ile 25 dakikada Alsancak.",
    tips: [
      "İZBAN treni: Havalimanı → Alsancak ~25 dk, ucuz",
      "HAVAŞ otobüsü: Alsancak / Konak hattı düzenli",
      "Taksi: Merkez yaklaşık 200-300 TL",
      "Rent-a-car: Tüm büyük firmalar terminalde",
    ],
    icon: "navigation",
  },
  {
    key: "alsancak",
    title: "Alsancak Garı & Basmane",
    titleEn: "Alsancak & Basmane Stations",
    description:
      "Şehirlerarası ve banliyö tren ağının kalbi. Basmane tarihi gar, Alsancak modern aktarma merkezi.",
    tips: [
      "İZBAN: ADB → Aliağa hattı, 6 dk arayla",
      "İzmir-Ankara Mavi Tren: Basmane",
      "Metro bağlantısı: Halkapınar aktarma",
      "Basmane çevresi bütçe oteller bölgesi",
    ],
    icon: "map-pin",
  },
  {
    key: "otogar",
    title: "İzmir Otogarı (Pınarbaşı)",
    titleEn: "İzmir Bus Terminal",
    description:
      "Türkiye'nin her şehrine otobüs seferleri. Metro ile merkeze 20 dakika.",
    tips: [
      "Metro: Otogar → Halkapınar aktarma → Konak",
      "Ücretsiz servis: Çoğu firma merkeze",
      "Çeşme/Urla için ayrıca Üçkuyular'dan dolmuş",
    ],
    icon: "truck",
  },
  {
    key: "liman",
    title: "Alsancak Limanı & Feribot",
    titleEn: "Alsancak Port & Ferry",
    description:
      "Körfez vapurları ve kruvaziyer terminali. Konak ↔ Karşıyaka deniz yolu efsanevi.",
    tips: [
      "Körfez vapuru: Konak ↔ Karşıyaka ~20 dk",
      "Üçkuyular ↔ Bostanlı arabalı vapur",
      "Yaz aylarında kruvaziyer turları",
    ],
    icon: "anchor",
  },
];

export type District = {
  key: string;
  title: string;
  titleEn: string;
  distance: string;
  description: string;
  highlights: string[];
  image: number;
  lat: number;
  lng: number;
};

export const DISTRICTS: District[] = [
  {
    key: "cesme",
    title: "Çeşme & Alaçatı",
    titleEn: "Cesme & Alacati",
    distance: "85 km · 1 sa",
    description:
      "Beyaz taş evler, ünlü plajlar, butik oteller ve rüzgar sörfü cenneti. Yaz turizminin başkenti.",
    highlights: ["Ilıca Plajı", "Alaçatı Sokakları", "Çeşme Kalesi", "Wind sörfü"],
    image: require("../assets/images/cesme-alacati.png"),
    lat: 38.3239,
    lng: 26.3019,
  },
  {
    key: "urla",
    title: "Urla",
    titleEn: "Urla",
    distance: "40 km · 35 dk",
    description:
      "Bağ rotaları, sanatçı atölyeleri, balıkçı limanı ve gastronomi köyleri. Yeni nesil İzmir'in kalbi.",
    highlights: ["Bağ Yolu", "Klazomenai antik kenti", "Limantepe", "Balık restoranları"],
    image: require("../assets/images/urla-marina.png"),
    lat: 38.3225,
    lng: 26.7644,
  },
  {
    key: "foca",
    title: "Foça",
    titleEn: "Foca",
    distance: "70 km · 1 sa",
    description:
      "Antik Phokaia, balıkçı tekneleri, Akdeniz fokları. Kalabalıktan uzak, otantik Ege.",
    highlights: ["Eski Foça limanı", "Siren Kayalıkları", "Foça Kalesi", "Tekne turu"],
    image: require("../assets/images/foca.png"),
    lat: 38.6694,
    lng: 26.7572,
  },
  {
    key: "selcuk",
    title: "Selçuk & Efes",
    titleEn: "Selcuk & Ephesus",
    distance: "75 km · 1 sa",
    description:
      "UNESCO Dünya Mirası Efes antik kenti, Meryem Ana Evi ve Şirince köyü. Tarih buradan başlar.",
    highlights: ["Efes Antik Kenti", "Celcus Kütüphanesi", "Meryem Ana", "İsa Bey Camii"],
    image: require("../assets/images/ephesus.png"),
    lat: 37.9514,
    lng: 27.3661,
  },
  {
    key: "sirince",
    title: "Şirince",
    titleEn: "Sirince",
    distance: "80 km · 1 sa 10 dk",
    description:
      "Taş evli dağ köyü, meyve şarapları, sakin atölyeler. Romantik bir kaçamak için ideal.",
    highlights: ["Şarap tadımı", "Taş evler", "Matematik köyü", "Yöresel mutfak"],
    image: require("../assets/images/sirince.png"),
    lat: 37.9472,
    lng: 27.4239,
  },
  {
    key: "karaburun",
    title: "Karaburun",
    titleEn: "Karaburun",
    distance: "100 km · 1 sa 30 dk",
    description:
      "İzmir'in en bakir yarımadası. Saklı koylar, zeytinlikler, taze deniz ürünleri.",
    highlights: ["Mordoğan", "Sarpıncık feneri", "Saklı koylar", "Enginar festivali"],
    image: require("../assets/images/karaburun.png"),
    lat: 38.6383,
    lng: 26.5111,
  },
];

export type MustDo = {
  key: string;
  title: string;
  emoji: string;
  description: string;
};

export const MUST_DO: MustDo[] = [
  { key: "boyoz", title: "Boyoz & Süt Kakao", emoji: "🥐", description: "Sabah Dönertaş'ta sıcak boyoz, yanında soğuk süt kakao — İzmir'in efsane kahvaltısı." },
  { key: "kumru", title: "Çeşme Kumrusu", emoji: "🥪", description: "Çeşme'nin tulum peyniri, domates, sucuk içeren ekmeği — bir kez deneyince unutulmaz." },
  { key: "vapur", title: "Körfez Vapuru", emoji: "⛴️", description: "Konak'tan Karşıyaka'ya vapurla geçiş — martılar, çay ve gün batımı eşliğinde." },
  { key: "asansor", title: "Tarihi Asansör", emoji: "🛗", description: "Karataş'taki tarihi asansörle yukarı çıkıp İzmir manzarasını kuş bakışı izle." },
  { key: "kemeralti", title: "Kemeraltı Çarşısı", emoji: "🛍️", description: "Tarihi çarşının labirent sokaklarında baharatçılar, hanlar ve Kızlarağası Hanı." },
  { key: "rakim", title: "Meze & Rakı Akşamı", emoji: "🍶", description: "Alsancak'ta veya Urla'da meze çeşitleriyle rakı sofrası — Ege ritüeli." },
  { key: "sahil", title: "Kordon'da Bisiklet", emoji: "🚲", description: "Bostanlı'dan Konak'a kadar uzanan sahil bisiklet yolu, gün batımına kadar." },
  { key: "agora", title: "Smyrna Agorası", emoji: "🏛️", description: "Şehrin tam ortasında 2000 yıllık antik Roma agorası — ücretsiz değil, ama büyüleyici." },
];

export type ArtSpot = {
  key: string;
  title: string;
  type: string;
  description: string;
};

export const ART_SPOTS: ArtSpot[] = [
  { key: "ahmedadnan", title: "Ahmed Adnan Saygun Sanat Merkezi", type: "Konser & Bale", description: "İzmir'in modern sanat merkezi, klasik müzik konserleri ve uluslararası prodüksiyonlar." },
  { key: "arkas", title: "Arkas Sanat Merkezi", type: "Müze", description: "Alsancak'ta tarihi binada koleksiyon ve geçici sergiler. Ücretsiz." },
  { key: "ktso", title: "Konak Pier & Tasarım", type: "Tasarım", description: "Eiffel imzalı tarihi rıhtım yapısı, butik mağazalar ve tasarım sergileri." },
  { key: "izmirresim", title: "İzmir Resim ve Heykel Müzesi", type: "Müze", description: "Cumhuriyet dönemi Türk resminin önemli koleksiyonu, Konak'ta." },
  { key: "kultur", title: "Tarihi Havagazı Fabrikası", type: "Kültür Merkezi", description: "Endüstriyel mimaride çağdaş sergi, sahne ve atölyeler." },
  { key: "operafest", title: "Uluslararası İzmir Festivali", type: "Festival", description: "Haziran-Temmuz: Efes Antik Tiyatro'da dünya yıldızları sahne alır." },
];

export type Tour = {
  key: string;
  title: string;
  duration: string;
  description: string;
  stops: string[];
};

export const TOURS: Tour[] = [
  {
    key: "klasik",
    title: "Klasik İzmir Şehir Turu",
    duration: "Yarım gün",
    description: "İzmir'in özünü 4 saatte gezmek için.",
    stops: ["Konak Meydanı & Saat Kulesi", "Kemeraltı Çarşısı", "Smyrna Agorası", "Asansör & Karataş", "Kordon"],
  },
  {
    key: "efes",
    title: "Efes & Meryem Ana Turu",
    duration: "Tam gün",
    description: "UNESCO Efes antik kenti ve çevresi.",
    stops: ["Efes Antik Kenti", "Celcus Kütüphanesi", "Meryem Ana Evi", "Şirince köyü öğle yemeği", "İsa Bey Camii"],
  },
  {
    key: "cesmeurla",
    title: "Çeşme & Alaçatı & Urla",
    duration: "Tam gün",
    description: "Ege rivierası gastronomi & tarih.",
    stops: ["Urla bağ rotası", "Alaçatı sokakları", "Çeşme Kalesi", "Ilıca Plajı", "Akşam balık yemeği"],
  },
  {
    key: "gastro",
    title: "Urla Gastronomi Rotası",
    duration: "Yarım gün",
    description: "Yeni nesil İzmir mutfağının kalbi.",
    stops: ["Köy pazarı", "Şarap evi tadımı", "Yöresel zeytinyağı", "Slow food restoran"],
  },
  {
    key: "tarih",
    title: "Pergamon & Bergama",
    duration: "Tam gün",
    description: "Antik dünyanın bir başka mucizesi.",
    stops: ["Akropol", "Asklepion", "Kızıl Avlu", "Bergama eski şehir"],
  },
  {
    key: "tekne",
    title: "Tekne ile Mavi Tur",
    duration: "Yarım/Tam gün",
    description: "Çeşme veya Foça'dan saklı koylar.",
    stops: ["Saklı koylarda yüzme", "Snorkeling", "Teknede öğle yemeği", "Gün batımı dönüşü"],
  },
];

export type MedicalService = {
  key: string;
  title: string;
  titleEn: string;
  emoji: string;
  description: string;
  features: string[];
};

export const MEDICAL: MedicalService[] = [
  {
    key: "sac",
    title: "Saç Ekimi",
    titleEn: "Hair Transplant",
    emoji: "💇",
    description: "FUE, DHI ve safir tekniklerle uluslararası kalitede, Avrupa fiyatlarının çok altında.",
    features: ["FUE & DHI teknikleri", "Otel + transfer paketleri", "PRP destek tedavisi", "İngilizce/Arapça/Rusça destek"],
  },
  {
    key: "dis",
    title: "Diş Tedavisi & Estetiği",
    titleEn: "Dental Treatment",
    emoji: "🦷",
    description: "Hollywood smile, zirkonyum kaplama, implant ve all-on-4 çözümleri.",
    features: ["Zirkonyum & E-max kaplama", "All-on-4 implant", "Lamine veneer", "Dijital smile design"],
  },
  {
    key: "estetik",
    title: "Estetik Cerrahi",
    titleEn: "Aesthetic Surgery",
    emoji: "✨",
    description: "Burun, meme, BBL, liposuction — JCI akreditasyonlu hastanelerde.",
    features: ["Rhinoplasty", "Liposuction & BBL", "Yüz germe", "JCI sertifikalı hastaneler"],
  },
  {
    key: "checkup",
    title: "Premium Check-up",
    titleEn: "Premium Check-up",
    emoji: "🩺",
    description: "Tam vücut tarama paketleri, kardiyoloji, onkoloji erken teşhis.",
    features: ["Full body MR", "Kardiyak panel", "Kanser taraması", "1 günde sonuç"],
  },
];

export type Property = {
  key: string;
  title: string;
  location: string;
  type: string;
  priceFrom: string;
  description: string;
  features: string[];
};

export const PROPERTIES: Property[] = [
  {
    key: "cesme-villa",
    title: "Çeşme Deniz Manzaralı Villa",
    location: "Çeşme · Reisdere",
    type: "Müstakil villa",
    priceFrom: "€650.000",
    description: "Özel havuz, 4+1, doğrudan deniz manzarası. Türk vatandaşlığı uygun.",
    features: ["Özel havuz", "4+1, 280 m²", "Türk vatandaşlığı", "Kira getirisi yüksek"],
  },
  {
    key: "alacati-stone",
    title: "Alaçatı Taş Ev",
    location: "Alaçatı merkez",
    type: "Restore taş ev",
    priceFrom: "€1.200.000",
    description: "Tarihi taş ev, modern iç tasarım, butik otel potansiyeli.",
    features: ["Restore edilmiş", "İç avlu", "3 yatak odası", "Butik otel ruhsatı uygun"],
  },
  {
    key: "urla-vineyard",
    title: "Urla Bağ Evi",
    location: "Urla · Kuşçular",
    type: "Bağlı arazi + ev",
    priceFrom: "€480.000",
    description: "Kendi üzüm bağı, zeytinlik, sakin yaşam, gastronomi rotası üzerinde.",
    features: ["5 dönüm arazi", "Bağ & zeytinlik", "Yatırım potansiyeli", "Doğal yaşam"],
  },
  {
    key: "alsancak-loft",
    title: "Alsancak Sahil Loft",
    location: "Alsancak · Kordon",
    type: "Yeni proje daire",
    priceFrom: "€320.000",
    description: "Yeni proje, Kordon'a yürüme mesafesi, deniz manzaralı 2+1.",
    features: ["Kordon yakını", "Yeni proje", "Deniz manzarası", "Kentsel dönüşüm"],
  },
  {
    key: "karsiyaka-tower",
    title: "Karşıyaka Marina Rezidans",
    location: "Karşıyaka · Bostanlı",
    type: "Lüks rezidans",
    priceFrom: "€280.000",
    description: "Marina manzaralı modern rezidans, fitness, havuz, concierge.",
    features: ["Marina manzarası", "Spa & fitness", "24/7 concierge", "Garanti kira"],
  },
];
