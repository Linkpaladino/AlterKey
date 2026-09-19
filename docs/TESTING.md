# AlterKey release checklist

Use this checklist before tagging or publishing a release.

## Setup

- [ ] `npm install` completes successfully.
- [ ] `npm run verify` passes.
- [ ] `npm run dev` starts without errors.
- [ ] Owlbear Rodeo loads `http://localhost:5173/manifest.json`.

## GM — core shortcuts

- [ ] `V` activates the AlterKey tool.
- [ ] `1` mirrors one selected image token.
- [ ] `Shift + Click` adds a token to the current selection while AlterKey is active.
- [ ] `Shift + Click` removes an already selected token from the current selection.
- [ ] `1` mirrors multiple tokens selected with `Shift + Click`.
- [ ] `2–9` switch configured variants on multiple selected tokens.
- [ ] An unconfigured `2–9` shortcut shows the expected notification.
- [ ] Disabled Mirror/Variants shortcuts show the disabled-feature notification.

## Variants

- [ ] A new token automatically becomes slot `2` when Variants is opened.
- [ ] Slot `2` is marked active for a newly initialized token.
- [ ] Slot `2` cannot be removed.
- [ ] Slot `2` cannot be reordered.
- [ ] The currently active extra variant cannot be removed.
- [ ] Extra variants can be removed after switching away from them.
- [ ] Extra variants can be reordered.
- [ ] Reordering extra variants updates the corresponding `3–9` shortcut order.
- [ ] Adding variants stops at eight total slots (`2–9`).
- [ ] Variant data persists after reloading the room.

## Copy / Paste

- [ ] Copy ignores slot `2` and copies only slots `3–9`.
- [ ] Paste preserves the destination token's slot `2`.
- [ ] Paste replaces the destination's extra variants in source order.
- [ ] Paste works on multiple destination tokens.
- [ ] Each destination keeps its own slot `2` when pasting to multiple tokens.
- [ ] If the destination's current image is not in the new set, it returns to slot `2`.
- [ ] Copy / Paste notifications use correct singular/plural wording.

## Settings

- [ ] Mirror can be enabled and disabled without reloading.
- [ ] Variants can be enabled and disabled without reloading.
- [ ] Copy / Paste can be enabled and disabled without reloading.
- [ ] Disabled context-menu features disappear.
- [ ] Settings persist after reloading the room.
- [ ] PLAYER can view settings but cannot change them.

## Roles and permissions

- [ ] GM sees add/remove/reorder controls.
- [ ] GM sees Copy variants / Paste variants when enabled.
- [ ] PLAYER does not see add/remove/reorder controls.
- [ ] PLAYER does not see Copy variants / Paste variants.
- [ ] PLAYER can mirror and switch variants only when Owlbear Rodeo grants update permission.
- [ ] Changing GM/PLAYER role during the session updates management menus.

## Language

- [ ] English is the default for a room with no saved language.
- [ ] Changing to Portuguese updates Settings immediately.
- [ ] Context-menu labels follow the selected language.
- [ ] Shortcut notifications follow the selected language.
- [ ] Variants UI and tooltips follow the selected language.
- [ ] Changing back to English updates the UI without reloading.

## Theme and layout

- [ ] Settings is legible in Owlbear dark theme.
- [ ] Settings is legible in Owlbear light theme.
- [ ] Variants is legible in Owlbear dark theme.
- [ ] Variants is legible in Owlbear light theme.
- [ ] Text is not clipped at the configured action size.

## Devices and browsers

- [ ] Chrome desktop.
- [ ] Firefox desktop.
- [ ] Safari desktop, if available.
- [ ] Android touch device, after the extension is hosted.
- [ ] iPhone/iPad touch device, after the extension is hosted.
- [ ] Variant reordering works using touch/pointer input.

## Room states

- [ ] Extension loads with a scene open.
- [ ] Extension loads with no scene open.
- [ ] Opening a scene after loading restores tool/menu behavior.
- [ ] Private/incognito browsing works.

## Production

- [ ] `npm run build` completes successfully.
- [ ] `dist/index.html` exists.
- [ ] `dist/settings.html` exists.
- [ ] `dist/variants.html` exists.
- [ ] `dist/manifest.json` exists.
- [ ] `dist/icons/alterkey-icon.png` exists.
- [ ] The hosted manifest can be installed in Owlbear Rodeo.
- [ ] The hosted extension is tested on desktop and at least one mobile device.
