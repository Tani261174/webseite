// Erzeugt Vorschaubilder (vorlagen/vorschau/<slug>.jpg) und prüft die Handy-Ansicht.
// Aufruf: node tools/vorschau.js            -> alle Vorlagen
//         node tools/vorschau.js zahnarzt,kita
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const V = path.join(__dirname, '..', 'vorlagen');
const arg = process.argv[2];
const slugs = arg ? arg.split(',') : fs.readdirSync(V).filter(f => f.endsWith('.html')).map(f => f.replace('.html', ''));

(async () => {
  const b = await chromium.launch();
  const desk = await b.newPage({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
  const mob = await b.newPage({ viewport: { width: 390, height: 800 } });
  const probleme = [];
  for (const s of slugs) {
    const url = 'file://' + path.join(V, s + '.html');
    await desk.goto(url + '?clean');
    await desk.waitForTimeout(700);
    await desk.screenshot({ path: path.join(V, 'vorschau', s + '.jpg'), type: 'jpeg', quality: 80 });
    await mob.goto(url);
    await mob.waitForTimeout(300);
    const w = await mob.evaluate(() => document.documentElement.scrollWidth);
    if (w > 390) probleme.push(s + ' (' + w + 'px)');
  }
  console.log(slugs.length + ' Vorschaubilder erstellt.');
  console.log(probleme.length ? 'Zu breit auf dem Handy: ' + probleme.join(', ') : 'Handy-Ansicht: alles passt.');
  await b.close();
})();
