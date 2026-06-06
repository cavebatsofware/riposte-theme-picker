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

/// Shared chassis for the pickers: the toggle/popover/focus shell and the
/// roving-focus keyboard hook. Both are exported so consumers can build
/// sibling pickers (visibility, compose, etc.) on the same foundation.
export { default as PopoverPicker } from "./PopoverPicker";
export type { PopoverPickerProps } from "./PopoverPicker";

export { default as useRovingFocus } from "./useRovingFocus";
export type { RovingFocusOptions } from "./useRovingFocus";
