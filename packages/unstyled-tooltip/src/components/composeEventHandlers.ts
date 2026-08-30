/**
 * Wraps a consumer-supplied event handler so the component's own handler runs
 * after it. Both always run — a tooltip never wants the consumer to be able to
 * silently suppress its open/close behavior.
 */
export function composeEventHandlers<E>(
  consumerHandler: ((event: E) => void) | undefined,
  ownHandler: (event: E) => void,
): (event: E) => void {
  return (event: E) => {
    consumerHandler?.(event);
    ownHandler(event);
  };
}
