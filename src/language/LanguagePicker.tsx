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
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PopoverPicker, useRovingFocus } from "@cavebatsofware/riposte-design-system/shared";
import { DEFAULT_LANGUAGES, type Language } from "./languages";

export interface LanguagePickerProps {
  /**
   * `popover` (default): a globe-icon button in a header that opens a
   * dropdown of languages. `inline`: the list rendered directly, for use
   * inside a drawer.
   */
  variant?: "popover" | "inline";
  /**
   * i18next namespace holding the `language.*` keys. Defaults to `common`.
   * Merge the package's `languageResources` into this namespace.
   */
  namespace?: string;
  /** Catalog of selectable languages. Defaults to the bundled five. */
  languages?: Language[];
  /**
   * Optional side effect fired after a successful switch, e.g. persisting the
   * choice server-side. Receives the chosen base code. Rejections are caught
   * so they never undo the local switch; handle errors inside the callback if
   * you need to surface them.
   */
  onChange?: (code: string) => void | Promise<void>;
}

/// Language picker built on the shared popover/roving-focus chassis.
///
/// Switching always calls `i18next.changeLanguage`, which (with the standard
/// browser-language-detector `caches`) persists to localStorage. The optional
/// `onChange` callback runs afterward for app-specific persistence (e.g. a
/// server PATCH) and is intentionally decoupled: this component knows nothing
/// about auth or your API.
export default function LanguagePicker({
  variant = "popover",
  namespace = "common",
  languages = DEFAULT_LANGUAGES,
  onChange,
}: LanguagePickerProps) {
  const { i18n, t } = useTranslation(namespace);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const inlineRef = useRef<HTMLDivElement | null>(null);

  useRovingFocus(popoverRef, variant === "popover" && open);
  useRovingFocus(inlineRef, variant === "inline", { autoFocus: false });

  const codes = languages.map((l) => l.code);
  // i18n.language can include a region subtag (e.g. "en-US"); compare against
  // the canonical base codes.
  const active = (i18n.resolvedLanguage || i18n.language || codes[0] || "en").split(
    "-",
  )[0];

  async function pick(code: string) {
    if (!codes.includes(code)) return;
    if (code === active) {
      if (variant === "popover") setOpen(false);
      return;
    }
    await i18n.changeLanguage(code);
    if (variant === "popover") setOpen(false);

    if (onChange) {
      try {
        await onChange(code);
      } catch {
        // The local switch already took effect; a failed persist must not
        // undo it. The consumer owns error reporting.
      }
    }
  }

  const list = (
    <div
      className="language-picker-list"
      role="menu"
      tabIndex={-1}
      aria-label={t("language.menuAria")}
    >
      <div className="language-picker-title">{t("language.title")}</div>
      {languages.map((lng) => {
        const isActive = lng.code === active;
        return (
          <button
            key={lng.code}
            type="button"
            role="menuitemradio"
            aria-checked={isActive}
            className={`language-picker-item ${isActive ? "active" : ""}`}
            onClick={() => pick(lng.code)}
          >
            <span className="language-picker-name">{lng.nativeName}</span>
            {isActive && (
              <span className="language-picker-check" aria-hidden="true">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <PopoverPicker
      variant={variant}
      open={open}
      onOpenChange={setOpen}
      className="language-picker"
      toggleAriaLabel={t("language.toggleAria")}
      popoverAriaLabel={t("language.title")}
      popoverRef={popoverRef}
      inlineRef={inlineRef}
      toggleIcon={
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      }
    >
      {list}
    </PopoverPicker>
  );
}
