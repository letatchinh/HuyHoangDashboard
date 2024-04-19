import { Collapse, ConfigProvider, Flex, List, Tag, Tooltip, Typography } from "antd";
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
  // const ref = useRef();
  // const uuid = useId();
  const addressString = useMemo(
    () => convertAddress(managementArea, onlyShowLastPath),
    [managementArea, onlyShowLastPath]
  );
  // const items: any = useMemo(
  //   () => ({
  //     key: uuid,
  //     label: "",
  //     children: (
  //       <div style={{ maxHeight: 200, overflowY: "scroll", padding: "0 15px" }}>
  //         {addressString?.map((item: any) => (
  //           <Typography.Text style={{ display: "block" }} strong>
  //             {item}
  //           </Typography.Text>
  //         ))}
  //       </div>
  //     ),
  //   }),
  //   [addressString]
  // );
  return (
    <div style={{ width: '80px', textAlign: 'center', lineHeight: 1
     }}>
      <ConfigProvider
        theme={{
          token: {
            paddingSM: 0,
            paddingXS: 0,
          },
          components: {
            List: {
              itemPadding: '5px 10px',
              itemPaddingSM: '5px 10px',
              itemPaddingLG: '5px 10px'
            }
          }
        }}
      >
        <Tooltip
          style = {{
            width: 'max-content',
          }}
          overlayInnerStyle={{
            width: 'max-content',
          }}
          overlayStyle={{
            width: 'max-content',
            maxWidth: 'unset'
          }}
          trigger={['click']}
          placement= {'right'}
          title={
          <List
            style={{
            backgroundColor: 'white'
            }}
            size="small"
            bordered
            dataSource={addressString}
            renderItem={(item: string,index) => (
              <List.Item key={index}>
                {item}
              </List.Item>
            )}
          />}
        >
          {/* <span> */}
          {managementArea?.length ? <span style={{ fontSize: 11, lineHeight: 1 }}>  <i className="fa-solid fa-location-dot"></i> Xem địa chỉ</span> : 'Không có địa chỉ'}
          {/* </span> */}
        </Tooltip>
      </ConfigProvider>
    </div>
  )
    
};
