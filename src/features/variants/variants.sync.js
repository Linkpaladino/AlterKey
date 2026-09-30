import OBR, { isImage } from "@owlbear-rodeo/sdk";

import {
  normalizeVariantScales,
  updateVariantFromItem,
  variantMatchesItem,
} from "./variants.mapper";
import {
  getStoredActiveVariantIndex,
  getVariants,
  setVariantsOnItem,
} from "./variants.repository";

function getSyncState(item) {
  if (!isImage(item)) {
    return null;
  }

  const currentVariants = getVariants(item);

  if (!currentVariants.length) {
    return null;
  }

  const activeIndex = getStoredActiveVariantIndex(item);

  if (activeIndex === null) {
    return null;
  }

  const normalized = normalizeVariantScales(currentVariants, item.scale);
  const activeVariant = normalized.variants[activeIndex];

  if (!activeVariant) {
    return null;
  }

  return {
    activeIndex,
    variants: normalized.variants,
    needsUpdate: normalized.changed || !variantMatchesItem(activeVariant, item),
  };
}

function syncItem(item) {
  const state = getSyncState(item);

  if (!state?.needsUpdate) {
    return;
  }

  const variants = [...state.variants];
  variants[state.activeIndex] = updateVariantFromItem(
    variants[state.activeIndex],
    item,
  );

  setVariantsOnItem(item, variants, state.activeIndex);
}

export async function registerVariantSync() {
  const playerId = await OBR.player.getId();

  OBR.scene.items.onChange((items) => {
    const tokenIds = items
      .filter((item) => item.lastModifiedUserId === playerId)
      .filter((item) => getSyncState(item)?.needsUpdate)
      .map((item) => item.id);

    if (!tokenIds.length) {
      return;
    }

    void OBR.scene.items.updateItems(tokenIds, (updatedItems) => {
      for (const item of updatedItems) {
        syncItem(item);
      }
    });
  });
}
