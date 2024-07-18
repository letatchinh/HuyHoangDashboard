import { Button, Form, Input, Row, Select } from "antd";
import {
  useCreateSaleChannel,
  useGetSaleChannel,
  useGetSaleChannel_onlyGet,
  useInitSaleChannel,
  useResetSaleChannelAction,
} from "../saleChannel.hook";
import { useCallback, useEffect, useMemo, useState } from "react";
import { convertInitSaleChannel } from "../saleChannel.service";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import {
  useCustomerSegmentationQueryParams,
  useGetCustomerSegmentations,
} from "~/modules/customerSegmentation/customerSegmentation.hook";
import { get } from "lodash";

const FormItem = Form.Item;
interface Props {
  onClose?: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
  setDestroy?: any;
  readOnly?: boolean
}
const hookGetData = {
  readOnly : useGetSaleChannel_onlyGet,
  notReadOnly : useGetSaleChannel
}

export default function SaleChannelForm({
  onClose,
  id,
  handleUpdate,
  setDestroy,
  readOnly
}: Props) {
  const [form] = Form.useForm();
  const [query] = useCustomerSegmentationQueryParams();
  const [isSubmitLoading, handleCreate] = useCreateSaleChannel(() => {
    onClose && onClose();
    setDestroy && setDestroy(true);
  });

  const [saleChannel, isLoading] : any = readOnly ? hookGetData.readOnly() : hookGetData.notReadOnly(id)
  const [customerSegmentation] = useGetCustomerSegmentations(query);
  const initSalesChannel = useInitSaleChannel(saleChannel, id);
  const [selectedCustomerSegmentation, setSelectedCustomerSegmentation] =
    useState<string | undefined>();
  useResetSaleChannelAction();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initSaleChannel = convertInitSaleChannel(initSalesChannel);
      form.setFieldsValue(initSaleChannel);
    }
  }, [initSalesChannel, id, form]);

  const optionsSegmentation = useMemo(
    () =>
      customerSegmentation?.map((item: any) => ({
        label: get(item, "title"),
        value: get(item, "_id"),
        key: get(item, "division"),
      })),
    [customerSegmentation]
  );

  const onFinish = useCallback(
    (values: any) => {
      if (id) {
        handleUpdate({ ...values, _id: id });
      } else {
        handleCreate({ ...values });
      }
      form.resetFields()
    },
    [handleCreate, handleUpdate, id]
  );
  const options = [
    {
      label: "Trực tiếp",
      value: "DIRECT_DISCOUNT",
    },
    {
      label: "Gián tiếp",
      value: "INDIRECT_DISCOUNT",
    },
  ];

  const onTypeChange = (value: string) => {
    setSelectedCustomerSegmentation(value);
  };

  return (
    <div className="sale-channel page-wraper form-page-content">
      <div className="container-fluid">
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          scrollToFirstError
          requiredMark={false}
          // onValuesChange={onValuesChange}
          labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
          wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
          labelAlign="left"
        >
          <FormItem
            label="Phân hệ khách hàng"
            name="customerDivisionId"
            rules={[
              {
                required: true,
                message: "Xin vui lòng chọn phân hệ khách hàng",
              },
            ]}
          >
            <Select
              options={optionsSegmentation}
              allowClear
              onChange={onTypeChange}
              // readOnly={readOnly}
            />
          </FormItem>
          <FormItem label="Mã kênh bán hàng" name="code">
            <Input disabled readOnly={readOnly} />
          </FormItem>
          <FormItem
            label="Tên kênh bán hàng"
            name="title"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập tên kênh bán hàng",
              },
            ]}
          >
            <Input readOnly={readOnly} />
          </FormItem>
          <FormItem
            shouldUpdate={(pre, curr) =>
              pre.customerDivisionId !== curr.customerDivisionId
            }
            noStyle
          >
            {({ getFieldValue, setFieldValue }) => {
              const checkCustomerDivision =
                getFieldValue("customerDivisionId") !==
                get(customerSegmentation, "[0]._id");
              if (checkCustomerDivision) {
                setFieldValue("discount", "DIRECT_DISCOUNT");
              }
              return (
                <FormItem
                  label="Loại chiết khấu"
                  name="discount"
                  initialValue={"DIRECT_DISCOUNT"}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui lòng nhập loại chiết khấu",
                    },
                  ]}
                >
                  <Select
                    options={options}
                    defaultValue={"DIRECT_DISCOUNT"}
                    // disabled={customerSegmentation?.division === "B2B" ? true : false}
                    disabled={checkCustomerDivision}
                  />
                </FormItem>
              );
            }}
          </FormItem>
          <Row
            className="form__submit-box"
            style={{ justifyContent: "center" }}
          >
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Button onClick={onClose}>Huỷ</Button>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitLoading}
              style={{ marginLeft: 5 }}
              disabled={readOnly}
            >
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
