/*  This file is part of @cavebatsofware/riposte-pickers
 *  Copyright (C) 2026 Grant DeFayette
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License (GPL-3.0-only).
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.html>.
 */
export interface Language {
  /** Base language code (no region subtag), e.g. `en`. Passed to i18next. */
  code: string;
  /**
   * Display name written in the language's own script (e.g. `Deutsch`,
   * `中文`). Shown verbatim in the list so a reader recognizes their own
   * language without a translation chain.
   */
  nativeName: string;
}

/// The bundled default catalog: the five riposte launch locales. Override
/// via the `languages` prop on `LanguagePicker` to ship a different set.
export const DEFAULT_LANGUAGES: Language[] = [
  { code: "en", nativeName: "English" },
  { code: "es", nativeName: "Español" },
  { code: "fr", nativeName: "Français" },
  { code: "zh", nativeName: "中文" },
  { code: "de", nativeName: "Deutsch" },
];
