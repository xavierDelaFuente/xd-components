import { type RefObject, useEffect, useRef, useState } from 'react';

export interface UseSelectOpenStateResult {
  open: boolean;
  containerRef: RefObject<HTMLDivElement>;
  toggle: () => void;
  close: () => void;
}

export function useSelectOpenState(): UseSelectOpenStateResult {
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
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return {
    open,
    containerRef,
    toggle: () => setOpen((prev) => !prev),
    close: () => setOpen(false),
  };
}
