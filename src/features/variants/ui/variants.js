import OBR from "@owlbear-rodeo/sdk";

import { MAX_VARIANTS } from "../../../config/constants";
import { setDocumentLanguage, translate } from "../../../i18n/i18n";
import { isGM } from "../../../shared/permissions";
import { getSingleSelectedImage } from "../../../shared/selection";
import { initializeTheme } from "../../../shared/theme";
import { getSettings } from "../../settings/settings.repository";
import { addVariantFromLibrary } from "../variants.assets";
import { reorderVariant } from "../variants.order";
import {
  applyVariantToToken,
  ensureBaseVariant,
  removeVariantFromToken,
} from "../variants.service";
import { setupVariantDragDrop } from "./variants.drag-drop";
import { renderEmpty, renderLoading, renderVariantsGrid } from "./variants.renderer";

import "./variants.css";

const app = document.querySelector("#app");
let currentLanguage = "en";

function t(key, variables = {}) {
  return translate(currentLanguage, key, variables);
}

async function applyVariant(index) {
  const token = await getSingleSelectedImage();

  if (!token) {
    return;
  }

  await applyVariantToToken(token.id, index);
  await render();
}

async function removeVariant(index) {
  const token = await getSingleSelectedImage();

  if (!token) {
    return;
  }

  const result = await removeVariantFromToken(token.id, index);

  if (result.status === "active") {
    await OBR.notification.show(t("variants.activeRemoveBlocked"));
    return;
  }

  if (result.status === "base") {
    await OBR.notification.show(t("variants.baseRemoveBlocked"));
    return;
  }

  await render();
}

async function addVariant() {
  try {
    const token = await getSingleSelectedImage();

    if (!token) {
      await OBR.notification.show(t("variants.noTokenSelected"));
      return;
    }

    const result = await addVariantFromLibrary(token);

    if (result.status === "limit") {
      await OBR.notification.show(t("variants.limitReached"));
    } else if (result.status === "added") {
      await render();
    }
  } catch (error) {
    console.error("Error adding variant:", error);
    await OBR.notification.show(t("variants.addError"));
  }
}

async function handleReorder(fromIndex, toIndex) {
  const token = await getSingleSelectedImage();

  if (!token) {
    return;
  }

  const result = await reorderVariant(token.id, fromIndex, toIndex);

  if (result.status === "base") {
    await OBR.notification.show(t("variants.baseReorderBlocked"));
    return;
  }

  await render();
}

function registerUiEvents() {
  document.querySelector("#addVariant")?.addEventListener("click", addVariant);

  document.querySelectorAll(".variant-slot").forEach((button) => {
    button.addEventListener("click", async () => {
      await applyVariant(Number(button.dataset.index));
    });
  });

  document.querySelectorAll(".remove").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      await removeVariant(Number(button.dataset.removeIndex));
    });
  });

  setupVariantDragDrop({ onReorder: handleReorder });
}

async function render() {
  const settings = await getSettings();
  currentLanguage = settings.language;
  setDocumentLanguage(currentLanguage);
  renderLoading(app, t);

  const token = await getSingleSelectedImage();

  if (!token) {
    renderEmpty(app, t);
    return;
  }

  const { variants, activeIndex } = await ensureBaseVariant(token);
  const canManage = await isGM();

  renderVariantsGrid(app, variants, activeIndex, MAX_VARIANTS, canManage, t);
  registerUiEvents();
}

OBR.onReady(async () => {
  await initializeTheme();
  await render();

  OBR.room.onMetadataChange(render);
  OBR.player.onChange(render);
});
