import OBR from "@owlbear-rodeo/sdk";

import { registerSettingsController } from "./features/settings/settings.controller";
import { registerShortcutsTool } from "./tools/shortcuts.tool";

OBR.onReady(async () => {
  await registerShortcutsTool();
  await registerSettingsController();
});
