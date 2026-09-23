export type LinkItem = {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
};

export type LinkSection = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: "coral" | "aegean" | "olive" | "amber";
  items: LinkItem[];
};

export const IZMIR_LINK_SECTIONS: LinkSection[] = [
  {
    id: "breaking",
    title: "Son Dakika · Ulusal Ajanslar",
    subtitle: "Anlık haber akışı · Türkiye + İzmir",
    icon: "zap",
    accent: "coral",
    items: [
      {
        id: "aa-izmir",
        title: "Anadolu Ajansı · İzmir",
        subtitle: "AA · resmi ajans",
        url: "https://www.aa.com.tr/tr/search/?s=izmir",
      },
      {
        id: "iha-izmir",
        title: "İHA · İzmir",
        subtitle: "İhlas Haber Ajansı",
        url: "https://www.iha.com.tr/izmir-haberleri/",
      },
      {
        id: "cnnturk-izmir",
        title: "CNN Türk · İzmir",
        subtitle: "Son dakika",
        url: "https://www.cnnturk.com/haberleri/izmir",
      },
      {
        id: "ntv-izmir",
        title: "NTV · İzmir",
        subtitle: "Canlı yayın + arşiv",
        url: "https://www.ntv.com.tr/son-dakika/izmir",
      },
      {
        id: "hurriyet-izmir",
        title: "Hürriyet · Ege",
        subtitle: "Ege bölgesi",
        url: "https://www.hurriyet.com.tr/yerel-haberler/izmir/",
      },
      {
        id: "sozcu-izmir",
        title: "Sözcü · İzmir",
        subtitle: "Yerel gündem",
        url: "https://www.sozcu.com.tr/etiket/izmir/",
      },
      {
        id: "yeniasir",
        title: "Yeni Asır",
        subtitle: "İzmir'in yerel gazetesi · 1895",
        url: "https://www.yeniasir.com.tr/",
      },
      {
        id: "egetelgraf",
        title: "Ege Telgraf",
        subtitle: "Ege bölgesi yerel",
        url: "https://www.egetelgraf.com/",
      },
    ],
  },
  {
    id: "social",
    title: "Sosyal Medya · Anlık",
    subtitle: "Instagram + X üzerinden canlı paylaşımlar",
    icon: "instagram",
    accent: "coral",
    items: [
      {
        id: "ig-ibb",
        title: "@izmirbuyuksehirbel",
        subtitle: "İzmir Büyükşehir Belediyesi",
        url: "https://www.instagram.com/izmirbuyuksehirbel/",
      },
      {
        id: "ig-izmir",
        title: "@izmir",
        subtitle: "Şehir resmi hesap",
        url: "https://www.instagram.com/izmir/",
      },
      {
        id: "ig-visit",
        title: "@visitizmir",
        subtitle: "Turizm tanıtım",
        url: "https://www.instagram.com/visitizmir/",
      },
      {
        id: "ig-cesme",
        title: "@cesmebld",
        subtitle: "Çeşme Belediyesi",
        url: "https://www.instagram.com/cesmebld/",
      },
      {
        id: "x-ibb",
        title: "X · @izmirbld",
        subtitle: "İzmir Büyükşehir resmi",
        url: "https://x.com/izmirbld",
      },
      {
        id: "x-valilik",
        title: "X · @izmirvaliligi",
        subtitle: "Valilik açıklamaları",
        url: "https://x.com/izmirvaliligi",
      },
    ],
  },
  {
    id: "sports",
    title: "Spor · İzmir Takımları",
    subtitle: "Göztepe · Karşıyaka · Altay",
    icon: "shield",
    accent: "olive",
    items: [
      {
        id: "goztepe",
        title: "Göztepe SK",
        subtitle: "Süper Lig · Gürsel Aksel",
        url: "https://goztepe.org.tr/",
      },
      {
        id: "karsiyaka",
        title: "Karşıyaka SK",
        subtitle: "1. Lig · Alaybey",
        url: "https://www.karsiyaka.org.tr/",
      },
      {
        id: "altay",
        title: "Altay SK",
        subtitle: "Tarihi kulüp",
        url: "https://www.altay.org.tr/",
      },
      {
        id: "fanatik-izmir",
        title: "Fanatik · İzmir",
        subtitle: "Spor gazetesi",
        url: "https://www.fanatik.com.tr/etiket/izmir/",
      },
      {
        id: "aspor",
        title: "A Spor",
        subtitle: "Canlı maç + analiz",
        url: "https://www.aspor.com.tr/",
      },
      {
        id: "ntvspor",
        title: "NTV Spor",
        subtitle: "Spor haberleri",
        url: "https://www.ntv.com.tr/spor",
      },
    ],
  },
  {
    id: "traffic",
    title: "Trafik & Yol Durumu",
    subtitle: "Canlı trafik · kameralar · viyadük",
    icon: "navigation-2",
    accent: "amber",
    items: [
      {
        id: "yandex",
        title: "Yandex Trafik · İzmir",
        subtitle: "Canlı yoğunluk haritası",
        url: "https://yandex.com.tr/harita/104/izmir/probki/",
      },
      {
        id: "google-traffic",
        title: "Google Maps · İzmir Trafik",
        subtitle: "Canlı + tahmini",
        url: "https://www.google.com/maps/@38.42,27.15,12z/data=!5m1!1e1",
      },
      {
        id: "ibb-trafik",
        title: "İBB Trafik Yönetim",
        subtitle: "Resmi kamera ve duyurular",
        url: "https://utkm.izmir.bel.tr/",
      },
      {
        id: "kgm-bati",
        title: "KGM · Batı Ege",
        subtitle: "Karayolları yol durumu",
        url: "https://www.kgm.gov.tr/Sayfalar/KGM/SiteTr/YolDurumu/YolDurumuHaritasi.aspx",
      },
      {
        id: "egm-trafik",
        title: "EGM Trafik",
        subtitle: "Acil durum + kazalar",
        url: "https://www.trafik.gov.tr/",
      },
    ],
  },
  {
    id: "transport",
    title: "Ulaşım · Vapur · Metro · İZBAN",
    subtitle: "Sefer saatleri · kart · canlı durum",
    icon: "anchor",
    accent: "aegean",
    items: [
      {
        id: "izdeniz",
        title: "İzdeniz · Vapur",
        subtitle: "Konak ↔ Karşıyaka ↔ Bostanlı ↔ Bayraklı",
        url: "https://www.izdeniz.com.tr/tr/seferler",
      },
      {
        id: "izban",
        title: "İZBAN · Banliyö Tren",
        subtitle: "Aliağa ↔ Selçuk · havalimanı",
        url: "https://www.izban.com.tr/sefer-saatleri",
      },
      {
        id: "metro",
        title: "İzmir Metro",
        subtitle: "M1: F.Altay ↔ Evka 3",
        url: "https://www.izmirmetro.com.tr/Sayfa/41/4/sefer-saatleri",
      },
      {
        id: "eshot",
        title: "ESHOT · Otobüs",
        subtitle: "Hat sorgu + canlı konum",
        url: "https://www.eshot.gov.tr/tr",
      },
      {
        id: "izulas",
        title: "İzulaş",
        subtitle: "Şehir içi otobüs",
        url: "https://www.izulas.com.tr/",
      },
      {
        id: "adb",
        title: "Adnan Menderes Havalimanı",
        subtitle: "ADB · uçuş durumu",
        url: "https://www.adnanmenderesairport.com/tr-tr/yolcular/Sayfalar/ucusbilgileri.aspx",
      },
      {
        id: "tcdd",
        title: "TCDD · Tren",
        subtitle: "Basmane / Alsancak garı",
        url: "https://ebilet.tcddtasimacilik.gov.tr/",
      },
    ],
  },
  {
    id: "museums",
    title: "Müzeler & Kültür",
    subtitle: "Arkeoloji · Etnografya · sergiler",
    icon: "book-open",
    accent: "aegean",
    items: [
      {
        id: "arkeoloji",
        title: "İzmir Arkeoloji Müzesi",
        subtitle: "Konak · antik İonia eserleri",
        url: "https://muze.gov.tr/muze-detay?SectionId=IAM01&DistId=IAM",
      },
      {
        id: "etnografya",
        title: "Etnografya Müzesi",
        subtitle: "Konak · Osmanlı dönemi",
        url: "https://muze.gov.tr/muze-detay?SectionId=IEM01&DistId=IEM",
      },
      {
        id: "agora",
        title: "Agora Ören Yeri",
        subtitle: "Antik Smyrna agorası",
        url: "https://muze.gov.tr/muze-detay?SectionId=AOY01&DistId=MRK",
      },
      {
        id: "efes",
        title: "Efes Antik Kenti",
        subtitle: "Selçuk · UNESCO",
        url: "https://muze.gov.tr/muze-detay?SectionId=EFS01&DistId=MRK",
      },
      {
        id: "ataturk-muze",
        title: "Atatürk Müzesi",
        subtitle: "Alsancak · Birinci Kordon",
        url: "https://www.kulturportali.gov.tr/turkiye/izmir/gezilecekyer/ataturk-muzesi",
      },
      {
        id: "aas",
        title: "Ahmed Adnan Saygun Sanat Merkezi",
        subtitle: "Konser · opera · tiyatro",
        url: "https://aassm.org.tr/",
      },
      {
        id: "arkas",
        title: "Arkas Sanat Merkezi",
        subtitle: "Modern sanat sergileri",
        url: "https://www.arkassanatmerkezi.com/",
      },
      {
        id: "izmiravm",
        title: "İzmir Resim Heykel Müzesi",
        subtitle: "Kültürpark",
        url: "https://www.kulturportali.gov.tr/turkiye/izmir/gezilecekyer/izmir-resim-ve-heykel-muzesi",
      },
    ],
  },
  {
    id: "food",
    title: "Meşhur Yeme-İçme",
    subtitle: "Lokanta · boyoz · kumru · balıkçı",
    icon: "coffee",
    accent: "coral",
    items: [
      {
        id: "kemeralti-lokanta",
        title: "Tarihi Kemeraltı Lokantaları",
        subtitle: "Boyoz, gevrek, kumru rotası",
        url: "https://www.google.com/maps/search/Kemeraltı+lokanta/@38.4181,27.1297,16z",
      },
      {
        id: "altinkapi",
        title: "Altın Kapı (1968)",
        subtitle: "Kemeraltı · meşhur kebap",
        url: "https://www.google.com/maps/search/Altın+Kapı+Restaurant+İzmir",
      },
      {
        id: "deniz-rest",
        title: "Deniz Restaurant",
        subtitle: "İzmir Palas · balık + meze",
        url: "https://www.denizrestaurant.com.tr/",
      },
      {
        id: "veli-usta",
        title: "Veli Usta Balıkçısı",
        subtitle: "Alsancak · efsane balıkçı",
        url: "https://www.google.com/maps/search/Veli+Usta+Balıkçısı+Alsancak",
      },
      {
        id: "tarihi-asansor",
        title: "Asansör Restaurant",
        subtitle: "Karataş · manzaralı",
        url: "https://www.asansor.com.tr/",
      },
      {
        id: "dostlar-firin",
        title: "Dostlar Fırını · Boyoz",
        subtitle: "Hisarönü · sabah boyoz",
        url: "https://www.google.com/maps/search/Dostlar+Fırını+boyoz+İzmir",
      },
      {
        id: "tatci-mahmut",
        title: "Tatçı Mahmut",
        subtitle: "Çiğköfte · şehir efsanesi",
        url: "https://www.google.com/maps/search/Tatcı+Mahmut+İzmir",
      },
      {
        id: "alacati-yemek",
        title: "Alaçatı / Çeşme Lezzetleri",
        subtitle: "Otel arkası enginar · kumru",
        url: "https://www.google.com/maps/search/Alacati+restaurant",
      },
      {
        id: "urla-baglar",
        title: "Urla Bağ Yolu · Şarap Rotası",
        subtitle: "USCA · butik şaraphaneler",
        url: "https://www.urlabagyolu.com/",
      },
    ],
  },
  {
    id: "official",
    title: "Resmi Bilgi",
    subtitle: "Belediye · valilik · hava + deprem",
    icon: "shield",
    accent: "aegean",
    items: [
      {
        id: "ibb",
        title: "İzmir Büyükşehir Belediyesi",
        subtitle: "izmir.bel.tr · resmi duyurular",
        url: "https://www.izmir.bel.tr/",
      },
      {
        id: "valilik",
        title: "İzmir Valiliği",
        subtitle: "Resmi açıklamalar",
        url: "http://www.izmir.gov.tr/",
      },
      {
        id: "mgm",
        title: "Hava Durumu · MGM",
        subtitle: "Meteoroloji Genel Müdürlüğü",
        url: "https://www.mgm.gov.tr/sondurum/sondurum.aspx?m=IZMIR",
      },
      {
        id: "afad",
        title: "AFAD · Deprem",
        subtitle: "Son depremler + uyarı",
        url: "https://deprem.afad.gov.tr/last-earthquakes.html",
      },
      {
        id: "kandilli",
        title: "Kandilli Rasathanesi",
        subtitle: "Anlık deprem listesi",
        url: "http://www.koeri.boun.edu.tr/scripts/lst0.asp",
      },
    ],
  },
];
