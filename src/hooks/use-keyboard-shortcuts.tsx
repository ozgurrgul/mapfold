import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey = false, shiftKey = false, altKey = false, callback }) => {
        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === ctrlKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey
        ) {
          event.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
