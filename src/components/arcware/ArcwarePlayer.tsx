import Sidepanel from "../panel/Sidepanel";
import Sidebar from "react-sidebar";
import { useRef, useEffect, useState } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [docked, setDocked] = useState(false);
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
    <Sidebar
      sidebar={<Sidepanel onRequestClose={() => setDocked(false)} />}
      docked={docked}
      open={docked}
      onSetOpen={(o) => setDocked(o)}
      pullRight
      styles={{
        sidebar: {
          width: "30dvw",
          maxWidth: "440px",
          minWidth: "320px",
          background: "var(--ColorBackground, #ebebeb)",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          transition: "transform .25s ease, opacity .25s ease",
        },
        content: { transition: "margin .25s ease" },
      }}
    >
      {!docked && (
        <button
          className="sp-export-btn sp-panel-open-btn"
          onClick={() => setDocked(true)}
        >
          Open
        </button>
      )}
      <div className="arcware-video-wrapper">
        <div ref={videoContainerRef} className="arcware-video" />
      </div>
    </Sidebar>
  );
}
export default ArcwarePlayer;
