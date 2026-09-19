import OBR from "@owlbear-rodeo/sdk";

import {
  ICON_PATH,
  VARIANTS_EMBED_HEIGHT,
  VARIANTS_EMBED_URL,
  VARIANTS_MENU_ID,
} from "../../config/constants";
import { translate } from "../../i18n/i18n";
import { getSettings } from "../settings/settings.repository";

export async function registerVariantsMenu() {
  const { language } = await getSettings();

  try {
    await OBR.contextMenu.remove(VARIANTS_MENU_ID);
  } catch {}

  await OBR.contextMenu.create({
    id: VARIANTS_MENU_ID,
    icons: [
      {
        icon: ICON_PATH,
        label: translate(language, "menu.variants"),
        filter: {
          min: 1,
          max: 1,
          permissions: ["UPDATE"],
          every: [{ key: "type", value: "IMAGE" }],
        },
      },
    ],
    onClick() {},
    embed: {
      url: VARIANTS_EMBED_URL,
      height: VARIANTS_EMBED_HEIGHT,
    },
  });
}
