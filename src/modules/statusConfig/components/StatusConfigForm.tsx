import React, { useState } from 'react';
import { Form, Input, Popover, Space } from 'antd';
import ColorPickerModule from './StatusEditForm';
import ColorPicker, { Color } from 'antd/es/color-picker';

interface StatusEditFormProps {
  form: any; // Replace 'any' with the actual type of your form
  inputRef: React.RefObject<any>;
  save: () => void;
  field: string;
}

const StatusEditForm: React.FC<StatusEditFormProps> = ({ form, inputRef, save, field }) => {
    const [colorHex, setColorHex] = useState<Color | string>("#1677ff");

    const handleColorChange = (color: Color) => {
      console.log(color.toHexString());
      setColorHex(color);
    };
  
    return (
      <Space>
        <ColorPicker value={form.getFieldValue('color')||colorHex} onChange={handleColorChange} showText />
        {/* <span>HEX: {hexString}</span> */}
      </Space>
    );
}

export default StatusEditForm;
