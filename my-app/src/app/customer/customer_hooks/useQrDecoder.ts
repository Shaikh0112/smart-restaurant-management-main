import { useState, useCallback } from "react";
import jsQR from "jsqr";
import type { AppTable } from "@/types/appTypes";

export function extractTableFromFilename(filename: string, tables: AppTable[]): AppTable | null {
  const cleanName = filename.toLowerCase().trim();

  for (const t of tables) {
    const tId = t.id.toLowerCase();
    const tNum = t.tableNumber.toLowerCase();
    const numOnly = t.tableNumber.replace(/^(t|tbl)-?/i, "").toLowerCase();

    if (
      cleanName.includes(tId) ||
      cleanName.includes(tNum) ||
      cleanName.includes(`table-${numOnly}`) ||
      cleanName.includes(`table_${numOnly}`) ||
      cleanName.includes(`table${numOnly}`) ||
      cleanName.includes(`t-${numOnly}`) ||
      cleanName.includes(`t_${numOnly}`)
    ) {
      return t;
    }
  }

  const match = cleanName.match(/(\d+)/);
  if (match && match[1]) {
    const num = match[1];
    const found = tables.find((t) => {
      const tNum = t.tableNumber.replace(/\D/g, "");
      return tNum === num || parseInt(tNum, 10) === parseInt(num, 10);
    });
    if (found) return found;
  }

  return tables[0] ?? null;
}

export function useQrDecoder() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedTable, setDetectedTable] = useState<AppTable | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const decodeFile = useCallback((file: File, tables: AppTable[], onDecodedUrl: (url: string) => void) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    const url = URL.createObjectURL(file);
    setTimeout(async () => {
      try {
        const img = new Image();
        img.src = url;
        await new Promise((resolve) => { img.onload = resolve; });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code && code.data) {
            onDecodedUrl(code.data);
            setIsProcessing(false);
            return;
          }
        }
      } catch (e) {
        // Fallback
      }

      const match = extractTableFromFilename(file.name, tables);
      if (match) {
        setDetectedTable(match);
      } else if (tables.length > 0) {
        setDetectedTable(tables[0] ?? null);
      } else {
        setErrorMsg("Could not detect a table number in QR image. Please pick a table below.");
      }
      setIsProcessing(false);
    }, 200);
  }, []);

  return { isProcessing, detectedTable, setDetectedTable, errorMsg, setErrorMsg, decodeFile, setIsProcessing };
}
