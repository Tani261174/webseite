"""Erzeugt das Arbeitsblatt der Amazon-Musterlektion (Spanisch) als PDF.
Aufruf: python3 scripts/make-worksheet.py"""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

GOLD, INK, GREY = HexColor("#C6A15B"), HexColor("#080808"), HexColor("#5c5c5c")
W, H = A4
c = canvas.Canvas("public/academia/amazon-hoja-de-trabajo-modelos.pdf", pagesize=A4)
c.setTitle("Hoja de trabajo – Tu mapa de decisión")
c.setAuthor("Academia NexusIA Digital")

c.setFillColor(INK); c.rect(0, H - 120, W, 120, fill=1, stroke=0)
c.setFillColor(GOLD); c.setFont("Helvetica-Bold", 8); c.drawString(40, H - 45, "ACADEMIA NEXUSIA DIGITAL  ·  AMAZON BUSINESS MASTERCLASS  ·  MÓDULO 1")
c.setFillColor(HexColor("#FFFFFF")); c.setFont("Times-Roman", 26); c.drawString(40, H - 82, "Hoja de trabajo: tu mapa de decisión")
c.setStrokeColor(GOLD); c.setLineWidth(1); c.line(40, H - 100, 200, H - 100)

y = H - 155
def label(text, size=10, color=INK, font="Helvetica-Bold"):
    global y
    c.setFont(font, size); c.setFillColor(color); c.drawString(40, y, text); y -= size + 8
def lines(n, gap=22):
    global y
    c.setStrokeColor(HexColor("#d8d6d0")); c.setLineWidth(0.6)
    for _ in range(n):
        c.line(40, y, W - 40, y); y -= gap
    y -= 6

label("1. Tu punto de partida")
for q in ["Presupuesto máximo que puedo invertir sin arriesgar mis gastos básicos:", "Horas reales por semana durante los próximos 3 meses:", "Mis tres habilidades más fuertes:"]:
    label(q, 9, GREY, "Helvetica"); lines(1)

label("2. Puntúa cada modelo del 1 (no encaja) al 5 (encaja muy bien)")
cols = ["Modelo", "Presupuesto", "Tiempo", "Habilidades", "Riesgo", "Total"]
xs = [40, 170, 250, 330, 420, 500]
c.setFont("Helvetica-Bold", 9); c.setFillColor(INK)
for x, t in zip(xs, cols): c.drawString(x, y, t)
y -= 8; c.setStrokeColor(INK); c.line(40, y, W - 40, y); y -= 20
c.setFont("Helvetica", 10)
for m in ["Amazon Afiliados", "Programa de Influencers", "FBA", "FBM", "KDP"]:
    c.setFillColor(INK); c.drawString(40, y, m)
    c.setStrokeColor(HexColor("#d8d6d0"))
    for x in xs[1:]: c.rect(x, y - 5, 50, 18, stroke=1, fill=0)
    y -= 28
y -= 10

label("3. Mi decisión para los próximos 90 días")
label("Modelo principal:", 9, GREY, "Helvetica"); lines(1)
label("Modelo secundario (opcional):", 9, GREY, "Helvetica"); lines(1)
label("Lo elijo porque…", 9, GREY, "Helvetica"); lines(3)

c.setFont("Helvetica", 7.5); c.setFillColor(GREY)
c.drawString(40, 40, "Guarda esta hoja: la usarás en el plan de acción de 90 días (módulo 15). Ningún modelo garantiza ingresos.")
c.drawString(40, 28, "Academia NexusIA Digital es independiente y no está afiliada a Amazon.")
c.save()
print("ok")
