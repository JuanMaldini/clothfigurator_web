import { ColorPicker, useColor, type IColor } from "react-color-palette";
import { useEffect } from "react";
import { sendUE } from "../arcware/ps-functions";

type Props = {
  /** Callback opcional si el padre quiere enterarse; el envío a Unreal se hace internamente */
  onTintChange?: (formatted: string) => void;
  /** Incrementar este número desde fuera para forzar reset a blanco */
  resetCounter?: number;
};

export default function ColorTint({ onTintChange, resetCounter }: Props) {
  // Color inicial: si hubiera un guardado previo podríamos leer localStorage aquí
  const [color, setColor] = useColor("#ffffff");

  const buildFormatted = (c: IColor) => {
    const { r, g, b } = c.rgb;
    const rf = (r / 255).toFixed(4);
    const gf = (g / 255).toFixed(4);
    const bf = (b / 255).toFixed(4);
    return `R=${rf},G=${gf},B=${bf}`;
  };

  const notify = (c: IColor) => {
    const formatted = buildFormatted(c);
    // Emitir a Unreal directamente aquí para modularidad
    try {
      sendUE({ "tint-change": formatted });
    } catch (e) {
      console.warn("Failed to send tint-change", e);
    }
    // Callback externo opcional
    onTintChange?.(formatted);
  };

  const onChange = (c: IColor) => {
    setColor(c);
    notify(c); // emite en vivo mientras se arrastra
  };

  const onChangeComplete = (c: IColor) => {
    localStorage.setItem("color", c.hex);
    notify(c); // refuerza al soltar
  };

  // Reset a blanco cuando resetCounter cambie
  useEffect(() => {
    if (resetCounter === undefined) return;
    // Set white
    const whiteHex = "#ffffff";
    // El hook useColor acepta set con hex string
    setColor({
      hex: whiteHex,
      hsv: { h: 0, s: 0, v: 1, a: 1 },
      rgb: { r: 255, g: 255, b: 255, a: 1 },
    } as any);
    const artificial: IColor = {
      hex: whiteHex,
      hsv: { h: 0, s: 0, v: 1, a: 1 },
      rgb: { r: 255, g: 255, b: 255, a: 1 },
    };
    notify(artificial);
  }, [resetCounter]);

  return (
    <ColorPicker
      color={color}
      onChange={onChange}
      onChangeComplete={onChangeComplete}
      hideAlpha={true}
    />
  );
}
