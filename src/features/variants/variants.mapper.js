import { ACTIVE_VARIANT_METADATA_KEY } from "../../config/constants";

function cloneImage(image) {
  return {
    url: image.url,
    width: image.width,
    height: image.height,
    mime: image.mime,
  };
}

function cloneGrid(grid) {
  return {
    dpi: grid.dpi,
    offset: {
      x: grid.offset.x,
      y: grid.offset.y,
    },
  };
}

function getScaleMagnitude(scale) {
  return {
    x: Math.abs(scale?.x ?? 1),
    y: Math.abs(scale?.y ?? 1),
  };
}

function applyScaleDirection(scale, currentScale) {
  const xDirection = currentScale?.x < 0 ? -1 : 1;
  const yDirection = currentScale?.y < 0 ? -1 : 1;

  return {
    x: scale.x * xDirection,
    y: scale.y * yDirection,
  };
}

function valuesMatch(left, right) {
  return left === right;
}

function vectorsMatch(left, right) {
  return valuesMatch(left?.x, right?.x) && valuesMatch(left?.y, right?.y);
}

export function createVariant(image, grid, name = "Variant", scale = { x: 1, y: 1 }) {
  return {
    name,
    image: cloneImage(image),
    grid: cloneGrid(grid),
    scale: getScaleMagnitude(scale),
  };
}

export function normalizeVariantScales(variants, fallbackScale) {
  const scale = getScaleMagnitude(fallbackScale);
  let changed = false;

  const normalizedVariants = variants.map((variant) => {
    const variantScale = variant?.scale
      ? getScaleMagnitude(variant.scale)
      : scale;

    if (vectorsMatch(variant?.scale, variantScale)) {
      return variant;
    }

    changed = true;
    return {
      ...variant,
      scale: { ...variantScale },
    };
  });

  return { variants: normalizedVariants, changed };
}

export function updateVariantFromItem(variant, item) {
  return {
    ...variant,
    image: cloneImage(item.image),
    grid: cloneGrid(item.grid),
    scale: getScaleMagnitude(item.scale),
  };
}

export function variantMatchesItem(variant, item) {
  if (!variant) {
    return false;
  }

  const itemScale = getScaleMagnitude(item.scale);

  return (
    valuesMatch(variant.image?.url, item.image?.url) &&
    valuesMatch(variant.image?.width, item.image?.width) &&
    valuesMatch(variant.image?.height, item.image?.height) &&
    valuesMatch(variant.image?.mime, item.image?.mime) &&
    valuesMatch(variant.grid?.dpi, item.grid?.dpi) &&
    vectorsMatch(variant.grid?.offset, item.grid?.offset) &&
    vectorsMatch(variant.scale, itemScale)
  );
}

export function applyVariantDataToItem(item, variant, index) {
  item.image = cloneImage(variant.image);
  item.grid = cloneGrid(variant.grid);

  if (variant.scale) {
    item.scale = applyScaleDirection(variant.scale, item.scale);
  }

  item.metadata[ACTIVE_VARIANT_METADATA_KEY] = index;
}
