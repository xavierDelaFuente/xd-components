import { type KeyboardEvent, useCallback, useRef } from 'react';
import type { SelectOption } from './UnstyledSelect';

interface UseRovingFocusParams {
  options: SelectOption[];
}

interface UseRovingFocusResult {
  setTriggerRef: (node: HTMLButtonElement | null) => void;
  setSearchInputRef: (node: HTMLInputElement | null) => void;
  getOptionRef: (value: string) => (node: HTMLButtonElement | null) => void;
  focusTrigger: () => void;
  focusSearchInput: () => void;
  handleListboxKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}

export function useRovingFocus({
  options,
}: UseRovingFocusParams): UseRovingFocusResult {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setTriggerRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node;
  };

  const setSearchInputRef = (node: HTMLInputElement | null) => {
    searchInputRef.current = node;
  };

  const getOptionRef = (value: string) => (node: HTMLButtonElement | null) => {
    if (node) {
      optionRefs.current.set(value, node);
    } else {
      optionRefs.current.delete(value);
    }
  };

  // Stable identity: `useSelectOpenState` takes this as its `onEscape`
  // callback and lists it as an effect dependency, so it must not be a
  // fresh function every render.
  const focusTrigger = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const focusSearchInput = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const focusOption = (value: string) => {
    optionRefs.current.get(value)?.focus();
  };

  const getCurrentIndex = (): number => {
    const active = document.activeElement;
    for (const [value, node] of optionRefs.current.entries()) {
      if (node === active) {
        return options.findIndex((option) => option.value === value);
      }
    }
    return -1;
  };

  const handleListboxKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = getCurrentIndex();
      const next = options
        .slice(currentIndex + 1)
        .find((option) => !option.disabled);
      if (next) focusOption(next.value);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = getCurrentIndex();
      const before =
        currentIndex === -1 ? options : options.slice(0, currentIndex);
      const prev = [...before].reverse().find((option) => !option.disabled);
      if (prev) {
        focusOption(prev.value);
      } else {
        focusSearchInput();
      }
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      const first = options.find((option) => !option.disabled);
      if (first) focusOption(first.value);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      const enabled = options.filter((option) => !option.disabled);
      if (enabled.length > 0) focusOption(enabled[enabled.length - 1].value);
    }
  };

  return {
    setTriggerRef,
    setSearchInputRef,
    getOptionRef,
    focusTrigger,
    focusSearchInput,
    handleListboxKeyDown,
  };
}
