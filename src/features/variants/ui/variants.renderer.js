import { BASE_VARIANT_INDEX } from "../../../config/constants";

function renderManagementControls(index, activeIndex, canManage, t) {
  if (!canManage) {
    return "";
  }

  const dragHandle =
    index === BASE_VARIANT_INDEX
      ? ""
      : `
        <span
          class="drag-handle"
          data-drag-index="${index}"
          title="${t("variants.dragToReorder")}"
        >
          ⠿
        </span>
      `;

  const removeButton =
    index === BASE_VARIANT_INDEX || index === activeIndex
      ? ""
      : `
        <span
          class="remove"
          data-remove-index="${index}"
          title="${t("variants.remove")}"
        >
          ×
        </span>
      `;

  return dragHandle + removeButton;
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

export function renderVariantsGrid(app, variants, activeIndex, maxVariants, canManage, t) {
  const buttons = variants
    .map((variant, index) => {
      const shortcut = index + 2;
      const reorderable = canManage && index !== BASE_VARIANT_INDEX;

      return `
        <button
          class="slot variant-slot ${index === activeIndex ? "active" : ""}"
          data-index="${index}"
          data-reorderable="${reorderable}"
          title="${t("variants.shortcut", { shortcut })}"
        >
          <img src="${variant.image.url}" alt="${t("variants.variantAlt", { number: shortcut })}">
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
