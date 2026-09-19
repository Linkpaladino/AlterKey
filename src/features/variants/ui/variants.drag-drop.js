export function setupVariantDragDrop({ onReorder }) {
  let draggedIndex = null;
  let dragOverSlot = null;

  const handles = document.querySelectorAll(".drag-handle");

  function clearDragState() {
    draggedIndex = null;
    dragOverSlot = null;
    document.querySelectorAll(".variant-slot").forEach((slot) => {
      slot.classList.remove("dragging", "drag-over");
    });
  }

  function updateDragTarget(event) {
    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest('.variant-slot[data-reorderable="true"]');

    if (target === dragOverSlot) {
      return;
    }

    dragOverSlot?.classList.remove("drag-over");
    dragOverSlot = target ?? null;
    dragOverSlot?.classList.add("drag-over");
  }

  handles.forEach((handle) => {
    handle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      draggedIndex = Number(handle.dataset.dragIndex);
      handle.setPointerCapture?.(event.pointerId);
      handle.closest(".variant-slot")?.classList.add("dragging");
    });

    handle.addEventListener("pointermove", (event) => {
      if (draggedIndex === null) {
        return;
      }

      event.preventDefault();
      updateDragTarget(event);
    });

    handle.addEventListener("pointerup", async (event) => {
      if (draggedIndex === null) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const fromIndex = draggedIndex;
      const toIndex = dragOverSlot ? Number(dragOverSlot.dataset.index) : fromIndex;
      clearDragState();

      if (fromIndex !== toIndex) {
        await onReorder(fromIndex, toIndex);
      }
    });

    handle.addEventListener("pointercancel", clearDragState);
  });
}
