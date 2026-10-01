import OBR from "@owlbear-rodeo/sdk";

import { BASE_VARIANT_INDEX } from "../../config/constants";
import { isGM } from "../../shared/permissions";
import { getSettings } from "../settings/settings.repository";
import { getActiveVariantIndex, getVariants, saveVariants } from "./variants.repository";

function isInvalidIndex(index, variants) {
  return index < 0 || index >= variants.length;
}

function getActiveIndexAfterSwap(activeIndex, fromIndex, toIndex) {
  if (activeIndex === fromIndex) {
    return toIndex;
  }

  if (activeIndex === toIndex) {
    return fromIndex;
  }

  return activeIndex;
}

function getActiveIndexAfterMove(activeIndex, fromIndex, toIndex) {
  if (activeIndex === null) {
    return null;
  }

  if (activeIndex === fromIndex) {
    return toIndex;
  }

  if (fromIndex < toIndex && activeIndex > fromIndex && activeIndex <= toIndex) {
    return activeIndex - 1;
  }

  if (fromIndex > toIndex && activeIndex >= toIndex && activeIndex < fromIndex) {
    return activeIndex + 1;
  }

  return activeIndex;
}

export async function reorderVariant(tokenId, fromIndex, toIndex) {
  if (!(await isGM())) {
    return { status: "forbidden" };
  }

  if (fromIndex === toIndex) {
    return { status: "unchanged" };
  }

  const settings = await getSettings();
  const involvesBase = fromIndex === BASE_VARIANT_INDEX || toIndex === BASE_VARIANT_INDEX;

  if (involvesBase && !settings.baseVariantReorderingEnabled) {
    return { status: "base" };
  }

  const items = await OBR.scene.items.getItems([tokenId]);
  const token = items[0];

  if (!token) {
    return { status: "not-found" };
  }

  const variants = [...getVariants(token)];

  if (isInvalidIndex(fromIndex, variants) || isInvalidIndex(toIndex, variants)) {
    return { status: "invalid" };
  }

  let activeIndex = getActiveVariantIndex(token);

  if (involvesBase) {
    [variants[fromIndex], variants[toIndex]] = [variants[toIndex], variants[fromIndex]];
    activeIndex = getActiveIndexAfterSwap(activeIndex, fromIndex, toIndex);
  } else {
    const [movedVariant] = variants.splice(fromIndex, 1);
    variants.splice(toIndex, 0, movedVariant);
    activeIndex = getActiveIndexAfterMove(activeIndex, fromIndex, toIndex);
  }

  await saveVariants(tokenId, variants, activeIndex);
  return { status: "reordered" };
}
