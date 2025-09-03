import Sidepanel from "../panel/Sidepanel";
import { useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { Application } = ArcwareInit(
        {
          shareId: "share-6b91e33a-c882-44a2-a0f5-b864eb1d6cf1"
        },
        {
          initialSettings: {
            StartVideoMuted: true,
            AutoConnect: true,
            AutoPlayVideo: true
          },
          settings: {
            infoButton: true,
            micButton: true,
            audioButton: true,
            fullscreenButton: true,
            settingsButton: true,
            connectionStrengthIcon: true
          },
        }
      );
    

    // Append the application's root element to the video container ref
    if (videoContainerRef?.current) {
      console.log("appendChild");
      videoContainerRef.current.appendChild(Application.rootElement);
    }

    // Expose a thin global bridge so other components (e.g., Sidepanel) can emit UI interactions
    // without prop drilling or extra context. This mirrors common Pixel Streaming globals.
    try {
      (window as any).emitUIInteraction = Application.emitUIInteraction?.bind(Application);
      (window as any).sendUIInteraction = (message: unknown) =>
        Application.emitUIInteraction?.(message as any);
    } catch {
      // ignore if window is not writable (shouldn't happen in browser)
    }
  }, []);
  
  return (
    <div>
      <div ref={videoContainerRef}/>
      <Sidepanel />
    </div>
  );
}

export default ArcwarePlayer;