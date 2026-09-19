import { ACTIVE_VARIANT_METADATA_KEY } from "../../config/constants";

export function createVariant(image, grid, name = "Variant") {
  return {
    name,
    image: {
      url: image.url,
      width: image.width,
      height: image.height,
      mime: image.mime,
    },
    grid: {
      dpi: grid.dpi,
      offset: grid.offset,
    },
  };
}

export function applyVariantDataToItem(item, variant, index) {
  item.image = {
    url: variant.image.url,
    width: variant.image.width,
    height: variant.image.height,
    mime: variant.image.mime,
  };
  item.grid = {
    dpi: variant.grid.dpi,
    offset: variant.grid.offset,
  };
  item.metadata[ACTIVE_VARIANT_METADATA_KEY] = index;
}
