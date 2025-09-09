import Sidepanel from "../panel/Sidepanel";
import { useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { Application } = ArcwareInit(
      {
        shareId: "share-02d001ba-3f86-4e67-beee-04b3c48846c1",
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
