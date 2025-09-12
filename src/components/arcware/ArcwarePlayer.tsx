import Sidepanel from "../panel/Sidepanel";
import { useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const { Application } = ArcwareInit(
      {
        shareId: "share-0f9aa231-983a-4163-9f8d-7741f5b3d6af",
        projectId: "e212120e-c599-415c-b304-b89ff342557a",
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
      (window as any).emitUIInteraction = (payload: unknown) => {
        if (typeof payload === "string") {
          Application.emitUIInteraction?.(payload as any);
          return;
        }
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
