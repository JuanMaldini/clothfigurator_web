import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
export interface PixelStreamingConfig {
  SignallingServerUrl: string;
  AutoPlay?: boolean;
}
interface PixelStreamingState {
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
  config: PixelStreamingConfig;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}
const PixelStreamingCtx = createContext<PixelStreamingState | null>(null);
export const usePixelStreaming = () => {
  const ctx = useContext(PixelStreamingCtx);
  if (!ctx) throw new Error('usePixelStreaming must be inside PixelStreamingProvider');
  return ctx;
};
export const PixelStreamingProvider: React.FC<{ config: PixelStreamingConfig; children: React.ReactNode }> = ({ config, children }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isConnected, setConnected] = useState(false);
  // TODO integrate real SDK logic later; this mimics lifecycle.
  const connect = () => {
    // placeholder connect flow
    setConnected(true);
  };
  const disconnect = () => {
    setConnected(false);
  };

  useEffect(() => () => connect(), []);

  return (
    <PixelStreamingCtx.Provider value={{ videoRef, config, isConnected, connect, disconnect }}>
      {children}
    </PixelStreamingCtx.Provider>
  );
};
