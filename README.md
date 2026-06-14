# @cavebatsofware/riposte-pickers

Accessible React **theme** and **language** pickers for the Riposte design
system. The theme picker has a two-axis model (colorway and light/dark mode);
the language picker drives `react-i18next` and persists through your i18next
instance, with an optional hook for server-side sync.

The theme engine (`ThemeProvider` / `useTheme`), the popover/roving-focus
chassis these pickers build on, and the design tokens they consume all ship in
[`@cavebatsofware/riposte-design-system`](https://github.com/cavebatsofware/riposte-design-system).
This package is the picker UI on top of that foundation. Extracted from
[riposte-social](https://github.com/cavebatsofware/riposte-social).

## What you get

- **`ThemePicker`**: a popover (or inline) grid of swatches plus a light/dark
  toggle, each an ARIA radiogroup with roving tabindex. Drives the
  design-system theme engine.
- **`LanguagePicker`**: a popover (or inline) list of languages by native name,
  with an injectable `onChange` for persistence.
- Translation fragments (en, de, es, fr, zh) for both pickers, and the picker
  layout stylesheets.

The provider/hook, the `PopoverPicker` / `useRovingFocus` chassis, and the
colorway palette + token scale come from the design-system package.

## Install

```sh
npm install @cavebatsofware/riposte-design-system @cavebatsofware/riposte-pickers
```

Peer dependencies (provided by your app): `@cavebatsofware/riposte-design-system
>=0.1.0`, `react >=18`, `react-dom >=18`, `react-i18next >=13`.

## Entry points

| Import | Contents |
|--------|----------|
| `@cavebatsofware/riposte-pickers` | `ThemePicker`, `LanguagePicker`, `DEFAULT_LANGUAGES`, `Language` |
| `@cavebatsofware/riposte-pickers/theme` | `ThemePicker` |
| `@cavebatsofware/riposte-pickers/language` | `LanguagePicker`, `DEFAULT_LANGUAGES`, `Language` |
| `@cavebatsofware/riposte-pickers/i18n` | `themeResources`, `languageResources` |
| `@cavebatsofware/riposte-pickers/styles` | picker + language layout CSS (tokens come from the design system) |

The theme engine and chassis live in
`@cavebatsofware/riposte-design-system` (`./theme`, `./shared`); import them from
there.

## Usage

```tsx
import { ThemeProvider } from "@cavebatsofware/riposte-design-system/theme";
import { ThemePicker, LanguagePicker } from "@cavebatsofware/riposte-pickers";

// Tokens (palette + scale) from the design system, then the picker layout.
import "@cavebatsofware/riposte-design-system/styles";
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

## Styling

The design tokens (the colorway palette and the typography/spacing/radius/shadow
scale) ship in `@cavebatsofware/riposte-design-system/styles`; load that at your
app root. This package ships only the picker layout:

- `styles/picker.css` is the theme-picker layout (`.theme-picker`,
  `.theme-swatch*`, `.theme-mode*`).
- `styles/language.css` is the language-picker layout (`.language-picker`,
  `.language-picker-item`, …).

Both reference token variables (`--color-*`, `--spacing-*`, …) defined by the
design-system palette, so load the design-system styles whenever you use either
picker. Import the picker stylesheets separately if you want only one:

```ts
import "@cavebatsofware/riposte-pickers/styles/picker.css";
import "@cavebatsofware/riposte-pickers/styles/language.css";
```

### Bring your own colorways

The colorway catalog is a prop on the design-system `ThemeProvider`. Each
colorway id needs a matching `[data-theme="<id>"]` (and `[data-theme="<id>-dark"]`)
block in your CSS. Ship your own blocks and pass your catalog:

```tsx
import { ThemeProvider, type Colorway } from "@cavebatsofware/riposte-design-system/theme";

const colorways: Colorway[] = [
  { id: "ocean", label: "Ocean", swatch: "#0b6e7a" },
  { id: "sand", label: "Sand", swatch: "#c9a26b" },
];

<ThemeProvider colorways={colorways} defaultColorway="ocean" storageKey="myapp_theme_v1">
  {children}
</ThemeProvider>;
```

`ThemePicker` renders whatever catalog the provider holds.

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

The theme engine API (`<ThemeProvider>`, `useTheme()`) lives in
`@cavebatsofware/riposte-design-system`; see its README. The pickers:

### `<ThemePicker>`

| Prop | Default | Description |
|------|---------|-------------|
| `variant` | `"popover"` | `"popover"` (toggle + dialog) or `"inline"` (always-visible grid). |
| `namespace` | `"common"` | i18next namespace holding the `theme.*` keys. |

Must render inside a design-system `<ThemeProvider>`.

### `<LanguagePicker>`

| Prop | Default | Description |
|------|---------|-------------|
| `variant` | `"popover"` | `"popover"` (toggle + dialog) or `"inline"` (always-visible list). |
| `namespace` | `"common"` | i18next namespace holding the `language.*` keys. |
| `languages` | bundled `DEFAULT_LANGUAGES` | Selectable languages (`{ code, nativeName }`). |
| `onChange` | none | Optional side effect after a switch (e.g. server persist). Rejections are swallowed. |

## License

GPL-3.0-only. See [LICENSE](./LICENSE).
