import { Button, Col, DatePicker, Form, Modal, Row, Skeleton, Spin, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import FormSelectProduct from "./FormSelectProduct";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import TableAnt from "~/components/Antd/TableAnt";
import { formatNumberThreeComma } from "~/utils/helpers";
import dayjs from "dayjs";
import { SubmitProductsBorrow, convertProductsBorrowById, useCreateProductBorrow, useGetProductBorrow, useUpdateProductBorrow } from "../../product.hook";
import UploadListFile from "~/components/common/UploadFileList";
import { useDispatch } from "react-redux";
import { productActions } from "../../redux/reducer";
import useProductBorrowContext from "./ProductBorrowContext";
type propsType = {
  id?: string | null;
  onCloseVoucher?: any;
};

const styles = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 12 },
  },
};
export default function ProductBorrowForm({id, onCloseVoucher}: propsType): React.JSX.Element {
  const { dataSelected, products,setDataSelected,setSelectedRowKeys } = useProductBorrowContext();
  const [productBorrow, loading] = useGetProductBorrow(id);
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(productActions.resetActionProductBorrow());
  };
  const [form] = Form.useForm();
  const [partnerId, setPartnerId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!id) { 
      form.resetFields();
      setDataSelected([]);
      setSelectedRowKeys([]);
    } else {
      form.setFieldsValue(productBorrow);
      const dateRefun = productBorrow?.items[0]?.dateRefun;
      form.setFieldsValue({ dateRefun: dayjs(dateRefun) });
      setPartnerId(productBorrow?.receidverId);
      setSelectedRowKeys(productBorrow?.items?.map((item: any) => item?.productId));
    }
  }, [productBorrow,id]);
  const openForm = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const [isSubmitLoading, handleCreate] = useCreateProductBorrow(() => {
    onCloseVoucher();
    resetAction();
  });
  const [, handleUpdate] = useUpdateProductBorrow(() => {
    onCloseVoucher();
    resetAction();
  });

  const onFinish = (values: any) => {
    const submitData = SubmitProductsBorrow({ ...values, data: dataSelected });
    if (!id) {
      handleCreate(submitData);
    } else {
      handleUpdate({ ...submitData, _id: id });
    }
  };
  const renderLoading = (component: React.ReactNode) => {
    return !loading ? <>{component}</> : <Skeleton.Input active/>
  };

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Tên sản phẩm",
        dataIndex: "variantCurrent",
        key: "name",
        width: 200,
        render(name, product, index) {
          return (
            <Typography.Text strong>{get(product, "name", "")}</Typography.Text>
          );
        },
      },
      {
        title: "Số lượng",
        key: "quantity",
        width: 80,
        align: "center",
        render(name, product, index) {
          return get(product, "quantity", 0);
        },
      },
      {
        title: "Đơn giá",
        key: "price",
        dataIndex: "variantCurrent",
        width: 80,
        align: "center",
        render(price, product, index) {
          return formatNumberThreeComma(get(price, "price")) || 0;
        },
      },
      {
        title: "Đơn vị",
        dataIndex: "variantCurrent",
        key: "unit",
        width: 100,
        align: "left",
        render(unit, record, index) {
          return unit?.unit?.name;
        },
      },
    ],
    [dataSelected]
  );

  return (
    <div>
      <Form
        form={form}
        {...styles}
        labelAlign="left"
        autoComplete="off"
        onFinish={onFinish}
        scrollToFirstError
        requiredMark={false}
      >
        <BaseBorderBox title={"Thông tin chung"}>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item label="Người mượn" name="receidverId">
                {renderLoading(<SelectCollaborator
                  onChange={(value: any) => setPartnerId(value)}
                />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateRefun" label="Thời gian hoàn trả">
                {renderLoading(<DatePicker
                  disabledDate={(current) => {
                    return current <= dayjs().endOf("day");
                  }}
                  style={{ width: "100%" }}
                  placeholder="Thời gian hoàn trả"
                />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox
          styleContent={{ minHeight: "300px" }}
          title={"Danh sách sản phẩm mượn"}
        >
          <div>
            <Button
              className="mb-2"
              type="primary"
              onClick={openForm}
              disabled={!id ? !partnerId: !id}
              loading ={isSubmitLoading}
            >
              Chọn sản phẩm
            </Button>
            <Form.Item name={"data"} noStyle>
              <TableAnt
                className="product-borrow-table"
                columns={columns}
                dataSource={dataSelected}
                size="small"
                pagination={false}
                stickyTop
                bordered
                footer={() => (
                  <h6
                    style={{ textAlign: "left", marginTop: 10 }}
                  >{`Tổng số: ${dataSelected?.length || 0}`}</h6>
                )}
              />
            </Form.Item>
          </div>
        </BaseBorderBox>

        <BaseBorderBox title={"Đính kèm"}>
          <Row gutter={10}>
            <Col span={12}>
                {renderLoading(<UploadListFile />)}
            </Col>
          </Row>
        </BaseBorderBox>
      {!id &&  <Row>
          <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
            <Button loading={isSubmitLoading} type="primary" htmlType="submit" disabled = {!dataSelected?.length}>
              {/* {`${id ? "Cập nhật" : "Tạo mới"}`} */}
              Tạo mới
            </Button>
          </Col>
        </Row>}
      </Form>
      <Modal
        title="Chọn sản phẩm"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={1300}
      >
        <FormSelectProduct id={partnerId} />
      </Modal>
    </div>
  );
}
