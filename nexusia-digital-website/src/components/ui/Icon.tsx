const paths = {
  cart: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2 M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 21a8 8 0 0 1 16 0",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3",
  menu: "M4 7h16 M4 12h16 M4 17h10",
  close: "M6 6l12 12 M18 6 6 18",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3 12h18 M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
  chevron: "M6 9l6 6 6-6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M6 11h12v10H6z M8 11V8a4 4 0 1 1 8 0v3",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3Z M8.5 12l2.5 2.5 4.5-5",
  languages: "M4 5h9 M8.5 3v2 M6 5c.6 3.2 2.6 5.7 5.5 7 M11 5c-.8 3.8-3.4 6.6-7 8 M13 21l4-10 4 10 M14.3 18h5.4",
  sparkle: "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z",
  plus: "M12 5v14 M5 12h14",
  minus: "M5 12h14",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  download: "M12 3v12 M7 10l5 5 5-5 M4 21h16",
  play: "M8 5v14l11-7L8 5Z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.6 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
