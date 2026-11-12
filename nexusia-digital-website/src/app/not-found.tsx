import "./globals.css";

// Globale 404 für Pfade außerhalb der Sprachbereiche (selten – die Middleware leitet fast alles um).
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body className="bg-noir grid min-h-dvh place-items-center text-center text-white">
        <div>
          <p className="display text-gold text-8xl">404</p>
          <a href="/de" className="btn btn-gold mt-8">Zur Startseite</a>
        </div>
      </body>
    </html>
  );
}
