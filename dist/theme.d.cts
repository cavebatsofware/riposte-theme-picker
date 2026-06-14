import * as react from 'react';

interface ThemePickerProps {
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
declare function ThemePicker({ variant, namespace }: ThemePickerProps): react.JSX.Element;

export { ThemePicker, type ThemePickerProps };
