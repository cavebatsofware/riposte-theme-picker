import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    theme: "src/theme/index.ts",
    language: "src/language/index.ts",
    "i18n/index": "src/i18n/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  external: [
    "react",
    "react-dom",
    "react-i18next",
    // The design-system is a peer dependency; never bundle it (a single
    // instance must back the shared ThemeContext across the package boundary).
    /^@cavebatsofware\/riposte-design-system(\/.*)?$/,
  ],
});
