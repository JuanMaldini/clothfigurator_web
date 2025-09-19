import React, { useState, useCallback } from 'react';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import { captureScreenshotBlob } from "../screenshot/screenshot";
const options = {
   method: 'open' as const,
   resolution: Resolution.HIGH,
   page: {
      margin: Margin.SMALL,
      format: 'letter',
   orientation: 'portrait' as const,
   },
   canvas: {
      mimeType: 'image/png' as const,
      qualityRatio: 1
   },
   overrides: {
      pdf: {
         compress: true
      },
      canvas: {
         useCORS: true
      }
   },
};
export const generateConfiguratorPDF = (targetId: string = 'sp-body') => {
   const fn = () => document.getElementById(targetId) as HTMLElement | null;
   return generatePDF(fn, options);
};
interface ExportPDFButtonProps {
   targetId?: string;
   className?: string;
   idleLabel?: string;
   busyLabel?: string;
   titleIdle?: string;
   titleBusy?: string;
   mode?: 'target' | 'screenshot';
}
export const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
   targetId = 'sp-body',
   className = 'sp-export-btn',
   idleLabel = 'Export',
   busyLabel = 'Creating pdf...',
   titleIdle = 'Download a pdf with all information',
   titleBusy = 'Generating PDF...',
   mode = 'target',
}) => {
   const [busy, setBusy] = useState(false);
   const handleClick = useCallback(async () => {
      if (busy) return;
      setBusy(true);
      try {
         if (mode === 'screenshot') {
            const { blob } = await captureScreenshotBlob();
            const url = URL.createObjectURL(blob);
            // Offscreen container to render image into PDF
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '-10000px';
            container.style.top = '0';
            container.style.width = '960px'; // tune for quality/size
            container.style.padding = '8px';

            const img = new Image();
            img.src = url;
            img.style.width = '100%';
            img.style.height = 'auto';
            await new Promise<void>((resolve, reject) => {
               img.onload = () => resolve();
               img.onerror = () => reject(new Error('Failed to load screenshot image'));
            });
            container.appendChild(img);
            document.body.appendChild(container);
            await generatePDF(() => container, options);
            document.body.removeChild(container);
            URL.revokeObjectURL(url);
         } else {
            await Promise.resolve(generateConfiguratorPDF(targetId));
         }
      } catch (e) {
         // Optionally fallback
         // try { window.print(); } catch {}
      } finally {
         setBusy(false);
      }
   }, [busy, targetId, mode]);
   return (
         <button
            type="button"
            className={className}
            disabled={busy}
            onClick={handleClick}
            title={busy ? titleBusy : titleIdle}
         >
         {busy ? busyLabel : idleLabel}
      </button>
   );
};