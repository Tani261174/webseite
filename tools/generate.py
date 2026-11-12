"""Erzeugt die Branchen-Vorlagen und baut die Galerie in index.html neu auf.

Aufruf (im Projektordner):  python3 tools/generate.py
Vorschaubilder:             node tools/vorschau.js [slug,slug,...]
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
from branchen import B  # noqa: E402
from layouts import LAYOUTS, ACC, e  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'vorlagen')

CATS = [
    ('gesundheit', 'Gesundheit & Medizin'), ('beauty', 'Beauty & Wellness'), ('sport', 'Sport & Freizeit'),
    ('handwerk', 'Handwerk & Bau'), ('gastro', 'Gastronomie & Hotel'), ('dienstleistung', 'Dienstleistung & Beratung'),
    ('kreativ', 'Kreativ & Events'), ('bildung', 'Bildung & Soziales'), ('auto', 'Auto & Mobilität'), ('shop', 'Handel & Shop'),
]

# Die 16 handgebauten Vorlagen (nur Daten für die Galerie)
HAND = [
    ('kanzlei', 'dienstleistung', 'Kanzlei & Beratung', 'Klassik', 'Seriös, ruhig und auf das Wesentliche reduziert.', ['#2f3e55', '#efece6', '#1c1d20']),
    ('restaurant', 'gastro', 'Restaurant & Café', 'Genuss', 'Stimmungsvoll, mit Speisekarte und Tischreservierung.', ['#b49a78', '#f6f2ec', '#1a1816']),
    ('handwerk', 'handwerk', 'Schreinerei & Handwerk', 'Werkstatt', 'Kräftig und direkt, mit Kennzahlen und Referenzen.', ['#b0613f', '#f4f3f0', '#161616']),
    ('praxis', 'gesundheit', 'Physiotherapie & Praxis', 'Balance', 'Hell, freundlich und mit Terminanfrage.', ['#7d8c78', '#eceeea', '#1e2321']),
    ('immobilien', 'dienstleistung', 'Immobilien & Makler', 'Prestige', 'Minimalistisch und edel, mit Objektsuche.', ['#2b2b2b', '#f3f3f1', '#ffffff']),
    ('studio', 'beauty', 'Kosmetik & Beauty', 'Atelier', 'Sanft und elegant, mit Preisliste und Buchung.', ['#a89584', '#f1ebe5', '#2a2523']),
    ('fitness', 'sport', 'Fitness & Personal Training', 'Energie', 'Dunkel und kraftvoll, mit Paketen und Probetraining.', ['#b49a78', '#1b1b1b', '#f2f1ee']),
    ('friseur', 'beauty', 'Friseur & Salon', 'Kante', 'Modern und selbstbewusst, mit Preisliste und Team.', ['#2b2b2b', '#efede8', '#faf9f6']),
    ('shop', 'shop', 'Online-Shop', 'Manufaktur', 'Produkte, Kategorien und Warenkorb – bereit zum Verkaufen.', ['#2f3e55', '#f4f2ee', '#ffffff']),
    ('hotel', 'gastro', 'Hotel & Ferienwohnung', 'Seeblick', 'Ruhig und einladend, mit Zimmern und Verfügbarkeitssuche.', ['#2d5f63', '#eeece7', '#1d2120']),
    ('fotografie', 'kreativ', 'Fotografie', 'Linse', 'Ruhiges Portfolio mit Bildergalerie, Filter und Paketen.', ['#2b2b2b', '#f3f2ef', '#ffffff']),
    ('architektur', 'kreativ', 'Architektur & Interior', 'Raster', 'Klares Raster, große Typografie, Projekte im Fokus.', ['#2b2b2b', '#f2f2f0', '#111111']),
    ('kfz', 'auto', 'Kfz-Werkstatt', 'Garage', 'Terminformular direkt im Kopfbereich, Leistungen mit Preisen.', ['#2f3e55', '#f3f4f5', '#1b1e22']),
    ('software', 'dienstleistung', 'IT & Software', 'Digital', 'Modern wie ein Startup, mit App-Vorschau und Preisumschalter.', ['#2d5f63', '#f0f1f1', '#0f1112']),
    ('event', 'kreativ', 'Hochzeit & Events', 'Festlich', 'Romantisch und elegant, mit Ablauf und Anfrageformular.', ['#b49a78', '#f3eee7', '#2a2724']),
    ('reinigung', 'dienstleistung', 'Reinigung & Gebäudeservice', 'Klar', 'Freundlich und vertrauensvoll, mit Angebotsrechner.', ['#7d8c78', '#f2f4f4', '#1b2023']),
]
LAYOUT_BG = {'A': '#efece6', 'B': '#eceeef', 'C': '#161616', 'D': '#f1ebe5', 'E': '#f3f3f1', 'F': '#f2f4f4'}
LAYOUT_INK = {'A': '#1d1e21', 'B': '#1c2124', 'C': '#f4f3f0', 'D': '#2a2523', 'E': '#111111', 'F': '#1b2023'}


def katalog():
    items = []
    for i, (slug, cat, br, name, desc, cols) in enumerate(HAND):
        items.append(dict(nr=f'{i + 1:02d}', slug=slug, cat=cat, br=br, name=name, desc=desc, cols=cols))
    for d in B:
        items.append(dict(nr=d['nr'], slug=d['slug'], cat=d['cat'], br=d['br'], name=d['name'], desc=d['desc'],
                          cols=[ACC[d['acc']][0], LAYOUT_BG[d['lay']], LAYOUT_INK[d['lay']]]))
    return items


def galerie(items):
    btns = '<button aria-pressed="true" data-f="alle">Alle</button>\n' + '\n'.join(
        f'      <button aria-pressed="false" data-f="{c}">{e(l)}</button>' for c, l in CATS)
    cards = []
    for it in items:
        dots = ''.join(f'<i style="background:{c}"></i>' for c in it['cols'])
        cards.append(f'''      <a class="tpl rv" data-cat="{it['cat']}" data-s="{e((it['br'] + ' ' + it['name'] + ' ' + it['desc']).lower())}" href="vorlagen/{it['slug']}.html">
        <div class="shot"><img src="vorlagen/vorschau/{it['slug']}.jpg" alt="Vorschau der Vorlage {e(it['name'])}" loading="lazy"><div class="over"><span>Live-Vorschau öffnen →</span></div></div>
        <div class="info"><div><small>Vorlage {it['nr']} · {e(it['br'])}</small><h3>{e(it['name'])}</h3><p>{e(it['desc'])}</p></div>
          <div class="dots">{dots}</div></div>
      </a>''')
    return f'''<!-- KATALOG:START (automatisch erzeugt von tools/generate.py) -->
    <div class="tools rv">
      <label class="search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" id="tsuche" placeholder="Branche suchen, z. B. Zahnarzt, Bäckerei, Elektriker …" aria-label="Vorlagen durchsuchen"></label>
      <span id="tcount">{len(items)} Vorlagen</span>
    </div>
    <div class="filters rv" role="group" aria-label="Vorlagen filtern">
      {btns}
    </div>
    <div class="tpl-grid">
{chr(10).join(cards)}
    </div>
    <p class="none" id="tnone" hidden>Keine passende Vorlage gefunden – fragen Sie uns einfach nach einer individuellen Lösung.</p>
<!-- KATALOG:END -->'''


def optionen(items):
    o = '\n'.join(f'          <option>{it["nr"]} {e(it["name"])} ({e(it["br"])})</option>' for it in items)
    return f'<!-- OPTIONEN:START -->\n{o}\n<!-- OPTIONEN:END -->'


def main():
    for d in B:
        with open(os.path.join(V, d['slug'] + '.html'), 'w') as f:
            f.write(LAYOUTS[d['lay']](d))
    items = katalog()
    p = os.path.join(ROOT, 'index.html')
    s = open(p).read()
    s = re.sub(r'<!-- KATALOG:START.*?<!-- KATALOG:END -->', lambda m: galerie(items), s, flags=re.S)
    s = re.sub(r'<!-- OPTIONEN:START -->.*?<!-- OPTIONEN:END -->', lambda m: optionen(items), s, flags=re.S)
    s = re.sub(r'<strong>\d+</strong><span>Designvorlagen', f'<strong>{len(items)}</strong><span>Designvorlagen', s)
    open(p, 'w').write(s)
    print(f'{len(B)} Seiten erzeugt, Galerie mit {len(items)} Vorlagen aktualisiert.')


if __name__ == '__main__':
    main()
