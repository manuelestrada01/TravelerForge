import VerseAngelOverlay from "./VerseAngelOverlay";
import VerseContent from "./VerseContent";

interface OurMannaResponse {
  verse: {
    details: {
      text: string;
      reference: string;
    };
  };
}

interface MyMemoryResponse {
  responseStatus: number;
  responseData: {
    translatedText: string;
  };
}

const BOOK_NAMES: Record<string, string> = {
  Genesis: "Génesis", Exodus: "Éxodo", Leviticus: "Levítico", Numbers: "Números",
  Deuteronomy: "Deuteronomio", Joshua: "Josué", Judges: "Jueces", Ruth: "Rut",
  "1 Samuel": "1 Samuel", "2 Samuel": "2 Samuel", "1 Kings": "1 Reyes",
  "2 Kings": "2 Reyes", "1 Chronicles": "1 Crónicas", "2 Chronicles": "2 Crónicas",
  Ezra: "Esdras", Nehemiah: "Nehemías", Esther: "Ester", Job: "Job",
  Psalms: "Salmos", Psalm: "Salmos", Proverbs: "Proverbios", Ecclesiastes: "Eclesiastés",
  "Song of Solomon": "Cantares", "Song of Songs": "Cantares", Isaiah: "Isaías",
  Jeremiah: "Jeremías", Lamentations: "Lamentaciones", Ezekiel: "Ezequiel",
  Daniel: "Daniel", Hosea: "Oseas", Joel: "Joel", Amos: "Amós", Obadiah: "Abdías",
  Jonah: "Jonás", Micah: "Miqueas", Nahum: "Nahúm", Habakkuk: "Habacuc",
  Zephaniah: "Sofonías", Haggai: "Hageo", Zechariah: "Zacarías", Malachi: "Malaquías",
  Matthew: "Mateo", Mark: "Marcos", Luke: "Lucas", John: "Juan", Acts: "Hechos",
  Romans: "Romanos", "1 Corinthians": "1 Corintios", "2 Corinthians": "2 Corintios",
  Galatians: "Gálatas", Ephesians: "Efesios", Philippians: "Filipenses",
  Colossians: "Colosenses", "1 Thessalonians": "1 Tesalonicenses",
  "2 Thessalonians": "2 Tesalonicenses", "1 Timothy": "1 Timoteo",
  "2 Timothy": "2 Timoteo", Titus: "Tito", Philemon: "Filemón", Hebrews: "Hebreos",
  James: "Santiago", "1 Peter": "1 Pedro", "2 Peter": "2 Pedro",
  "1 John": "1 Juan", "2 John": "2 Juan", "3 John": "3 Juan",
  Jude: "Judas", Revelation: "Apocalipsis",
};

function translateReference(reference: string): string {
  for (const [en, es] of Object.entries(BOOK_NAMES)) {
    if (reference.startsWith(en)) {
      return reference.replace(en, es);
    }
  }
  return reference;
}

async function translateToSpanish(text: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return text;
    const data: MyMemoryResponse = await res.json();
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return text;
  } catch {
    return text;
  }
}

