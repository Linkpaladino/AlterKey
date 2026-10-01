import { BASE_VARIANT_INDEX } from "../../../config/constants";

function renderManagementControls(index, activeIndex, canManage, t) {
  if (!canManage || index === BASE_VARIANT_INDEX || index === activeIndex) {
    return "";
  }

  return `
    <span
      class="remove"
      data-remove-index="${index}"
      title="${t("variants.remove")}"
    >
      ×
    </span>
  `;
}

export function renderLoading(app, t) {
  app.innerHTML = `
    <div class="variants">
      <div class="loading">${t("variants.loading")}</div>
    </div>
  `;
}

export function renderEmpty(app, t) {
  app.innerHTML = `
    <div class="variants">
      <div class="loading">${t("variants.selectToken")}</div>
    </div>
  `;
}

export function renderVariantsGrid(
  app,
  variants,
  activeIndex,
  maxVariants,
  canManage,
  baseVariantReorderingEnabled,
  t,
) {
  const buttons = variants
    .map((variant, index) => {
      const shortcut = index + 2;
      const reorderable =
        canManage && (index !== BASE_VARIANT_INDEX || baseVariantReorderingEnabled);

      return `
        <button
          class="slot variant-slot ${index === activeIndex ? "active" : ""}"
          data-index="${index}"
          data-reorderable="${reorderable}"
          title="${t("variants.shortcut", { shortcut })}"
        >
          <img
            src="${variant.image.url}"
            alt="${t("variants.variantAlt", { number: shortcut })}"
            draggable="false"
          >
          ${renderManagementControls(index, activeIndex, canManage, t)}
          <span class="number">${shortcut}</span>
        </button>
      `;
    })
    .join("");

  const addButton =
    canManage && variants.length < maxVariants
      ? `
        <button class="slot add" id="addVariant" title="${t("variants.add")}">
          +
        </button>
      `
      : "";

  app.innerHTML = `
    <div class="variants">
      <div class="slots">
        ${buttons}
        ${addButton}
      </div>
    </div>
  `;
}
