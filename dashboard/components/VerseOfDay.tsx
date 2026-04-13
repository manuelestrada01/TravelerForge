import { BookOpen } from "lucide-react";

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

export default async function VerseOfDay() {
  const verse = await fetchVerseOfDay();

  return (
    <div className="hud-panel hud-panel-teal rune-corners relative flex flex-col items-center justify-center p-6 text-center h-full">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.04)_0%,transparent_70%)]" />

      {/* Top teal ornament line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal/50 to-transparent" />

      {/* Icon */}
      <div
        className="relative mb-4 flex h-11 w-11 items-center justify-center bg-teal/10 border border-teal/30"
        style={{ clipPath: "polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))" }}
      >
        <BookOpen size={20} strokeWidth={1.2} className="text-teal" />
      </div>

      {/* Label */}
      <p className="relative mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-sage/60">
        Versículo del Día
      </p>

      {/* Gold divider */}
      <div className="relative mb-5 mt-2 gold-divider w-16" />

      {/* Verse */}
      {verse ? (
        <blockquote className="relative flex flex-col items-center">
          <p className="font-serif text-sm leading-relaxed text-cream italic">
            &ldquo;{verse.text}&rdquo;
          </p>
          <cite className="mt-3 block text-[11px] not-italic text-gold/80 tracking-wider">
            — {verse.reference}
          </cite>
        </blockquote>
      ) : (
        <p className="text-xs text-sage/50">No disponible en este momento.</p>
      )}

      {/* Bottom ornament */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-20 gold-divider" />
    </div>
  );
}
