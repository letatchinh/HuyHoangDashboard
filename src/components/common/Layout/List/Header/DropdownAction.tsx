import { MenuOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import React, { useMemo } from "react";
import { v4 } from "uuid";
type propsType = {
    items : any[]
};
export default function DropdownAction({items}: propsType): React.JSX.Element {
    const items_ = useMemo(() => items?.map((item:any) => ({
        key : v4(),
        label : item
    })), [items])
  return (
    <Dropdown
    overlayClassName="DropdownAction"
    trigger={['click']}
      menu={{
        items : items_,
      }}
    >
     <Button icon={<MoreOutlined />}/>
    </Dropdown>
  );
}
