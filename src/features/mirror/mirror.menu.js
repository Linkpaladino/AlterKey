import OBR from "@owlbear-rodeo/sdk";

import { ICON_PATH, MIRROR_MENU_ID } from "../../config/constants";
import { translate } from "../../i18n/i18n";
import { getSettings } from "../settings/settings.repository";
import { mirrorItems } from "./mirror.service";

export async function registerMirrorMenu() {
  const { language } = await getSettings();

  try {
    await OBR.contextMenu.remove(MIRROR_MENU_ID);
  } catch {}

  await OBR.contextMenu.create({
    id: MIRROR_MENU_ID,
    shortcut: "1",
    icons: [
      {
        icon: ICON_PATH,
        label: translate(language, "menu.mirror"),
        filter: {
          min: 1,
          permissions: ["UPDATE"],
          every: [{ key: "type", value: "IMAGE" }],
        },
      },
    ],
    async onClick(context) {
      await mirrorItems(context.items);
    },
  });
}
