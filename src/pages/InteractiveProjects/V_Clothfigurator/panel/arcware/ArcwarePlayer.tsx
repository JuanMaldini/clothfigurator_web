import Sidepanel from "../Sidepanel";
import { useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";
import { registerScreenshotApplication } from "../screenshot/screenshot";
import ViewRotator from "../view-rotator/view-rotator";
import collections from "../textures.json";
import models from "../models.json";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  // In editor (dev) mode, do not load Arcware: make IDs undefined
  const isEditor = import.meta.env.DEV;
  const shareId = isEditor
    ? undefined
    : (import.meta.env.VITE_ARCWARE_SHARE_ID as string | undefined);
  const projectId = isEditor
    ? undefined
    : (import.meta.env.VITE_ARCWARE_PROJECT_ID as string | undefined);
  useEffect(() => {
    // Skip initializing Arcware when IDs are not available (e.g., editor/preview)
    if (!shareId || !projectId) return;
    const { Application } = ArcwareInit(
      {
        shareId: shareId as string,
        projectId: projectId as string,
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
          fullscreenButton: false,
          settingsButton: false,
          connectionStrengthIcon: false,
        },
      }
    );
    if (videoContainerRef?.current) {
      videoContainerRef.current.appendChild(Application.rootElement);
    }
    // Register screenshot listener once
    registerScreenshotApplication(Application as any);
    try {
      (window as any).emitUIInteraction = (payload: unknown) => {
        if (typeof payload === "string") {
          Application.emitUIInteraction?.(payload as any);
          return;
        }
        Application.emitUIInteraction?.(payload as any);
      };
    } catch {}
  }, [shareId, projectId]);
  return (
    <div className="aw-shell is-open"> 
      <main className="aw-main">
        <div className="arcware-video-wrapper">
          <div ref={videoContainerRef} className="arcware-video" />
          <div className="hud-view-rotator">
            <div className="hud-card">
              <ViewRotator />
            </div>
          </div>
        </div>
      </main>
      <aside className="aw-aside">
        <Sidepanel
          textures={collections as any}
          models={models as any}
        />
      </aside>
    </div>
  );
}
export default ArcwarePlayer;
