import { Collapse, Flex, Tag, Typography } from "antd";
import type { CollapseProps } from "antd";
import React, { useId, useMemo } from "react";
import { convertAddress } from "../salesGroup.service";
interface TypeProps extends CollapseProps {
  managementArea?: any[];
  onlyShowLastPath?: boolean;
}

export default function Address({
  managementArea,
  onlyShowLastPath,
  ...props
}: TypeProps): React.JSX.Element {
  const uuid = useId();
  const addressString = useMemo(
    () => convertAddress(managementArea, onlyShowLastPath),
    [managementArea, onlyShowLastPath]
  );
  const items: any = useMemo(
    () => ({
      key: uuid,
      label: "",
      children: (
        <div style={{maxHeight : 50,overflowY : 'scroll',padding : '0 15px'}}>
          {addressString?.map((item: any) => (
            <Typography.Text style={{ display: "block" }} strong>
              {item}
            </Typography.Text>
          ))}
        </div>
      ),
    }),
    [addressString]
  );
  return (
    <Collapse
      collapsible={"icon"}
      expandIcon={({isActive}) => (
        <Flex style={{ userSelect: "none",width : '100%' }} gap={5} align={"center"}>
          <i className="fa-solid fa-location-dot"></i> {isActive ? "Ẩn địa chỉ" : "Xem Địa chỉ"}
        </Flex>
      )}
      className="collapseCustom"
      bordered={false}
      items={[items]}
      defaultActiveKey={["1"]}
      {...props}
    />
  );
}
