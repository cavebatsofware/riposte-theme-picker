import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@cavebatsofware/riposte-design-system/theme';
import { PopoverPicker } from '@cavebatsofware/riposte-design-system/shared';
import { jsxs, jsx } from 'react/jsx-runtime';

// src/theme/ThemePicker.tsx
var ARROW_KEYS = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
function nextRadioIndex(key, currentIndex, length) {
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
function ThemePicker({ variant = "popover", namespace = "common" }) {
  const { theme, setTheme, colorways, mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const colorwayBtnRefs = useRef([]);
  const modeBtnRefs = useRef([]);
  const { t } = useTranslation(namespace);
  const currentColorway = theme.endsWith("-dark") ? theme.slice(0, -"-dark".length) : theme;
  const grid = /* @__PURE__ */ jsxs("div", { className: "theme-picker-grid", children: [
    /* @__PURE__ */ jsx("div", { className: "theme-picker-title", children: t("theme.title") }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "theme-swatches",
        role: "radiogroup",
        tabIndex: -1,
        "aria-label": t("theme.colorwayAria"),
        children: colorways.map((c, idx) => {
          const active = c.id === currentColorway;
          const label = t(`theme.colorways.${c.id}`, { defaultValue: c.label });
          return /* @__PURE__ */ jsxs(
            "button",
            {
              ref: (el) => {
                colorwayBtnRefs.current[idx] = el;
              },
              type: "button",
              role: "radio",
              "aria-checked": active,
              tabIndex: active ? 0 : -1,
              className: `theme-swatch ${active ? "active" : ""}`,
              onClick: () => {
                setTheme(`${c.id}${mode === "dark" ? "-dark" : ""}`);
                if (variant === "popover") setOpen(false);
              },
              onKeyDown: (e) => {
                if (!ARROW_KEYS.includes(e.key)) return;
                e.preventDefault();
                const next = nextRadioIndex(e.key, idx, colorways.length);
                const target = colorways[next];
                setTheme(`${target.id}${mode === "dark" ? "-dark" : ""}`);
                colorwayBtnRefs.current[next]?.focus();
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "theme-swatch-color",
                    style: { background: c.swatch },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "theme-swatch-label", children: label }),
                active && /* @__PURE__ */ jsx("span", { className: "theme-swatch-check", "aria-hidden": "true", children: "\u2713" })
              ]
            },
            c.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "theme-mode-row",
        role: "radiogroup",
        tabIndex: -1,
        "aria-label": t("theme.modeAria"),
        children: (() => {
          const modes = [
            { id: "light", label: t("theme.mode.light") },
            { id: "dark", label: t("theme.mode.dark") }
          ];
          return modes.map((m, idx) => /* @__PURE__ */ jsx(
            "button",
            {
              ref: (el) => {
                modeBtnRefs.current[idx] = el;
              },
              type: "button",
              role: "radio",
              "aria-checked": mode === m.id,
              tabIndex: mode === m.id ? 0 : -1,
              className: `theme-mode-btn ${mode === m.id ? "active" : ""}`,
              onClick: () => setMode(m.id),
              onKeyDown: (e) => {
                if (!ARROW_KEYS.includes(e.key)) return;
                e.preventDefault();
                const next = nextRadioIndex(e.key, idx, modes.length);
                setMode(modes[next].id);
                modeBtnRefs.current[next]?.focus();
              },
              children: m.label
            },
            m.id
          ));
        })()
      }
    )
  ] });
  return /* @__PURE__ */ jsx(
    PopoverPicker,
    {
      variant,
      open,
      onOpenChange: setOpen,
      className: "theme-picker",
      toggleAriaLabel: t("theme.toggleAria"),
      popoverAriaLabel: t("theme.dialogAria"),
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
            /* @__PURE__ */ jsx("circle", { cx: "13.5", cy: "6.5", r: "0.5", fill: "currentColor" }),
            /* @__PURE__ */ jsx("circle", { cx: "17.5", cy: "10.5", r: "0.5", fill: "currentColor" }),
            /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "7.5", r: "0.5", fill: "currentColor" }),
            /* @__PURE__ */ jsx("circle", { cx: "6.5", cy: "12.5", r: "0.5", fill: "currentColor" }),
            /* @__PURE__ */ jsx("path", { d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1 0 1.5-.5 1.5-1.2 0-.4-.1-.7-.4-1-.2-.3-.4-.6-.4-1 0-.7.5-1.2 1.2-1.2H16c3.3 0 6-2.7 6-6 0-5-4.5-9-10-9z" })
          ]
        }
      ),
      children: grid
    }
  );
}

export { ThemePicker };
//# sourceMappingURL=chunk-VK64ALLN.js.map
//# sourceMappingURL=chunk-VK64ALLN.js.map