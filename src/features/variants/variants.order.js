import OBR from "@owlbear-rodeo/sdk";

import { BASE_VARIANT_INDEX } from "../../config/constants";
import { isGM } from "../../shared/permissions";
import { getActiveVariantIndex, getVariants, saveVariants } from "./variants.repository";

export async function reorderVariant(tokenId, fromIndex, toIndex) {
  if (!(await isGM())) {
    return { status: "forbidden" };
  }

  if (fromIndex === BASE_VARIANT_INDEX || toIndex === BASE_VARIANT_INDEX) {
    return { status: "base" };
  }

  if (fromIndex === toIndex) {
    return { status: "unchanged" };
  }

  const items = await OBR.scene.items.getItems([tokenId]);
  const token = items[0];

  if (!token) {
    return { status: "not-found" };
  }

  const variants = [...getVariants(token)];
  const invalidIndex =
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= variants.length ||
    toIndex >= variants.length;

  if (invalidIndex) {
    return { status: "invalid" };
  }

  let activeIndex = getActiveVariantIndex(token);
  const [movedVariant] = variants.splice(fromIndex, 1);
  variants.splice(toIndex, 0, movedVariant);

  if (activeIndex !== null) {
    if (activeIndex === fromIndex) {
      activeIndex = toIndex;
    } else if (fromIndex < toIndex && activeIndex > fromIndex && activeIndex <= toIndex) {
      activeIndex -= 1;
    } else if (fromIndex > toIndex && activeIndex >= toIndex && activeIndex < fromIndex) {
      activeIndex += 1;
    }
  }

  await saveVariants(tokenId, variants, activeIndex);
  return { status: "reordered" };
}
