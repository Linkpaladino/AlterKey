import OBR, { isImage } from "@owlbear-rodeo/sdk";

export async function getSelectedImageItems() {
  const selection = await OBR.player.getSelection();

  if (!selection?.length) {
    return [];
  }

  const items = await OBR.scene.items.getItems(selection);
  return items.filter(isImage);
}

export async function getSingleSelectedImage() {
  const images = await getSelectedImageItems();
  return images.length === 1 ? images[0] : null;
}
