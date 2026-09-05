import '@testing-library/jest-dom/vitest';

/**
 * jsdom — through the current 30.x — still ships an empty `HTMLDialogElement`
 * implementation: only the `open` content attribute reflects. There is no
 * `show()` / `showModal()` / `close()`, no `close` / `cancel` events, no
 * `returnValue`. This shim reproduces exactly the surface that
 * `@asnewyla/unstyled-dialog` wires against.
 *
 * What it deliberately does NOT reproduce, because that is native `<dialog>`
 * behavior verified in Storybook rather than here: the focus trap, background
 * inertness, top-layer stacking, and the `::backdrop` pseudo-element.
 */
if (
  typeof HTMLDialogElement !== 'undefined' &&
  typeof HTMLDialogElement.prototype.showModal !== 'function'
) {
  const openModals = new Set<HTMLDialogElement>();

  function close(this: HTMLDialogElement, returnValue?: string): void {
    if (!this.open) return;
    this.open = false;
    openModals.delete(this);
    if (returnValue !== undefined) {
      this.returnValue = returnValue;
    }
    this.dispatchEvent(new Event('close'));
  }

  HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
    this.open = true;
  };

  HTMLDialogElement.prototype.showModal = function showModal(
    this: HTMLDialogElement,
  ) {
    this.open = true;
    openModals.add(this);
  };

  HTMLDialogElement.prototype.close = close;

  // Escape on the top-most open modal fires `cancel`, then `close` unless the
  // `cancel` handler called preventDefault().
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || openModals.size === 0) return;
    const topMost = [...openModals][openModals.size - 1];
    const cancel = new Event('cancel', { cancelable: true });
    const proceed = topMost.dispatchEvent(cancel);
    if (proceed) close.call(topMost);
  });
}
