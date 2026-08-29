import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  type KeyboardEvent,
  useRef,
} from 'react';
import { useTabsContext } from './TabsContext';

export type TabListProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'>;

const NAVIGATION_KEYS = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];

function TabListInner(
  { onKeyDown, ...rest }: TabListProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setActiveValue } = useTabsContext();

  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);

    if (!NAVIGATION_KEYS.includes(e.key)) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Disabled tabs are real native <button disabled> elements, so
    // :not(:disabled) is enough to skip them — no extra bookkeeping.
    const tabs = Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled)',
      ),
    );
    if (tabs.length === 0) {
      return;
    }

    const currentIndex = tabs.indexOf(
      document.activeElement as HTMLButtonElement,
    );

    let nextIndex: number;
    switch (e.key) {
      case 'ArrowRight':
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      default:
        nextIndex = tabs.length - 1;
    }

    e.preventDefault();
    const nextTab = tabs[nextIndex];
    nextTab.focus();
    const nextValue = nextTab.dataset.tabValue;
    if (nextValue !== undefined) {
      setActiveValue(nextValue);
    }
  };

  return (
    <div {...rest} ref={setRefs} role="tablist" onKeyDown={handleKeyDown} />
  );
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(TabListInner);
