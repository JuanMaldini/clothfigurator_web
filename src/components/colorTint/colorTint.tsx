import { ColorPicker, useColor, type IColor } from "react-color-palette";
import "react-color-palette/css";

type Props = {
  onTintChange?: (r: number, g: number, b: number) => void;
};

export default function ColorTint({ onTintChange }: Props) {
  const [color, setColor] = useColor("#123123");

  const notify = (c: IColor) => {
    const { r, g, b } = c.rgb;
    onTintChange?.(Math.round(r), Math.round(g), Math.round(b));
  };

  const onChange = (c: IColor) => {
    setColor(c);
    notify(c);
  };

  const onChangeComplete = (c: IColor) => {
    localStorage.setItem("color", c.hex);
    notify(c);
  };

  return (
    <ColorPicker
      color={color}
      onChange={onChange}
      onChangeComplete={onChangeComplete}
      hideAlpha={true}
    />
  );
}