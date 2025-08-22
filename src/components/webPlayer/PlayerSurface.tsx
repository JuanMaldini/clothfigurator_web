import React from 'react';
import { usePixelStreaming } from './PixelStreamingContext';

export const PlayerSurface: React.FC = () => {
  const { videoRef, isConnected, connect, disconnect } = usePixelStreaming();
  return (
    <div className="ps-player-surface" data-connected={isConnected || undefined}>
      <div className="ps-toolbar">
        <button onClick={connect} disabled={isConnected}>Connect</button>
        <button onClick={disconnect} disabled={!isConnected}>Disconnect</button>
      </div>
      <video ref={videoRef as React.MutableRefObject<HTMLVideoElement | null>} className="ps-video" playsInline autoPlay muted />
      {!isConnected && <div className="ps-overlay">Not connected</div>}
    </div>
  );
};

export default PlayerSurface;
