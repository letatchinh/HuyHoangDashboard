import { Table } from "antd";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetMyEmployee } from "../employee.hook";
type propsType = {
  _id?: any;
};
export default function ExpandRowEmployee({
  _id,
}: propsType) {
    const memoId = useMemo(() => _id, [_id]);
  const [myEmployee, isLoading] = useGetMyEmployee(memoId);
  console.log(myEmployee, "myEmployee");
  
  return (
    <div>
      <h5>Nhân sự</h5>
      <Table
        dataSource={myEmployee}
        rowKey={(rc) => rc?._id}
        columns={[
          {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
          },
          {
            title: "Số điện thoại",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            render(phoneNumber) {
              return (
                <Link
                  className="link_"
                  to={`/collaborator?&keyword=${phoneNumber}`}
                  target={"_blank"}
                ></Link>
              );
            },
          },
          {
            title: "Loại nhân sự",
            dataIndex: "type",
            key: "type",
          },
        ]}
        // pagination={{
        //   ...paging,
        //   showSizeChanger: true,
        //   showTotal: (total) => `Tổng cộng: ${total} `,
        // }}
      />
    </div>
  );
}
