import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Typography } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/lib/table/InternalTable";
import dayjs from "dayjs";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import SearchAnt from "~/components/Antd/SearchAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import { getTextOfDiscount, getValueOfMath } from "~/utils/helpers";
import CouponForm from "../components/CouponForm";
import { STATE_VI } from "../constants";
import {
  useCouponPaging,
  useCouponQueryParams,
  useDeleteCoupon,
  useGetCoupons,
  useUpdateCouponParams,
} from "../coupon.hook";
type propsType = {};
export default function Coupon(props: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [query] = useCouponQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateCouponParams(query);
  const [dataSource, isLoading] = useGetCoupons(query);
  console.log(dataSource,'dataSource');
  
  const paging = useCouponPaging();
  const [isSubmitLoading, onDelete] = useDeleteCoupon();
  const [id, setId] = useState<any>();
  const onOpen = useCallback((i?: any) => {
    if (i) setId(i);
    setOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
    setId(null);
  }, []);
  const columns: ColumnsType = [
    {
      title: "Mã",
      dataIndex: "giftCode",
      key: "giftCode",
      render: (value,rc) => <Typography.Link  onClick={() => onOpen(rc?._id)}>{value}</Typography.Link>,
    },
    {
      title: "Tên mã",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá trị giảm",
      dataIndex: "discount",
      key: "discount",
      align : 'center',
      render : (discount : any) => getTextOfDiscount(get(discount,'value'),get(discount,'type'))
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      key: "state",
      render : (state : "PUBLIC" | "PRIVATE") => STATE_VI[state]
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (value, rc) =>
        !rc?.startDate && !rc?.endDate ? (
          <span>Vô thời hạn</span>
        ) : (
          <Flex justify={"center"} gap={5}>
            {rc?.startDate ? (
              <Typography.Text type="secondary">
                {dayjs(rc?.startDate).format("DD/MM/YYYY HH:mm:ss")}
              </Typography.Text>
            ) : (
              <Typography.Text type="secondary">&infin;</Typography.Text>
            )}
            {"=>"}
            {rc?.endDate ? (
              <Typography.Text type="secondary">
                {dayjs(rc?.endDate).format("DD/MM/YYYY HH:mm:ss")}
              </Typography.Text>
            ) : (
              <Typography.Text type="secondary">&infin;</Typography.Text>
            )}
          </Flex>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      dataIndex: "_id",
      width: 100,
      render: (_id, rc) => (
        <Flex align={"center"} gap={5}>
          <Typography.Link onClick={() => onOpen(_id)}>Sửa</Typography.Link>|
          <Popconfirm
            okButtonProps={{ loading: isSubmitLoading }}
            title="Xác nhận xoá"
            onConfirm={() => onDelete(_id)}
          >
            <Typography.Link type="danger">Xoá</Typography.Link>
          </Popconfirm>
        </Flex>
      ),
    },
  ];
  return (
    <div>
      <Breadcrumb title={"Danh sách mã giảm giá"} />
      <Flex style={{ marginBottom: 8 }} justify={"space-between"}>
        <SearchAnt onParamChange={onParamChange} />
        <Button onClick={() => onOpen()} type="primary" icon={<PlusOutlined />}>
          Thêm mới
        </Button>
      </Flex>
      <TableAnt
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: "auto" }}
        pagination={{
          ...paging,
          onChange(page, pageSize) {
            onParamChange({ page, limit: pageSize });
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng: ${total} `,
        }}
        loading={isLoading}
      />
      <ModalAnt
        title={id ? "Cập nhật mã giảm giá" : "Tạo mới mã giảm giá"}
        width={800}
        onCancel={onClose}
        open={open}
        destroyOnClose
        footer={null}
      >
        <CouponForm id={id} onCancel={onClose} />
      </ModalAnt>
    </div>
  );
}
