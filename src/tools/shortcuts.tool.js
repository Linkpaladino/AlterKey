import OBR from "@owlbear-rodeo/sdk";

import { ICON_PATH, MODE_ID, TOOL_ID } from "../config/constants";
import { mirrorSelectedItems } from "../features/mirror/mirror.service";
import { getSettings } from "../features/settings/settings.repository";
import { applyVariantToSelection } from "../features/variants/variants.service";
import { translate } from "../i18n/i18n";

function getVariantIndexFromKeyboardEvent(event) {
  if (event.repeat) {
    return null;
  }

  if (event.code?.startsWith("Digit")) {
    const number = Number(event.code.replace("Digit", ""));

    if (number >= 2 && number <= 9) {
      return number - 2;
    }
  }

  const number = Number(event.key);

  return !Number.isNaN(number) && number >= 2 && number <= 9
    ? number - 2
    : null;
}

function isMirrorShortcut(event) {
  return !event.repeat && (event.code === "Digit1" || event.key === "1");
}

async function toggleItemSelection(itemId) {
  const selection = (await OBR.player.getSelection()) ?? [];

  if (selection.includes(itemId)) {
    await OBR.player.deselect([itemId]);
    return;
  }

  await OBR.player.select([itemId], false);
}

export async function registerShortcutsTool() {
  await OBR.tool.create({
    id: TOOL_ID,
    icons: [{ icon: ICON_PATH, label: "AlterKey" }],
    shortcut: "V",
    defaultMode: MODE_ID,
  });

  await OBR.tool.createMode({
    id: MODE_ID,
    icons: [
      {
        icon: ICON_PATH,
        label: "AlterKey",
        filter: { activeTools: [TOOL_ID] },
      },
    ],

    preventDrag: {},

    onToolClick(_context, event) {
      if (!event.shiftKey || !event.target || event.transformer) {
        return true;
      }

      if (event.target.locked) {
        return true;
      }

      void toggleItemSelection(event.target.id);

      return false;
    },

    async onKeyDown(_context, event) {
      const settings = await getSettings();

      if (isMirrorShortcut(event)) {
        if (!settings.mirrorEnabled) {
          await OBR.notification.show(
            translate(settings.language, "shortcuts.mirrorDisabled"),
          );

          return;
        }

        await mirrorSelectedItems();
        return;
      }

      const variantIndex = getVariantIndexFromKeyboardEvent(event);

      if (variantIndex === null) {
        return;
      }

      if (!settings.variantsEnabled) {
        await OBR.notification.show(
          translate(settings.language, "shortcuts.variantsDisabled"),
        );

        return;
      }

      const result = await applyVariantToSelection(variantIndex);

      if (result.status === "missing") {
        await OBR.notification.show(
          translate(settings.language, "shortcuts.missingVariant", {
            shortcut: variantIndex + 2,
          }),
        );
      }
    },
  });
}