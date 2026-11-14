import type { LessonBody } from "../types";

/** Musterlektion – deutsche Fassung (inhaltsgleich mit der spanischen). */
export const amazonSampleLessonDe: LessonBody = {
  lang: "de",
  intro:
    "Wenn jemand sagt „Ich verdiene Geld mit Amazon“, kann das ganz Unterschiedliches bedeuten. Eine Creatorin, die Produkte empfiehlt, ein Händler, der seine eigene Marke importiert und verkauft, und eine Autorin, die ihr Buch veröffentlicht, arbeiten völlig verschieden. In dieser Lektion lernst du die fünf wichtigsten Modelle kennen, was jedes davon voraussetzt und wie du das Modell findest, das für deinen Start am besten passt.",
  objectives: [
    "Die fünf gängigsten Geschäftsmodelle auf Amazon unterscheiden.",
    "Verstehen, was du für jedes Modell brauchst: Produkt, Budget, Zeit und Fähigkeiten.",
    "Risiken realistisch einschätzen, bevor du Geld investierst.",
    "Ein Startmodell bewusst wählen – nicht aus dem Bauch heraus.",
  ],
  blocks: [
    { type: "h", text: "1. Amazon ist nicht ein einziges Geschäft" },
    {
      type: "p",
      text:
        "Amazon besteht aus mehreren Welten gleichzeitig: einem Marktplatz, auf dem Dritte Produkte verkaufen, einem Partnerprogramm, das Provisionen für Empfehlungen zahlt, einer Selfpublishing-Plattform für Bücher und einem Logistikunternehmen. Jede dieser Welten hat eigene Regeln, eigene Konten und je nach Land eigene Bedingungen (amazon.de, amazon.es, amazon.com, amazon.com.mx usw.).",
    },
    {
      type: "callout",
      title: "Wichtig vom ersten Tag an",
      text:
        "Bedingungen, Gebühren und Provisionen ändern sich mit der Zeit und unterscheiden sich je nach Land. In diesem Kurs zeigen wir dir, wo du sie findest und wie du damit rechnest – prüf aber vor jeder Entscheidung die offizielle Seite des Programms auf deinem Marktplatz.",
    },
    { type: "h", text: "2. Die fünf Modelle" },
    { type: "p", text: "Modell 1 – Amazon-Partnerprogramm (Affiliate). Du empfiehlst Amazon-Produkte über spezielle Links auf deiner Website, in deinem Blog, in sozialen Netzwerken oder im Newsletter. Kauft jemand über deinen Link, bekommst du eine Provision, deren Höhe von Produktkategorie und Land abhängt. Du brauchst weder ein eigenes Produkt noch ein Lager. Deine Aufgabe: hilfreiche Inhalte erstellen und das Vertrauen deiner Community gewinnen." },
    { type: "p", text: "Modell 2 – Amazon-Influencer-Programm. Eine Erweiterung des Partnerprogramms für Creator mit Reichweite in sozialen Netzwerken. Wirst du aufgenommen, bekommst du eine eigene Shopseite bei Amazon, auf der du deine Empfehlungen bündelst, und kannst in manchen Ländern Produktvideos veröffentlichen. Amazon prüft jede Bewerbung, und das Programm gibt es nicht auf allen Marktplätzen." },
    { type: "p", text: "Modell 3 – Verkaufen mit FBA (Fulfillment by Amazon / Versand durch Amazon). Du verkaufst eigene Produkte (vom Hersteller eingekauft, als Eigenmarke oder zum Wiederverkauf) über ein Verkäuferkonto in Seller Central. Du schickst deine Ware an die Amazon-Lager, und Amazon übernimmt Lagerung, Verpackung und Versand der Bestellungen sowie Rücksendungen und Kundenservice für diese Bestellungen. Dafür zahlst du Versand- und Lagergebühren." },
    { type: "p", text: "Modell 4 – Verkaufen mit FBM (Fulfilled by Merchant / Versand durch den Verkäufer). Auch hier verkaufst du eigene Produkte über Seller Central, lagerst und versendest aber selbst. Du hast mehr Kontrolle und weniger Amazon-Logistikgebühren, dafür mehr eigenen Aufwand und die Verantwortung, Lieferzeiten einzuhalten." },
    { type: "p", text: "Modell 5 – Amazon KDP (Kindle Direct Publishing). Du veröffentlichst dein eigenes Buch als E-Book und auf Wunsch als gedrucktes Buch. Die Veröffentlichung kostet nichts, und Printbücher werden erst bei Bestellung gedruckt – du brauchst also kein Lager. Du erhältst Tantiemen: Für E-Books bietet Amazon zwei Optionen (35 % und 70 %, letztere mit Vorgaben zu Preis und Gebiet), bei Printbüchern werden die Druckkosten abgezogen. Was du investierst, ist Zeit und – wenn du möchtest – Geld für Lektorat, Satz oder Cover." },
    { type: "h", text: "3. Der schnelle Vergleich" },
    {
      type: "table",
      head: ["Modell", "Eigenes Produkt?", "Typische Startinvestition", "Hauptaufgabe", "Finanzielles Risiko"],
      rows: [
        ["Affiliate", "Nein", "Gering: vor allem Zeit", "Inhalte erstellen und empfehlen", "Gering; Einnahmen stark schwankend"],
        ["Influencer", "Nein", "Gering: Zeit und einfache Ausstattung", "Videos und Social-Media-Inhalte", "Gering; Aufnahme nötig"],
        ["FBA", "Ja", "Mittel bis hoch: Ware und Gebühren", "Produkt, Lieferungen an Amazon, Werbung", "Mittel bis hoch: gebundenes Kapital im Lager"],
        ["FBM", "Ja", "Mittel: Ware und Versand", "Produkt, eigenes Lager und Versand", "Mittel"],
        ["KDP", "Ja, dein Buch", "Gering: Zeit; Design optional", "Schreiben, setzen, veröffentlichen, bewerben", "Gering"],
      ],
    },
    {
      type: "callout",
      title: "Keine falschen Versprechen",
      text:
        "Kein Modell garantiert Einnahmen. Mit jedem davon verdienen manche Menschen Geld – und viele nicht. Der Unterschied liegt meist in Ausdauer, im Verständnis der Zahlen und darin, etwas wirklich Nützliches anzubieten. Sei misstrauisch, wenn dir jemand schnelle Ergebnisse verspricht.",
    },
    { type: "h", text: "4. So wählst du dein Startmodell" },
    { type: "p", text: "Du musst dich nicht für immer festlegen. Viele Geschäfte kombinieren Modelle: zum Beispiel erst mit Content und Affiliate-Links starten und später ein Buch oder ein eigenes Produkt herausbringen. Für deinen ersten Schritt beantworte ehrlich vier Fragen:" },
    {
      type: "list",
      ordered: true,
      items: [
        "Budget: Wie viel Geld kannst du investieren, ohne deine Grundausgaben zu gefährden?",
        "Zeit: Wie viele Stunden pro Woche kannst du in den nächsten drei Monaten wirklich aufbringen?",
        "Fähigkeiten: Liegt dir eher Content erstellen, Schreiben oder Verhandeln und Logistik organisieren?",
        "Risikobereitschaft: Wie würdest du dich fühlen, wenn sich eine Investition nicht auszahlt?",
      ],
    },
    {
      type: "example",
      title: "Praxisbeispiel (fiktiver Fall): Lucía, 4 Stunden pro Woche und wenig Budget",
      text: [
        "Lucía arbeitet Vollzeit, liebt gesunde Küche und teilt schon Rezepte auf Instagram. Sie hat etwa 4 freie Stunden pro Woche und möchte nicht mehr investieren, als sie verlieren könnte.",
        "FBA passt gerade nicht: Sie müsste Ware einkaufen, Gebühren kalkulieren und Lieferungen an Lager organisieren – mit 4 Stunden pro Woche und wenig Kapital schwierig.",
        "Affiliate passt: Sie kann in ihren Rezepten die Küchenhelfer empfehlen, die sie wirklich nutzt, und klar kennzeichnen, dass es Affiliate-Links sind.",
        "KDP ist eine gute zweite Etappe: Aus ihren eigenen Rezepten kann ein Kochbuch werden. Vorher prüft sie, welche Rezepte ihre Community am meisten interessieren.",
        "Bewusste Entscheidung: 90 Tage mit Affiliate starten, Ergebnisse messen und parallel das Inhaltsverzeichnis ihres Buchs vorbereiten.",
      ],
    },
    { type: "h", text: "5. Häufige Fehler am Anfang" },
    {
      type: "list",
      items: [
        "Das Modell wählen, das laut einem Video „am meisten Geld bringt“, statt das, das zu deiner Situation passt.",
        "In Ware investieren, bevor du Gebühren, Margen und Nachfrage verstehst.",
        "Affiliate-Links ohne Kennzeichnung veröffentlichen: Das kostet Vertrauen und verstößt gegen die Programmregeln und das Werberecht.",
        "Inhalte oder Bücher anderer kopieren: Amazon kann Produkte entfernen und Konten wegen Rechtsverletzungen schließen.",
        "Mit KI erstellte Inhalte bei KDP veröffentlichen, ohne sie zu prüfen und – wo die Plattform es verlangt – anzugeben.",
      ],
    },
    {
      type: "exercise",
      title: "Übung: deine Entscheidungskarte (15–20 Minuten)",
      steps: [
        "Lade das Arbeitsblatt dieser Lektion herunter oder nimm ein leeres Blatt.",
        "Notiere dein maximales Budget, deine realistischen Wochenstunden und deine drei stärksten Fähigkeiten.",
        "Bewerte jedes Modell (Affiliate, Influencer, FBA, FBM, KDP) von 1 bis 5 danach, wie gut es zu diesen Angaben passt.",
        "Wähle ein Hauptmodell für die nächsten 90 Tage und, wenn du willst, ein zweites.",
        "Schreib in einem Satz auf, warum du dich dafür entscheidest. Heb das Blatt auf: Wir nutzen es im 90-Tage-Aktionsplan (Modul 15).",
      ],
    },
  ],
  quiz: [
    {
      q: "Für welches Modell brauchst du KEIN eigenes Produkt?",
      options: ["Verkaufen mit FBA", "Amazon-Partnerprogramm (Affiliate)", "Verkaufen mit FBM", "Veröffentlichen mit KDP"],
      correct: 1,
      explain: "Beim Partnerprogramm empfiehlst du Produkte, die es bei Amazon schon gibt, und erhältst eine Provision für Käufe über deinen Link.",
    },
    {
      q: "Wer lagert und versendet die Bestellungen, wenn du mit FBA verkaufst?",
      options: ["Du selbst von zu Hause", "Eine Agentur, die du zwingend beauftragen musst", "Amazon aus seinen Logistikzentren", "Der Hersteller des Produkts"],
      correct: 2,
      explain: "Bei FBA schickst du deine Ware an Amazon. Amazon übernimmt gegen Gebühren Lagerung, Versand und Rücksendungen dieser Bestellungen.",
    },
    {
      q: "Was musst du tun, wenn du Affiliate-Links in sozialen Netzwerken teilst?",
      options: ["Nichts, das ist freiwillig", "Klar kennzeichnen, dass es Affiliate-Links sind", "Den Link in einem Kurzlink verstecken", "Sie nur in privaten Nachrichten nutzen"],
      correct: 1,
      explain: "Transparenz ist nach den Programmregeln und dem Werberecht vieler Länder Pflicht – und sie schafft Vertrauen.",
    },
    {
      q: "Welche Aussage über KDP stimmt?",
      options: [
        "Für jedes Buch muss man eine Gebühr zahlen",
        "Du musst die Bücher selbst drucken und lagern",
        "Die Veröffentlichung kostet nichts, und Printbücher werden bei Bestellung gedruckt",
        "Man kann nur E-Books veröffentlichen",
      ],
      correct: 2,
      explain: "Mit KDP veröffentlichst du E-Books und Printbücher ohne Startkosten; Printbücher werden gedruckt, wenn jemand sie kauft.",
    },
    {
      q: "Wie wählst du dein erstes Modell am besten?",
      options: [
        "Das, das im Internet am meisten Geld verspricht",
        "Nach Budget, Zeit, Fähigkeiten und Risikobereitschaft",
        "Mit allen gleichzeitig starten",
        "Das, das die meisten Freunde nutzen",
      ],
      correct: 1,
      explain: "Ein guter Start orientiert sich an deiner echten Situation. Kombinieren kannst du später immer noch.",
    },
  ],
  takeaways: [
    "„Geld verdienen mit Amazon“ umfasst mindestens fünf sehr unterschiedliche Modelle.",
    "Affiliate und Influencer brauchen kein Lager; FBA und FBM schon; KDP braucht dein eigenes Buch.",
    "Die Bedingungen unterscheiden sich je nach Land und ändern sich: Prüf immer die offiziellen Quellen.",
    "Kein Modell garantiert Einnahmen – wähle nach deiner Situation und miss deine Ergebnisse.",
  ],
};
