import { ColumnsType } from 'antd/es/table';
import React, { useMemo } from 'react';
type propsType = {

}
export default function ProductList(props: propsType): React.JSX.Element {
  const columns: ColumnsType  = useMemo(
    () => [
      {
        title: "Mã nhà cung cấp",
        dataIndex: "code",
        key: "code",
      },
      
    ],
    []
  );
  return (
    <div>ProductList</div>
  )
}