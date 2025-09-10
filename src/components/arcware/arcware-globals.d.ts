export {};
declare global {
  interface Window {
    emitUIInteraction?: (payload: unknown) => void;
  }
}
