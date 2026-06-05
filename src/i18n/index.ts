import { en } from "./en";
import { de } from "./de";
import { es } from "./es";
import { fr } from "./fr";
import { zh } from "./zh";

/// Theme translation fragments keyed by language. Each value is a `{ theme: {...} }`
/// tree meant to be merged into your i18next namespace (default `common`):
///
///   import { themeResources } from "@cavebatsofware/riposte-theme-picker/i18n";
///   for (const [lng, res] of Object.entries(themeResources)) {
///     i18n.addResourceBundle(lng, "common", res, true, true);
///   }
export const themeResources = { en, de, es, fr, zh };

export { en, de, es, fr, zh };
