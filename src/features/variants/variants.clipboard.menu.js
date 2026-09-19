import OBR from "@owlbear-rodeo/sdk";

import {
  COPY_VARIANTS_MENU_ID,
  ICON_PATH,
  PASTE_VARIANTS_MENU_ID,
} from "../../config/constants";
import { translate, translateCount } from "../../i18n/i18n";
import { getSettings } from "../settings/settings.repository";
import { copyVariantsFromToken, pasteVariantsToTokens } from "./variants.clipboard";

export async function registerVariantsClipboardMenus() {
  const { language } = await getSettings();

  try {
    await OBR.contextMenu.remove(COPY_VARIANTS_MENU_ID);
  } catch {}

  try {
    await OBR.contextMenu.remove(PASTE_VARIANTS_MENU_ID);
  } catch {}

  await OBR.contextMenu.create({
    id: COPY_VARIANTS_MENU_ID,
    icons: [
      {
        icon: ICON_PATH,
        label: translate(language, "menu.copyVariants"),
        filter: {
          min: 1,
          max: 1,
          permissions: ["UPDATE"],
          roles: ["GM"],
          every: [{ key: "type", value: "IMAGE" }],
        },
      },
    ],
    async onClick(context) {
      const tokenId = context.items[0]?.id;

      if (!tokenId) {
        return;
      }

      const result = await copyVariantsFromToken(tokenId);

      if (result.status === "copied") {
        await OBR.notification.show(
          translateCount(language, "clipboard.copied", result.count),
        );
      } else if (result.status === "empty") {
        await OBR.notification.show(translate(language, "clipboard.nothingToCopy"));
      } else if (result.status === "not-found") {
        await OBR.notification.show(translate(language, "clipboard.tokenNotFound"));
      }
    },
  });

  await OBR.contextMenu.create({
    id: PASTE_VARIANTS_MENU_ID,
    icons: [
      {
        icon: ICON_PATH,
        label: translate(language, "menu.pasteVariants"),
        filter: {
          min: 1,
          permissions: ["UPDATE"],
          roles: ["GM"],
          every: [{ key: "type", value: "IMAGE" }],
        },
      },
    ],
    async onClick(context) {
      const tokenIds = context.items.map((item) => item.id);

      if (!tokenIds.length) {
        return;
      }

      const result = await pasteVariantsToTokens(tokenIds);

      if (result.status === "pasted") {
        await OBR.notification.show(
          translateCount(language, "clipboard.pasted", result.count),
        );
      } else if (result.status === "empty") {
        await OBR.notification.show(translate(language, "clipboard.nothingCopied"));
      } else if (result.status === "not-found") {
        await OBR.notification.show(translate(language, "clipboard.noValidTokens"));
      }
    },
  });
}
