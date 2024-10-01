import { Button, Flex, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/common/Antd/SearchAnt";
import TableAnt from "~/components/common/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import BtnAdd from "~/components/common/BtnAdd";
import WhiteBox from "~/components/common/WhiteBox";
import {
  useCourseGroupQueryParams,
  useDeleteCourseGroup,
  useGetCourseGroups,
  useUpdateCourseGroupParams,
} from "../courseGroup.hook";
type propsType = {};
export default function CourseGroup(props: propsType): React.JSX.Element {
  const [query] = useCourseGroupQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateCourseGroupParams(query);
  const [dataSource, isLoading] = useGetCourseGroups(query);
  const [isSubmitLoading, onDelete] = useDeleteCourseGroup();

  const columns: ColumnsType = [
    {
      title: "STT",
      render: (q, e, i) => ++i,
      align: "center",
      width: 80,
    },
    {
      title: "Tên nhóm khoá học",
      dataIndex: "name",
      key: "name",
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
          <Link to={`/courseGroup-update/${_id}`}>
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
      <Breadcrumb title={"Danh sách nhóm khoá học"} />
      <Flex style={{ marginBottom: 8 }} justify={"space-between"}>
        <SearchAnt onParamChange={onParamChange} />
        <Link to={"/courseGroup-create"}>
          <BtnAdd>Thêm mới</BtnAdd>
        </Link>
      </Flex>
      <WhiteBox>
        <TableAnt
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1000 }}
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
