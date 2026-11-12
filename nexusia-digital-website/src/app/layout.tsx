// Durchreichendes Root-Layout: <html>/<body> werden im Sprach-Layout ([locale]/layout.tsx)
// bzw. im Admin-Layout gesetzt, damit das lang-Attribut zur Sprache passt.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
