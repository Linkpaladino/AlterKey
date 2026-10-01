const DRAG_THRESHOLD = 6;

export function setupVariantDragDrop({ onReorder }) {
  let pointerId = null;
  let draggedSlot = null;
  let dragOverSlot = null;
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let suppressClickSlot = null;

  const slots = document.querySelectorAll(".variant-slot");

  function clearVisualState() {
    dragOverSlot?.classList.remove("drag-over");
    draggedSlot?.classList.remove("dragging");
    dragOverSlot = null;
  }

  function resetPointerState() {
    clearVisualState();
    pointerId = null;
    draggedSlot = null;
    startX = 0;
    startY = 0;
    isDragging = false;
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

  function hasReachedDragThreshold(event) {
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    return Math.hypot(deltaX, deltaY) >= DRAG_THRESHOLD;
  }

  slots.forEach((slot) => {
    slot.addEventListener(
      "click",
      (event) => {
        if (suppressClickSlot !== slot) {
          return;
        }

        suppressClickSlot = null;
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );

    slot.addEventListener("pointerdown", (event) => {
      if (slot.dataset.reorderable !== "true") {
        return;
      }

      if (event.button !== undefined && event.button !== 0) {
        return;
      }

      if (event.target.closest(".remove")) {
        return;
      }

      pointerId = event.pointerId;
      draggedSlot = slot;
      startX = event.clientX;
      startY = event.clientY;
      isDragging = false;
      slot.setPointerCapture?.(event.pointerId);
    });

    slot.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId || draggedSlot !== slot) {
        return;
      }

      if (!isDragging && !hasReachedDragThreshold(event)) {
        return;
      }

      if (!isDragging) {
        isDragging = true;
        draggedSlot.classList.add("dragging");
      }

      event.preventDefault();
      updateDragTarget(event);
    });

    slot.addEventListener("pointerup", (event) => {
      if (event.pointerId !== pointerId || draggedSlot !== slot) {
        return;
      }

      const fromIndex = Number(slot.dataset.index);
      const toIndex = dragOverSlot ? Number(dragOverSlot.dataset.index) : fromIndex;
      const completedDrag = isDragging;

      if (slot.hasPointerCapture?.(event.pointerId)) {
        slot.releasePointerCapture(event.pointerId);
      }

      if (completedDrag) {
        suppressClickSlot = slot;
        event.preventDefault();
      }

      resetPointerState();

      if (completedDrag && fromIndex !== toIndex) {
        void onReorder(fromIndex, toIndex);
      }
    });

    slot.addEventListener("pointercancel", (event) => {
      if (event.pointerId === pointerId && draggedSlot === slot) {
        resetPointerState();
      }
    });
  });
}
