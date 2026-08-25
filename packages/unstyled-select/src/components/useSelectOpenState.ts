import { type RefObject, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export interface UseSelectOpenStateParams {
  onEscape?: () => void;
}

export interface UseSelectOpenStateResult {
  open: boolean;
  containerRef: RefObject<HTMLDivElement>;
  toggle: () => boolean;
  close: () => void;
}

export function useSelectOpenState({
  onEscape,
}: UseSelectOpenStateParams = {}): UseSelectOpenStateResult {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        onEscape?.();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onEscape]);

  const toggle = () => {
    const next = !open;
    // flushSync commits synchronously so a caller opening the listbox can
    // focus an option immediately after, before it's ever painted closed.
    flushSync(() => setOpen(next));
    return next;
  };

  return {
    open,
    containerRef,
    toggle,
    close: () => setOpen(false),
  };
}
