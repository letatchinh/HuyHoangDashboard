import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Flex, Image, Popconfirm, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import ModalAnt from "~/components/common/Antd/ModalAnt";
import SearchAnt from "~/components/common/Antd/SearchAnt";
import TableAnt from "~/components/common/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import BtnAdd from "~/components/common/BtnAdd";
import ImageCustom from "~/components/common/Upload/ImageCustom";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter } from "~/utils/helpers";
import CourseForm from "../components/CourseForm";
import {
  useCourseQueryParams,
  useDeleteCourse,
  useGetCourses,
  useUpdateCourseParams,
} from "../course.hook";
type propsType = {};
export default function Course(props: propsType): React.JSX.Element {
  const [query] = useCourseQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateCourseParams(query);
  const [dataSource, isLoading] = useGetCourses(query);
  const [isSubmitLoading, onDelete] = useDeleteCourse();

  const columns: ColumnsType = [
    {
      title: "STT",
      render: (q, e, i) => ++i,
      align: "center",
      width: 80,
    },
    {
      title: "Tên khoá học",
      dataIndex: "name",
      key: "name",
      align: "center",

    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (value: any) => (
        <span>
          <Typography.Text strong>{formatter(value || 0)}</Typography.Text> VNĐ
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value: any) => (
        <Typography.Text type="secondary" strong>
          {dayjs(value).format("DD-MM-YYYY")}
        </Typography.Text>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      align: "center",
      width: 170,
      render: (createdBy: any) => get(createdBy, "fullName", ""),
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: 180,
      render: (_id: any) => (
        <Flex justify={"center"} align="center" gap={5}>
          <Link to={"/course-update/" + _id}>
            <Button type="primary" size="small" icon={<SettingOutlined />}>
              Thiết lập
            </Button>
          </Link>
          <Popconfirm title="Xác nhận xoá" onConfirm={() => onDelete(_id)}>
            <Button
              type="primary"
              size="small"
              icon={<DeleteOutlined />}
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
      <Breadcrumb title={"Danh sách khoá học"} />
      <Flex style={{ marginBottom: 8 }} justify={"space-between"}>
        <SearchAnt onParamChange={onParamChange} />
        <Link to={"/course-create"}>
          <BtnAdd>Thêm mới</BtnAdd>
        </Link>
      </Flex>
      <WhiteBox>
        <TableAnt
          scroll={{x : 1000}}
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
