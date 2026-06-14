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

// The theme engine (ThemeProvider, useTheme, COLORWAYS) now lives in
// @cavebatsofware/riposte-design-system/theme; import it from there. This
// package ships the picker UI that drives the engine.
export { default as ThemePicker } from "./ThemePicker";
export type { ThemePickerProps } from "./ThemePicker";
