import Sidepanel from "../panel/Sidepanel";
import { useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { Application } = ArcwareInit(
      {
        shareId: "share-0451edf9-0bd6-43d3-969c-9647a2ee19eb",
        projectId: "e3c24e9f-fe87-462c-bc58-52612604c1b7",
      },
      {
        initialSettings: {
          AutoConnect: true,
          StartVideoMuted: true,
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
    try {
      (window as any).emitUIInteraction = (payload: string) => {
        if (typeof payload !== "string") return;
        Application.emitUIInteraction?.(payload as any);
      };
    } catch {}
  }, []);

  return (
    <div>
      <div ref={videoContainerRef} />
      <Sidepanel />
    </div>
  );
}

export default ArcwarePlayer;
