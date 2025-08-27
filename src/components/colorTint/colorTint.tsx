// Stubs para compatibilidad con el import del Sidepanel
export function getCurrentTint() {
  return "#ffffffff";
}

export function subscribeTint(cb: (t: string) => void) {
  // No hay gestión global real, solo stub para evitar errores
  void cb; // marcar como usado para evitar TS6133
  return () => {};
}
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/dist/css/rcp.css";

export function ColorTint() {
  const [color, setColor] = useColor("#ffffffff");

  return (
    <div className="sp-tint-picker-wrap">
      <ColorPicker
        height={180}
        color={color}
        onChange={setColor}
        hideAlpha
        hideInput={["rgb", "hsv"]}
      />
    </div>
  );
}

export { useColor };
export default ColorTint;
