# @cavebatsofware/riposte-theme-picker

Accessible React theme picker with a two-axis model (colorway and light/dark
mode), a `localStorage`-backed engine that honors `prefers-color-scheme`, and a
bundled default palette of eight colorways (including three accessibility
colorways). Extracted from [riposte-social](https://github.com/cavebatsofware/riposte-social).

## What you get

- `ThemeProvider` / `useTheme` engine: persists the choice, tracks the OS
  preference until the user picks, and applies `<html data-theme="…">`.
- `ThemePicker`: a popover (or inline) grid of swatches plus a light/dark
  toggle, each an ARIA radiogroup with roving tabindex.
- A default palette (`styles/`) you can ship as-is or replace.
- Translation fragments for en, de, es, fr, zh.

## Install

```sh
npm install @cavebatsofware/riposte-theme-picker
```

Peer dependencies (provided by your app): `react >=18`, `react-dom >=18`,
`react-i18next >=13`.

## Usage

```tsx
import { ThemeProvider, ThemePicker } from "@cavebatsofware/riposte-theme-picker";
import "@cavebatsofware/riposte-theme-picker/styles";

function App() {
  return (
    <ThemeProvider>
      <header>
        <ThemePicker />
      </header>
      {/* ... */}
    </ThemeProvider>
  );
}
```

`ThemePicker` reads its strings from `react-i18next`, so it must render inside
an `I18nextProvider` (or your global i18next instance). Merge the bundled
fragments into your namespace (default `common`):

```ts
import i18n from "./i18n"; // your configured i18next instance
import { themeResources } from "@cavebatsofware/riposte-theme-picker/i18n";

for (const [lng, res] of Object.entries(themeResources)) {
  i18n.addResourceBundle(lng, "common", res, true, true);
}
```

Using a different namespace? Pass it through and merge into the same one:

```tsx
<ThemePicker namespace="ui" />
```

## Styling and the palette

`import ".../styles"` pulls in two stylesheets:

- `styles/palette.css` defines the colorway design tokens as
  `[data-theme="<id>"]` / `[data-theme="<id>-dark"]` blocks, plus shared tokens
  (typography, spacing, radius, shadow) the picker consumes.
- `styles/picker.css` is the picker layout (`.theme-picker`, `.theme-swatch*`,
  `.theme-mode*`).

Import them separately if you only want one:

```ts
import "@cavebatsofware/riposte-theme-picker/styles/picker.css";
```

### Bring your own colorways

Each colorway id must have a matching `[data-theme="<id>"]` (and
`[data-theme="<id>-dark"]`) block in your CSS. To replace the default catalog,
skip `palette.css`, ship your own blocks, and pass your catalog to the provider:

```tsx
import { ThemeProvider, type Colorway } from "@cavebatsofware/riposte-theme-picker";

const colorways: Colorway[] = [
  { id: "ocean", label: "Ocean", swatch: "#0b6e7a" },
  { id: "sand", label: "Sand", swatch: "#c9a26b" },
];

<ThemeProvider colorways={colorways} defaultColorway="ocean" storageKey="myapp_theme_v1">
  {children}
</ThemeProvider>;
```

## API

### `<ThemeProvider>`

| Prop | Default | Description |
|------|---------|-------------|
| `colorways` | bundled `COLORWAYS` | The catalog the picker renders and the engine validates against. |
| `defaultColorway` | `"forest"` | Used when nothing is stored. |
| `storageKey` | `"rs_theme_v1"` | `localStorage` key for the persisted id. |

### `useTheme()`

Returns `{ theme, setTheme, colorways, mode, setMode }`. `theme` is the resolved
id of record (`"forest"` or `"forest-dark"`); `mode` is the derived
`"light"` | `"dark"`.

### `<ThemePicker>`

| Prop | Default | Description |
|------|---------|-------------|
| `variant` | `"popover"` | `"popover"` (toggle + dialog) or `"inline"` (always-visible grid). |
| `namespace` | `"common"` | i18next namespace holding the `theme.*` keys. |

`PopoverPicker` is also exported for building sibling pickers (language,
compose, etc.) on the same toggle/popover/focus chassis.

## License

GPL-3.0-only. See [LICENSE](./LICENSE).
