import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Skeleton,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import FormSelectProduct from "./FormSelectProduct";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import TableAnt from "~/components/Antd/TableAnt";
import { formatNumberThreeComma } from "~/utils/helpers";
import dayjs from "dayjs";
import {
  SubmitProductsBorrow,
  convertProductsBorrowById,
  useConfirmBorrowVoucher,
  useCreateProductBorrow,
  useGetProductBorrow,
  useUpdateProductBorrow,
} from "../../product.hook";
import UploadListFile from "~/components/common/UploadFileList";
import { useDispatch } from "react-redux";
import { productActions } from "../../redux/reducer";
import useProductBorrowContext from "./ProductBorrowContext";
import {
  LANGUAGE,
  STATUS_VOUCHER_BORROW_EN,
  STATUS_VOUCHER_BORROW_NAME,
} from "../../constants";
import { ExclamationCircleOutlined, SaveOutlined } from "@ant-design/icons";
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useGetProfile } from "~/modules/auth/auth.hook";
import WithPermission from "~/components/common/WithPermission";
type propsType = {
  id?: string | null;
  onCloseVoucher?: any;
};
const { confirm } = Modal;

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
export default function ProductBorrowForm({
  id,
  onCloseVoucher,
}: propsType): React.JSX.Element {
  const { dataSelected, products, setDataSelected, setSelectedRowKeys } =
    useProductBorrowContext();
    const [productBorrow, loading] = useGetProductBorrow(id);
  const profile = useGetProfile();
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
      form.setFieldsValue({
        createdDate: dayjs(new Date()),
      });
      if (profile?.role !== 'staff') {
        setPartnerId(profile?.profile?._id);
        form.setFieldsValue({
          receidverId: profile?.profile?._id
        });
      };
      setDataSelected([]);
      setSelectedRowKeys([]);
    } else {
      form.setFieldsValue(productBorrow);
      const dateRefun = productBorrow?.items[0]?.dateRefun;
      form.setFieldsValue({
        dateRefun: dayjs(dateRefun),
        createdDate: dayjs(productBorrow?.createdAt),
      });
      setPartnerId(productBorrow?.receidverId);
      setSelectedRowKeys(
        productBorrow?.items?.map((item: any) => item?.productId)
      );
      if (productBorrow?.status === STATUS_VOUCHER_BORROW_EN.PROCESSING) {
        const updated = productBorrow?.historyStatus?.PROCESSING?.timestamp;
        form.setFieldsValue({
          updated: dayjs(updated)
        });
      }
    }
  }, [productBorrow, id]);
  // useEffect(() => {
  //   if (dataSelected?.length && productBorrow) {
  //     const newData = [...dataSelected];
  //     const newDataSelected = newData?.map((e: any) => {
  //       const findData = productBorrow?.items?.find((item: any) => e?._id === item?.productId);
  //       return {
  //         ...e,
  //         note: findData?.note
  //       };
  //     });
  //     setDataSelected(newDataSelected);
  //   };
  // }, [productBorrow]);

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

  const [, handleConfirm] = useConfirmBorrowVoucher(() => {
    onCloseVoucher();
    resetAction();
  });

  const handleChangeValueData = (key: any, value: any, productId: string) => {
    const data = [...dataSelected];
    if (key === "note") {
      const newData = data?.map((item: any) => {
        if (item?._id === productId) {
          return {
            ...item,
            note: value,
          };
        }
        return item;
      });
      setDataSelected(newData);
    }
  };

  const onWhVoucherStatusChange = async (status: string) => {
    confirm({
      title: `${STATUS_VOUCHER_BORROW_NAME[status][LANGUAGE.VI]} sản phẩm trong phiếu này?`,
      icon: <ExclamationCircleOutlined />,
      content: "",
      onOk() {
        switch (status) {
          case STATUS_VOUCHER_BORROW_EN.PROCESSING:
            handleConfirm({ id: id, status: STATUS_VOUCHER_BORROW_EN.PROCESSING });
            break;
          case STATUS_VOUCHER_BORROW_EN.COMPLETED:
            handleConfirm({ id: id, status: STATUS_VOUCHER_BORROW_EN.COMPLETED });
            break;
          case STATUS_VOUCHER_BORROW_EN.CANCELLED:
            handleConfirm({ id: id, status: STATUS_VOUCHER_BORROW_EN.CANCELLED });
            break;
          default:
            break;
        }
      },
      onCancel() {},
    });
  };

  const onFinish = (values: any) => {
    const submitData = SubmitProductsBorrow({ ...values, data: dataSelected });
    console.log(submitData,'submitData')
    if (!id) {
      handleCreate(submitData);
    } else {
      handleUpdate({ ...submitData, id });
    };
  };

  const renderLoading = (component: React.ReactNode) => {
    return !loading ? <>{component}</> : <Skeleton.Input active />;
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
    <>
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
                {renderLoading(
                  <SelectCollaborator
                    disabled = {profile?.role !== 'staff' || !!id}
                    onChange={(value: any) => setPartnerId(value)}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="createdDate" label="Ngày tạo phiếu mượn">
                {renderLoading(
                  <DatePicker disabled style={{ width: "100%" }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item name="updated" label="Ngày bắt đầu mượn">
                {renderLoading(
                  <DatePicker disabled style={{ width: "100%" }} placeholder="Ngày được phê duyệt phiếu mượn"/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateRefun" label="Ngày hoàn trả">
                {renderLoading(
                  <DatePicker
                    disabledDate={(current) => {
                      return current <= dayjs().endOf("day");
                    }}
                    disabled = {!!id}
                    style={{ width: "100%" }}
                    placeholder="Ngày hoàn trả"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox
          styleContent={{ minHeight: "300px" }}
          title={"Danh sách sản phẩm mượn"}
        >
          <div>
            {!id && (
              <Button
                className="mb-2"
                type="primary"
                onClick={openForm}
                disabled={!id ? !partnerId : !id}
                loading={isSubmitLoading}
              >
                Chọn sản phẩm
              </Button>
            )}
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
                  <h6 style={{ textAlign: "left", marginTop: 10 }}>{`Tổng số: ${
                    dataSelected?.length || 0
                  }`}</h6>
                )}
              />
            </Form.Item>
          </div>
        </BaseBorderBox>

        <BaseBorderBox title={"Thông tin thêm"}>
          <Row gutter={10}>
            <Col span={12}>{renderLoading(<UploadListFile />)}</Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                name="note"
                label="Ghi chú"
              >
                {renderLoading(<Input.TextArea />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        {!loading && <Row align={"middle"} justify={"center"}>
          {!id ? (
            <WithPermission permission={POLICIES.WRITE_BORROWPRODUCT}>
              <Col span={24} style={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  loading={isSubmitLoading}
                  type="primary"
                  htmlType="submit"
                  disabled={!dataSelected?.length}
                >
                  {/* {`${id ? "Cập nhật" : "Tạo mới"}`} */}
                  Tạo mới
                </Button>
              </Col>
            </WithPermission>
          ) : (
            <>
              {(get(productBorrow, "status") !== STATUS_VOUCHER_BORROW_EN.CANCELLED  || get(productBorrow, "status") !== STATUS_VOUCHER_BORROW_EN.COMPLETED) && (
                <>
                    {get(productBorrow, "status") === STATUS_VOUCHER_BORROW_EN.NEW &&
                      <WithPermission permission={POLICIES.UPDATE_BORROWPRODUCT}>
                      <Button
                        style={{ marginRight: "10px" }}
                        icon={<SaveOutlined />}
                        htmlType="submit"
                        loading={isSubmitLoading}
                      >
                        Lưu
                      </Button>
                  </WithPermission>}
                    {profile?.role === "staff" && (
                      productBorrow?.status === STATUS_VOUCHER_BORROW_EN.NEW &&
                      <>
                        {/* ACTION CONFIRM BORROW */}
                      <WithOrPermission
                        permission={[POLICIES.UPDATE_STATUSBORROWPRODUCT]}
                      >
                        <Button
                          loading={isSubmitLoading}
                          style={{ marginRight: "10px" }}
                          icon={<SaveOutlined />}
                          type="primary"
                          onClick={() =>
                            onWhVoucherStatusChange(
                              STATUS_VOUCHER_BORROW_EN.PROCESSING
                            )
                          }
                        >
                          {STATUS_VOUCHER_BORROW_NAME.PROCESSING[LANGUAGE.VI]}
                        </Button>
                        </WithOrPermission>
                        
                        {/* ACTION  CANCEL BORROW */}

                      <WithOrPermission
                        permission={[POLICIES.UPDATE_STATUSBORROWPRODUCT]}
                      >
                        <Button
                          loading={isSubmitLoading}
                          danger
                          style={{ marginRight: "10px" }}
                          icon={<SaveOutlined />}
                          type="primary"
                          onClick={() =>
                            onWhVoucherStatusChange(
                              STATUS_VOUCHER_BORROW_EN.CANCELLED
                            )
                          }
                        >
                          {STATUS_VOUCHER_BORROW_NAME.CANCELLED[LANGUAGE.VI]}
                        </Button>
                      </WithOrPermission>
                      </>
                    )}

                  {/* ACTION RETURN PRODUCT */}
                    { get(productBorrow, "status") === STATUS_VOUCHER_BORROW_EN.PROCESSING && <WithOrPermission
                        permission={[POLICIES.UPDATE_STATUSBORROWPRODUCT]}
                      >
                        <Button
                          loading={isSubmitLoading}
                          style={{ marginRight: "10px" }}
                          icon={<SaveOutlined />}
                          type="primary"
                          onClick={() =>
                            onWhVoucherStatusChange(
                              STATUS_VOUCHER_BORROW_EN.COMPLETED
                            )
                          }
                        >
                          Hoàn trả
                        </Button>
                      </WithOrPermission>}

                </>
              )}
            </>
          )}
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
    </>
  );
}
