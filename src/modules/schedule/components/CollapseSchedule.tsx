import { Collapse, ConfigProvider, GetProps } from "antd";
import React from "react";
export default function CollapseSchedule(props: GetProps<typeof Collapse>): React.JSX.Element {
  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
                contentPadding: '16px 16px 16px 32px'
          },
        },
      }}
    >
        <Collapse {...props}/>
    </ConfigProvider>
  );
}
