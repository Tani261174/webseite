import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Die Seiten werden beim Build vorgerendert (SSG) und aus den Workers Static Assets
// ausgeliefert – ohne kostenpflichtigen Cache-Speicher. Sobald Inhalte zur Laufzeit
// aktualisiert werden sollen (ISR, Admin-Änderungen), auf R2-Cache umstellen:
// https://opennext.js.org/cloudflare/caching
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
