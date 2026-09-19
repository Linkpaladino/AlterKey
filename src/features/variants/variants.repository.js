import OBR from "@owlbear-rodeo/sdk";

import {
  ACTIVE_VARIANT_METADATA_KEY,
  VARIANTS_METADATA_KEY,
} from "../../config/constants";

export function getVariants(token) {
  const variants = token?.metadata?.[VARIANTS_METADATA_KEY];
  return Array.isArray(variants) ? variants : [];
}

export function getActiveVariantIndex(token) {
  const variants = getVariants(token);
  const storedIndex = token?.metadata?.[ACTIVE_VARIANT_METADATA_KEY];

  if (Number.isInteger(storedIndex) && storedIndex >= 0 && storedIndex < variants.length) {
    const storedVariant = variants[storedIndex];

    if (storedVariant?.image?.url === token?.image?.url) {
      return storedIndex;
    }
  }

  const detectedIndex = variants.findIndex(
    (variant) => variant?.image?.url === token?.image?.url,
  );

  return detectedIndex >= 0 ? detectedIndex : null;
}

export function setVariantsOnItem(item, variants, activeIndex) {
  if (!variants.length) {
    delete item.metadata[VARIANTS_METADATA_KEY];
    delete item.metadata[ACTIVE_VARIANT_METADATA_KEY];
    return;
  }

  item.metadata[VARIANTS_METADATA_KEY] = variants;

  if (Number.isInteger(activeIndex) && activeIndex >= 0 && activeIndex < variants.length) {
    item.metadata[ACTIVE_VARIANT_METADATA_KEY] = activeIndex;
  } else {
    delete item.metadata[ACTIVE_VARIANT_METADATA_KEY];
  }
}

export async function saveVariants(tokenId, variants, activeIndex) {
  await OBR.scene.items.updateItems([tokenId], (items) => {
    for (const item of items) {
      setVariantsOnItem(item, variants, activeIndex);
    }
  });
}
