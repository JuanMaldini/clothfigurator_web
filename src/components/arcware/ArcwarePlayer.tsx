import Sidepanel from "../panel/Sidepanel";
import { useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { Application } = ArcwareInit(
      {
        shareId: "share-0451edf9-0bd6-43d3-969c-9647a2ee19eb",
      },
      {
        initialSettings: {
          StartVideoMuted: true,
          AutoConnect: true,
          AutoPlayVideo: true,
        },
        settings: {
          infoButton: false,
          micButton: false,
          audioButton: false,
          fullscreenButton: true,
          settingsButton: false,
          connectionStrengthIcon: false,
        },
      }
    );

    if (videoContainerRef?.current) {
      videoContainerRef.current.appendChild(Application.rootElement);
    }

    // Expose solo un puente global simple: esperamos un string crudo (ej: "MI_COLLECTION_SUB_VARIATION")
    // Sidepanel ahora llama window.emitUIInteraction directamente con el nombre MI.
    try {
      (window as any).emitUIInteraction = (payload: string) => {
        if (typeof payload !== "string") return; // guard estricto
        Application.emitUIInteraction?.(payload as any);
      };
    } catch {
      // ignorar si window no es escribible
    }
  }, []);

  return (
    <div>
      <div ref={videoContainerRef} />
      <Sidepanel />
    </div>
  );
}

export default ArcwarePlayer;
