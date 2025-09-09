import Sidepanel from "../panel/Sidepanel";
import { useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { Application } = ArcwareInit(
      {
        shareId: "share-592dbc2c-3475-4321-898c-a8d6abe5b835",
      },
      {
        initialSettings: {
          StartVideoMuted: true,
          AutoConnect: true,
          AutoPlayVideo: true,
        },
        settings: {
          infoButton: true,
          micButton: true,
          audioButton: true,
          fullscreenButton: true,
          settingsButton: true,
          connectionStrengthIcon: true,
        },
      }
    );

    // Append the application's root element to the video container ref
    if (videoContainerRef?.current) {
      console.log("appendChild");
      videoContainerRef.current.appendChild(Application.rootElement);
    }

    // Expose a thin global bridge so other components (e.g., Sidepanel) can emit UI interactions
    // without prop drilling or extra context. Pass plain objects; the SDK will serialize them once.
    try {
      (window as any).emitUIInteraction =
        Application.emitUIInteraction?.bind(Application);
      (window as any).sendUIInteraction = (message: unknown) => {
        // If message is a string that looks like JSON, parse it so Unreal gets an object once.
        try {
          if (typeof message === "string" && message.trim().startsWith("{")) {
            const obj = JSON.parse(message);
            Application.emitUIInteraction?.(obj as any);
            return;
          }
        } catch {
          // fall through and send as-is
        }
        Application.emitUIInteraction?.(message as any);
      };
    } catch {
      // ignore if window is not writable (shouldn't happen in browser)
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
