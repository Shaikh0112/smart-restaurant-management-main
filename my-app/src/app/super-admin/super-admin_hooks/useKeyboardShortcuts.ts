// RESPONSIBILITY: Global keyboard shortcuts for Super Admin module (Ctrl+K, Esc, ?)
// DATA FLOW: Window Event Listener -> useKeyboardShortcuts -> Trigger actions

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * @description Hook to manage global keyboard shortcuts for the Super Admin module
 * @param {boolean} isSearchModalOpen - State of the command palette
 * @param {function} setSearchModalOpen - Setter for command palette state
 * @returns {void}
 */
export function useKeyboardShortcuts(
  isSearchModalOpen: boolean,
  setSearchModalOpen: (open: boolean) => void
) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        // Allow Esc to escape focus from inputs
        if (e.key === "Escape") {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      // Ctrl+K or Cmd+K to open search command palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      }

      // Esc to close modals
      if (e.key === "Escape" && isSearchModalOpen) {
        e.preventDefault();
        setSearchModalOpen(false);
      }

      // ? to show help (can route to docs or show a help modal)
      if (e.key === "?" && !e.shiftKey) {
        // e.preventDefault();
        // Trigger help modal (to be implemented)
      }
    },
    [isSearchModalOpen, setSearchModalOpen]
  );

  // AUDIT: Dependency array verified for React bounds
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
