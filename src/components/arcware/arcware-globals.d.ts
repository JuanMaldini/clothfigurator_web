// Ambient declarations for global Pixel Streaming helpers to satisfy TS in strict mode.
// Kept intentionally minimal and colocated under arcware/ to avoid polluting the rest of the app.

export {};

declare global {
  /**
   * Arcware wrapper may expose a global sendUIInteraction for convenience.
   * We declare it so Sidepanel can call it when available.
   */
  // Accept unknown to allow passing plain objects; the SDK will serialize once.
  function sendUIInteraction(message: unknown): void;

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
