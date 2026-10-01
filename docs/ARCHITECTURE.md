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

Mirror orientation remains independent from per-variant scale.

### `src/features/settings`

Room-level settings persistence, feature-menu synchronization, and the settings UI.

### `src/features/variants`

Variant storage, mapping, application, asset selection, reordering, copy/paste behavior, context menus, per-variant scale, Owlbear item synchronization, and the variants UI.

`variants.sync.js` observes relevant Owlbear item changes and keeps the active variant synchronized with native image replacement and manual resizing without treating AlterKey's own updates as new user changes.

### `src/i18n`

English and Portuguese (Brazil) dictionaries plus translation helpers.

### `src/shared`

Small Owlbear helpers used by multiple features, including selection, permissions, and theme synchronization.

### `src/tools`

The AlterKey tool, keyboard shortcut handling, and `Shift + Click` multi-selection while the tool is active.

## State

Room settings are stored in namespaced room metadata. Token variant data and active-variant state are stored in namespaced item metadata.

Each variant may store its own image, grid, and scale data. Existing variant metadata created before per-variant scale support remains compatible and can acquire scale data during normal use.

The copy/paste buffer is intentionally temporary and exists only for the current extension session.

## Variant rules

- Slot `2` maps to variant index `0` and is the current base variant.
- Slot `2` cannot be removed while it is the base variant.
- Base variant reordering is disabled by default.
- When base variant reordering is enabled, another variant can be swapped directly with slot `2`.
- After a base swap, the previous base becomes a regular extra variant.
- Slots `3–9` are extra variants and can be managed by the GM.
- The currently active extra variant cannot be removed.
- Variants are reordered using pointer input on the full variant card.
- New variants initially inherit the scale of the current base variant.
- Manual resizing updates the stored scale of the currently active variant.
- Owlbear Rodeo's native `Replace Image` action updates the currently active variant.
- Variant scale stores size independently from the token's mirrored orientation.
- Copy / Paste transfers only slots `3–9` and preserves the destination token's current base variant.
- Copied extra variants retain their stored scale data.
- If Paste replaces the currently displayed extra variant and that image no longer exists in the new set, the destination returns to slot `2`.

## Permissions and settings

- Players may mirror and switch variants only when Owlbear Rodeo grants update permission for the selected token.
- Adding, removing, reordering, copying, and pasting variants are GM-only operations.
- Mirror, Variants, Copy / Paste, and base variant reordering are controlled through room settings.
- Base variant reordering is disabled by default.
- English is the default interface language; Portuguese (Brazil) can be selected per room.

## Code conventions

- User-facing strings belong in `src/i18n`.
- UI modules render state and display notifications.
- Services enforce feature rules and return status values instead of deciding user-facing text.
- Synchronization logic stays isolated from rendering and user-facing notification logic.
- Shared Owlbear-specific helpers belong in `src/shared` when more than one feature uses them.
