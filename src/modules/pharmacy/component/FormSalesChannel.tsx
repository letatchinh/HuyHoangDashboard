import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { get } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import groupPharmacyApi from "~/modules/groupPharmacy/groupPharmacy.api";
import { useCreateGroupPharmacy } from "~/modules/groupPharmacy/groupPharmacy.hook";
import saleChannelApi from "~/modules/saleChannel/saleChannel.api";
import { useCreateSaleChannel } from "~/modules/saleChannel/saleChannel.hook";
import typePharmacyApi from "~/modules/typePharmacy/typePharmacy.api";
import { useCreateTypePharmacy } from "~/modules/typePharmacy/typePharmacy.hook";
import { filterOptionSlug } from "~/utils/helpers";
const FormItem = Form.Item;
const api = {
  saleChannel: saleChannelApi,
  typePharmacy: typePharmacyApi,
  groupPharmacy: groupPharmacyApi,
};

const ButtonAdd = ({ onClick }: { onClick: () => void }) => {
  return (
    <Col>
      <Button
        onClick={() => {
          onClick();
        }}
      >
        <PlusOutlined />
      </Button>
    </Col>
  );
};
const SelectType = ({
  onChange = () => {},
  name = "name",
  options = [],
  rulesRequiredMess = "error",
  disabled = false,
}) => {
  return (
    <Col flex={1}>
      <FormItem
        name={name}
        noStyle
        rules={[
          {
            required: true,
            message: rulesRequiredMess,
          },
        ]}
      >
        <Select
          showSearch
          filterOption={filterOptionSlug}
          onChange={onChange}
          disabled={disabled}
          options={options}
          allowClear
        />
      </FormItem>
    </Col>
  );
};

export default function FormSalesChannel(): React.JSX.Element {
  const [modal, contextModel] = Modal.useModal();
  const [form] = Form.useForm();
  const refModalNow = useRef<any>();
  const [saleChannels, setSalesChannels] = useState([]);
  const [typePharmacies, setTypePharmacies] = useState([]);
  const [groupPharmacies, setGroupPharmacies] = useState([]);
  const [refetch, setRefetch] = useState(0);
  const func = useCallback(() => {
    if(refModalNow.current?.destroy){
        refModalNow.current?.destroy();
    }
    form.resetFields();
    setRefetch((val) => val + 1);
  }, [refModalNow, form]);

  const [, handleCreateSaleChannel] = useCreateSaleChannel(func);
  const [, handleCreateTypePharmacy] = useCreateTypePharmacy(func);
  const [, handleCreateGroupPharmacy] = useCreateGroupPharmacy(func);

  useEffect(() => {
    const loadData = async () => {
      const saleChannel = api.saleChannel.search({
        // id: query.saleChannelId,
        keyword: "",
        division: "B2B",
      });
      const typePharmacy = api.typePharmacy.searchList({ keyword: "" });
      const groupPharmacy = api.groupPharmacy.search({ keyword: "" });

      const data = await Promise.all([
        saleChannel,
        typePharmacy,
        groupPharmacy,
      ]);
      const getOptions = (item: any) => ({
        value: item._id,
        label: item.title,
        rule: get(item, "salesChannelId", get(item, "customerGroupId", "")),
      });
      setSalesChannels(data[0].map(getOptions));
      setTypePharmacies(data[1].map(getOptions));
      setGroupPharmacies(data[2].map(getOptions));
    };
    loadData();
  }, [refetch]);

  const addNewSaleChannel = () => {
    function onFinish(value: {
      customerDivisionId: string;
      discount: "DIRECT_DISCOUNT" | "INDIRECT_DISCOUNT";
      title: string;
    }) {
      handleCreateSaleChannel(value);
    }

    refModalNow.current = modal.info({
      icon: <></>,
      width: 600,
      maskClosable: true,
      title: "Thêm mới Kênh bán hàng",
      content: <ContentCreateSalesChannel form={form} />,
      okText: "Tạo mới",
      cancelText: "Huỷ",
      onOk: (e) => {
        e.close = null;
        form
          .validateFields()
          .then(() => {
            onFinish(form.getFieldsValue());
          })
          .catch((error) => {
            form.scrollToField(error.errorFields[0].name[0]);
          });
      },
      afterClose: () => {
        // form.resetFields()
      },
      onCancel: () => {
        refModalNow.current.destroy();
      },
    });
  };
  const addNewCustomerGroup = () => {
    function onFinish(value: { salesChannelId: string; title: string }) {
      handleCreateTypePharmacy(value);
    }

    refModalNow.current = modal.info({
      icon: <></>,
      width: 600,
      maskClosable: true,
      title: "Thêm mới Nhánh khách hàng",
      content: (
        <ContentCreateCustomerGroup form={form} saleChannels={saleChannels} />
      ),
      okText: "Tạo mới",
      cancelText: "Huỷ",
      onOk: (e) => {
        e.close = null;
        form
          .validateFields()
          .then(() => {
            onFinish(form.getFieldsValue());
          })
          .catch((error) => {
            form.scrollToField(error.errorFields[0].name[0]);
          });
      },
      afterClose: () => {
        // form.resetFields()
      },
      onCancel: () => {
        refModalNow.current.destroy();
      },
    });
  };
  const addNewCustomerType = () => {
    function onFinish(value: {
      customerGroupId: string;
      title: string;
      desc: string;
    }) {
      handleCreateGroupPharmacy(value);
    }

    refModalNow.current = modal.info({
      icon: <></>,
      width: 600,
      maskClosable: true,
      title: "Thêm mới Nhóm khách hàng",
      content: (
        <ContentCreateCustomer form={form} saleChannels={typePharmacies} />
      ),
      okText: "Tạo mới",
      cancelText: "Huỷ",
      onOk: (e) => {
        e.close = null;
        form
          .validateFields()
          .then(() => {
            onFinish(form.getFieldsValue());
          })
          .catch((error) => {
            form.scrollToField(error.errorFields[0].name[0]);
          });
      },
      afterClose: () => {
        // form.resetFields()
      },
      onCancel: () => {
        refModalNow.current.destroy();
      },
    });
  };

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{ marginLeft: 0, marginRight: 0, width: "100%" }}
    >
      {contextModel}
      <Col span={12}>
        <FormItem label="Kênh bán hàng" shouldUpdate>
          {({ setFieldValue }) => {
            return (
              <Row style={{ width: "100%" }}>
                <SelectType
                  name={"salesChannelId"}
                  options={saleChannels}
                  onChange={() => {
                    setFieldValue("customerGroupId", null);
                    setFieldValue("customerId", null);
                  }}
                  rulesRequiredMess={"Xin vui lòng chọn kênh bán hàng"}
                />
                <ButtonAdd onClick={addNewSaleChannel} />
              </Row>
            );
          }}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem
          label="Nhánh khách hàng"
          shouldUpdate={(pre, current) => {
            return pre.salesChannelId !== current.salesChannelId;
          }}
        >
          {({ getFieldValue, setFieldValue }) => {
            return (
              <Row style={{ width: "100%" }}>
                <SelectType
                  name={"customerGroupId"}
                  options={typePharmacies.filter(
                    ({ rule }) => rule === getFieldValue("salesChannelId")
                  )}
                  onChange={() => {
                    setFieldValue("customerId", null);
                  }}
                  disabled={!!!getFieldValue("salesChannelId")}
                  rulesRequiredMess={"Xin vui lòng chọn nhánh khách hàng"}
                />
                <ButtonAdd onClick={addNewCustomerGroup} />
              </Row>
            );
          }}
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem
          label="Nhóm khách hàng"
          shouldUpdate={(pre, current) => {
            return pre.customerGroupId !== current.customerGroupId;
          }}
        >
          {({ getFieldValue }) => {
            return (
              <Row style={{ width: "100%" }}>
                <SelectType
                  name={"customerId"}
                  options={groupPharmacies.filter(
                    ({ rule }) => rule === getFieldValue("customerGroupId")
                  )}
                  disabled={!!!getFieldValue("customerGroupId")}
                  rulesRequiredMess={"Xin vui lòng chọn nhóm khách hàng"}
                />
                <ButtonAdd onClick={addNewCustomerType} />
              </Row>
            );
          }}
        </FormItem>
      </Col>
    </Row>
  );
}

