import type { Feather } from "@expo/vector-icons";

type FeatherIcon = React.ComponentProps<typeof Feather>["name"];

export type TripStop = {
  title: string;
  detail: string;
  duration?: string;
};

export type CuratedTrip = {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  duration: string;
  distance?: string;
  difficulty: "kolay" | "orta" | "aktif";
  bestTime: string;
  summary: string;
  stops: TripStop[];
  tips: string[];
  budgetTl?: string;
  aiPrompt: string;
};

export type CuratedCategory = {
  id: "gurme" | "sanat" | "spor" | "tarih";
  title: string;
  subtitle: string;
  icon: FeatherIcon;
  accent: "coral" | "aegean" | "olive" | "amber";
  trips: CuratedTrip[];
};

export const CURATED_CATEGORIES: CuratedCategory[] = [
  {
    id: "gurme",
    title: "Gurme Gezileri",
    subtitle: "Boyoz, kumru, balıkçı, bağ yolu — lezzet rotaları",
    icon: "coffee",
    accent: "coral",
    trips: [
      {
        id: "kemeralti-boyoz",
        title: "Kemeraltı Sabah Lezzetleri",
        titleEn: "Kemeraltı Morning Food Walk",
        emoji: "🥐",
        duration: "3-4 saat",
        distance: "~2 km yürüyüş",
        difficulty: "kolay",
        bestTime: "08:00 – 12:00",
        budgetTl: "₺250-450 / kişi",
        summary:
          "İzmir'in en eski çarşısında boyoz, gevrek, kumru ve Türk kahvesi üzerinden klasik bir sabah turu.",
        stops: [
          {
            title: "Dostlar Fırını · Boyoz",
            detail: "Hisarönü'nde fırından çıkmış sıcak boyoz + tatlı tarçınlı.",
            duration: "30 dk",
          },
          {
            title: "Hisarönü Camii çevresi · Gevrek",
            detail: "Sokak satıcısından sıcak gevrek ve süt.",
            duration: "20 dk",
          },
          {
            title: "Kızlarağası Hanı · Türk Kahvesi",
            detail:
              "Tarihi hanın avlusunda mırra/Türk kahvesi ve lokum molası.",
            duration: "45 dk",
          },
          {
            title: "Tatçı Mahmut · Çiğköfte",
            detail: "Şehrin efsane çiğköfte ustasında erken öğle.",
            duration: "30 dk",
          },
          {
            title: "Şadırvanaltı · Kumru",
            detail: "Tulum peyniri, sucuk, domates — gerçek Ege kumrusu.",
            duration: "45 dk",
          },
        ],
        tips: [
          "Cumartesi sabahları daha hareketli ama sıralar olur.",
          "Boyozun yanına tatlı tarçınlısını mutlaka tat.",
          "Bol su iç — yaz aylarında çarşı çok sıcak olabilir.",
        ],
        aiPrompt:
          "Kemeraltı sabah lezzetleri turu için bugün güncel açık olan mekanları, sıra durumunu ve fiyatları verir misin?",
      },
      {
        id: "alsancak-balik",
        title: "Alsancak Balık & Meze Akşamı",
        titleEn: "Alsancak Fish & Meze Evening",
        emoji: "🐟",
        duration: "4-5 saat",
        distance: "Yürüyüş + Kordon",
        difficulty: "kolay",
        bestTime: "18:30 – 23:30",
        budgetTl: "₺900-1500 / kişi",
        summary:
          "Kordon gün batımı, Tarihi Havra Sokağı'nda meze turu ve klasik bir Ege balıkçısında akşam yemeği.",
        stops: [
          {
            title: "Kordon · Gün Batımı",
            detail: "Birinci Kordon'da yürüyüş, Bornova kestanesi/mısır arası.",
            duration: "45 dk",
          },
          {
            title: "Tarihi Havra Sokağı · Meze Turu",
            detail:
              "3-4 farklı mezeci dur, tarator, deniz börülcesi, ahtapot salata.",
            duration: "1 saat",
          },
          {
            title: "Deniz Restaurant veya Veli Usta",
            detail:
              "Mevsim balığı (çupra, levrek, lüfer), Urla şarabı eşliğinde.",
            duration: "2 saat",
          },
          {
            title: "Kordon · Akşam Yürüyüşü",
            detail: "Atatürk anıtı çevresi, tek tek dondurmacı molası.",
            duration: "45 dk",
          },
        ],
        tips: [
          "Cuma/Cumartesi için rezervasyon şart.",
          "Lüfer Eylül-Kasım, çupra her zaman güvenli.",
          "Mezeci sokağında küçük tabaklarla 5-6 çeşit dene.",
        ],
        aiPrompt:
          "Alsancak balık & meze akşamı için bu hafta açık olan en iyi 3 balıkçı, ortalama hesap ve rezervasyon ipuçları nedir?",
      },
      {
        id: "urla-bag",
        title: "Urla Bağ Yolu · Şarap Rotası",
        titleEn: "Urla Wine Route",
        emoji: "🍇",
        duration: "Tam gün",
        distance: "İzmir ↔ Urla 40 km",
        difficulty: "kolay",
        bestTime: "Mayıs-Ekim · 10:00-19:00",
        budgetTl: "₺2000-3500 / kişi",
        summary:
          "USCA üyesi butik şaraphanelerde tadım, Urla balıkçısında öğle, sahil köylerinde günbatımı.",
        stops: [
          {
            title: "Urbla / MMG / USCA Şaraphaneleri",
            detail:
              "3 farklı bağda rehberli tadım — Bornova Misketi, Urla Karası.",
            duration: "3 saat",
          },
          {
            title: "Urla İskele · Balık",
            detail: "Sahilde küçük bir balıkçıda mevsim balığı.",
            duration: "1.5 saat",
          },
          {
            title: "Özbek / Demircili Koyları",
            detail: "Sakin koylarda yüzme ve kahve.",
            duration: "2 saat",
          },
          {
            title: "Vino Locale / Nars · Akşamüstü",
            detail: "Günbatımı eşliğinde son tadım.",
            duration: "1.5 saat",
          },
        ],
        tips: [
          "Şoför ayarla — tadım yapacaksan araba kullanma.",
          "Cumartesi pazarına denk gelirse Urla köy pazarına uğra.",
          "Şaraphaneye önceden rezervasyon iyi olur.",
        ],
        aiPrompt:
          "Urla şarap rotası için ziyaret edilebilecek şu an açık olan 4-5 bağ, tadım fiyatları ve transfer önerisi verir misin?",
      },
      {
        id: "cesme-alacati",
        title: "Çeşme & Alaçatı Gurme Kaçamağı",
        titleEn: "Çeşme & Alaçatı Foodie Escape",
        emoji: "🌿",
        duration: "1-2 gün",
        distance: "İzmir ↔ Çeşme 85 km",
        difficulty: "kolay",
        bestTime: "Tüm yıl · Mart-Mayıs özellikle",
        budgetTl: "₺2500-5000 / kişi",
        summary:
          "Alaçatı'da enginar, otel arkası kumru, Çeşme'de sakız tatlıları ve deniz mahsulleri.",
        stops: [
          {
            title: "Alaçatı Otel Arkası · Kumru",
            detail: "Asril, Imren gibi yerlerde gerçek Çeşme kumrusu.",
            duration: "1 saat",
          },
          {
            title: "Alaçatı Ot Pazarı",
            detail:
              "Mart-Nisan ot festivaline denk gel — şevketi bostan, deniz börülcesi.",
            duration: "2 saat",
          },
          {
            title: "Sakız Tatlıları",
            detail: "Imren'de sakız muhallebisi, sakızlı dondurma.",
            duration: "30 dk",
          },
          {
            title: "Çeşme Marina · Balık",
            detail: "Mevsim balığı, deniz manzaralı akşam.",
            duration: "2-3 saat",
          },
        ],
        tips: [
          "Alaçatı'da arabayı dışarıda bırak, içeride yürü.",
          "Sezon Mart-Ekim, en kalabalık Temmuz-Ağustos.",
          "Erken rezervasyon büyük fark yaratır.",
        ],
        aiPrompt:
          "Çeşme & Alaçatı gurme kaçamağı için bu hafta açık olan restoranlar, ot pazarı tarihi ve konaklama önerisi verir misin?",
      },
    ],
  },
  {
    id: "sanat",
    title: "Sanat Gezileri",
    subtitle: "Müze, galeri, sergi, opera — kültür rotaları",
    icon: "image",
    accent: "aegean",
    trips: [
      {
        id: "muze-konak",
        title: "Konak Müzeler Üçlüsü",
        titleEn: "Konak Museum Trio",
        emoji: "🏛️",
        duration: "Yarım gün",
        distance: "~1.5 km yürüyüş",
        difficulty: "kolay",
        bestTime: "10:00 – 16:00 · Pazartesi hariç",
        budgetTl: "₺200-400 (Müzekart varsa ücretsiz)",
        summary:
          "Arkeoloji, Etnografya ve Atatürk Müzesi'ni tek günde yürüyerek dolaş.",
        stops: [
          {
            title: "İzmir Arkeoloji Müzesi",
            detail: "İonia, Klazomenai, Smyrna eserleri — heykel galerisi.",
            duration: "1.5 saat",
          },
          {
            title: "Etnografya Müzesi",
            detail:
              "Osmanlı dönemi giysiler, deve güreşi, Tire bezleri sergisi.",
            duration: "1 saat",
          },
          {
            title: "Konak Meydanı · Saat Kulesi",
            detail: "Yivli minareli camii ve saat kulesi çevresinde mola.",
            duration: "30 dk",
          },
          {
            title: "Atatürk Müzesi · Birinci Kordon",
            detail:
              "Atatürk'ün İzmir'deki konaklamaları, dönem fotoğrafları.",
            duration: "1 saat",
          },
        ],
        tips: [
          "Müzekart al — 3 müze birden açılır.",
          "Pazartesi çoğu kapalı, sal-cuma tercih et.",
          "Konak'tan Alsancak'a yürüyerek bağlayabilirsin.",
        ],
        aiPrompt:
          "Konak müzeler turu için bugün açık olan müzeler, ücretler ve aktif sergiler nelerdir?",
      },
      {
        id: "modern-sanat",
        title: "Modern Sanat & Galeri Hattı",
        titleEn: "Contemporary Art & Galleries",
        emoji: "🎨",
        duration: "Yarım gün",
        distance: "Alsancak + Pasaport",
        difficulty: "kolay",
        bestTime: "11:00 – 19:00",
        budgetTl: "₺0-150 · çoğu ücretsiz",
        summary:
          "Arkas Sanat, K2 Çağdaş, Karşıyaka Sanat — bugünün İzmir sanat sahnesi.",
        stops: [
          {
            title: "Arkas Sanat Merkezi · Pasaport",
            detail: "Önemli koleksiyon + dönemli uluslararası sergiler.",
            duration: "1.5 saat",
          },
          {
            title: "K2 Çağdaş Sanat Merkezi",
            detail: "Genç sanatçılar, deneysel sergiler.",
            duration: "1 saat",
          },
          {
            title: "Alsancak Galeri Rotası",
            detail: "Kıbrıs Şehitleri çevresi 4-5 küçük galeri.",
            duration: "1.5 saat",
          },
          {
            title: "Karşıyaka Sanat Galerisi",
            detail: "Vapurla Karşıyaka, Bostanlı sahil + galeri.",
            duration: "1 saat",
          },
        ],
        tips: [
          "Galeriler genelde pazar kapalı.",
          "Arkas'ın web sitesinden güncel sergiyi kontrol et.",
          "Vapurla Karşıyaka geçişi mini bir gezi.",
        ],
        aiPrompt:
          "İzmir'de bu hafta açık olan modern sanat sergileri ve galeri önerisi verir misin?",
      },
      {
        id: "opera-konser",
        title: "Opera, Bale ve Klasik Müzik Akşamı",
        titleEn: "Opera, Ballet & Classical Concert",
        emoji: "🎼",
        duration: "Akşam · 3-4 saat",
        difficulty: "kolay",
        bestTime: "Ekim-Mayıs sezonu · 19:30 – 23:00",
        budgetTl: "₺250-1200 / bilet",
        summary:
          "Ahmed Adnan Saygun Sanat Merkezi (AASSM) ve İzmir Devlet Opera-Balesi sezon programı.",
        stops: [
          {
            title: "Erken Akşam · Alsancak",
            detail: "Konserden önce hafif yemek ve kahve.",
            duration: "1.5 saat",
          },
          {
            title: "AASSM · Konser/Opera",
            detail: "Türkiye'nin en iyi akustiklerinden biri.",
            duration: "2 saat",
          },
          {
            title: "Sonrası · Kordon Yürüyüşü",
            detail: "Geç saatte sahilde nefes molası.",
            duration: "30 dk",
          },
        ],
        tips: [
          "Biletini en az 1 hafta önceden al.",
          "AASSM Güzelyalı'da, taksi en pratik.",
          "Smart casual giyim önerilir.",
        ],
        aiPrompt:
          "Bu ay AASSM ve İzmir Devlet Opera-Balesi'nde hangi performanslar var, biletler ve saatler nedir?",
      },
    ],
  },
  {
    id: "spor",
    title: "Spor Gezileri",
    subtitle: "Maç günleri, su sporu, doğa yürüyüşleri",
    icon: "activity",
    accent: "olive",
    trips: [
      {
        id: "goztepe-mac",
        title: "Göztepe Maç Günü",
        titleEn: "Göztepe Match Day",
        emoji: "⚽",
        duration: "4-5 saat",
        distance: "Stadyum + Alsancak",
        difficulty: "kolay",
        bestTime: "Maç saati ± 2 saat",
        budgetTl: "₺350-1800 / bilet",
        summary:
          "Gürsel Aksel Stadyumu'nda Göztepe maçı ve sonrası Alsancak'ta kutlama.",
        stops: [
          {
            title: "Stadyum Çevresi · Önce",
            detail: "Forma, fular alımı, taraftar atmosferi.",
            duration: "1 saat",
          },
          {
            title: "Maç · 90+ dk",
            detail: "Gürsel Aksel Stadyumu sıcak taraftar deneyimi.",
            duration: "2 saat",
          },
          {
            title: "Alsancak · Sonrası",
            detail: "Maç sonrası bira ve meze atmosferi.",
            duration: "1.5 saat",
          },
        ],
        tips: [
          "Biletini Passolig üzerinden önceden al.",
          "Deplasman taraftarı sektörü ayrı, dikkat.",
          "Toplu taşıma maç günü çok yoğun.",
        ],
        aiPrompt:
          "Bu hafta Göztepe'nin maçı var mı? Saat, bilet bulma ve stada ulaşım önerisi verir misin?",
      },
      {
        id: "cesme-surf",
        title: "Çeşme · Sörf & Rüzgar Sporları",
        titleEn: "Çeşme Surf & Windsports",
        emoji: "🏄",
        duration: "Tam gün / hafta sonu",
        distance: "İzmir ↔ Çeşme/Alaçatı 85 km",
        difficulty: "aktif",
        bestTime: "Mayıs-Ekim · sabah erken rüzgar",
        budgetTl: "₺800-2500 / gün",
        summary:
          "Alaçatı koyu, Pırlanta ve Ilıca'da rüzgar sörfü, kitesurf ve sup.",
        stops: [
          {
            title: "Alaçatı Surf Paradise",
            detail: "Başlangıç dersi veya ekipman kiralama.",
            duration: "2-3 saat",
          },
          {
            title: "Pırlanta Plajı · Kitesurf",
            detail: "İleri seviye için güçlü rüzgar.",
            duration: "2 saat",
          },
          {
            title: "Ilıca Plajı · SUP & Yüzme",
            detail: "Daha sakin sular, aile dostu.",
            duration: "2 saat",
          },
          {
            title: "Akşam · Alaçatı Mola",
            detail: "Sokaklarda akşam yemeği ve dinlenme.",
            duration: "2 saat",
          },
        ],
        tips: [
          "Sabah rüzgarı en stabil — erken çık.",
          "Ekipman kiralayacaksan rezervasyon yap.",
          "Güneş kremi + UV gözlük şart.",
        ],
        aiPrompt:
          "Bu hafta Alaçatı rüzgar durumu nasıl, hangi okullarda başlangıç dersi var, fiyatlar ne?",
      },
      {
        id: "doga-yuruyus",
        title: "Yamanlar & Sasalı Doğa Yürüyüşü",
        titleEn: "Yamanlar & Sasalı Nature Walk",
        emoji: "🥾",
        duration: "Yarım gün",
        distance: "5-10 km · orta tempo",
        difficulty: "orta",
        bestTime: "Mart-Haziran, Eylül-Kasım",
        budgetTl: "₺150-400 / kişi",
        summary:
          "Yamanlar Dağı'nda hafif trekking ve Sasalı Doğal Yaşam Parkı'nda safari.",
        stops: [
          {
            title: "Karagöl · Yamanlar",
            detail: "Çam ormanı içinde küçük göl, piknik alanı.",
            duration: "2 saat",
          },
          {
            title: "Yamanlar Tepesi Manzara",
            detail: "İzmir körfezi panorama noktası.",
            duration: "1 saat",
          },
          {
            title: "Sasalı Doğal Yaşam Parkı",
            detail:
              "Türkiye'nin en büyük doğal yaşam parkı — aslan, kaplan, zebra.",
            duration: "2.5 saat",
          },
        ],
        tips: [
          "Spor ayakkabı + şapka şart.",
          "Yamanlar yolu için araç gerekli.",
          "Sasalı pazartesi kapalı.",
        ],
        aiPrompt:
          "Yamanlar ve Sasalı için bu hafta sonu hava durumu, açılış saatleri ve ulaşım önerisi verir misin?",
      },
    ],
  },
  {
    id: "tarih",
    title: "Tarihi Yer Gezileri",
    subtitle: "Smyrna, Efes, Bergama, Şirince — antik rotalar",
    icon: "compass",
    accent: "amber",
    trips: [
      {
        id: "antik-smyrna",
        title: "Antik Smyrna · Şehir İçi Rota",
        titleEn: "Ancient Smyrna · City Route",
        emoji: "🏛️",
        duration: "Yarım gün",
        distance: "~3 km yürüyüş",
        difficulty: "kolay",
        bestTime: "08:30 – 14:00",
        budgetTl: "₺200-400 (Müzekart varsa ücretsiz)",
        summary:
          "Agora antik kenti, Kadifekale (Pagos) ve Asansör çevresinde Smyrna izleri.",
        stops: [
          {
            title: "Agora Ören Yeri",
            detail: "Roma dönemi sütunlu agora, bazilika, sarnıçlar.",
            duration: "1.5 saat",
          },
          {
            title: "Kadifekale (Pagos)",
            detail: "Helenistik kale duvarları, körfez panoraması.",
            duration: "1 saat",
          },
          {
            title: "Asansör · Karataş",
            detail: "Tarihi asansörle yüksek mahalleye çık, kahve molası.",
            duration: "45 dk",
          },
          {
            title: "Havra Sokağı · Kemeraltı",
            detail: "Antik yapılar arasında devam — Şadırvanaltı bitişi.",
            duration: "1 saat",
          },
        ],
        tips: [
          "Sabah erken başla, öğle sıcağından kaç.",
          "Agora'da rehberli tur sabah 10:00.",
          "Kadifekale'ye taksi en pratik.",
        ],
        aiPrompt:
          "Antik Smyrna şehir içi rotası için bugün açık olan yerler, müzekart ve rehberli tur önerisi verir misin?",
      },
      {
        id: "efes-meryem",
        title: "Efes & Meryem Ana Evi",
        titleEn: "Ephesus & House of Virgin Mary",
        emoji: "🏺",
        duration: "Tam gün",
        distance: "İzmir ↔ Selçuk 75 km",
        difficulty: "kolay",
        bestTime: "Mart-Mayıs, Eylül-Kasım · 09:00-16:00",
        budgetTl: "₺1200-2500 / kişi (giriş + ulaşım)",
        summary:
          "UNESCO listesindeki Efes antik kenti, Meryem Ana Evi ve Şirince bağ köyü.",
        stops: [
          {
            title: "Efes Antik Kenti",
            detail:
              "Celsus Kütüphanesi, Büyük Tiyatro, mermer cadde — 3 saat tam tur.",
            duration: "3 saat",
          },
          {
            title: "Efes Müzesi · Selçuk",
            detail: "Artemis heykelleri, gladyatör mezarları.",
            duration: "1 saat",
          },
          {
            title: "Meryem Ana Evi",
            detail: "Bülbül Dağı'nda hac merkezi, sessizlik alanı.",
            duration: "1 saat",
          },
          {
            title: "Şirince Köyü",
            detail:
              "Şarap köyü — meyve şarapları, akşam üstü taş evlerde mola.",
            duration: "2 saat",
          },
        ],
        tips: [
          "İZBAN ile Selçuk'a ucuza ulaşabilirsin.",
          "Efes'te güneş şiddetli — şapka + su şart.",
          "Şirince'de meyve şarabı tat ama tek tek.",
        ],
        aiPrompt:
          "Efes + Meryem Ana + Şirince günü için bu hafta açılış saatleri, giriş ücretleri ve günübirlik tur önerisi verir misin?",
      },
      {
        id: "bergama",
        title: "Bergama · Pergamon Antik Kenti",
        titleEn: "Bergama · Pergamon",
        emoji: "⚱️",
        duration: "Tam gün",
        distance: "İzmir ↔ Bergama 105 km",
        difficulty: "orta",
        bestTime: "Mart-Mayıs, Eylül-Kasım",
        budgetTl: "₺1000-1800 / kişi",
        summary:
          "UNESCO Pergamon Akropolü, Asklepion sağlık tapınağı ve Kızıl Avlu.",
        stops: [
          {
            title: "Pergamon Akropol · Teleferik",
            detail: "Zeus Sunağı kalıntıları, Trajan Tapınağı, tiyatro.",
            duration: "2.5 saat",
          },
          {
            title: "Asklepion",
            detail:
              "Antik dünyanın en önemli sağlık merkezlerinden — yer altı tüneli.",
            duration: "1.5 saat",
          },
          {
            title: "Kızıl Avlu (Serapis)",
            detail: "Mısır tanrılarına adanmış Roma tapınağı.",
            duration: "45 dk",
          },
          {
            title: "Bergama Çarşı",
            detail: "Geleneksel halı dokumacısı, lokal yemek.",
            duration: "1.5 saat",
          },
        ],
        tips: [
          "Akropole teleferik ile çık — yürüyüş zor.",
          "Yaz öğle saatleri çok sıcak.",
          "Bergama halısı dünyaca ünlü — bakmaya değer.",
        ],
        aiPrompt:
          "Bergama Pergamon günü için bu hafta açılış saatleri, teleferik durumu ve İzmir'den ulaşım önerisi verir misin?",
      },
      {
        id: "tire-birgi",
        title: "Tire & Birgi · Selçuklu-Osmanlı İzleri",
        titleEn: "Tire & Birgi Heritage Trail",
        emoji: "🕌",
        duration: "Tam gün",
        distance: "İzmir ↔ Birgi 95 km",
        difficulty: "kolay",
        bestTime: "Salı (Tire pazarı) önerilir",
        budgetTl: "₺700-1300 / kişi",
        summary:
          "Tire'nin tarihi pazarı, Birgi'nin Ulu Camii ve Çakırağa Konağı'nda Osmanlı evi.",
        stops: [
          {
            title: "Tire Salı Pazarı",
            detail: "Türkiye'nin en otantik köy pazarlarından biri.",
            duration: "2 saat",
          },
          {
            title: "Tire Müzesi & Yeşil İmaret Camii",
            detail: "Selçuklu kalıntıları, tarihi camiler.",
            duration: "1 saat",
          },
          {
            title: "Birgi Köyü · Ulu Cami",
            detail: "14. yy ahşap işçiliği, tarihi sokaklar.",
            duration: "1.5 saat",
          },
          {
            title: "Çakırağa Konağı",
            detail:
              "Osmanlı dönemi konak müzesi, fresk işlemeleri.",
            duration: "1 saat",
          },
        ],
        tips: [
          "Tire pazarı sadece salı — gününü buna göre seç.",
          "Birgi'de eski kahvede mola unutulmaz.",
          "Sandık kebabı Tire'nin meşhuru — öğle için ideal.",
        ],
        aiPrompt:
          "Tire ve Birgi günü için bu hafta açık yerler, salı pazarı saatleri ve İzmir'den ulaşım önerisi verir misin?",
      },
    ],
  },
];

// Compact catalog of the app's real curated experiences, for the Master AI
// system prompt so it can recommend existing packages instead of inventing.
export function curatedExperiencesSummary(): string {
  return CURATED_CATEGORIES.map(
    (c) => `- ${c.title}: ${c.trips.map((t) => t.title).join(", ")}`,
  ).join("\n");
}
