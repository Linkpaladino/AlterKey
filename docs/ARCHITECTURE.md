# Architecture

AlterKey is a small vanilla JavaScript Owlbear Rodeo extension built with Vite.

## Entry points

- `index.html` loads the background logic through `src/main.js`.
- `settings.html` renders the extension action popover.
- `variants.html` renders the embedded variants context-menu UI.

## Main areas

### `src/config`

Stable extension IDs, metadata keys, limits, icon paths, and embed configuration.

### `src/features/mirror`

Horizontal image mirroring and its context-menu registration.

### `src/features/settings`

Room-level settings persistence, feature-menu synchronization, and the settings UI.

### `src/features/variants`

Variant storage, mapping, application, asset selection, reordering, copy/paste behavior, context menus, and the variants UI.

### `src/i18n`

English and Portuguese (Brazil) dictionaries plus translation helpers.

### `src/shared`

Small Owlbear helpers used by multiple features, including selection, permissions, and theme synchronization.

### `src/tools`

The AlterKey tool, keyboard shortcut handling, and `Shift + Click` multi-selection while the tool is active.

## State

Room settings are stored in namespaced room metadata. Token variant data and active-variant state are stored in namespaced item metadata. The copy/paste buffer is intentionally temporary and exists only for the current extension session.

## Variant rules

- Slot `2` maps to variant index `0` and is the fixed base variant.
- Slots `3–9` are extra variants and can be managed by the GM.
- Slot `2` cannot be removed or reordered.
- The currently active extra variant cannot be removed.
- Copy / Paste transfers only slots `3–9` and preserves the destination token's base variant.
- If Paste replaces the currently displayed extra variant and that image no longer exists in the new set, the destination returns to slot `2`.

## Permissions and settings

- Players may mirror and switch variants only when Owlbear Rodeo grants update permission for the selected token.
- Adding, removing, reordering, copying, and pasting variants are GM-only operations.
- Mirror, Variants, and Copy / Paste can be enabled or disabled per room.
- English is the default interface language; Portuguese (Brazil) can be selected per room.

## Code conventions

- User-facing strings belong in `src/i18n`.
- UI modules render state and display notifications.
- Services enforce feature rules and return status values instead of deciding user-facing text.
- Shared Owlbear-specific helpers belong in `src/shared` when more than one feature uses them.
