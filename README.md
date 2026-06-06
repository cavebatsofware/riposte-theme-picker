# @cavebatsofware/riposte-pickers

Accessible React **theme** and **language** pickers that share one
popover/roving-focus chassis. The theme picker has a two-axis model (colorway
and light/dark mode) with a `localStorage`-backed engine that honors
`prefers-color-scheme`; the language picker drives `react-i18next` and persists
through your i18next instance, with an optional hook for server-side sync.
Extracted from [riposte-social](https://github.com/cavebatsofware/riposte-social).

## What you get

- **`ThemeProvider` / `useTheme`** engine: persists the choice, tracks the OS
  preference until the user picks, and applies `<html data-theme="…">`.
- **`ThemePicker`**: a popover (or inline) grid of swatches plus a light/dark
  toggle, each an ARIA radiogroup with roving tabindex.
- **`LanguagePicker`**: a popover (or inline) list of languages by native name,
  built on the same chassis, with an injectable `onChange` for persistence.
- **`PopoverPicker` / `useRovingFocus`**: the shared toggle/popover/focus shell
  and the WAI-ARIA roving-tabindex hook, exported so you can build sibling
  pickers (visibility, compose, etc.) on the same foundation.
- A default palette (`styles/`) and translation fragments (en, de, es, fr, zh).

## Install

```sh
npm install @cavebatsofware/riposte-pickers
```

Peer dependencies (provided by your app): `react >=18`, `react-dom >=18`,
`react-i18next >=13`.

## Entry points

| Import | Contents |
|--------|----------|
| `@cavebatsofware/riposte-pickers` | everything below |
| `@cavebatsofware/riposte-pickers/theme` | `ThemeProvider`, `useTheme`, `ThemePicker`, `COLORWAYS`, … |
| `@cavebatsofware/riposte-pickers/language` | `LanguagePicker`, `DEFAULT_LANGUAGES`, `Language` |
| `@cavebatsofware/riposte-pickers/shared` | `PopoverPicker`, `useRovingFocus` |
| `@cavebatsofware/riposte-pickers/i18n` | `themeResources`, `languageResources` |
| `@cavebatsofware/riposte-pickers/styles` | all CSS (`palette` + `picker` + `language`) |

The root entry re-exports every symbol, so a single import works too; the
subpaths exist for explicit boundaries and to keep theme-only or language-only
consumers lean.

## Usage

```tsx
import { ThemeProvider, ThemePicker, LanguagePicker } from "@cavebatsofware/riposte-pickers";
import "@cavebatsofware/riposte-pickers/styles";

function App() {
  return (
    <ThemeProvider>
      <header>
        <LanguagePicker />
        <ThemePicker />
      </header>
      {/* ... */}
    </ThemeProvider>
  );
}
```

Both pickers read their strings from `react-i18next`, so they must render
inside an `I18nextProvider` (or your global i18next instance). Merge the
bundled fragments into your namespace (default `common`):

```ts
import i18n from "./i18n"; // your configured i18next instance
import { themeResources, languageResources } from "@cavebatsofware/riposte-pickers/i18n";

for (const [lng, res] of Object.entries(themeResources)) {
  i18n.addResourceBundle(lng, "common", res, true, true);
}
for (const [lng, res] of Object.entries(languageResources)) {
  i18n.addResourceBundle(lng, "common", res, true, true);
}
```

Using a different namespace? Pass it to each picker and merge into the same one:

```tsx
<ThemePicker namespace="ui" />
<LanguagePicker namespace="ui" />
```

### Persisting the language server-side

The `LanguagePicker` always calls `i18next.changeLanguage` (which, with the
standard browser-language-detector `caches`, writes to `localStorage`). It
knows nothing about auth or your API. To additionally persist the choice for a
signed-in user, pass `onChange`:

```tsx
import { useAuth } from "./auth";
import { updateLocale } from "./api";

function HeaderLanguage() {
  const { user } = useAuth();
  return (
    <LanguagePicker
      onChange={(code) => {
        if (user) return updateLocale(code); // fire-and-forget; rejections are swallowed
      }}
    />
  );
}
```

A rejected `onChange` never undoes the local switch; surface errors inside the
callback if you need to.

## Styling and the palette

`import ".../styles"` pulls in three stylesheets:

- `styles/palette.css` defines the colorway design tokens as
  `[data-theme="<id>"]` / `[data-theme="<id>-dark"]` blocks, plus shared tokens
  (typography, spacing, radius, shadow) both pickers consume.
- `styles/picker.css` is the theme-picker layout (`.theme-picker`,
  `.theme-swatch*`, `.theme-mode*`).
- `styles/language.css` is the language-picker layout (`.language-picker`,
  `.language-picker-item`, …).

Import them separately if you only want some:

```ts
import "@cavebatsofware/riposte-pickers/styles/picker.css";
import "@cavebatsofware/riposte-pickers/styles/language.css";
```

Both picker stylesheets reference the shared tokens in `palette.css`, so ship
`palette.css` (or define equivalent tokens) whenever you use either picker.

### Bring your own colorways

Each colorway id must have a matching `[data-theme="<id>"]` (and
`[data-theme="<id>-dark"]`) block in your CSS. To replace the default catalog,
skip `palette.css`, ship your own blocks, and pass your catalog to the provider:

```tsx
import { ThemeProvider, type Colorway } from "@cavebatsofware/riposte-pickers";

const colorways: Colorway[] = [
  { id: "ocean", label: "Ocean", swatch: "#0b6e7a" },
  { id: "sand", label: "Sand", swatch: "#c9a26b" },
];

<ThemeProvider colorways={colorways} defaultColorway="ocean" storageKey="myapp_theme_v1">
  {children}
</ThemeProvider>;
```

### Bring your own languages

Pass a `languages` catalog (base code plus a native-script display name).
Defaults to the bundled five. Each code is handed to `i18next.changeLanguage`,
so make sure your i18next instance has a catalog for it:

```tsx
import { LanguagePicker, type Language } from "@cavebatsofware/riposte-pickers";

const languages: Language[] = [
  { code: "en", nativeName: "English" },
  { code: "ja", nativeName: "日本語" },
];

<LanguagePicker languages={languages} />;
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

### `<LanguagePicker>`

| Prop | Default | Description |
|------|---------|-------------|
| `variant` | `"popover"` | `"popover"` (toggle + dialog) or `"inline"` (always-visible list). |
| `namespace` | `"common"` | i18next namespace holding the `language.*` keys. |
| `languages` | bundled `DEFAULT_LANGUAGES` | Selectable languages (`{ code, nativeName }`). |
| `onChange` | none | Optional side effect after a switch (e.g. server persist). Rejections are swallowed. |

### Shared chassis

`PopoverPicker` and `useRovingFocus` are exported for building sibling pickers
on the same toggle/popover/focus chassis. `PopoverPicker` owns the
close-on-outside-interaction and Escape handling; `useRovingFocus` wires the
WAI-ARIA roving-tabindex keyboard pattern onto a container.

## License

GPL-3.0-only. See [LICENSE](./LICENSE).
