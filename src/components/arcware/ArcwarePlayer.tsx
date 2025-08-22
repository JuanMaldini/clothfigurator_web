import Sidepanel from "../panel/Sidepanel";
import React, { useState, useRef, useEffect } from "react";
import { ArcwareInit } from "@arcware-cloud/pixelstreaming-websdk";

function ArcwarePlayer() {
  const videoContainerRef = useRef(null);
  const [arcwareApplication, setArcwareApplication] = useState(null);
  const [applicationResponse, setApplicationResponse] = useState("");

  const handleSendCommand = (descriptor) => {
    arcwareApplication?.emitUIInteraction(descriptor);
  };

  useEffect(() => {
    const { Config, PixelStreaming, Application } = ArcwareInit(
        {
          shareId: "share-51d14dfe-3b21-4bcd-9a4e-9f212983f79e"
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
      
    setArcwareApplication(Application);
    Application.getApplicationResponse((response) =>
      setApplicationResponse(response)
    );

    // Append the application's root element to the video container ref
    if (videoContainerRef?.current) {
      console.log("appendChild");
      videoContainerRef.current.appendChild(Application.rootElement);
    }
  }, []);
  
  // console.log("applicationResponse", applicationResponse);

  return (
    <div>
      <div
        ref={videoContainerRef}
        style={{ width: "100vw", height: "100vh" }}
      />
      <Sidepanel />
      <button
        style={{
          position: "absolute",
          right: "100px",
          bottom: 20,
          margin: "auto",
          zIndex: 9,
          width: "200px",
        }}
        onClick={() => handleSendCommand({ test: "Send command" })}
      >
        Emit command to Unreal
      </button>
    </div>
  );
}

export default ArcwarePlayer;