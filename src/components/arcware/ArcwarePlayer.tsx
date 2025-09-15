import Sidepanel from "../panel/Sidepanel";
import { useRef, useEffect, useState } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";
import ViewRotator from "../view-rotator/view-rotator";
import collections from "../panel/collections.json";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true); //AQUI DEFINIR INITIAL STATE
  useEffect(() => {
    const { Application } = ArcwareInit(
      {
        shareId: "share-0fs9aa231-983a-4163-9f8d-7741f5b3d6af",
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
          fullscreenButton: false,
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
    <div className={"aw-shell" + (open ? " is-open" : "")}>
      <main className="aw-main">
        {!open && (
          <button
            className="sp-export-btn sp-panel-open-btn"
            onClick={() => setOpen(true)}
          >
            Open
          </button>
        )}
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
        {open && (
          <Sidepanel
            data={collections as any}
            onRequestClose={() => setOpen(false)}
          />
        )}
      </aside>
    </div>
  );
}
export default ArcwarePlayer;
