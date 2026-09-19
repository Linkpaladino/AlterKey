import OBR from "@owlbear-rodeo/sdk";

import { BASE_VARIANT_INDEX } from "../../config/constants";
import { isGM } from "../../shared/permissions";
import { getSelectedImageItems } from "../../shared/selection";
import { applyVariantDataToItem, createVariant } from "./variants.mapper";
import {
  getActiveVariantIndex,
  getVariants,
  saveVariants,
  setVariantsOnItem,
} from "./variants.repository";

export async function applyVariantToToken(tokenId, index) {
  await OBR.scene.items.updateItems([tokenId], (items) => {
    for (const item of items) {
      const variant = getVariants(item)[index];

      if (variant) {
        applyVariantDataToItem(item, variant, index);
      }
    }
  });
}

export async function applyVariantToSelection(index) {
  const selectedImages = await getSelectedImageItems();

  if (!selectedImages.length) {
    return { status: "no-selection" };
  }

  const itemsWithVariant = selectedImages.filter((item) => Boolean(getVariants(item)[index]));

  if (!itemsWithVariant.length) {
    return { status: "missing" };
  }

  await OBR.scene.items.updateItems(
    itemsWithVariant.map((item) => item.id),
    (items) => {
      for (const item of items) {
        const variant = getVariants(item)[index];

        if (variant) {
          applyVariantDataToItem(item, variant, index);
        }
      }
    },
  );

  return { status: "applied", count: itemsWithVariant.length };
}

export async function removeVariantFromToken(tokenId, index) {
  if (!(await isGM())) {
    return { status: "forbidden" };
  }

  if (index === BASE_VARIANT_INDEX) {
    return { status: "base" };
  }

  const items = await OBR.scene.items.getItems([tokenId]);
  const token = items[0];

  if (!token) {
    return { status: "not-found" };
  }

  if (getActiveVariantIndex(token) === index) {
    return { status: "active" };
  }

  await OBR.scene.items.updateItems([tokenId], (updatedItems) => {
    for (const item of updatedItems) {
      const variants = [...getVariants(item)];

      if (!variants[index]) {
        continue;
      }

      let activeIndex = getActiveVariantIndex(item);
      variants.splice(index, 1);

      if (activeIndex !== null && activeIndex > index) {
        activeIndex -= 1;
      }

      setVariantsOnItem(item, variants, activeIndex);
    }
  });

  return { status: "removed" };
}

export async function ensureBaseVariant(token) {
  const existingVariants = getVariants(token);

  if (existingVariants.length) {
    return {
      variants: existingVariants,
      activeIndex: getActiveVariantIndex(token),
    };
  }

  const variants = [createVariant(token.image, token.grid, token.name || "Base")];
  await saveVariants(token.id, variants, BASE_VARIANT_INDEX);

  return { variants, activeIndex: BASE_VARIANT_INDEX };
}
