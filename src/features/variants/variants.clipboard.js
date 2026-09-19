import OBR from "@owlbear-rodeo/sdk";

import { BASE_VARIANT_INDEX, MAX_VARIANTS } from "../../config/constants";
import { isGM } from "../../shared/permissions";
import { applyVariantDataToItem, createVariant } from "./variants.mapper";
import { getVariants, saveVariants } from "./variants.repository";

let copiedVariants = [];

function cloneVariants(variants) {
  return structuredClone(variants);
}

function hasCopiedVariants() {
  return copiedVariants.length > 0;
}

export async function copyVariantsFromToken(tokenId) {
  if (!(await isGM())) {
    return { status: "forbidden" };
  }

  const items = await OBR.scene.items.getItems([tokenId]);
  const token = items[0];

  if (!token) {
    return { status: "not-found" };
  }

  const variantsToCopy = getVariants(token).slice(
    BASE_VARIANT_INDEX + 1,
    MAX_VARIANTS,
  );

  if (!variantsToCopy.length) {
    copiedVariants = [];
    return { status: "empty" };
  }

  copiedVariants = cloneVariants(variantsToCopy);

  return {
    status: "copied",
    count: copiedVariants.length,
  };
}

export async function pasteVariantsToTokens(tokenIds) {
  if (!(await isGM())) {
    return { status: "forbidden" };
  }

  if (!hasCopiedVariants()) {
    return { status: "empty" };
  }

  const items = await OBR.scene.items.getItems(tokenIds);

  if (!items.length) {
    return { status: "not-found" };
  }

  for (const token of items) {
    const existingVariants = getVariants(token);

    const baseVariant = existingVariants[BASE_VARIANT_INDEX]
      ? structuredClone(existingVariants[BASE_VARIANT_INDEX])
      : createVariant(
          token.image,
          token.grid,
          token.name || "Base",
        );

    const variants = [
      baseVariant,
      ...cloneVariants(copiedVariants),
    ].slice(0, MAX_VARIANTS);

    const matchedIndex = variants.findIndex(
      (variant) => variant?.image?.url === token.image?.url,
    );

    const activeIndex =
      matchedIndex >= 0
        ? matchedIndex
        : BASE_VARIANT_INDEX;

    await saveVariants(
      token.id,
      variants,
      activeIndex,
    );

    if (matchedIndex < 0) {
      await OBR.scene.items.updateItems(
        [token.id],
        (updatedItems) => {
          const item = updatedItems[0];

          if (!item) {
            return;
          }

          applyVariantDataToItem(
            item,
            baseVariant,
            BASE_VARIANT_INDEX,
          );
        },
      );
    }
  }

  return {
    status: "pasted",
    count: items.length,
  };
}