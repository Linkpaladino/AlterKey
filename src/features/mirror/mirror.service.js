import OBR, { isImage } from "@owlbear-rodeo/sdk";

import { getSelectedImageItems } from "../../shared/selection";

export async function mirrorItems(itemsOrIds) {
  if (!itemsOrIds?.length) {
    return;
  }

  await OBR.scene.items.updateItems(itemsOrIds, (items) => {
    for (const item of items) {
      if (isImage(item)) {
        item.scale.x *= -1;
      }
    }
  });
}

export async function mirrorSelectedItems() {
  const images = await getSelectedImageItems();

  if (!images.length) {
    return;
  }

  await mirrorItems(images.map((item) => item.id));
}
