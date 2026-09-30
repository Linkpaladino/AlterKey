import OBR from "@owlbear-rodeo/sdk";

import { BASE_VARIANT_INDEX, MAX_VARIANTS } from "../../config/constants";
import { isGM } from "../../shared/permissions";
import { createVariant } from "./variants.mapper";
import { saveVariants } from "./variants.repository";
import { ensureBaseVariant } from "./variants.service";

function resolveAssetType(token) {
  const validAssetTypes = ["CHARACTER", "PROP", "MOUNT", "ATTACHMENT", "NOTE", "MAP"];
  return validAssetTypes.includes(token.layer) ? token.layer : "CHARACTER";
}

export async function addVariantFromLibrary(token) {
  if (!(await isGM())) {
    return { status: "forbidden" };
  }

  const baseState = await ensureBaseVariant(token);
  const variants = [...baseState.variants];
  const activeIndex = baseState.activeIndex ?? BASE_VARIANT_INDEX;

  if (variants.length >= MAX_VARIANTS) {
    return { status: "limit" };
  }

  const selectedAssets = await OBR.assets.downloadImages(false, undefined, resolveAssetType(token));

  if (!selectedAssets?.length) {
    return { status: "cancelled" };
  }

  const selectedAsset = selectedAssets[0];
  const baseScale = variants[BASE_VARIANT_INDEX]?.scale ?? token.scale;

  variants.push(
    createVariant(
      selectedAsset.image,
      selectedAsset.grid,
      selectedAsset.name,
      baseScale,
    ),
  );

  await saveVariants(token.id, variants, activeIndex);
  return { status: "added" };
}
