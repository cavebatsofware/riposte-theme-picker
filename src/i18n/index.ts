import { en as themeEn } from "./theme/en";
import { de as themeDe } from "./theme/de";
import { es as themeEs } from "./theme/es";
import { fr as themeFr } from "./theme/fr";
import { zh as themeZh } from "./theme/zh";

import { en as langEn } from "./language/en";
import { de as langDe } from "./language/de";
import { es as langEs } from "./language/es";
import { fr as langFr } from "./language/fr";
import { zh as langZh } from "./language/zh";

/// Theme translation fragments keyed by language. Each value is a
/// `{ theme: {...} }` tree meant to be merged into your i18next namespace
/// (default `common`):
///
///   import { themeResources } from "@cavebatsofware/riposte-pickers/i18n";
///   for (const [lng, res] of Object.entries(themeResources)) {
///     i18n.addResourceBundle(lng, "common", res, true, true);
///   }
export const themeResources = {
  en: themeEn,
  de: themeDe,
  es: themeEs,
  fr: themeFr,
  zh: themeZh,
};

/// Language-picker translation fragments keyed by language. Each value is a
/// `{ language: {...} }` tree, merged the same way as `themeResources`.
export const languageResources = {
  en: langEn,
  de: langDe,
  es: langEs,
  fr: langFr,
  zh: langZh,
};
