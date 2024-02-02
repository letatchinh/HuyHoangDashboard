import React, { useMemo, useState } from "react";
import { ColorPicker, Space } from "antd";
import type { Color, ColorPickerProps } from "antd/es/color-picker";

const ColorPickerModule = () => {
  const [colorHex, setColorHex] = useState<Color | string>("#1677ff");

  const handleColorChange = (color: Color) => {
    console.log(color.toHexString());
    setColorHex(color);
  };

  return (
    <Space>
      <ColorPicker value={colorHex} onChange={handleColorChange} showText />
      {/* <span>HEX: {hexString}</span> */}
    </Space>
  );
};

export default ColorPickerModule;
