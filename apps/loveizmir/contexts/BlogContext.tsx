import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { askLoveizmir } from "@/lib/loveizmirApi";

export type BlogPost = {
  id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  sources?: { name: string; url: string }[];
  generatedAt: number;
};

type BlogState = {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const STORAGE_KEY = "loveizmir.blog.v1";
const MAX_POSTS = 30;

const TOPICS = [
  "İzmir'in antik tarihi: Smyrna'dan günümüze",
  "Cumhuriyet döneminde İzmir'in kentsel dönüşümü",
  "Efes Antik Kenti ve UNESCO mirası",
  "Kemeraltı Çarşısı'nın 400 yıllık hikayesi",
  "İzmir mutfağı: boyoz, kumru, gevrek",
  "Levanten İzmir: 19. yüzyıl ticaret hayatı",
  "Konak Meydanı ve Saat Kulesi'nin öyküsü",
  "İzmir Enternasyonal Fuarı tarihi",
  "Karşıyaka ve vapurculuk kültürü",
  "Çeşme ve Alaçatı: rüzgar sörfünden lüks turizme",
  "Urla bağcılığı ve şarap rotası",
  "Foça'nın kuruluşu ve Phokaia tarihi",
  "İzmir Asansörü ve Dario Moreno Sokağı",
  "Şirince köyü ve Rum mirası",
  "Bergama (Pergamon): Helenistik krallık",
  "İzmir Resim ve Heykel Müzesi koleksiyonu",
  "Aliağa endüstri bölgesi ve liman ekonomisi",
  "Selçuk Meryem Ana Evi ve hac yolu",
  "İzmir'de modern mimarinin doğuşu",
  "9 Eylül 1922: İzmir'in kurtuluşu",
  "Klazomenai antik kenti ve zeytinyağı",
  "Bornova ve Boveco İngiliz mirası",
  "İzmir Marş'ı ve Atatürk'ün kente bakışı",
  "İzmir Bisiklet Festivali ve sürdürülebilir ulaşım",
  "Kordon'un evrimi: liman cephesinden gezinti alanına",
  "İzmir'de gastronomi turizmi yükselişi",
  "Tire'nin Salı pazarı ve dokuma kültürü",
  "Karaburun Yarımadası: doğa, deniz ve sakinlik",
  "Ödemiş ve Birgi: Aydınoğulları beyliği",
  "İzmir Liman'ı ve Akdeniz ticareti tarihi",
];

const BlogContext = createContext<BlogState | null>(null);

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function pickTopic(date: string): string {
  let hash = 0;
  for (let i = 0; i < date.length; i++) hash = (hash * 31 + date.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % TOPICS.length;
  return TOPICS[idx];
}

function safeParse(raw: string): Omit<
  BlogPost,
  "id" | "date" | "topic" | "generatedAt"
> | null {
  const match = raw.match(/\{[\s\S]*\}/);
  const jsonText = match ? match[0] : raw;
  try {
    const parsed = JSON.parse(jsonText);
    if (
      !parsed ||
      typeof parsed.title !== "string" ||
      typeof parsed.content !== "string"
    ) {
      return null;
    }
    const sources = Array.isArray(parsed.sources)
      ? parsed.sources
          .filter(
            (s: unknown) =>
              s &&
              typeof (s as { name?: unknown }).name === "string" &&
              typeof (s as { url?: unknown }).url === "string",
          )
          .slice(0, 5)
          .map((s: { name: string; url: string }) => ({
            name: String(s.name).trim(),
            url: String(s.url).trim(),
          }))
      : [];
    return {
      title: String(parsed.title).trim(),
      subtitle: parsed.subtitle ? String(parsed.subtitle).trim() : "",
      excerpt: parsed.excerpt
        ? String(parsed.excerpt).trim()
        : String(parsed.content).trim().slice(0, 180),
      content: String(parsed.content).trim(),
      sources,
    };
  } catch {
    return null;
  }
}

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<boolean>(false);
  const initDone = useRef<boolean>(false);

  const persist = useCallback(async (next: BlogPost[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const generate = useCallback(
    async (date: string, existing: BlogPost[], force = false) => {
      if (inFlight.current) return;
      if (!force && existing.some((p) => p.date === date)) return;
      inFlight.current = true;
      setLoading(true);
      setError(null);
      const topic = pickTopic(date);
      try {
        const prompt =
          "Sen Loveİzmir uygulamasının günlük blog yazarısın. Bilgi tabanın ve " +
          "(varsa) web tarama özelliklerini kullanarak gazetecilik kalitesinde " +
          `bir Türkçe makale yaz. KONU: "${topic}". ` +
          "Uzunluk: 600-900 kelime, akıcı, sıcak ama bilgili ton, paragraflar " +
          "arasına \\n\\n koy. Tarih, isim ve rakamları doğru kullan — emin " +
          "olmadığın spesifik istatistikleri uydurma, yerine genel ama doğru " +
          "bilgiyi tercih et. Yazıyı reddetme veya 'web araması mevcut değil' " +
          "gibi açıklama yapma — bilgi tabanından İzmir hakkında zaten yeterli " +
          "bilgin var. ÖNEMLİ: Cevabını SADECE tek bir geçerli JSON nesnesi " +
          "olarak ver, başka hiçbir metin/açıklama yok. " +
          'Format: {"title":"Çekici başlık","subtitle":"1 cümle alt başlık","excerpt":"2-3 cümle özet","content":"Tam yazı, paragraflar \\n\\n ile ayrılmış","sources":[{"name":"Referans adı","url":"https://..."}]}. ' +
          "sources alanı opsiyonel — emin olduğun gerçek URL'ler varsa ekle, " +
          "yoksa boş dizi [] bırak.";
        const response = await askLoveizmir(prompt);
        const parsed = safeParse(response.reply);
        if (!parsed) throw new Error("Blog yazısı üretilemedi");
        if (parsed.content.length < 500) {
          throw new Error("AI çok kısa yanıt verdi, tekrar deneyin");
        }
        const blob = `${parsed.title} ${parsed.subtitle} ${parsed.content}`.toLowerCase();
        const badTerms = [
          "engellendi",
          "üretemiyorum",
          "üretemedim",
          "web araması",
          "web tarama",
          "erişimim yok",
          "erişim sağlayamıyor",
          "servis aktif değil",
          "servisi gerekli",
        ];
        if (badTerms.some((t) => blob.includes(t))) {
          throw new Error("AI yazıyı reddetti, tekrar deneyin");
        }
        const post: BlogPost = {
          id: `${date}-${Date.now()}`,
          date,
          topic,
          generatedAt: Date.now(),
          ...parsed,
        };
        const next = [post, ...existing].slice(0, MAX_POSTS);
        setPosts(next);
        await persist(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bilinmeyen hata");
      } finally {
        setLoading(false);
        inFlight.current = false;
      }
    },
    [persist],
  );

  const refresh = useCallback(async () => {
    const today = todayKey();
    const without = posts.filter((p) => p.date !== today);
    await generate(today, without, true);
  }, [generate, posts]);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    (async () => {
      let cached: BlogPost[] = [];
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (Array.isArray(data)) cached = data as BlogPost[];
        }
      } catch {
        // ignore
      }
      // Drop low-quality cached posts (old refusals etc.)
      cached = cached.filter((p) => {
        if (!p.content || p.content.length < 500) return false;
        const blob = `${p.title} ${p.subtitle} ${p.content}`.toLowerCase();
        const badTerms = [
          "engellendi",
          "üretemiyorum",
          "üretemedim",
          "web araması",
          "web tarama",
          "erişimim yok",
          "erişim sağlayamıyor",
          "servis aktif değil",
          "servisi gerekli",
        ];
        return !badTerms.some((t) => blob.includes(t));
      });
      setPosts(cached);
      const today = todayKey();
      if (!cached.some((p) => p.date === today)) {
        void generate(today, cached);
      }
    })();
  }, [generate]);

  useEffect(() => {
    // Hourly check — if local date rolled over (new morning), generate today's post.
    const id = setInterval(() => {
      const today = todayKey();
      if (!posts.some((p) => p.date === today) && !inFlight.current) {
        void generate(today, posts);
      }
    }, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [generate, posts]);

  return (
    <BlogContext.Provider value={{ posts, loading, error, refresh }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error("useBlog must be used inside BlogProvider");
  return ctx;
}
