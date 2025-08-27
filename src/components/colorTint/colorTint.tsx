// Gestión global simple de Tint (publish/subscribe)
let CURRENT_TINT = "#ffffff";
const SUBSCRIBERS = new Set<(t: string) => void>();
const COMMIT_SUBSCRIBERS = new Set<(t: string) => void>();

export function getCurrentTint() {
  return CURRENT_TINT;
}

export function subscribeTint(cb: (t: string) => void) {
  SUBSCRIBERS.add(cb);
  // Enviar el valor actual de inmediato
  try {
    cb(CURRENT_TINT);
  } catch {}
  return () => {
    SUBSCRIBERS.delete(cb);
  };
}

export function setGlobalTint(value: string) {
  if (value === CURRENT_TINT) return; // prevent redundant updates
  CURRENT_TINT = value;
  for (const cb of SUBSCRIBERS) {
    try {
      cb(CURRENT_TINT);
    } catch {}
  }
}

// Suscripción a commits (cuando el usuario suelta el click en el picker)
export function subscribeTintCommit(cb: (t: string) => void) {
  COMMIT_SUBSCRIBERS.add(cb);
  return () => {
    COMMIT_SUBSCRIBERS.delete(cb);
  };
}
function emitTintCommit() {
  for (const cb of COMMIT_SUBSCRIBERS) {
    try {
      cb(CURRENT_TINT);
    } catch {}
  }
}

// Allow external modules (Sidepanel) to trigger a commit explicitly (e.g., reset button)
export function commitTint() {
  emitTintCommit();
}

import { useRef } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/dist/css/rcp.css";

export function ColorTint() {
  const [color, setColor] = useColor(CURRENT_TINT);
  const trackingRef = useRef(false);

  return (
    <div
      className="sp-tint-picker-wrap"
      onPointerDown={() => {
        if (trackingRef.current) return;
        trackingRef.current = true;
        const commitOnce = () => {
          trackingRef.current = false;
          emitTintCommit();
        };
        window.addEventListener("pointerup", commitOnce, { once: true });
      }}
    >
      <ColorPicker
        height={180}
        color={color}
        onChange={(c) => {
          if (c.hex !== color.hex) {
            setColor(c);
            // react-color-palette expone c.hex (#RRGGBB)
            setGlobalTint(c.hex);
          }
        }}
        hideAlpha
        hideInput={["rgb", "hsv"]}
      />
    </div>
  );
}

export { useColor };
export default ColorTint;
