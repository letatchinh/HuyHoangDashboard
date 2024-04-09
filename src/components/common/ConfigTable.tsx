import { ConfigProvider } from 'antd';
import React from 'react';
type propsType = {
children : React.ReactNode
}

// Please add className="table-striped-rows-custom" to children table 

export default function ConfigTable({children}:propsType) {
  return (
    <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#C4E4FF',
            },
          },
        }}
    >
      {children}
      </ConfigProvider>
  )
};