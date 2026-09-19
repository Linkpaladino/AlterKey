import OBR from "@owlbear-rodeo/sdk";

import { setDocumentLanguage, translate } from "../../../i18n/i18n";
import { isGM } from "../../../shared/permissions";
import { initializeTheme } from "../../../shared/theme";
import { getSettings, updateSetting } from "../settings.repository";

import "./settings.css";

const app = document.querySelector("#app");
let currentLanguage = "en";

function t(key, variables = {}) {
  return translate(currentLanguage, key, variables);
}

function renderToggle(setting, titleKey, descriptionKey, checked, canManage) {
  return `
    <div class="setting-row">
      <div class="setting-info">
        <span class="setting-title">${t(titleKey)}</span>
        <span class="setting-description">${t(descriptionKey)}</span>
      </div>
      <label class="switch">
        <input
          type="checkbox"
          data-setting="${setting}"
          aria-label="${t(titleKey)}"
          ${checked ? "checked" : ""}
          ${canManage ? "" : "disabled"}
        >
        <span class="slider"></span>
      </label>
    </div>
  `;
}

function renderSettings(settings, canManage) {
  app.innerHTML = `
    <div class="settings">
      <header class="header">
        <h1>${t("settings.title")}</h1>
        <p>${t("settings.subtitle")}</p>
      </header>

      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-title">${t("settings.language")}</span>
          <span class="setting-description">${t("settings.languageDescription")}</span>
        </div>
        <select
          class="language-select"
          id="languageSelect"
          aria-label="${t("settings.language")}"
          ${canManage ? "" : "disabled"}
        >
          <option value="en" ${settings.language === "en" ? "selected" : ""}>
            ${t("settings.english")}
          </option>
          <option value="pt-BR" ${settings.language === "pt-BR" ? "selected" : ""}>
            ${t("settings.portugueseBrazil")}
          </option>
        </select>
      </div>

      ${renderToggle(
        "mirrorEnabled",
        "settings.mirror",
        "settings.mirrorDescription",
        settings.mirrorEnabled,
        canManage,
      )}
      ${renderToggle(
        "variantsEnabled",
        "settings.variants",
        "settings.variantsDescription",
        settings.variantsEnabled,
        canManage,
      )}
      ${renderToggle(
        "clipboardEnabled",
        "settings.clipboard",
        "settings.clipboardDescription",
        settings.clipboardEnabled,
        canManage,
      )}

      ${canManage ? "" : `<div class="player-message">${t("settings.gmOnly")}</div>`}
    </div>
  `;

  registerSettingEvents(canManage);
}

async function saveToggle(input) {
  const key = input.dataset.setting;
  const value = input.checked;
  input.disabled = true;

  try {
    await updateSetting(key, value);
  } catch (error) {
    console.error("Error saving setting:", error);
    input.checked = !value;
    await OBR.notification.show(t("settings.saveError"));
  } finally {
    input.disabled = false;
  }
}

async function saveLanguage(select) {
  const previousLanguage = currentLanguage;
  select.disabled = true;

  try {
    await updateSetting("language", select.value);
    await render();
  } catch (error) {
    console.error("Error saving language:", error);
    select.value = previousLanguage;
    await OBR.notification.show(t("settings.saveError"));
  } finally {
    select.disabled = false;
  }
}

function registerSettingEvents(canManage) {
  if (!canManage) {
    return;
  }

  document.querySelectorAll("[data-setting]").forEach((input) => {
    input.addEventListener("change", () => saveToggle(input));
  });

  document.querySelector("#languageSelect")?.addEventListener("change", (event) => {
    saveLanguage(event.target);
  });
}

async function render() {
  const settings = await getSettings();
  currentLanguage = settings.language;
  setDocumentLanguage(currentLanguage);

  renderSettings(settings, await isGM());
}

OBR.onReady(async () => {
  await initializeTheme();
  await render();

  OBR.room.onMetadataChange(render);

  let currentRole = await OBR.player.getRole();
  OBR.player.onChange((player) => {
    if (player.role !== currentRole) {
      currentRole = player.role;
      render();
    }
  });
});
