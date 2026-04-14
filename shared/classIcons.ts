export const CLASS_ICONS: Record<string, string> = {
  "Bárbaro": "⚔",
  "Bardo": "♪",
  "Clérigo": "✦",
  "Paladín": "🛡",
  "Druida": "◈",
  "Erudito": "◉",
};

export function getClassIcon(title: string): string {
  return CLASS_ICONS[title] ?? "◆";
}
