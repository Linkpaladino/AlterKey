import OBR from "@owlbear-rodeo/sdk";

import { BASE_VARIANT_INDEX, MAX_VARIANTS } from "../../config/constants";
import { isGM } from "../../shared/permissions";
import { createVariant } from "./variants.mapper";
import { getActiveVariantIndex, getVariants, saveVariants } from "./variants.repository";

function resolveAssetType(token) {
  const validAssetTypes = ["CHARACTER", "PROP", "MOUNT", "ATTACHMENT", "NOTE", "MAP"];
  return validAssetTypes.includes(token.layer) ? token.layer : "CHARACTER";
}

export async function addVariantFromLibrary(token) {
  if (!(await isGM())) {
    return { status: "forbidden" };
  }

  const variants = [...getVariants(token)];
  let activeIndex = getActiveVariantIndex(token);

  if (!variants.length) {
    variants.push(createVariant(token.image, token.grid, token.name || "Base"));
    activeIndex = BASE_VARIANT_INDEX;
  }

  if (variants.length >= MAX_VARIANTS) {
    return { status: "limit" };
  }

  const selectedAssets = await OBR.assets.downloadImages(false, undefined, resolveAssetType(token));

  if (!selectedAssets?.length) {
    return { status: "cancelled" };
  }

  const selectedAsset = selectedAssets[0];
  variants.push(createVariant(selectedAsset.image, selectedAsset.grid, selectedAsset.name));

  await saveVariants(token.id, variants, activeIndex);
  return { status: "added" };
}
