import OBR from "@owlbear-rodeo/sdk";

import { SETTINGS_METADATA_KEY } from "../../config/constants";
import { isGM } from "../../shared/permissions";

const SUPPORTED_LANGUAGES = new Set(["en", "pt-BR"]);
const SETTING_KEYS = new Set([
  "mirrorEnabled",
  "variantsEnabled",
  "clipboardEnabled",
  "language",
]);

const DEFAULT_SETTINGS = {
  mirrorEnabled: true,
  variantsEnabled: true,
  clipboardEnabled: true,
  language: "en",
};

function normalizeSettings(settings = {}) {
  return {
    mirrorEnabled:
      typeof settings.mirrorEnabled === "boolean"
        ? settings.mirrorEnabled
        : DEFAULT_SETTINGS.mirrorEnabled,
    variantsEnabled:
      typeof settings.variantsEnabled === "boolean"
        ? settings.variantsEnabled
        : DEFAULT_SETTINGS.variantsEnabled,
    clipboardEnabled:
      typeof settings.clipboardEnabled === "boolean"
        ? settings.clipboardEnabled
        : DEFAULT_SETTINGS.clipboardEnabled,
    language: SUPPORTED_LANGUAGES.has(settings.language)
      ? settings.language
      : DEFAULT_SETTINGS.language,
  };
}

export async function getSettings() {
  const metadata = await OBR.room.getMetadata();
  return normalizeSettings(metadata?.[SETTINGS_METADATA_KEY]);
}

async function saveSettings(settings) {
  if (!(await isGM())) {
    throw new Error("Only the GM can change AlterKey settings.");
  }

  await OBR.room.setMetadata({
    [SETTINGS_METADATA_KEY]: normalizeSettings(settings),
  });
}

export async function updateSetting(key, value) {
  if (!SETTING_KEYS.has(key)) {
    throw new Error(`Unknown AlterKey setting: ${key}`);
  }

  const currentSettings = await getSettings();
  const nextSettings = normalizeSettings({ ...currentSettings, [key]: value });

  await saveSettings(nextSettings);
  return nextSettings;
}
