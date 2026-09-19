import OBR from "@owlbear-rodeo/sdk";

import {
  COPY_VARIANTS_MENU_ID,
  MIRROR_MENU_ID,
  PASTE_VARIANTS_MENU_ID,
  VARIANTS_MENU_ID,
} from "../../config/constants";
import { registerMirrorMenu } from "../mirror/mirror.menu";
import { registerVariantsClipboardMenus } from "../variants/variants.clipboard.menu";
import { registerVariantsMenu } from "../variants/variants.menu";
import { getSettings } from "./settings.repository";

async function removeContextMenu(menuId) {
  try {
    await OBR.contextMenu.remove(menuId);
  } catch {}
}

async function syncMirrorMenu(settings) {
  if (settings.mirrorEnabled) {
    await registerMirrorMenu();
  } else {
    await removeContextMenu(MIRROR_MENU_ID);
  }
}

async function syncVariantsMenu(settings) {
  if (settings.variantsEnabled) {
    await registerVariantsMenu();
  } else {
    await removeContextMenu(VARIANTS_MENU_ID);
  }
}

async function syncClipboardMenus(settings, role) {
  const enabled = settings.variantsEnabled && settings.clipboardEnabled && role === "GM";

  if (enabled) {
    await registerVariantsClipboardMenus();
    return;
  }

  await removeContextMenu(COPY_VARIANTS_MENU_ID);
  await removeContextMenu(PASTE_VARIANTS_MENU_ID);
}

async function syncFeatureMenus(role) {
  const settings = await getSettings();

  await syncMirrorMenu(settings);
  await syncVariantsMenu(settings);
  await syncClipboardMenus(settings, role);
}

export async function registerSettingsController() {
  let currentRole = await OBR.player.getRole();

  await syncFeatureMenus(currentRole);

  OBR.room.onMetadataChange(async () => {
    await syncFeatureMenus(currentRole);
  });

  OBR.player.onChange(async (player) => {
    if (player.role === currentRole) {
      return;
    }

    currentRole = player.role;
    await syncFeatureMenus(currentRole);
  });
}
