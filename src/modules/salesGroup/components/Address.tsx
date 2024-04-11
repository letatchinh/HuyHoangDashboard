import { Collapse, Flex, Tag, Tooltip, Typography } from "antd";
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
        <div style={{ maxHeight: 200, overflowY: "scroll", padding: "0 15px" }}>
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
  return (<Tooltip
    trigger={['click']}
    placement= {'right'}
    title={addressString}
  >{managementArea?.length ? <span style={{fontSize: 11}}>  <i className="fa-solid fa-location-dot"></i> Xem địa chỉ</span> : 'Không có địa chỉ'}
  </Tooltip>)
    
};
