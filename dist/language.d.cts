import * as react from 'react';

interface Language {
    /** Base language code (no region subtag), e.g. `en`. Passed to i18next. */
    code: string;
    /**
     * Display name written in the language's own script (e.g. `Deutsch`,
     * `中文`). Shown verbatim in the list so a reader recognizes their own
     * language without a translation chain.
     */
    nativeName: string;
}
declare const DEFAULT_LANGUAGES: Language[];

interface LanguagePickerProps {
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
declare function LanguagePicker({ variant, namespace, languages, onChange, }: LanguagePickerProps): react.JSX.Element;

export { DEFAULT_LANGUAGES, type Language, LanguagePicker, type LanguagePickerProps };
