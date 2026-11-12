"""Sechs Design-Grundlayouts für die Branchen-Vorlagen.

Jede Funktion bekommt ein Branchen-Dict (siehe branchen.py) und gibt eine
komplette HTML-Seite zurück. Farben laufen über --accent/--accent-ink, damit
der Farbwähler aus shared.js in jeder Vorlage funktioniert.
"""
import html
import re

ACC = {  # Kürzel -> (Farbe, Schriftfarbe auf der Farbe)
    'G': ('#2b2b2b', '#fff'), 'S': ('#b49a78', '#1d1a16'), 'Sa': ('#7d8c78', '#fff'),
    'N': ('#2f3e55', '#fff'), 'T': ('#b0613f', '#fff'), 'W': ('#7a2430', '#fff'), 'P': ('#2d5f63', '#fff'),
}

ICONS = [
    '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/>',
    '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"/>',
    '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    '<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2Z"/>',
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
]


def e(s):
    return html.escape(str(s), quote=True)


def em(s, tag='em'):
    """*Wort* -> <em>Wort</em> (nach dem Escapen)."""
    return re.sub(r'\*(.+?)\*', rf'<{tag}>\1</{tag}>', e(s))


def icon(i, size=24):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[i % len(ICONS)]}</svg>')


def head(d, fonts, css):
    a, ink = ACC[d['acc']]
    return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(d['brand'])} – {e(d['br'])} Vorlage</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?{fonts}&display=swap" rel="stylesheet">
<style>
:root{{--accent:{a};--accent-ink:{ink}}}
*{{box-sizing:border-box;margin:0;padding:0}}
html{{scroll-behavior:smooth;overflow-x:clip}}
a{{color:inherit;text-decoration:none}}
button,input,select,textarea{{font:inherit}}
.w{{max-width:1180px;margin:0 auto;padding:0 24px}}
section{{padding:104px 0}}
.img{{position:relative}}
.img::after{{content:attr(data-l);position:absolute;left:16px;bottom:14px;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;opacity:.55}}
[class*=grid]>*,.split>*{{min-width:0}}
h1,h2,h3{{overflow-wrap:break-word}}
@media(max-width:560px){{.w{{padding:0 16px}}h1,h2{{hyphens:auto;-webkit-hyphens:auto}}}}
{css}
</style>
</head>
<body data-vorlage="Vorlage {d['nr']} · {e(d['br'])}">
'''


TAIL = '<script src="shared.js"></script>\n</body>\n</html>\n'


def opts(d):
    return ''.join(f'<option>{e(o)}</option>' for o in [d['f_sel']] + d['f_opts'])


def prices_rows(d, row):
    return ''.join(row(e(a), e(b)) for a, b in d['pr'])


# ---------------------------------------------------------------- A · Klassik
def klassik(d):
    css = '''
