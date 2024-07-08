import { Button, Divider, Popconfirm, Radio, Row, Table, TableColumnsType } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";
import { useGetBranch } from "../branch.hook";
import useBranchContext from "../store/BranchContext";
type propsType = {};
interface DataType {
  key: React.Key;
  name: string;
};

export default function ListWarehouseLinked({}: propsType): React.JSX.Element {
  const { id ,deleteWarehouseLink, isSubmitLoading} = useBranchContext();
  const [branch, loading] = useGetBranch(id);
  const listWarehouse = useMemo(()=> branch?.listWarehouse?.map((item: any)=> ({name:item?.name?.vi, key: item?._id})) || [], [branch]);
  const [value, setValue] = useState<any[]>([]);
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      const newValue = selectedRows.map((item) => item.key);
      setValue(newValue);
    },
  };
  const columns: ColumnsType = [
    {
      title: "Tên kho",
      dataIndex: "name",
      key: "name",
      render: (text: any) => <a>{text?.vi || text}</a>,
    },
  ];
  
  return (
    <>
      <Table
        size="small"
        columns={columns}
        dataSource={listWarehouse || []}
        pagination={false}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        loading={loading}
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
