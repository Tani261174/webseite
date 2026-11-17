// Erzeugt einen sicheren Passwort-Hash (scrypt) für ADMIN_PASSWORD_HASH.
// Aufruf: npm run admin:hash                       (fragt das Passwort ab)
//    oder: npm run admin:hash -- "MeinLangesPasswort"
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

function hash(pw) {
  const salt = randomBytes(16);
  const key = scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  // ":" als Trennzeichen – "$" würde in .env-Dateien als Variable gelesen
  return `scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`;
}

function done(pw) {
  if (!pw || pw.length < 12) {
    console.error("Das Passwort muss mindestens 12 Zeichen lang sein.");
    process.exit(1);
  }
  console.log("\nIn .env.local bzw. beim Hoster eintragen:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash(pw)}\n`);
}

const arg = process.argv[2];
if (arg) {
  done(arg);
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.question("Neues Admin-Passwort (mind. 12 Zeichen): ", (pw) => {
    rl.close();
    done(pw.trim());
  });
}