const optionsContent = [
  {
    label: "Trực tiếp",
    value: "DIRECT_DISCOUNT",
  },
  {
    label: "Gián tiếp",
    value: "INDIRECT_DISCOUNT",
  },
];

function ContentCreateSalesChannel({ form }: any): React.JSX.Element {
  return (
    <Form
      form={form}
      autoComplete="off"
      requiredMark={false}
      labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
      wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
      labelAlign="left"
    >
      <FormItem
        label="Phân hệ khách hàng"
        name="customerDivisionId"
        hidden
        initialValue={"B2C"}
      >
        <Input value={"B2C"}></Input>
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
        <Input autoFocus />
      </FormItem>
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
        <Select options={optionsContent} defaultValue={"DIRECT_DISCOUNT"} />
      </FormItem>
    </Form>
  );
}

function ContentCreateCustomerGroup({ form, saleChannels }: any) {
  return (
    <Form
      form={form}
      autoComplete="off"
      scrollToFirstError
      requiredMark={false}
      labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
      wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
      labelAlign="left"
    >
      <FormItem
        name={"salesChannelId"}
        label="Kênh bán hàng"
        rules={[{ required: true, message: "Xin vui long chọn kênh bán hàng" }]}
      >
        <Select options={saleChannels}></Select>
      </FormItem>
      <FormItem
        label="Tên nhánh khách hàng"
        name="title"
        rules={[
          {
            required: true,
            message: "Xin vui lòng nhập tên nhánh khách hàng",
          },
        ]}
      >
        <Input />
      </FormItem>
    </Form>
  );
}

function ContentCreateCustomer({ form, saleChannels }: any) {
  return (
    <Form
      form={form}
      autoComplete="off"
      scrollToFirstError
      requiredMark={false}
      labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
      wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
      labelAlign="left"
    >
      <FormItem
        name={"customerGroupId"}
        label="Nhánh khách hàng"
        rules={[
          { required: true, message: "Xin vui long chọn nhánh khách hàng" },
        ]}
      >
        <Select options={saleChannels}></Select>
      </FormItem>
      <FormItem
        label="Nhóm khách hàng"
        name="title"
        rules={[
          {
            required: true,
            message: "Xin vui lòng nhập nhóm khách hàng",
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem label="Mô tả" name="desc">
        <TextArea />
      </FormItem>
    </Form>
  );
}
