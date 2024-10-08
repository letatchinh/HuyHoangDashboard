import { Button, Flex, Popconfirm, Switch } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/common/Antd/SearchAnt";
import TableAnt from "~/components/common/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import BtnAdd from "~/components/common/BtnAdd";
import WhiteBox from "~/components/common/WhiteBox";
import {
    useDeleteTeacher,
    useGetTeachers,
    useTeacherQueryParams,
    useUpdateTeacherParams
} from "../teacher.hook";
type propsType = {};
export default function Teacher(props: propsType): React.JSX.Element {
  const [query] = useTeacherQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateTeacherParams(query);
  const [dataSource, isLoading] = useGetTeachers(query);
  const [isSubmitLoading, onDelete] = useDeleteTeacher();

  const columns: ColumnsType = [
    {
        title: "Họ và tên",
        dataIndex: "fullName",
        key: "fullName",
        align: "left",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        align: "center",
        width: 150,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        align: "center",
      },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: 150,
      render: (_id) => (
        <Flex justify={"space-between"}>
          <Link to={`/teacher-update/${_id}`}>
            <Button size="small" type="primary">
              Cập nhật
            </Button>
          </Link>
          <Popconfirm title="Xác nhận xoá" onConfirm={() => onDelete(_id)}>
            <Button
              loading={isSubmitLoading}
              size="small"
              type="primary"
              danger
            >
              Xoá
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];
  return (
    <div>
      <Breadcrumb title={"Danh sách giảng viên"} />
      <Flex style={{ marginBottom: 8 }} justify={"space-between"}>
        <SearchAnt onParamChange={onParamChange} />
        <Link to={`/teacher-create`}>
          <BtnAdd>Thêm mới</BtnAdd>
        </Link>
      </Flex>
     <WhiteBox>
     <TableAnt
        columns={columns}
        dataSource={dataSource}
        stickyTop
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng: ${total} `,
        }}
        loading={isLoading}
      />
     </WhiteBox>
    </div>
  );
}
