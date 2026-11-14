"""Erzeugt das Arbeitsblatt der Amazon-Musterlektion als PDF in ES, DE und EN.
Aufruf: python3 scripts/make-worksheet.py"""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

GOLD, INK, GREY = HexColor("#C6A15B"), HexColor("#080808"), HexColor("#5c5c5c")
W, H = A4
T = {
 "es": dict(file="amazon-hoja-de-trabajo-modelos.pdf", head="ACADEMIA NEXUSIA DIGITAL  ·  AMAZON BUSINESS MASTERCLASS  ·  MÓDULO 1",
   title="Hoja de trabajo: tu mapa de decisión", s1="1. Tu punto de partida",
   q=["Presupuesto máximo que puedo invertir sin arriesgar mis gastos básicos:", "Horas reales por semana durante los próximos 3 meses:", "Mis tres habilidades más fuertes:"],
   s2="2. Puntúa cada modelo del 1 (no encaja) al 5 (encaja muy bien)", cols=["Modelo", "Presupuesto", "Tiempo", "Habilidades", "Riesgo", "Total"],
   models=["Amazon Afiliados", "Programa de Influencers", "FBA", "FBM", "KDP"], s3="3. Mi decisión para los próximos 90 días",
   d=["Modelo principal:", "Modelo secundario (opcional):", "Lo elijo porque…"],
   f1="Guarda esta hoja: la usarás en el plan de acción de 90 días (módulo 15). Ningún modelo garantiza ingresos.",
   f2="Academia NexusIA Digital es independiente y no está afiliada a Amazon."),
 "de": dict(file="amazon-arbeitsblatt-modelle.pdf", head="ACADEMIA NEXUSIA DIGITAL  ·  AMAZON BUSINESS MASTERCLASS  ·  MODUL 1",
   title="Arbeitsblatt: deine Entscheidungskarte", s1="1. Dein Ausgangspunkt",
   q=["Maximales Budget, das ich investieren kann, ohne meine Grundausgaben zu gefährden:", "Realistische Stunden pro Woche in den nächsten 3 Monaten:", "Meine drei stärksten Fähigkeiten:"],
   s2="2. Bewerte jedes Modell von 1 (passt nicht) bis 5 (passt sehr gut)", cols=["Modell", "Budget", "Zeit", "Fähigkeiten", "Risiko", "Summe"],
   models=["Amazon-Partnerprogramm", "Influencer-Programm", "FBA", "FBM", "KDP"], s3="3. Meine Entscheidung für die nächsten 90 Tage",
   d=["Hauptmodell:", "Zweites Modell (optional):", "Ich wähle es, weil …"],
   f1="Heb dieses Blatt auf: Du brauchst es im 90-Tage-Aktionsplan (Modul 15). Kein Modell garantiert Einnahmen.",
   f2="Die Academia NexusIA Digital ist unabhängig und nicht mit Amazon verbunden."),
 "en": dict(file="amazon-worksheet-models.pdf", head="ACADEMIA NEXUSIA DIGITAL  ·  AMAZON BUSINESS MASTERCLASS  ·  MODULE 1",
   title="Worksheet: your decision map", s1="1. Your starting point",
   q=["Maximum budget I can invest without risking my basic expenses:", "Realistic hours per week over the next 3 months:", "My three strongest skills:"],
   s2="2. Score each model from 1 (poor fit) to 5 (great fit)", cols=["Model", "Budget", "Time", "Skills", "Risk", "Total"],
   models=["Amazon Associates", "Influencer Program", "FBA", "FBM", "KDP"], s3="3. My decision for the next 90 days",
   d=["Main model:", "Secondary model (optional):", "I'm choosing it because…"],
   f1="Keep this sheet: you'll use it in the 90-day action plan (module 15). No model guarantees income.",
   f2="Academia NexusIA Digital is independent and not affiliated with Amazon."),
}
for lang, t in T.items():
    c = canvas.Canvas("public/academia/" + t["file"], pagesize=A4)
    c.setTitle(t["title"]); c.setAuthor("Academia NexusIA Digital")
    c.setFillColor(INK); c.rect(0, H - 120, W, 120, fill=1, stroke=0)
    c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 8); c.drawString(40, H - 45, t["head"])
    c.setFillColor(HexColor("#FFFFFF")); c.setFont("Times-Roman", 26); c.drawString(40, H - 82, t["title"])
    c.setStrokeColor(GOLD); c.setLineWidth(1); c.line(40, H - 100, 200, H - 100)
    y = [H - 155]
    def label(text, size=10, color=INK, font="Helvetica-Bold"):
        c.setFont(font, size); c.setFillColor(color); c.drawString(40, y[0], text); y[0] -= size + 8
    def lines(n, gap=22):
        c.setStrokeColor(HexColor("#d8d6d0")); c.setLineWidth(0.6)
        for _ in range(n):
            c.line(40, y[0], W - 40, y[0]); y[0] -= gap
        y[0] -= 6
    label(t["s1"])
    for q in t["q"]:
        label(q, 9, GREY, "Helvetica"); lines(1)
    label(t["s2"])
    xs = [40, 170, 250, 330, 420, 500]
    c.setFont("Helvetica-Bold", 9); c.setFillColor(INK)
    for x, col in zip(xs, t["cols"]): c.drawString(x, y[0], col)
    y[0] -= 8; c.setStrokeColor(INK); c.line(40, y[0], W - 40, y[0]); y[0] -= 20
    c.setFont("Helvetica", 10)
    for m in t["models"]:
        c.setFillColor(INK); c.setFont("Helvetica", 9.5 if len(m) > 20 else 10); c.drawString(40, y[0], m)
        c.setStrokeColor(HexColor("#d8d6d0"))
        for x in xs[1:]: c.rect(x, y[0] - 5, 50, 18, stroke=1, fill=0)
        y[0] -= 28
    y[0] -= 10
    label(t["s3"])
    label(t["d"][0], 9, GREY, "Helvetica"); lines(1)
    label(t["d"][1], 9, GREY, "Helvetica"); lines(1)
    label(t["d"][2], 9, GREY, "Helvetica"); lines(3)
    c.setFont("Helvetica", 7.5); c.setFillColor(GREY)
    c.drawString(40, 40, t["f1"]); c.drawString(40, 28, t["f2"])
    c.save()
    print(lang, t["file"])
