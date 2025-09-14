// Centralized Pixel Streaming helpers

declare global {
  interface Window {
    emitUIInteraction?: (payload: unknown) => void;
  }
}

/**
 * Sends a UI interaction payload to Unreal via Arcware SDK.
 * Accepts objects or strings. The SDK will serialize objects once.
 */
export function sendToUE(payload: unknown) {
  try {
    window.emitUIInteraction?.(payload as any);
  } catch (e) {
    if (import.meta.env.MODE !== "production") {
      console.warn("sendToUE failed", e, payload);
    }
  }
}

/**
 * Convenience helper: logs payload in dev and sends to UE.
 * Keeps UI components free of console.log noise.
 */
export function sendUE(payload: unknown) {
  if (import.meta.env.MODE !== "production") {
    console.log(payload);
  }
  sendToUE(payload);
}