:root{--ink:#1d1e21;--muted:#64666b;--paper:#fbfaf8;--stone:#efece6;--line:#dedad2}
body{font:400 17px/1.7 Inter,system-ui,sans-serif;color:var(--ink);background:var(--paper)}
h1,h2,h3{font-family:Lora,Georgia,serif;font-weight:500;line-height:1.18}
h2{font-size:clamp(1.9rem,3.6vw,2.7rem);margin-bottom:16px}
h1 em,h2 em{color:var(--accent);font-style:italic}
.kick{font-size:.74rem;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:14px}
.btn{display:inline-block;padding:15px 28px;background:var(--accent);color:var(--accent-ink);font-weight:600;font-size:.93rem;border:0;cursor:pointer;transition:.25s}
.btn:hover{filter:brightness(1.15)}
.btn.o{background:none;color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.img{background:radial-gradient(120% 90% at 30% 20%,#ebe7e0 0%,#cfc8bc 60%,#b6ad9f 100%);color:#000}
header{border-bottom:1px solid var(--line)}
.top{display:flex;justify-content:space-between;align-items:center;height:84px;gap:20px}
.brand{font-family:Lora,serif;font-size:1.3rem;font-weight:600}
.brand small{display:block;font-family:Inter;font-weight:500;font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
nav{display:flex;gap:30px;font-size:.92rem;color:var(--muted)}nav a:hover{color:var(--ink)}
.hero{display:grid;grid-template-columns:1.05fr .95fr;min-height:600px}
.hero .t{padding:90px 56px 90px max(24px,calc((100vw - 1180px)/2 + 24px));display:flex;flex-direction:column;justify-content:center}
.hero h1{font-size:clamp(2.3rem,4.6vw,3.6rem);margin-bottom:22px}
.hero p{color:var(--muted);font-size:1.1rem;max-width:500px;margin-bottom:34px}
.cta{display:flex;gap:12px;flex-wrap:wrap}
.areas{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line);margin-top:46px}
.area{padding:36px 32px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transition:.3s}
.area:hover{background:#fff}
.area span{font-family:Lora;color:var(--accent);font-style:italic}
.area h3{font-size:1.28rem;margin:12px 0 8px}
.area p{color:var(--muted);font-size:.95rem}
.band{background:var(--stone)}
.split{display:grid;grid-template-columns:1fr 1fr;gap:76px;align-items:center}
.split .img{aspect-ratio:4/5}
.pts{list-style:none;margin:22px 0}
.pts li{padding:10px 0;border-bottom:1px solid var(--line);display:flex;gap:12px}
.pts li::before{content:"—";color:var(--accent)}
.nums{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:30px}
.nums b{font-family:Lora;font-size:2.1rem;font-weight:500;color:var(--accent);display:block;line-height:1.1}
.nums span{font-size:.85rem;color:var(--muted)}
.plist{display:grid;grid-template-columns:1fr 1fr;gap:0 60px;margin-top:40px}
.prow{display:flex;justify-content:space-between;gap:20px;padding:16px 0;border-bottom:1px solid var(--line)}
.prow b{font-family:Lora;font-weight:500;white-space:nowrap}
.contact{background:var(--ink);color:#f3f1ed}
.contact .kick{color:#cbc6bc}
.contact p{color:#b8b4ac}
form{display:grid;gap:12px}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
input,select,textarea{padding:14px 16px;background:transparent;border:1px solid #4b4c51;color:#fff;width:100%}
select option{color:#111}
input:focus,select:focus,textarea:focus{outline:none;border-color:#fff}
textarea{min-height:110px}
footer{background:#141518;color:#8d8b86;font-size:.85rem;padding:28px 0}
footer .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:900px){nav{display:none}.hero,.split{grid-template-columns:1fr}.hero .t{padding:64px 24px}.hero .img{min-height:300px}.areas,.plist{grid-template-columns:1fr}.split{gap:40px}section{padding:80px 0}}
@media(max-width:560px){.hero .t{padding:56px 16px}.r2,.nums{grid-template-columns:1fr}.top .btn{display:none}}
'''
    rn = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.']
    svc = ''.join(f'<div class="area rv"><span>{rn[i]}</span><h3>{e(t)}</h3><p>{e(x)}</p></div>' for i, (t, x) in enumerate(d['svc']))
    pts = ''.join(f'<li>{e(p)}</li>' for p in d['pts'])
    st = ''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in d['st'])
    pr = ''
    if d.get('pr'):
        pr = f'''<section id="preise"><div class="w"><div class="rv"><div class="kick">Preise</div><h2>{em(d['pr_h'])}</h2></div>
<div class="plist rv">{prices_rows(d, lambda a, b: f'<div class="prow"><span>{a}</span><b>{b}</b></div>')}</div></div></section>'''
    return head(d, 'family=Lora:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600', css) + f'''
<header><div class="w top">
  <a class="brand" href="#">{e(d['brand'])}<small>{e(d['sub'])}</small></a>
  <nav><a href="#leistungen">Leistungen</a><a href="#ueber">Über uns</a>{'<a href="#preise">Preise</a>' if d.get('pr') else ''}<a href="#kontakt">Kontakt</a></nav>
  <a class="btn" href="#kontakt">{e(d['cta'])}</a>
</div></header>
<section class="hero" style="padding:0">
  <div class="t">
    <div class="kick">{e(d['kick'])}</div>
    <h1>{em(d['h1'])}</h1>
    <p>{e(d['lead'])}</p>
    <div class="cta"><a class="btn" href="#kontakt">{e(d['cta'])}</a><a class="btn o" href="#leistungen">Leistungen</a></div>
  </div>
  <div class="img" data-l="{e(d['img'])}"></div>
</section>
<section id="leistungen"><div class="w">
  <div class="rv"><div class="kick">Leistungen</div><h2>{em(d['svc_h'])}</h2></div>
  <div class="areas">{svc}</div>
</div></section>
<section id="ueber" class="band"><div class="w split">
  <div class="img rv" data-l="{e(d['img2'])}"></div>
  <div class="rv"><div class="kick">Über uns</div><h2>{em(d['ab_h'])}</h2><p style="color:var(--muted)">{e(d['ab_t'])}</p><ul class="pts">{pts}</ul><div class="nums">{st}</div></div>
</div></section>
{pr}
<section id="kontakt" class="contact"><div class="w split">
  <div class="rv"><div class="kick">Kontakt</div><h2>{em(d['f_h'])}</h2><p>{e(d['f_t'])}</p><p style="margin-top:20px">{e(d['adr'])}<br>{e(d['hrs'])}</p></div>
  <form class="rv"><div class="r2"><input placeholder="Name" required><input type="email" placeholder="E-Mail" required></div>
    <select>{opts(d)}</select><textarea placeholder="Ihre Nachricht"></textarea><button class="btn">Anfrage senden</button></form>
</div></section>
<footer><div class="w"><span>© {e(d['brand'])}</span><span>Impressum · Datenschutz</span></div></footer>
''' + TAIL


# ---------------------------------------------------------------- B · Modern
def modern(d):
    css = '''
:root{--ink:#1c2124;--muted:#61696d;--paper:#f6f7f7;--soft:#eceeef;--line:#dfe3e4}
body{font:400 17px/1.7 "Plus Jakarta Sans",system-ui,sans-serif;color:var(--ink);background:var(--paper)}
h1,h2,h3{font-weight:700;line-height:1.12;letter-spacing:-.025em}
h2{font-size:clamp(2rem,4vw,3rem);margin-bottom:14px}
h1 em,h2 em{color:var(--accent);font-style:normal}
.kick{display:inline-flex;align-items:center;gap:8px;font-size:.82rem;font-weight:600;color:var(--muted);margin-bottom:14px}
.kick::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent)}
.btn{display:inline-block;padding:15px 26px;border-radius:14px;background:var(--accent);color:var(--accent-ink);font-weight:600;font-size:.95rem;border:0;cursor:pointer;transition:.25s}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.12)}
.btn.o{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1px var(--line)}
.img{background:radial-gradient(90% 80% at 30% 25%,#f4f5f5 0%,#d4d9da 55%,#b8c0c2 100%);border-radius:26px;color:#000}
header{padding:16px 0}
.top{display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:20px;padding:12px 14px 12px 22px;box-shadow:0 4px 20px rgba(0,0,0,.04)}
.brand{font-weight:800;font-size:1.12rem;display:flex;align-items:center;gap:10px}
.brand i{width:30px;height:30px;border-radius:10px;background:var(--accent);display:inline-block}
nav{display:flex;gap:28px;font-weight:500;font-size:.93rem;color:var(--muted)}nav a:hover{color:var(--ink)}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center;padding:56px 0 96px}
.hero h1{font-size:clamp(2.4rem,5.2vw,4.1rem);margin-bottom:20px}
.hero p{color:var(--muted);font-size:1.1rem;margin-bottom:30px;max-width:480px}
.hero .img{aspect-ratio:1/1.02}
.chip{position:absolute;background:#fff;border-radius:16px;padding:12px 16px;box-shadow:0 14px 34px rgba(0,0,0,.1);font-size:.84rem;display:flex;gap:12px;align-items:center;color:var(--ink)}
.chip b{display:block;font-size:1.05rem}
.chip i{width:36px;height:36px;border-radius:11px;background:var(--soft);display:grid;place-items:center;color:var(--accent)}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:40px}
.card{background:#fff;border-radius:22px;padding:30px 26px;border:1px solid var(--line);transition:.3s}
.card:hover{transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,.06)}
.card .ic{width:48px;height:48px;border-radius:14px;background:var(--soft);display:grid;place-items:center;color:var(--accent);margin-bottom:18px}
.card h3{font-size:1.15rem;margin-bottom:6px}
.card p{color:var(--muted);font-size:.93rem}
.stats{background:var(--accent);color:var(--accent-ink);border-radius:26px;display:grid;grid-template-columns:repeat(3,1fr);padding:38px;gap:20px;text-align:center}
.stats b{display:block;font-size:2.4rem;font-weight:800;line-height:1.1}
.stats span{opacity:.8;font-size:.9rem}
.split{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
.split .img{aspect-ratio:5/4}
.checks{list-style:none;margin-top:22px;display:grid;gap:14px}
.checks li{display:flex;gap:14px}
.checks li::before{content:"✓";flex:none;width:26px;height:26px;border-radius:50%;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font-size:.8rem;font-weight:800}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px}
.pc{background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px 24px;display:flex;justify-content:space-between;gap:14px;align-items:center}
.pc b{color:var(--accent);white-space:nowrap;filter:brightness(.9)}
.book{background:var(--ink);color:#fff;border-radius:30px;padding:64px;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.book p{color:#b5bdc0}
.book .kick{color:#b5bdc0}
form{display:grid;gap:12px}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
input,select,textarea{padding:15px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;width:100%}
select option{color:#111}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--accent)}
.book .btn{box-shadow:0 0 0 1px rgba(255,255,255,.2)}
footer{padding:36px 0;color:var(--muted);font-size:.85rem}
footer .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:960px){nav{display:none}.hero,.split,.book{grid-template-columns:1fr}.cards,.pgrid{grid-template-columns:1fr 1fr}.book{padding:44px 28px}section{padding:80px 0}}
@media(max-width:560px){.cards,.pgrid,.r2,.stats{grid-template-columns:1fr}.top .btn{display:none}.book{padding:32px 20px;border-radius:24px}.chip{display:none}}
'''
    cards = ''.join(f'<div class="card rv"><div class="ic">{icon(i)}</div><h3>{e(t)}</h3><p>{e(x)}</p></div>' for i, (t, x) in enumerate(d['svc']))
    st = ''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in d['st'])
    pts = ''.join(f'<li>{e(p)}</li>' for p in d['pts'])
    pr = ''
    if d.get('pr'):
        pr = f'''<section id="preise" style="padding-top:0"><div class="w"><div class="rv"><div class="kick">Preise</div><h2>{em(d['pr_h'])}</h2></div>
<div class="pgrid">{prices_rows(d, lambda a, b: f'<div class="pc rv"><span>{a}</span><b>{b}</b></div>')}</div></div></section>'''
    a0, b0 = d['st'][0]
    return head(d, 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800', css) + f'''
<header><div class="w"><div class="top">
  <a class="brand" href="#"><i></i>{e(d['brand'])}</a>
  <nav><a href="#leistungen">Leistungen</a><a href="#ueber">Über uns</a>{'<a href="#preise">Preise</a>' if d.get('pr') else ''}<a href="#kontakt">Kontakt</a></nav>
  <a class="btn" href="#kontakt">{e(d['cta'])}</a>
</div></div></header>
<div class="w hero">
  <div class="rv"><div class="kick">{e(d['kick'])}</div><h1>{em(d['h1'])}</h1><p>{e(d['lead'])}</p>
    <a class="btn" href="#kontakt">{e(d['cta'])}</a> <a class="btn o" href="#leistungen">Mehr erfahren</a></div>
  <div class="img rv" data-l="{e(d['img'])}">
    <div class="chip" style="left:-18px;bottom:56px"><i>{icon(5, 18)}</i><div><b>{e(a0)}</b>{e(b0)}</div></div>
    <div class="chip" style="right:-10px;top:46px"><i>{icon(0, 18)}</i><div><b>{e(d['pts'][0].split(' ')[0])}</b>{e(' '.join(d['pts'][0].split(' ')[1:4]))}</div></div>
  </div>
</div>
<section id="leistungen" style="background:#fff"><div class="w">
  <div class="rv"><div class="kick">Leistungen</div><h2>{em(d['svc_h'])}</h2></div>
  <div class="cards">{cards}</div>
</div></section>
<section id="ueber"><div class="w">
  <div class="stats rv">{st}</div>
  <div class="split" style="margin-top:90px"><div class="img rv" data-l="{e(d['img2'])}"></div>
  <div class="rv"><div class="kick">Über uns</div><h2>{em(d['ab_h'])}</h2><p style="color:var(--muted)">{e(d['ab_t'])}</p><ul class="checks">{pts}</ul></div></div>
</div></section>
{pr}
<section id="kontakt" style="padding-top:0"><div class="w"><div class="book rv">
  <div><div class="kick">Kontakt</div><h2>{em(d['f_h'])}</h2><p>{e(d['f_t'])}</p><p style="margin-top:16px">{e(d['adr'])}<br>{e(d['hrs'])}</p></div>
  <form><div class="r2"><input placeholder="Name" required><input type="tel" placeholder="Telefon" required></div><input type="email" placeholder="E-Mail"><select>{opts(d)}</select><button class="btn">Anfrage senden</button></form>
</div></div></section>
<footer><div class="w"><span>© {e(d['brand'])}</span><span>Impressum · Datenschutz</span></div></footer>
''' + TAIL


# ---------------------------------------------------------------- C · Kraft
def kraft(d):
    css = '''
:root{--ink:#161616;--muted:#5f5f5c;--paper:#f4f3f0;--line:#d9d7d1}
body{font:400 17px/1.65 Archivo,system-ui,sans-serif;color:var(--ink);background:var(--paper)}
h1,h2,h3{font-weight:800;line-height:1;letter-spacing:-.02em;text-transform:uppercase}
h2{font-size:clamp(2.1rem,4.8vw,3.6rem);margin-bottom:18px}
h1 em,h2 em{color:var(--accent);font-style:normal}
.hero h1 em{color:color-mix(in srgb,var(--accent) 45%,#fff)}
.kick{display:inline-block;font-size:.76rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;background:var(--accent);color:var(--accent-ink);padding:6px 12px;margin-bottom:20px}
.btn{display:inline-block;padding:17px 30px;background:var(--accent);color:var(--accent-ink);font-weight:700;text-transform:uppercase;font-size:.86rem;letter-spacing:.06em;border:0;cursor:pointer;transition:.2s}
.btn:hover{transform:translateY(-2px)}
.btn.o{background:transparent;color:#fff;box-shadow:inset 0 0 0 2px #fff}
.dk .btn:not(.o){box-shadow:0 0 0 1px rgba(255,255,255,.3)}
.img{background:repeating-linear-gradient(115deg,rgba(0,0,0,.06) 0 2px,transparent 2px 14px),linear-gradient(135deg,#a59d92,#6b645b);color:#fff}
.bar{background:var(--ink);color:#bcbab4;font-size:.82rem}
.bar .w{display:flex;justify-content:space-between;padding-top:9px;padding-bottom:9px;gap:16px;flex-wrap:wrap}
header{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
.top{display:flex;align-items:center;justify-content:space-between;height:78px}
.brand{font-weight:800;font-size:1.3rem;text-transform:uppercase;display:flex;align-items:center;gap:10px}
.brand i{width:28px;height:28px;background:var(--accent);display:inline-block}
nav{display:flex;gap:28px;font-weight:500;font-size:.92rem}nav a:hover{color:var(--accent)}
.hero{background:linear-gradient(90deg,rgba(14,14,14,.94) 0%,rgba(14,14,14,.65) 60%,rgba(14,14,14,.3)),repeating-linear-gradient(115deg,#5b564e 0 2px,transparent 2px 16px),linear-gradient(135deg,#7a7268,#35322d);color:#fff;padding:130px 0 120px}
.hero h1{font-size:clamp(2.2rem,7vw,5.6rem);max-width:860px;margin-bottom:26px}
.hero p{max-width:540px;font-size:1.12rem;color:#d4d2cc;margin-bottom:34px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);background:#fff;margin-top:-56px;position:relative;box-shadow:0 20px 50px rgba(0,0,0,.08)}
.stats div{padding:28px 30px;border-right:1px solid var(--line)}
.stats div:last-child{border:0}
.stats b{display:block;font-size:2.5rem;font-weight:800;color:var(--accent);line-height:1}
.stats span{font-size:.88rem;color:var(--muted)}
.svc{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--line);margin-top:40px;border:2px solid var(--line)}
.svc article{background:#fff;padding:38px 30px;transition:.25s}
.svc article:hover{background:var(--ink);color:#fff}
.svc article:hover p{color:#bdbab3}
.svc b{font-size:.85rem;color:var(--accent);font-weight:800}
.svc h3{font-size:1.32rem;margin:16px 0 10px}
.svc p{color:var(--muted);font-size:.95rem;transition:.25s}
.split{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.split .img{aspect-ratio:1}
.pts{list-style:none;margin-top:22px;display:grid;gap:12px}
.pts li{display:flex;gap:12px;font-weight:500}
.pts li::before{content:"";flex:none;width:12px;height:12px;margin-top:7px;background:var(--accent)}
.ptab{margin-top:36px;background:#fff;border:2px solid var(--line)}
.ptab div{display:flex;justify-content:space-between;gap:20px;padding:18px 24px;border-bottom:1px solid var(--line)}
.ptab div:last-child{border:0}
.ptab b{font-weight:800;white-space:nowrap}
.band{background:var(--accent);color:var(--accent-ink);padding:74px 0}
.band .w{display:flex;justify-content:space-between;align-items:center;gap:30px;flex-wrap:wrap}
.band h2{margin:0;font-size:clamp(1.8rem,4vw,2.8rem)}
.band .btn{background:var(--ink);color:#fff}
.contact{display:grid;grid-template-columns:1fr 1fr;gap:64px}
.contact ul{list-style:none;margin-top:22px}
.contact li{padding:15px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:20px}
form{display:grid;gap:12px}
input,textarea,select{padding:16px;border:2px solid var(--line);background:#fff;width:100%}
input:focus,textarea:focus,select:focus{outline:none;border-color:var(--accent)}
textarea{min-height:110px}
footer{background:var(--ink);color:#8f8d88;font-size:.85rem;padding:30px 0}
footer .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:900px){nav{display:none}.svc,.split,.contact{grid-template-columns:1fr}.stats{grid-template-columns:1fr}.stats div{border-right:0;border-bottom:1px solid var(--line)}section{padding:80px 0}.hero{padding:90px 0 110px}}
@media(max-width:560px){.top .btn{display:none}.ptab div{flex-direction:column;gap:2px}}
'''
    svc = ''.join(f'<article class="rv"><b>{i + 1:02d}</b><h3>{e(t)}</h3><p>{e(x)}</p></article>' for i, (t, x) in enumerate(d['svc']))
    st = ''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in d['st'])
    pts = ''.join(f'<li>{e(p)}</li>' for p in d['pts'])
    pr = ''
    if d.get('pr'):
        pr = f'''<section id="preise" style="padding-top:0"><div class="w"><div class="rv"><div class="kick">Preise</div><h2>{em(d['pr_h'])}</h2></div>
<div class="ptab rv">{prices_rows(d, lambda a, b: f'<div><span>{a}</span><b>{b}</b></div>')}</div></div></section>'''
    return head(d, 'family=Archivo:wght@400;500;700;800', css) + f'''
<div class="bar"><div class="w"><span>{e(d['sub'])}</span><span>{e(d['hrs'])}</span></div></div>
<header><div class="w top">
  <a class="brand" href="#"><i></i>{e(d['brand'])}</a>
  <nav><a href="#leistungen">Leistungen</a><a href="#ueber">Über uns</a>{'<a href="#preise">Preise</a>' if d.get('pr') else ''}<a href="#kontakt">Kontakt</a></nav>
  <a class="btn" href="#kontakt">{e(d['cta'])}</a>
</div></header>
<section class="hero dk"><div class="w">
  <div class="kick">{e(d['kick'])}</div>
  <h1>{em(d['h1'])}</h1>
  <p>{e(d['lead'])}</p>
  <a class="btn" href="#kontakt">{e(d['cta'])} →</a> <a class="btn o" href="#leistungen">Leistungen</a>
</div></section>
<div class="w"><div class="stats rv">{st}</div></div>
<section id="leistungen"><div class="w">
  <div class="rv"><div class="kick">Leistungen</div><h2>{em(d['svc_h'])}</h2></div>
  <div class="svc">{svc}</div>
</div></section>
<section id="ueber" style="background:#fff"><div class="w split">
  <div class="img rv" data-l="{e(d['img2'])}"></div>
  <div class="rv"><div class="kick">Über uns</div><h2>{em(d['ab_h'])}</h2><p style="color:var(--muted)">{e(d['ab_t'])}</p><ul class="pts">{pts}</ul></div>
</div></section>
{pr}
<div class="band"><div class="w"><h2>{em(d['f_h'])}</h2><a class="btn" href="#kontakt">{e(d['cta'])} →</a></div></div>
<section id="kontakt"><div class="w contact">
  <div class="rv"><div class="kick">Kontakt</div><h2>So erreichen Sie uns.</h2><p style="color:var(--muted)">{e(d['f_t'])}</p>
    <ul><li><span>Adresse</span><b>{e(d['adr'])}</b></li><li><span>Telefon</span><b>000 000 000</b></li><li><span>Zeiten</span><b>{e(d['hrs'])}</b></li></ul></div>
  <form class="rv"><input placeholder="Name" required><input type="tel" placeholder="Telefon"><select>{opts(d)}</select><textarea placeholder="Ihre Nachricht"></textarea><button class="btn">Anfrage senden →</button></form>
</div></section>
<footer><div class="w"><span>© {e(d['brand'])}</span><span>Impressum · Datenschutz</span></div></footer>
''' + TAIL


# ---------------------------------------------------------------- D · Elegant
def elegant(d):
    css = '''
:root{--ink:#2a2523;--muted:#7a716b;--paper:#faf7f4;--soft:#f1ebe5;--line:#e4dbd2}
body{font:300 17px/1.8 Jost,system-ui,sans-serif;color:var(--ink);background:var(--paper)}
h1,h2,h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:400;line-height:1.08}
h2{font-size:clamp(2.3rem,4.8vw,3.6rem);margin-bottom:16px}
h1 em,h2 em{color:var(--accent)}
.kick{font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
.btn{display:inline-block;padding:15px 34px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;border:0;cursor:pointer;transition:.3s}
.btn:hover{transform:translateY(-2px)}
.btn.o{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.img{background:radial-gradient(90% 80% at 40% 30%,#f4ede6 0%,#ddd0c3 55%,#c5b4a4 100%);color:#000}
.img::after{left:0;right:0;text-align:center}
header .w{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;height:96px}
nav{display:flex;gap:28px;font-size:.76rem;letter-spacing:.18em;text-transform:uppercase}
nav.r{justify-content:flex-end}
.brand{font-family:"Cormorant Garamond";font-size:1.9rem;font-style:italic;text-align:center;line-height:1}
.brand small{display:block;font-family:Jost;font-style:normal;font-size:.58rem;letter-spacing:.38em;text-transform:uppercase;color:var(--muted);margin-top:5px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;padding:30px 0 100px}
.hero h1{font-size:clamp(2.8rem,6.4vw,5.2rem);margin-bottom:24px}
.hero p{color:var(--muted);max-width:440px;margin-bottom:34px}
.arch{aspect-ratio:4/5;border-radius:999px 999px 0 0}
.soft{background:var(--soft)}
.c{text-align:center}
.tr{display:grid;grid-template-columns:repeat(3,1fr);gap:34px 30px;margin-top:50px}
.tr article{text-align:center}
.tr .dot{width:64px;height:64px;border-radius:50%;border:1px solid var(--accent);display:grid;place-items:center;margin:0 auto 18px;color:var(--accent)}
.tr h3{font-size:1.6rem;margin-bottom:6px}
.tr p{color:var(--muted);font-size:.95rem;max-width:300px;margin:0 auto}
.split{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
.split .img{aspect-ratio:4/5;border-radius:4px}
.pts{list-style:none;margin:20px 0 0}
.pts li{padding:10px 0;border-bottom:1px solid var(--line)}
.pts li::before{content:"✦  ";color:var(--accent)}
.nums{display:flex;gap:40px;margin-top:30px;flex-wrap:wrap}
.nums b{font-family:"Cormorant Garamond";font-weight:500;font-size:2.4rem;display:block;line-height:1;color:var(--accent)}
.nums span{font-size:.82rem;color:var(--muted)}
.prices{max-width:760px;margin:44px auto 0}
.p-row{display:flex;align-items:baseline;gap:14px;padding:16px 0}
.p-row h3{font-size:1.4rem}
.p-row span{flex:1;border-bottom:1px dotted #c7bcb1;transform:translateY(-6px)}
.p-row b{font-family:"Cormorant Garamond";font-weight:500;font-size:1.4rem;white-space:nowrap}
.book{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
form{display:grid;gap:14px}
input,select,textarea{padding:14px 0;border:0;border-bottom:1px solid var(--line);background:transparent;width:100%;color:var(--ink)}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--accent)}
textarea{min-height:90px}
footer{padding:40px 0;text-align:center;font-size:.78rem;color:var(--muted);letter-spacing:.12em}
@media(max-width:960px){header .w{grid-template-columns:1fr;justify-items:center;height:auto;padding-top:24px;padding-bottom:10px}nav{display:none}.hero,.book,.split{grid-template-columns:1fr}.tr{grid-template-columns:1fr}section{padding:80px 0}.hero{padding-top:16px}}
@media(max-width:560px){.p-row{flex-wrap:wrap}.p-row span{display:none}.p-row b{margin-left:auto}}
'''
    tr = ''.join(f'<article class="rv"><div class="dot">{icon(i, 22)}</div><h3>{e(t)}</h3><p>{e(x)}</p></article>' for i, (t, x) in enumerate(d['svc']))
    pts = ''.join(f'<li>{e(p)}</li>' for p in d['pts'])
    st = ''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in d['st'])
    pr = ''
    if d.get('pr'):
        pr = f'''<section id="preise"><div class="w"><div class="rv c"><div class="kick">Preise</div><h2>{em(d['pr_h'])}</h2></div>
<div class="prices rv">{prices_rows(d, lambda a, b: f'<div class="p-row"><h3>{a}</h3><span></span><b>{b}</b></div>')}</div></div></section>'''
    return head(d, 'family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500', css) + f'''
<header><div class="w">
  <nav><a href="#leistungen">Leistungen</a>{'<a href="#preise">Preise</a>' if d.get('pr') else ''}</nav>
  <a class="brand" href="#">{e(d['brand'])}<small>{e(d['sub'])}</small></a>
  <nav class="r"><a href="#ueber">Über uns</a><a href="#kontakt">Kontakt</a></nav>
</div></header>
<div class="w hero">
  <div class="rv"><div class="kick">{e(d['kick'])}</div><h1>{em(d['h1'])}</h1><p>{e(d['lead'])}</p>
    <a class="btn" href="#kontakt">{e(d['cta'])}</a> <a class="btn o" href="#leistungen">Leistungen</a></div>
  <div class="img arch rv" data-l="{e(d['img'])}"></div>
</div>
<section id="leistungen" class="soft"><div class="w">
  <div class="rv c"><div class="kick">Leistungen</div><h2>{em(d['svc_h'])}</h2></div>
  <div class="tr">{tr}</div>
</div></section>
<section id="ueber"><div class="w split">
  <div class="rv"><div class="kick">Über uns</div><h2>{em(d['ab_h'])}</h2><p style="color:var(--muted)">{e(d['ab_t'])}</p><ul class="pts">{pts}</ul><div class="nums">{st}</div></div>
  <div class="img rv" data-l="{e(d['img2'])}"></div>
</div></section>
{pr}
<section id="kontakt" class="soft"><div class="w book">
  <div class="rv"><div class="kick">Kontakt</div><h2>{em(d['f_h'])}</h2><p style="color:var(--muted)">{e(d['f_t'])}</p><p style="color:var(--muted);margin-top:16px">{e(d['adr'])}<br>{e(d['hrs'])}</p></div>
  <form class="rv"><input placeholder="Name" required><input type="email" placeholder="E-Mail" required><select>{opts(d)}</select><textarea placeholder="Nachricht"></textarea><button class="btn" style="justify-self:start;margin-top:10px">Anfrage senden</button></form>
</div></section>
<footer>© {e(d['brand'])} · Impressum · Datenschutz</footer>
''' + TAIL


# ---------------------------------------------------------------- E · Minimal
def minimal(d):
    css = '''
:root{--ink:#111;--muted:#77777a;--paper:#f3f3f1;--line:#d2d2ce}
body{font:400 16px/1.6 "Inter Tight",system-ui,sans-serif;color:var(--ink);background:var(--paper)}
.w{max-width:1320px}
h1,h2,h3{font-weight:500;letter-spacing:-.04em;line-height:.98}
h2{font-size:clamp(2.1rem,4.8vw,4rem)}
h1 em,h2 em{color:var(--accent);font-style:normal}
.lbl{font-size:.74rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.btn{display:inline-flex;gap:12px;align-items:center;padding:14px 24px;background:var(--accent);color:var(--accent-ink);font-size:.92rem;font-weight:500;border:0;cursor:pointer;transition:.25s}
.btn:hover{gap:18px}
.img{background:linear-gradient(135deg,#d8d8d4 0%,#b2b2ad 100%);color:#fff}
.img.d{background:linear-gradient(135deg,#6a6a66,#2d2d2b)}
header{border-bottom:1px solid var(--line)}
header .w{display:grid;grid-template-columns:1fr 2fr 1fr;align-items:center;height:68px}
.brand{font-weight:600;letter-spacing:-.02em;font-size:1.12rem}
nav{display:flex;gap:26px;font-size:.92rem;justify-content:center}
nav a{color:var(--muted)}nav a:hover{color:var(--ink)}
header .r{text-align:right;font-size:.9rem}
.hero{padding:64px 0 0}
.hero h1{font-size:clamp(2.8rem,9.4vw,8.6rem);letter-spacing:-.055em}
.row4{display:grid;grid-template-columns:1fr 1.3fr 1.3fr 1fr;gap:24px;margin:38px 0;border-top:1px solid var(--ink);padding-top:16px;align-items:start}
.row4 p{color:var(--muted);font-size:.96rem}
.hero .img{aspect-ratio:21/8}
.g12{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}
.list{margin-top:46px;border-top:1px solid var(--ink)}
.li{display:grid;grid-template-columns:80px 1fr 1.2fr;gap:24px;padding:28px 0;border-bottom:1px solid var(--line);align-items:baseline;transition:.25s}
.li:hover{padding-left:12px}
.li h3{font-size:clamp(1.4rem,2.4vw,2rem)}
.li p{color:var(--muted)}
.dark{background:var(--ink);color:#eee}
.dark .lbl{color:#8f8f8b}
.nums{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:50px}
.nums b{font-size:clamp(2.8rem,6vw,5.2rem);font-weight:400;letter-spacing:-.05em;display:block;line-height:1;margin-bottom:8px}
.split{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;margin-top:70px}
.split p{color:#a5a5a1}
.pts{list-style:none;border-top:1px solid #333}
.pts li{padding:14px 0;border-bottom:1px solid #333}
.prow{display:flex;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px solid var(--line);font-size:1.05rem}
.contact{display:grid;grid-template-columns:1fr 1fr;gap:60px}
dl{display:grid;grid-template-columns:110px 1fr;gap:12px 20px;margin-top:28px}
dt{color:var(--muted)}
form{display:grid;gap:10px}
input,textarea,select{padding:14px;background:#fff;border:1px solid var(--line);width:100%}
input:focus,textarea:focus,select:focus{outline:none;border-color:var(--ink)}
textarea{min-height:120px}
footer{border-top:1px solid var(--line);padding:24px 0;font-size:.85rem;color:var(--muted)}
footer .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:900px){header .w{grid-template-columns:1fr 1fr}nav{display:none}.row4{grid-template-columns:1fr 1fr}.li{grid-template-columns:50px 1fr}.li p{grid-column:2}.nums,.split,.contact{grid-template-columns:1fr}section{padding:80px 0}.g12>*{grid-column:1/-1!important}}
@media(max-width:560px){.row4{grid-template-columns:1fr}.hero .img{aspect-ratio:4/3}dl{grid-template-columns:80px 1fr}header .r{display:none}header .w{grid-template-columns:1fr}}
'''
    li = ''.join(f'<div class="li rv"><span class="lbl">{i + 1:02d}</span><h3>{e(t)}</h3><p>{e(x)}</p></div>' for i, (t, x) in enumerate(d['svc']))
    st = ''.join(f'<div><b>{e(a)}</b><span class="lbl">{e(b)}</span></div>' for a, b in d['st'])
    pts = ''.join(f'<li>{e(p)}</li>' for p in d['pts'])
    pr = ''
    if d.get('pr'):
        pr = f'''<section id="preise"><div class="w"><div class="g12 rv"><span class="lbl" style="grid-column:1/4">Preise</span><h2 style="grid-column:4/13">{em(d['pr_h'])}</h2></div>
<div class="rv" style="margin-top:40px;border-top:1px solid var(--ink)">{prices_rows(d, lambda a, b: f'<div class="prow"><span>{a}</span><b style="font-weight:500">{b}</b></div>')}</div></div></section>'''
    return head(d, 'family=Inter+Tight:wght@400;500;600', css) + f'''
<header><div class="w">
  <a class="brand" href="#">{e(d['brand'])}</a>
  <nav><a href="#leistungen">Leistungen</a><a href="#ueber">Über uns</a>{'<a href="#preise">Preise</a>' if d.get('pr') else ''}<a href="#kontakt">Kontakt</a></nav>
  <a class="r" href="#kontakt">{e(d['cta'])} →</a>
</div></header>
<div class="w hero">
  <h1 class="rv">{em(d['h1'])}</h1>
  <div class="row4 rv"><span class="lbl">{e(d['kick'])}</span><p>{e(d['lead'])}</p><p>{e(d['sub'])}</p><div style="text-align:right"><a class="btn" href="#kontakt">{e(d['cta'])} →</a></div></div>
  <div class="img d rv" data-l="{e(d['img'])}"></div>
</div>
<section id="leistungen"><div class="w">
  <div class="g12 rv"><span class="lbl" style="grid-column:1/4">Leistungen</span><h2 style="grid-column:4/13">{em(d['svc_h'])}</h2></div>
  <div class="list">{li}</div>
</div></section>
<section id="ueber" class="dark"><div class="w">
  <div class="g12 rv"><span class="lbl" style="grid-column:1/4">Über uns</span><h2 style="grid-column:4/13">{em(d['ab_h'])}</h2></div>
  <div class="nums rv">{st}</div>
  <div class="split rv"><p>{e(d['ab_t'])}</p><ul class="pts">{pts}</ul></div>
</div></section>
{pr}
<section id="kontakt"><div class="w contact">
  <div class="rv"><span class="lbl">Kontakt</span><h2 style="margin-top:14px">{em(d['f_h'])}</h2><p style="color:var(--muted);margin-top:16px">{e(d['f_t'])}</p>
    <dl><dt>Adresse</dt><dd>{e(d['adr'])}</dd><dt>Zeiten</dt><dd>{e(d['hrs'])}</dd><dt>Telefon</dt><dd>000 000 000</dd></dl></div>
  <form class="rv"><input placeholder="Name" required><input type="email" placeholder="E-Mail" required><select>{opts(d)}</select><textarea placeholder="Nachricht"></textarea><button class="btn">Nachricht senden →</button></form>
</div></section>
<footer><div class="w"><span>© {e(d['brand'])}</span><span>Impressum · Datenschutz</span></div></footer>
''' + TAIL


# ---------------------------------------------------------------- F · Freundlich
def frisch(d):
    css = '''
:root{--ink:#1b2023;--muted:#5f676c;--paper:#fff;--soft:#f2f4f4;--line:#e1e5e6}
body{font:400 17px/1.65 "Nunito Sans",system-ui,sans-serif;color:var(--ink);background:var(--paper)}
h1,h2,h3{font-weight:800;letter-spacing:-.02em;line-height:1.1}
h2{font-size:clamp(2rem,4.2vw,3rem);margin-bottom:14px}
h1 em,h2 em{color:var(--accent);font-style:normal}
.kick{font-weight:700;font-size:.86rem;color:var(--accent);margin-bottom:10px}
.btn{display:inline-block;padding:15px 28px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-weight:700;font-size:.97rem;border:0;cursor:pointer;transition:.2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,.1)}
.btn.o{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 2px var(--line)}
.img{background:radial-gradient(90% 80% at 35% 30%,#f5f7f7 0%,#d6dcdd 60%,#b9c2c4 100%);color:#000}
header .w{display:flex;align-items:center;justify-content:space-between;height:80px}
.brand{font-weight:800;font-size:1.25rem;display:flex;gap:10px;align-items:center}
.brand i{width:34px;height:34px;border-radius:50%;background:var(--accent);display:grid;place-items:center;color:var(--accent-ink);font-style:normal;font-size:.95rem}
nav{display:flex;gap:28px;font-weight:600;font-size:.94rem;color:var(--muted)}nav a:hover{color:var(--ink)}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center;padding:36px 0 90px}
.hero h1{font-size:clamp(2.4rem,5.2vw,3.9rem);margin-bottom:18px}
.hero p{color:var(--muted);font-size:1.12rem;margin-bottom:28px;max-width:500px}
.blob{aspect-ratio:1;border-radius:58% 42% 46% 54% / 48% 56% 44% 52%}
.trust{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap}
.trust span{background:var(--soft);border-radius:999px;padding:8px 16px;font-weight:600;font-size:.86rem}
.trust span::before{content:"✓ ";color:var(--accent);font-weight:800}
.soft{background:var(--soft)}
.svc{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:40px}
.svc article{background:#fff;border-radius:24px;padding:30px;transition:.25s}
.svc article:hover{transform:translateY(-5px);box-shadow:0 16px 36px rgba(0,0,0,.06)}
.svc .ic{width:56px;height:56px;border-radius:50%;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;margin-bottom:18px}
.svc h3{font-size:1.22rem;margin-bottom:6px}
.svc p{color:var(--muted);font-size:.95rem}
.why{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.why .img{aspect-ratio:5/4;border-radius:28px}
.nums{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:26px}
.nums div{background:var(--soft);border-radius:18px;padding:18px}
.nums b{font-size:1.8rem;font-weight:800;display:block;line-height:1.1}
.nums span{color:var(--muted);font-size:.86rem}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px}
.pc{background:#fff;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:6px}
.pc b{font-size:1.5rem;font-weight:800;color:var(--accent);filter:brightness(.9)}
.calc{background:var(--ink);color:#fff;border-radius:30px;padding:56px;display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.calc p{color:#a9b1b5}
.calc .kick{color:#a9b1b5}
.calc .btn{box-shadow:0 0 0 1px rgba(255,255,255,.25)}
form{display:grid;gap:12px}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
input,select,textarea{padding:14px 18px;border-radius:14px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.07);color:#fff;width:100%}
select option{color:#111}
input:focus,select:focus{outline:none;border-color:var(--accent)}
footer{padding:36px 0;color:var(--muted);font-size:.88rem}
footer .w{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
@media(max-width:900px){nav{display:none}.hero,.why,.calc{grid-template-columns:1fr}.svc,.pgrid{grid-template-columns:1fr 1fr}.calc{padding:40px 26px}section{padding:80px 0}}
@media(max-width:560px){.svc,.pgrid,.r2,.nums{grid-template-columns:1fr}header .btn{display:none}.calc{padding:32px 20px}}
'''
    svc = ''.join(f'<article class="rv"><div class="ic">{icon(i)}</div><h3>{e(t)}</h3><p>{e(x)}</p></article>' for i, (t, x) in enumerate(d['svc']))
    st = ''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in d['st'])
    trust = ''.join(f'<span>{e(p)}</span>' for p in d['pts'])
    pr = ''
    if d.get('pr'):
        pr = f'''<section id="preise" class="soft" style="padding-top:0"><div class="w"><div class="rv"><div class="kick">Preise</div><h2>{em(d['pr_h'])}</h2></div>
<div class="pgrid">{prices_rows(d, lambda a, b: f'<div class="pc rv"><span>{a}</span><b>{b}</b></div>')}</div></div></section>'''
    return head(d, 'family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800', css) + f'''
<header><div class="w">
  <a class="brand" href="#"><i>{e(d['brand'][0])}</i>{e(d['brand'])}</a>
  <nav><a href="#leistungen">Leistungen</a><a href="#ueber">Über uns</a>{'<a href="#preise">Preise</a>' if d.get('pr') else ''}<a href="#kontakt">Kontakt</a></nav>
  <a class="btn" href="#kontakt">{e(d['cta'])}</a>
</div></header>
<div class="w hero">
  <div class="rv"><div class="kick">{e(d['kick'])}</div><h1>{em(d['h1'])}</h1><p>{e(d['lead'])}</p>
    <a class="btn" href="#kontakt">{e(d['cta'])}</a> <a class="btn o" href="#leistungen">Leistungen</a>
    <div class="trust">{trust}</div></div>
  <div class="img blob rv" data-l="{e(d['img'])}"></div>
</div>
<section id="leistungen" class="soft"><div class="w">
  <div class="rv"><div class="kick">Leistungen</div><h2>{em(d['svc_h'])}</h2></div>
  <div class="svc">{svc}</div>
</div></section>
{pr}
<section id="ueber"><div class="w why">
  <div class="img rv" data-l="{e(d['img2'])}"></div>
  <div class="rv"><div class="kick">Über uns</div><h2>{em(d['ab_h'])}</h2><p style="color:var(--muted)">{e(d['ab_t'])}</p><div class="nums">{st}</div></div>
</div></section>
<section id="kontakt" style="padding-top:0"><div class="w"><div class="calc rv">
  <div><div class="kick">Kontakt</div><h2>{em(d['f_h'])}</h2><p>{e(d['f_t'])}</p><p style="margin-top:16px">{e(d['adr'])}<br>{e(d['hrs'])}</p></div>
  <form><select>{opts(d)}</select><div class="r2"><input placeholder="Name" required><input type="tel" placeholder="Telefon" required></div><input type="email" placeholder="E-Mail"><button class="btn">Anfrage senden</button></form>
</div></div></section>
<footer><div class="w"><span>© {e(d['brand'])}</span><span>Impressum · Datenschutz</span></div></footer>
''' + TAIL


LAYOUTS = {'A': klassik, 'B': modern, 'C': kraft, 'D': elegant, 'E': minimal, 'F': frisch}
