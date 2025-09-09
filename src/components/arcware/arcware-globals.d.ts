export {};
declare global {
  interface Window {
    emitUIInteraction?: (payload: string) => void;
  }
}
