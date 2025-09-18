import React, { useState, useCallback } from 'react';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
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
}
export const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
   targetId = 'sp-body',
   className = 'sp-export-btn',
   idleLabel = 'Export',
   busyLabel = 'Creating pdf...',
   titleIdle = 'Download a pdf with all information',
   titleBusy = 'Generating PDF...',
}) => {
   const [busy, setBusy] = useState(false);
   const handleClick = useCallback(async () => {
      if (busy) return;
      setBusy(true);
      try {
         await Promise.resolve(generateConfiguratorPDF(targetId));
      } catch (e) {
         try { window.print(); } catch {}
      } finally {
         setBusy(false);
      }
   }, [busy, targetId]);
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