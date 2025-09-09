import { ColorPicker, useColor, type IColor } from "react-color-palette";
// import "react-color-palette/css";

export default function ColorTint() {
  const [color, setColor] = useColor("#123123");

  const onChangeComplete = (color: IColor) =>
    localStorage.setItem("color", color.hex);

  return <ColorPicker
  hideInput={["rgb", "hsv"]}
  color={color}
  onChange={setColor}
  onChangeComplete={onChangeComplete}
  hideAlpha={true}
/>;
}