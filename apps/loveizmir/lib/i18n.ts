export const SUPPORTED_LANGUAGES = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷", nativeName: "Türkçe" },
  { code: "en", label: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "ar", label: "العربية", flag: "🇸🇦", nativeName: "العربية" },
  { code: "ru", label: "Русский", flag: "🇷🇺", nativeName: "Русский" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", nativeName: "Deutsch" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export const RTL_LANGUAGES: LanguageCode[] = ["ar"];

export type TranslationKey =
  | "tab.discover"
  | "tab.guide"
  | "tab.chat"
  | "tab.news"
  | "tab.services"
  | "common.profile"
  | "common.settings"
  | "common.language"
  | "common.save"
  | "common.cancel"
  | "common.delete"
  | "common.add"
  | "common.edit"
  | "common.confirm"
  | "common.close"
  | "common.search"
  | "common.loading"
  | "common.empty"
  | "common.tryAgain"
  | "common.signIn"
  | "common.signOut"
  | "common.guest"
  | "profile.title"
  | "profile.subtitle"
  | "profile.languageSection"
  | "profile.languageHint"
  | "profile.visitedSection"
  | "profile.visitedHint"
  | "profile.visitedEmpty"
  | "profile.addVisited"
  | "profile.placeName"
  | "profile.placeNote"
  | "profile.rateExperience"
  | "profile.memoriesSection"
  | "profile.memoriesHint"
  | "profile.memoriesEmpty"
  | "profile.addMemory"
  | "profile.memoryTitle"
  | "profile.memoryText"
  | "profile.memoryDate"
  | "profile.addPhoto"
  | "profile.removePhoto"
  | "profile.stats.visited"
  | "profile.stats.memories"
  | "profile.stats.avgRating"
  | "profile.aiAskAbout"
  | "chat.copy"
  | "chat.copied"
  | "chat.listen"
  | "chat.stop"
  | "chat.share"
  | "chat.placeholder"
  | "chat.thinking";

type Dict = Record<TranslationKey, string>;

const tr: Dict = {
  "tab.discover": "Keşfet",
  "tab.guide": "Rehber",
  "tab.chat": "Sohbet",
  "tab.news": "Haberler",
  "tab.services": "Hizmetler",
  "common.profile": "Profilim",
  "common.settings": "Ayarlar",
  "common.language": "Dil",
  "common.save": "Kaydet",
  "common.cancel": "İptal",
  "common.delete": "Sil",
  "common.add": "Ekle",
  "common.edit": "Düzenle",
  "common.confirm": "Onayla",
  "common.close": "Kapat",
  "common.search": "Ara",
  "common.loading": "Yükleniyor…",
  "common.empty": "Henüz bir şey yok",
  "common.tryAgain": "Tekrar Dene",
  "common.signIn": "Giriş yap",
  "common.signOut": "Çıkış yap",
  "common.guest": "Misafir",
  "profile.title": "Profilim",
  "profile.subtitle": "İzmir maceran burada — diller, ziyaretler, hatıralar.",
  "profile.languageSection": "Dil Tercihi",
  "profile.languageHint": "Uygulamayı kendi dilinde kullan.",
  "profile.visitedSection": "Gittiğim Yerler",
  "profile.visitedHint": "Ziyaret ettiğin yerleri ekle, puanla.",
  "profile.visitedEmpty": "Henüz ziyaret eklemedin. İlk yerini ekle!",
  "profile.addVisited": "Yer Ekle",
  "profile.placeName": "Yer adı",
  "profile.placeNote": "Not (isteğe bağlı)",
  "profile.rateExperience": "Deneyimini puanla",
  "profile.memoriesSection": "Hatıralarım",
  "profile.memoriesHint": "Yaşadıklarını yaz, fotoğrafla — sonra hatırlamak için.",
  "profile.memoriesEmpty": "Henüz hatıra eklemedin. İlk hatıranı kaydet!",
  "profile.addMemory": "Hatıra Ekle",
  "profile.memoryTitle": "Başlık",
  "profile.memoryText": "Anılar, izlenimler…",
  "profile.memoryDate": "Tarih",
  "profile.addPhoto": "Fotoğraf Ekle",
  "profile.removePhoto": "Fotoğrafı Kaldır",
  "profile.stats.visited": "Ziyaret",
  "profile.stats.memories": "Hatıra",
  "profile.stats.avgRating": "Ort. Puan",
  "profile.aiAskAbout": "AI'ya bu yer hakkında sor",
  "chat.copy": "Kopyala",
  "chat.copied": "Kopyalandı",
  "chat.listen": "Dinle",
  "chat.stop": "Durdur",
  "chat.share": "Paylaş",
  "chat.placeholder": "Master AI'ya sor…",
  "chat.thinking": "Master AI düşünüyor…",
};

const en: Dict = {
  "tab.discover": "Discover",
  "tab.guide": "Guide",
  "tab.chat": "Chat",
  "tab.news": "News",
  "tab.services": "Services",
  "common.profile": "My Profile",
  "common.settings": "Settings",
  "common.language": "Language",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.add": "Add",
  "common.edit": "Edit",
  "common.confirm": "Confirm",
  "common.close": "Close",
  "common.search": "Search",
  "common.loading": "Loading…",
  "common.empty": "Nothing here yet",
  "common.tryAgain": "Try Again",
  "common.signIn": "Sign in",
  "common.signOut": "Sign out",
  "common.guest": "Guest",
  "profile.title": "My Profile",
  "profile.subtitle":
    "Your İzmir adventure — languages, visits and memories.",
  "profile.languageSection": "Language",
  "profile.languageHint": "Use the app in your own language.",
  "profile.visitedSection": "Places I've Visited",
  "profile.visitedHint": "Save places you've been to and rate them.",
  "profile.visitedEmpty": "No places yet. Add your first one!",
  "profile.addVisited": "Add Place",
  "profile.placeName": "Place name",
  "profile.placeNote": "Note (optional)",
  "profile.rateExperience": "Rate your experience",
  "profile.memoriesSection": "Memories",
  "profile.memoriesHint":
    "Write what you lived, attach photos — to remember later.",
  "profile.memoriesEmpty": "No memories yet. Save your first one!",
  "profile.addMemory": "Add Memory",
  "profile.memoryTitle": "Title",
  "profile.memoryText": "Memories, impressions…",
  "profile.memoryDate": "Date",
  "profile.addPhoto": "Add Photo",
  "profile.removePhoto": "Remove Photo",
  "profile.stats.visited": "Visited",
  "profile.stats.memories": "Memories",
  "profile.stats.avgRating": "Avg Rating",
  "profile.aiAskAbout": "Ask AI about this place",
  "chat.copy": "Copy",
  "chat.copied": "Copied",
  "chat.listen": "Listen",
  "chat.stop": "Stop",
  "chat.share": "Share",
  "chat.placeholder": "Ask Master AI…",
  "chat.thinking": "Master AI is thinking…",
};

const ar: Dict = {
  "tab.discover": "اكتشف",
  "tab.guide": "الدليل",
  "tab.chat": "محادثة",
  "tab.news": "الأخبار",
  "tab.services": "خدمات",
  "common.profile": "حسابي",
  "common.settings": "الإعدادات",
  "common.language": "اللغة",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.delete": "حذف",
  "common.add": "إضافة",
  "common.edit": "تعديل",
  "common.confirm": "تأكيد",
  "common.close": "إغلاق",
  "common.search": "بحث",
  "common.loading": "جارٍ التحميل…",
  "common.empty": "لا يوجد شيء بعد",
  "common.tryAgain": "حاول مرة أخرى",
  "common.signIn": "تسجيل الدخول",
  "common.signOut": "تسجيل الخروج",
  "common.guest": "ضيف",
  "profile.title": "حسابي",
  "profile.subtitle": "مغامرتك في إزمير — اللغات والزيارات والذكريات.",
  "profile.languageSection": "اللغة",
  "profile.languageHint": "استخدم التطبيق بلغتك.",
  "profile.visitedSection": "الأماكن التي زرتها",
  "profile.visitedHint": "احفظ الأماكن التي زرتها وقم بتقييمها.",
  "profile.visitedEmpty": "لا توجد أماكن بعد. أضف أول واحد!",
  "profile.addVisited": "أضف مكاناً",
  "profile.placeName": "اسم المكان",
  "profile.placeNote": "ملاحظة (اختياري)",
  "profile.rateExperience": "قيّم تجربتك",
  "profile.memoriesSection": "الذكريات",
  "profile.memoriesHint": "اكتب ما عشته وأضف صوراً لتتذكر لاحقاً.",
  "profile.memoriesEmpty": "لا توجد ذكريات بعد. احفظ أولها!",
  "profile.addMemory": "أضف ذكرى",
  "profile.memoryTitle": "العنوان",
  "profile.memoryText": "ذكريات، انطباعات…",
  "profile.memoryDate": "التاريخ",
  "profile.addPhoto": "إضافة صورة",
  "profile.removePhoto": "إزالة الصورة",
  "profile.stats.visited": "زيارة",
  "profile.stats.memories": "ذكرى",
  "profile.stats.avgRating": "متوسط التقييم",
  "profile.aiAskAbout": "اسأل الذكاء الاصطناعي عن هذا المكان",
  "chat.copy": "نسخ",
  "chat.copied": "تم النسخ",
  "chat.listen": "استماع",
  "chat.stop": "إيقاف",
  "chat.share": "مشاركة",
  "chat.placeholder": "اسأل Master AI…",
  "chat.thinking": "Master AI يفكر…",
};

const ru: Dict = {
  "tab.discover": "Открой",
  "tab.guide": "Гид",
  "tab.chat": "Чат",
  "tab.news": "Новости",
  "tab.services": "Сервис",
  "common.profile": "Профиль",
  "common.settings": "Настройки",
  "common.language": "Язык",
  "common.save": "Сохранить",
  "common.cancel": "Отмена",
  "common.delete": "Удалить",
  "common.add": "Добавить",
  "common.edit": "Изменить",
  "common.confirm": "Подтвердить",
  "common.close": "Закрыть",
  "common.search": "Поиск",
  "common.loading": "Загрузка…",
  "common.empty": "Здесь пусто",
  "common.tryAgain": "Повторить",
  "common.signIn": "Войти",
  "common.signOut": "Выйти",
  "common.guest": "Гость",
  "profile.title": "Мой профиль",
  "profile.subtitle":
    "Твоё приключение в Измире — языки, посещения и воспоминания.",
  "profile.languageSection": "Язык",
  "profile.languageHint": "Используй приложение на своём языке.",
  "profile.visitedSection": "Места, где я был",
  "profile.visitedHint": "Сохраняй места и оценивай их.",
  "profile.visitedEmpty": "Пока пусто. Добавь первое место!",
  "profile.addVisited": "Добавить место",
  "profile.placeName": "Название места",
  "profile.placeNote": "Заметка (по желанию)",
  "profile.rateExperience": "Оцени впечатление",
  "profile.memoriesSection": "Воспоминания",
  "profile.memoriesHint": "Запиши, что пережил, добавь фото.",
  "profile.memoriesEmpty": "Пока нет воспоминаний.",
  "profile.addMemory": "Добавить воспоминание",
  "profile.memoryTitle": "Заголовок",
  "profile.memoryText": "Воспоминания, впечатления…",
  "profile.memoryDate": "Дата",
  "profile.addPhoto": "Добавить фото",
  "profile.removePhoto": "Удалить фото",
  "profile.stats.visited": "Посещений",
  "profile.stats.memories": "Воспоминаний",
  "profile.stats.avgRating": "Ср. оценка",
  "profile.aiAskAbout": "Спросить AI об этом месте",
  "chat.copy": "Копировать",
  "chat.copied": "Скопировано",
  "chat.listen": "Слушать",
  "chat.stop": "Стоп",
  "chat.share": "Поделиться",
  "chat.placeholder": "Спроси Master AI…",
  "chat.thinking": "Master AI думает…",
};

const de: Dict = {
  "tab.discover": "Entdecken",
  "tab.guide": "Reiseführer",
  "tab.chat": "Chat",
  "tab.news": "News",
  "tab.services": "Service",
  "common.profile": "Mein Profil",
  "common.settings": "Einstellungen",
  "common.language": "Sprache",
  "common.save": "Speichern",
  "common.cancel": "Abbrechen",
  "common.delete": "Löschen",
  "common.add": "Hinzufügen",
  "common.edit": "Bearbeiten",
  "common.confirm": "Bestätigen",
  "common.close": "Schließen",
  "common.search": "Suche",
  "common.loading": "Lädt…",
  "common.empty": "Noch nichts hier",
  "common.tryAgain": "Erneut versuchen",
  "common.signIn": "Anmelden",
  "common.signOut": "Abmelden",
  "common.guest": "Gast",
  "profile.title": "Mein Profil",
  "profile.subtitle":
    "Dein İzmir-Abenteuer — Sprachen, Besuche, Erinnerungen.",
  "profile.languageSection": "Sprache",
  "profile.languageHint": "Nutze die App in deiner Sprache.",
  "profile.visitedSection": "Besuchte Orte",
  "profile.visitedHint": "Speichere besuchte Orte und bewerte sie.",
  "profile.visitedEmpty": "Noch keine Orte. Füge deinen ersten hinzu!",
  "profile.addVisited": "Ort hinzufügen",
  "profile.placeName": "Name des Ortes",
  "profile.placeNote": "Notiz (optional)",
  "profile.rateExperience": "Bewerte dein Erlebnis",
  "profile.memoriesSection": "Erinnerungen",
  "profile.memoriesHint":
    "Schreib, was du erlebt hast, füge Fotos hinzu.",
  "profile.memoriesEmpty": "Noch keine Erinnerungen.",
  "profile.addMemory": "Erinnerung hinzufügen",
  "profile.memoryTitle": "Titel",
  "profile.memoryText": "Erinnerungen, Eindrücke…",
  "profile.memoryDate": "Datum",
  "profile.addPhoto": "Foto hinzufügen",
  "profile.removePhoto": "Foto entfernen",
  "profile.stats.visited": "Besuche",
  "profile.stats.memories": "Erinnerungen",
  "profile.stats.avgRating": "Ø Bewertung",
  "profile.aiAskAbout": "AI nach diesem Ort fragen",
  "chat.copy": "Kopieren",
  "chat.copied": "Kopiert",
  "chat.listen": "Hören",
  "chat.stop": "Stopp",
  "chat.share": "Teilen",
  "chat.placeholder": "Frag Master AI…",
  "chat.thinking": "Master AI denkt nach…",
};

export const TRANSLATIONS: Record<LanguageCode, Dict> = {
  tr,
  en,
  ar,
  ru,
  de,
};

export function translate(
  code: LanguageCode,
  key: TranslationKey,
): string {
  return TRANSLATIONS[code]?.[key] ?? TRANSLATIONS.tr[key] ?? key;
}

export const SPEECH_LANG: Record<LanguageCode, string> = {
  tr: "tr-TR",
  en: "en-US",
  ar: "ar-SA",
  ru: "ru-RU",
  de: "de-DE",
};
