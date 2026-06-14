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
import { useTheme, type ThemeMode } from "@cavebatsofware/riposte-design-system/theme";
import { PopoverPicker } from "@cavebatsofware/riposte-design-system/shared";

const ARROW_KEYS = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];

/// Resolve the next index for a roving radiogroup keystroke. ArrowDown /
/// ArrowRight advance, ArrowUp / ArrowLeft retreat, Home / End jump. The
/// list wraps at the ends.
function nextRadioIndex(key: string, currentIndex: number, length: number): number {
  switch (key) {
    case "Home":
      return 0;
    case "End":
      return length - 1;
    case "ArrowDown":
    case "ArrowRight":
      return (currentIndex + 1) % length;
    case "ArrowUp":
    case "ArrowLeft":
      return (currentIndex - 1 + length) % length;
    default:
      return currentIndex;
  }
}

export interface ThemePickerProps {
  /**
   * `popover` (default): round icon button in a header that opens a popover
   * grid. `inline`: the grid rendered directly, for use inside a drawer.
   */
  variant?: "popover" | "inline";
  /**
   * i18next namespace holding the `theme.*` keys. Defaults to `common`.
   * Merge the package's `themeResources` into this namespace.
   */
  namespace?: string;
}

/// Theme picker: a colorway switch and a light/dark mode toggle rendered as
/// two adjacent ARIA radiogroups with roving tabindex. The underlying state
/// is a single id of the form "<colorway>-<mode>" or just "<colorway>" for
/// light-mode values (both handled by `ThemeContext.setTheme`).
export default function ThemePicker({ variant = "popover", namespace = "common" }: ThemePickerProps) {
  const { theme, setTheme, colorways, mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const colorwayBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const modeBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { t } = useTranslation(namespace);

  // Today the theme id is "<colorway>" (light) or "<colorway>-dark". Derive
  // the current colorway from the resolved theme so the swatches show the
  // right active state regardless of which form is stored.
  const currentColorway = theme.endsWith("-dark") ? theme.slice(0, -"-dark".length) : theme;

  const grid = (
    <div className="theme-picker-grid">
      <div className="theme-picker-title">{t("theme.title")}</div>
      <div
        className="theme-swatches"
        role="radiogroup"
        tabIndex={-1}
        aria-label={t("theme.colorwayAria")}
      >
        {colorways.map((c, idx) => {
          const active = c.id === currentColorway;
          // Colorway display name comes from the catalog so each language can
          // localize the marketing-style names. Fall back to the catalog's
          // hardcoded `c.label` if a key is missing.
          const label = t(`theme.colorways.${c.id}`, { defaultValue: c.label });
          return (
            <button
              key={c.id}
              ref={(el) => {
                colorwayBtnRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              className={`theme-swatch ${active ? "active" : ""}`}
              onClick={() => {
                setTheme(`${c.id}${mode === "dark" ? "-dark" : ""}`);
                if (variant === "popover") setOpen(false);
              }}
              onKeyDown={(e) => {
                if (!ARROW_KEYS.includes(e.key)) return;
                e.preventDefault();
                const next = nextRadioIndex(e.key, idx, colorways.length);
                const target = colorways[next];
                setTheme(`${target.id}${mode === "dark" ? "-dark" : ""}`);
                colorwayBtnRefs.current[next]?.focus();
              }}
            >
              <span
                className="theme-swatch-color"
                style={{ background: c.swatch }}
                aria-hidden="true"
              />
              <span className="theme-swatch-label">{label}</span>
              {active && (
                <span className="theme-swatch-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div
        className="theme-mode-row"
        role="radiogroup"
        tabIndex={-1}
        aria-label={t("theme.modeAria")}
      >
        {(() => {
          const modes: Array<{ id: ThemeMode; label: string }> = [
            { id: "light", label: t("theme.mode.light") },
            { id: "dark", label: t("theme.mode.dark") },
          ];
          return modes.map((m, idx) => (
            <button
              key={m.id}
              ref={(el) => {
                modeBtnRefs.current[idx] = el;
              }}
              type="button"
              role="radio"
              aria-checked={mode === m.id}
              tabIndex={mode === m.id ? 0 : -1}
              className={`theme-mode-btn ${mode === m.id ? "active" : ""}`}
              onClick={() => setMode(m.id)}
              onKeyDown={(e) => {
                if (!ARROW_KEYS.includes(e.key)) return;
                e.preventDefault();
                const next = nextRadioIndex(e.key, idx, modes.length);
                setMode(modes[next].id);
                modeBtnRefs.current[next]?.focus();
              }}
            >
              {m.label}
            </button>
          ));
        })()}
      </div>
    </div>
  );

  return (
    <PopoverPicker
      variant={variant}
      open={open}
      onOpenChange={setOpen}
      className="theme-picker"
      toggleAriaLabel={t("theme.toggleAria")}
      popoverAriaLabel={t("theme.dialogAria")}
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
          <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.5-.5 1.5-1.2 0-.4-.1-.7-.4-1-.2-.3-.4-.6-.4-1 0-.7.5-1.2 1.2-1.2H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z" />
        </svg>
      }
    >
      {grid}
    </PopoverPicker>
  );
}
