// Ambient declarations for global Pixel Streaming helpers to satisfy TS in strict mode.
// Kept intentionally minimal and colocated under arcware/ to avoid polluting the rest of the app.

export {};

declare global {
  /**
   * Arcware wrapper may expose a global sendUIInteraction for convenience.
   * We declare it so Sidepanel can call it when available.
   */
  function sendUIInteraction(message: string): void;

  interface Window {
    webRtcPlayerObj?: {
      emitUIInteraction?: (message: unknown) => void;
      sendMessage?: (message: string) => void;
    };
    InputEmitter?: {
      EmitUIInteraction?: (message: unknown) => void;
    };
  }
}
