# Changelog

All notable changes to AlterKey will be documented in this file.

## 1.1.0

### Added

- Individual scale support for each token variant.
- Synchronization with Owlbear Rodeo's native `Replace Image` action.
- Automatic scale synchronization when resizing the currently active variant.
- Room setting to allow the base variant in slot `2` to be reordered.

### Changed

- New variants now inherit the scale of the base variant when created.
- The base variant can optionally be swapped with another variant, making the new slot `2` the token's base.
- The previous base becomes a regular variant after being swapped and can be removed normally.
- Copy / Paste continues to preserve the current base variant of the destination token.
- Variant reordering can now be started by dragging the entire variant card instead of using a dedicated drag handle.
- Variant scale and token mirroring are handled independently, preserving the current mirror state when switching variants.

### Fixed

- Fixed variants with different image dimensions sharing the same visual scale.
- Fixed `Replace Image` changes being lost when switching away from and back to a variant.
- Fixed drag state cleanup when a reorder gesture is cancelled or ends without moving a variant.

## 1.0.0

### Added

- AlterKey tool activated with `V`.
- Horizontal token mirroring with shortcut `1`.
- Token variant slots mapped to shortcuts `2–9`.
- `Shift + Click` multi-selection while the AlterKey tool is active.
- Automatic base variant creation in slot `2`.
- Fixed base protection for slot `2`.
- GM management of variant slots `3–9` through the Owlbear asset library.
- Variant removal and reordering with active-variant protections.
- Copy and paste of extra variants across tokens while preserving each destination token's base image.
- Room-level feature toggles for Mirror, Variants, and Copy / Paste.
- English and Portuguese (Brazil) localization with live language switching.
- Owlbear light and dark theme integration.
- Pointer-based variant reordering for mouse and touch input.
- GM/PLAYER role-aware management controls.
- AlterKey settings panel.