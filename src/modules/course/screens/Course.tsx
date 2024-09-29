import { SettingOutlined } from "@ant-design/icons";
import { Button, Flex, Image, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import ModalAnt from "~/components/common/Antd/ModalAnt";
import SearchAnt from "~/components/common/Antd/SearchAnt";
import TableAnt from "~/components/common/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import BtnAdd from "~/components/common/BtnAdd";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter } from "~/utils/helpers";
import CourseForm from "../components/CourseForm";
import {
  useCourseQueryParams,
  useGetCourses,
  useUpdateCourseParams
} from "../course.hook";
type propsType = {};
export default function Course(props: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const [query] = useCourseQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateCourseParams(query);
  const [dataSource, isLoading] = useGetCourses(query);
  console.log(dataSource,'dataSource');
  

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

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
    // {
    //   title: "Giá",
    //   dataIndex: "price",
    //   key: "price",
    //   align: "center",
    //   render: (value: any) => (
    //     <span>
    //       <Typography.Text strong>{formatter(value)}</Typography.Text> VNĐ
    //     </span>
    //   ),
    // },
    // {
    //   title: "Ảnh",
    //   dataIndex: "image",
    //   key: "image",
    //   align: "center",
    //   width: 170,
    //   render: (value: any) => <Image style={{ height: 80 }} src={value} />,
    // },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: 170,
      render: (_id: any) => <Link to={'/course-update/'+_id}>
        <Button type="primary" size="small" icon={<SettingOutlined />}>Thiết lập</Button>
      </Link>,
    },
  ];
  return (
    <div>
      <Breadcrumb title={"Danh sách khoá học"} />
      <Flex style={{ marginBottom: 8 }} justify={"space-between"}>
        <SearchAnt onParamChange={onParamChange} />
        <BtnAdd onClick={() => onOpen()}>Thêm mới</BtnAdd>
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
      <ModalAnt
        width={1000}
        title={"Thêm mới Khoá học"}
        open={open}
        onCancel={onCancel}
        destroyOnClose
        footer={null}
      >
        <CourseForm />
      </ModalAnt>
    </div>
  );
}
