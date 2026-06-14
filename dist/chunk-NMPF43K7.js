import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRovingFocus, PopoverPicker } from '@cavebatsofware/riposte-design-system/shared';
import { jsxs, jsx } from 'react/jsx-runtime';

// src/language/LanguagePicker.tsx

// src/language/languages.ts
var DEFAULT_LANGUAGES = [
  { code: "en", nativeName: "English" },
  { code: "es", nativeName: "Espa\xF1ol" },
  { code: "fr", nativeName: "Fran\xE7ais" },
  { code: "zh", nativeName: "\u4E2D\u6587" },
  { code: "de", nativeName: "Deutsch" }
];
function LanguagePicker({
  variant = "popover",
  namespace = "common",
  languages = DEFAULT_LANGUAGES,
  onChange
}) {
  const { i18n, t } = useTranslation(namespace);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);
  const inlineRef = useRef(null);
  useRovingFocus(popoverRef, variant === "popover" && open);
  useRovingFocus(inlineRef, variant === "inline", { autoFocus: false });
  const codes = languages.map((l) => l.code);
  const active = (i18n.resolvedLanguage || i18n.language || codes[0] || "en").split(
    "-"
  )[0];
  async function pick(code) {
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
      }
    }
  }
  const list = /* @__PURE__ */ jsxs(
    "div",
    {
      className: "language-picker-list",
      role: "menu",
      tabIndex: -1,
      "aria-label": t("language.menuAria"),
      children: [
        /* @__PURE__ */ jsx("div", { className: "language-picker-title", children: t("language.title") }),
        languages.map((lng) => {
          const isActive = lng.code === active;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              role: "menuitemradio",
              "aria-checked": isActive,
              className: `language-picker-item ${isActive ? "active" : ""}`,
              onClick: () => pick(lng.code),
              children: [
                /* @__PURE__ */ jsx("span", { className: "language-picker-name", children: lng.nativeName }),
                isActive && /* @__PURE__ */ jsx("span", { className: "language-picker-check", "aria-hidden": "true", children: "\u2713" })
              ]
            },
            lng.code
          );
        })
      ]
    }
  );
  return /* @__PURE__ */ jsx(
    PopoverPicker,
    {
      variant,
      open,
      onOpenChange: setOpen,
      className: "language-picker",
      toggleAriaLabel: t("language.toggleAria"),
      popoverAriaLabel: t("language.title"),
      popoverRef,
      inlineRef,
      toggleIcon: /* @__PURE__ */ jsxs(
        "svg",
        {
          width: "20",
          height: "20",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsx("path", { d: "M2 12h20" }),
            /* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
          ]
        }
      ),
      children: list
    }
  );
}

export { DEFAULT_LANGUAGES, LanguagePicker };
//# sourceMappingURL=chunk-NMPF43K7.js.map
//# sourceMappingURL=chunk-NMPF43K7.js.map