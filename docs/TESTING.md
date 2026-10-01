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
- [ ] Slot `2` cannot be removed while it is the base variant.
- [ ] Slot `2` cannot be reordered when base variant reordering is disabled.
- [ ] The currently active extra variant cannot be removed.
- [ ] Extra variants can be removed after switching away from them.
- [ ] Variants can be reordered by dragging anywhere on the variant card.
- [ ] Reordering extra variants updates the corresponding `3–9` shortcut order.
- [ ] Clicking/tapping a card without dragging still activates the variant normally.
- [ ] Cancelling a drag or dropping in the same position does not leave the card in a dragging state.
- [ ] Adding variants stops at eight total slots (`2–9`).
- [ ] Variant data persists after reloading the room.

## Base variant reordering

- [ ] Base variant reordering is disabled by default.
- [ ] Enabling base variant reordering allows another variant to be swapped into slot `2`.
- [ ] Swapping another variant into slot `2` makes it the new base variant.
- [ ] The previous base moves to the other variant's slot.
- [ ] The previous base behaves like a regular extra variant after the swap.
- [ ] The previous base can be removed after switching away from it.
- [ ] Disabling base variant reordering protects the current slot `2` again.
- [ ] Reordering the base does not change the currently displayed image unexpectedly.
- [ ] Shortcut numbers reflect the new slot order after a base swap.

## Variant scale and image sync

- [ ] Each variant restores its own saved scale when activated.
- [ ] A newly added variant initially inherits the scale of the base variant.
- [ ] Resizing the active variant updates only that variant's stored scale.
- [ ] Switching between variants with different source image dimensions preserves each configured visual size.
- [ ] Variants created before v1.1 continue working and learn scale data without being recreated.
- [ ] Mirroring a token does not overwrite the variant's stored scale.
- [ ] Switching variants preserves the token's current mirrored/non-mirrored orientation.
- [ ] Using Owlbear Rodeo `Replace Image` updates the currently active variant.
- [ ] `Replace Image` on slot `2` remains saved after switching away and back.
- [ ] `Replace Image` on slots `3–9` remains saved after switching away and back.
- [ ] AlterKey-driven variant changes do not cause unwanted sync loops or overwrite another variant.

## Copy / Paste

- [ ] Copy ignores slot `2` and copies only slots `3–9`.
- [ ] Paste preserves the destination token's current slot `2`.
- [ ] Paste replaces the destination's extra variants in source order.
- [ ] Paste works on multiple destination tokens.
- [ ] Each destination keeps its own slot `2` when pasting to multiple tokens.
- [ ] Copied variants keep their individual saved scales.
- [ ] If the destination's current image is not in the new set, it returns to slot `2`.
- [ ] Copy / Paste still works correctly after the destination base has been changed.
- [ ] Copy / Paste notifications use correct singular/plural wording.

## Settings

- [ ] Mirror can be enabled and disabled without reloading.
- [ ] Variants can be enabled and disabled without reloading.
- [ ] Copy / Paste can be enabled and disabled without reloading.
- [ ] Base variant reordering can be enabled and disabled without reloading.
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
- [ ] Base variant reordering setting is translated correctly.
- [ ] Changing back to English updates the UI without reloading.

## Theme and layout

- [ ] Settings is legible in Owlbear dark theme.
- [ ] Settings is legible in Owlbear light theme.
- [ ] Variants is legible in Owlbear dark theme.
- [ ] Variants is legible in Owlbear light theme.
- [ ] Text is not clipped at the configured action size.
- [ ] Variant cards remain usable after the drag-handle removal.

## Devices and browsers

- [ ] Chrome desktop.
- [ ] Firefox desktop.
- [ ] Safari desktop, if available.
- [ ] Android touch device using a hosted deployment.
- [ ] iPhone/iPad touch device using a hosted deployment.
- [ ] Variant reordering works using mouse input.
- [ ] Variant reordering works using touch/pointer input.
- [ ] Touching a card without dragging still activates the variant.
- [ ] Full-card dragging is comfortable to use on touch devices.

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
- [ ] `dist/icons/alterkey.svg` exists.
- [ ] `dist/icons/alterkey-icon.png` exists.
- [ ] The hosted manifest can be installed in Owlbear Rodeo.
- [ ] The hosted extension is tested on desktop and at least one mobile device.
