import OBR from "@owlbear-rodeo/sdk";

import { registerSettingsController } from "./features/settings/settings.controller";
import { registerVariantSync } from "./features/variants/variants.sync";
import { registerShortcutsTool } from "./tools/shortcuts.tool";

OBR.onReady(async () => {
  await registerShortcutsTool();
  await registerSettingsController();
  await registerVariantSync();
});
