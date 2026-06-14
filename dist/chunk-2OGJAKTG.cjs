'use strict';

var react = require('react');
var reactI18next = require('react-i18next');
var shared = require('@cavebatsofware/riposte-design-system/shared');
var jsxRuntime = require('react/jsx-runtime');

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
  const { i18n, t } = reactI18next.useTranslation(namespace);
  const [open, setOpen] = react.useState(false);
  const popoverRef = react.useRef(null);
  const inlineRef = react.useRef(null);
  shared.useRovingFocus(popoverRef, variant === "popover" && open);
  shared.useRovingFocus(inlineRef, variant === "inline", { autoFocus: false });
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
  const list = /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: "language-picker-list",
      role: "menu",
      tabIndex: -1,
      "aria-label": t("language.menuAria"),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "language-picker-title", children: t("language.title") }),
        languages.map((lng) => {
          const isActive = lng.code === active;
          return /* @__PURE__ */ jsxRuntime.jsxs(
            "button",
            {
              type: "button",
              role: "menuitemradio",
              "aria-checked": isActive,
              className: `language-picker-item ${isActive ? "active" : ""}`,
              onClick: () => pick(lng.code),
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "language-picker-name", children: lng.nativeName }),
                isActive && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "language-picker-check", "aria-hidden": "true", children: "\u2713" })
              ]
            },
            lng.code
          );
        })
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntime.jsx(
    shared.PopoverPicker,
    {
      variant,
      open,
      onOpenChange: setOpen,
      className: "language-picker",
      toggleAriaLabel: t("language.toggleAria"),
      popoverAriaLabel: t("language.title"),
      popoverRef,
      inlineRef,
      toggleIcon: /* @__PURE__ */ jsxRuntime.jsxs(
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
            /* @__PURE__ */ jsxRuntime.jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M2 12h20" }),
            /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
          ]
        }
      ),
      children: list
    }
  );
}

exports.DEFAULT_LANGUAGES = DEFAULT_LANGUAGES;
exports.LanguagePicker = LanguagePicker;
//# sourceMappingURL=chunk-2OGJAKTG.cjs.map
//# sourceMappingURL=chunk-2OGJAKTG.cjs.map