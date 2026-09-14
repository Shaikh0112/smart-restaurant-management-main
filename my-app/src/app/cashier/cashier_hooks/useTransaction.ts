// RESPONSIBILITY: useTransaction module logic and UI.
// DATA FLOW: Local component state -> External API
import { useState, useCallback } from "react";

export type FetchState = "idle" | "loading" | "success" | "error";

export function useTransaction() {
  const [status, setStatus] = useState<FetchState>("idle");

  const execute = useCallback(async <T,>(task: () => Promise<T> | T): Promise<T | null> => {
    setStatus("loading");
    try {
      const result = await task();
      setStatus("success");
      return result;
    } catch (err) {
      console.error("[useTransaction] Error executing transaction:", err);
      setStatus("error");
      return null;
    }
  }, []);

  return { status, execute };
}
