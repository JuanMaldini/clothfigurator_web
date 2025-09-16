declare global {
  interface Window {
    emitUIInteraction?: (payload: unknown) => void;
  }
}

export function sendToUE(payload: unknown) {
  try {
    window.emitUIInteraction?.(payload as any);
  } catch (e) {
    console.warn("sendToUE failed", e, payload);
  }
}

export function sendUE(payload: unknown) {
  console.log(payload);
  sendToUE(payload);
}
