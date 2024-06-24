import { Button, Divider, Popconfirm, Radio, Row, Table, TableColumnsType } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useGetBranch } from "../branch.hook";
import useBranchContext from "../store/BranchContext";
type propsType = {};
interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
};

export default function ListWarehouseLinked({}: propsType): React.JSX.Element {
  const { id ,deleteWarehouseLink, isSubmitLoading} = useBranchContext();
  const [branch, loading] = useGetBranch(id);
  const [value, setValue] = useState<any[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const newValue = selectedRows?.map((item: any) => item?._id);
      setValue(newValue);
    },
  };
  const columns: ColumnsType = [
    {
      title: "Tên kho",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    {
      key: '4',
      name: 'Disabled User',
      age: 99,
      address: 'Sydney No. 1 Lake Park',
    },
  ];
  return (
    <>
      <Table
        size="small"
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={{
          type: "checkbox",
          ...rowSelection
        }}
      />
      <Row justify="end" align="middle" style={{ marginTop: 10 }}>
       <Popconfirm
         title={'Hành động này sẽ xoá liên kết với các kho đã được chọn, bạn có chắc chắn?'}
         onConfirm={() => deleteWarehouseLink({id,  warehouseIds: value })}
        >
          <Button type="primary" danger loading={isSubmitLoading} disabled={value?.length <= 0}>
            Xác nhận xoá
          </Button>
          </Popconfirm>
      </Row>
    </>
  );
}
