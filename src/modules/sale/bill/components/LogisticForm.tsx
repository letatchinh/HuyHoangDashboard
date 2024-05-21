import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import useUpdateBillStore from "../storeContext/UpdateBillContext";
import { serviceLogistic } from "../constants";
import subvn from "~/core/subvn";
import { compact } from "lodash";
import { SubmitCountLogisticFee } from "../bill.hook";
type propsType = {};

const typeSent = [
  {
    label: "Thu gom tận nơi",
    value: "TGTN",
  },
  {
    label: "Gửi hàng tại bưu cục",
    value: "GHBC",
  },
];
const CheckboxGroup = Checkbox.Group;
export default function LogisticForm(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { bill } = useUpdateBillStore();
  const { deliveryAddressId, deliveryAddress, pharmacy, } = bill;
  const [checkboxValue, setCheckboxValue] = useState <any[]>([]);

  useEffect(() => {
    if (deliveryAddressId) {
      const receiverCommuneName = subvn.getWardsByCode(deliveryAddressId?.wardId)?.name; 
      const receiverDistrictName = subvn.getDistrictByCode(deliveryAddressId?.districtId)?.name; 
      const receiverProvinceName = subvn.getCityByCode(deliveryAddressId?.cityId)?.name; 
      const receiverAddress = deliveryAddressId?.street;
      form.setFieldsValue({
        customerAddress: compact([receiverAddress, receiverCommuneName, receiverDistrictName, receiverProvinceName]).join(", "),
        receiverAddress
      });
    };
  }, [deliveryAddressId]);

  useEffect(() => {
    form.setFieldsValue({
      senderName: 'WorldPharma',
      receiverName: pharmacy?.fullName ?? pharmacy?.name,
      scope: 1, // Default postage is domestic
      receiverNational: 'VN' // Default country is Vietnam
    });
  }, [form, bill]);

  const onFinish = (values: any) => {
    const receiverCommuneName = subvn.getWardsByCode(deliveryAddressId?.wardId)?.name; 
    const receiverDistrictName = subvn.getDistrictByCode(deliveryAddressId?.districtId)?.name; 
    const receiverProvinceName = subvn.getCityByCode(deliveryAddressId?.cityId)?.name; 
    const submitData = SubmitCountLogisticFee(values, { receiverCommuneName, receiverDistrictName, receiverProvinceName });
    console.log(submitData,'submitData')
    try {
      form.validateFields();
    } catch (error) {
      
    }
  };
   
  const onChangeCheckBox = ( value: string) => {
    // set checkboxValue just have only one value
      setCheckboxValue([value]);
  };
 
    return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      scrollToFirstError={true}
      onFinish={onFinish}
    >
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item hidden name={"scope"} label={"Loại bưu gửi"}> 
            <Input value={1}/>
          </Form.Item>
          <Form.Item hidden name={"receiverNational"} label={"Mã quốc gia"}> 
            <Input value={'VN'}/>
          </Form.Item>
          <BaseBorderBox title={"Người gửi"}>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item name={"senderName"} label={"Người gửi"}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </BaseBorderBox>
          <BaseBorderBox title={"Người nhận"}>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item name={"receiverName"} label={"Người nhận"}>
                  <Input />
                </Form.Item>
                <Form.Item hidden name={"receiverAddress"}>
                  <Input readOnly/>
                </Form.Item>
                <Form.Item name={"customerAddress"} label={"Địa chỉ nhận"}>
                  <Input readOnly/>
                </Form.Item>
              </Col>
            </Row>
          </BaseBorderBox>
          <BaseBorderBox title={"Chọn dịch vụ"}>
            <Form.Item
              name={"serviceCode"}
              label={"Tên SPDV"}
              rules={[{ required: true , message : "Chọn dịch vụ"}]}
            >
              <Select
                placeholder="Chọn dịch vụ"
                options={serviceLogistic}
              />
            </Form.Item>
          </BaseBorderBox>
        </Col>
        <Col span={12}>
          <BaseBorderBox title={"Thông tin hàng hoá"}>
            <Form.Item name={"code"} label={"Mã đơn hàng"}>
              <Input placeholder="Mã đơn hàng" />
            </Form.Item>
            <Form.Item rules={[{ required: true, message: "Vui lòng nhập khối lượng" }]} name={"weight"} label={"Tổng khối lượng"}>
              <InputNumber
                min={0}
                addonAfter="gram"
                style={{ width: "100%" }}
                placeholder="Tổng khối lượng"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              />
            </Form.Item>
            <Form.Item label={"Kích thước (cm)"}>
              <Flex gap={10} style={{ width: "100%" }}>
                <Form.Item name={"length"} label={""}>
                  <InputNumber min={0} placeholder="Dọc" />
                </Form.Item>
                <Form.Item name={"width"} label={""}>
                  <InputNumber  min={0} placeholder="Ngang" />
                </Form.Item>
                <Form.Item name={"height"} label={""}>
                  <InputNumber  min={0} placeholder="Cao" />
                </Form.Item>
              </Flex>
            </Form.Item>
            <Form.Item name={"note"} label={"Nội dung"}>
              <Input.TextArea rows={2} placeholder="Nội dung" />
            </Form.Item>
          </BaseBorderBox>
          <BaseBorderBox title={"Yêu cầu thêm"}>
            <Form.Item name={"customer"} label={"Hình thức gửi hàng"}>
              <CheckboxGroup options={typeSent}  value={checkboxValue} onChange={(e: any)=> onChangeCheckBox(e)}/>
            </Form.Item>
          </BaseBorderBox>
        </Col>
        </Row>
        <Row align={'middle'} justify={'end'}>
              <Button type="primary" htmlType="submit">Tính cước</Button>
          </Row>
        {/* <Popconfirm
          onConfirm={onFinish}
          title={`Bạn có chắc chắn muốn tạo bưu gửi này với đơn vị vận chuyển`}
          okText="Tạo"
          cancelText="Huỷ"
        >
          <Row align={'middle'} justify={'end'}>
            <Col span={24}>
              <Button type="primary" htmlType="submit">Tạo bưu gửi</Button>
            </Col>
          </Row>
        </Popconfirm> */}
    </Form>
  );
}
