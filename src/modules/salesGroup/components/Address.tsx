import { Collapse, Flex, Tag, Tooltip, Typography } from "antd";
import type { CollapseProps } from "antd";
import React, { useId, useMemo, useRef } from "react";
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
  const ref = useRef();
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
  return (
    <div style={{width: '80px'}}>
      <Tooltip
        style = {{width: '50px'}}
        trigger={['click']}
        placement= {'right'}
        title={addressString}
      >
        {/* <span> */}
        {managementArea?.length ? <span style={{ fontSize: 11 }}>  <i className="fa-solid fa-location-dot"></i> Xem địa chỉ</span> : 'Không có địa chỉ'}
        {/* </span> */}
      </Tooltip>
    </div>
  )
    
};