async function fetchVerseOfDay(): Promise<{ text: string; reference: string } | null> {
  try {
    const res = await fetch("https://beta.ourmanna.com/api/v1/get/?format=json", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data: OurMannaResponse = await res.json();
    const englishText = data.verse.details.text;
    const spanishText = await translateToSpanish(englishText);
    return {
      text: spanishText,
      reference: translateReference(data.verse.details.reference),
    };
  } catch {
    return null;
  }
}

// Parchment noise — fine grain for ancient manuscript feel
const PARCHMENT_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")";

export default async function VerseOfDay() {
  const verse = await fetchVerseOfDay();

  return (
    <div
      className="relative flex flex-col items-center justify-center p-7 text-center overflow-hidden h-full"
      style={{
        background: `${PARCHMENT_NOISE}, linear-gradient(180deg, #1e1b0e 0%, #17140a 40%, #100e07 100%)`,
        border: "1px solid rgba(220,195,110,0.42)",
        boxShadow:
          "0 6px 36px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,250,200,0.06), inset 0 -1px 0 rgba(0,0,0,0.3)",
      }}
    >
      {/* ── Angel animation overlay ── */}
      <VerseAngelOverlay />

      {/* ── Inner manuscript frame ── */}
      <div
        className="pointer-events-none absolute inset-[7px]"
        style={{ border: "1px solid rgba(220,195,110,0.14)" }}
      />

      {/* ── Second inner frame — illuminated border ── */}
      <div
        className="pointer-events-none absolute inset-[12px]"
        style={{ border: "1px solid rgba(220,195,110,0.06)" }}
      />

      {/* ── Corner flourishes — ornate manuscript ── */}
      <span className="pointer-events-none absolute top-[4px] left-[4px] select-none leading-none" style={{ fontSize: "8px", color: "rgba(220,195,110,0.55)" }}>✦</span>
      <span className="pointer-events-none absolute top-[4px] right-[4px] select-none leading-none" style={{ fontSize: "8px", color: "rgba(220,195,110,0.55)" }}>✦</span>
      <span className="pointer-events-none absolute bottom-[4px] left-[4px] select-none leading-none" style={{ fontSize: "8px", color: "rgba(220,195,110,0.55)" }}>✦</span>
      <span className="pointer-events-none absolute bottom-[4px] right-[4px] select-none leading-none" style={{ fontSize: "8px", color: "rgba(220,195,110,0.55)" }}>✦</span>

      {/* ── Crepuscular rays — divine light from above ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "280%",
          height: "85%",
          background: `conic-gradient(
            from 270deg at 50% 0%,
            transparent 0deg,
            rgba(255,248,180,0.025) 2deg, transparent 4deg,
            transparent 14deg, rgba(255,248,180,0.02) 16deg, transparent 18deg,
            transparent 26deg, rgba(255,248,180,0.03) 28deg, transparent 30deg,
            transparent 38deg, rgba(255,248,180,0.018) 40deg, transparent 42deg,
            transparent 50deg, rgba(255,248,180,0.025) 52deg, transparent 54deg,
            transparent 62deg, rgba(255,248,180,0.02) 64deg, transparent 66deg,
            transparent 74deg, rgba(255,248,180,0.015) 76deg, transparent 78deg,
            transparent 86deg, rgba(255,248,180,0.02) 88deg, transparent 90deg
          )`,
        }}
      />

      {/* ── Primary divine glow — descending light column ── */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "100%",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,248,180,0.1) 0%, rgba(255,240,140,0.04) 40%, transparent 75%)",
        }}
      />

      {/* ── Ambient warm fill ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220,195,110,0.03) 0%, transparent 70%)",
        }}
      />

      {/* ── Top rule — golden light bar ── */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,248,180,0.3) 30%, rgba(255,255,220,0.6) 50%, rgba(255,248,180,0.3) 70%, transparent 100%)",
        }}
      />

      {/* ── Content with GSAP animations — word reveal + halo pulse ── */}
      {verse ? (
        <VerseContent text={verse.text} reference={verse.reference} />
      ) : (
        <p className="relative font-serif italic" style={{ fontSize: "12px", color: "rgba(220,195,110,0.35)" }}>
          No disponible en este momento.
        </p>
      )}

      {/* ── Bottom ornament — three divine lights ── */}
      <div
        className="pointer-events-none absolute bottom-3 left-1/2 flex items-center gap-2"
        style={{ transform: "translateX(-50%)" }}
      >
        <span style={{ fontSize: "5px", color: "rgba(220,195,110,0.3)" }}>✦</span>
        <div
          style={{
            width: "28px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(220,195,110,0.25) 50%, transparent)",
          }}
        />
        <span style={{ fontSize: "7px", color: "rgba(255,248,180,0.45)" }}>✦</span>
        <div
          style={{
            width: "28px",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(220,195,110,0.25) 50%, transparent)",
          }}
        />
        <span style={{ fontSize: "5px", color: "rgba(220,195,110,0.3)" }}>✦</span>
      </div>

      {/* ── Bottom rule ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(220,195,110,0.2) 40%, rgba(220,195,110,0.35) 50%, rgba(220,195,110,0.2) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
