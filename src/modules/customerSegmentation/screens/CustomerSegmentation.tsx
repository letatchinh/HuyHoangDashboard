import { ColumnsType } from "antd/es/table";
import { title } from "process";
import React, { useCallback, useMemo, useState } from "react";
import WithPermission from "~/components/common/WithPermission";
import {
  useCustomerSegmentationPaging,
  useCustomerSegmentationQueryParams,
  useGetCustomerSegmentations,
  useUpdateCustomerSegmentation,
  useUpdateCustomerSegmentationParams,
} from "../customerSegmentation.hook";
import { Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import ModalAnt from "~/components/Antd/ModalAnt";
import CustomerSegmentationForm from "./CustomerSegmentationForm";
import Breadcrumb from "~/components/common/Breadcrumb";
type propsType = {};
export default function CustomerSegmentation(
  props: propsType
): React.JSX.Element {
  const [query] = useCustomerSegmentationQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateCustomerSegmentationParams(query);
  const [data, isLoading] = useGetCustomerSegmentations(query);
  const [customerSegmentationId, setCustomerSegmentationId] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [destroy, setDestroy] = useState(false);
  const onCloseForm = useCallback(() => {
    setCustomerSegmentationId(null);
    setIsOpenForm(false);
  }, []);
  const onOpenForm = useCallback(
    (id?: any) => {
      if (id) {
        setCustomerSegmentationId(id);
        setDestroy(true);
      }
      setIsOpenForm(true);
    },
    [setCustomerSegmentationId, setIsOpenForm]
  );
  const paging = useCustomerSegmentationPaging();
  const [isSubmitLoading, handleUpdate] =
    useUpdateCustomerSegmentation(onCloseForm);
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mô hình kinh doanh",
        dataIndex: "division",
        key: "division",
      },
      {
        title: "Tên phân hệ khách hàng",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Thao tác",
        dataIndex: "_id",
        // key: "actions",
        width: 150,
        align: "center",
        render: (record) => {
          return (
            // <WithPermission permission={POLICIES.UPDATE_PHARMAPROFILE}>
            <Button
              block
              icon={<InfoCircleOutlined />}
              onClick={() => onOpenForm(record)}
              size="small"
            >
              Cập nhật
            </Button>
            //   </WithPermission>
          );
        },
      },
    ],
    []
  );
  return (
    <div>
      <Breadcrumb title={"Phân hệ bán hàng"} />
      <WhiteBox>
        <TableAnt
          dataSource={data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: false,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
          stickyTop
        />
      </WhiteBox>
      <ModalAnt
        width={700}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <CustomerSegmentationForm
          setDestroy={setDestroy}
          onClose={onCloseForm}
          id={customerSegmentationId}
          handleUpdate={handleUpdate}
          isSubmitLoading={isSubmitLoading}
        />
      </ModalAnt>
    </div>
  );
}
