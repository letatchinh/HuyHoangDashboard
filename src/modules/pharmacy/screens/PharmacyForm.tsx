import { Button, Col, Form, Input, Modal, Row, Select, Skeleton } from "antd";
import {
  useCreatePharmacy,
  useGetPharmacyId,
  useInitPharmacy,
} from "../pharmacy.hook";
import { useCallback, useEffect, useState } from "react";
import { useCities, useWards } from "~/modules/geo/geo.hook";
import { get } from "lodash";
import { filterAcrossAccents } from "~/utils/helpers";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import AddressFormSection from "~/components/common/AddressFormSection";

const FormItem = Form.Item;
const { Option } = Select;
interface Props {
  isOpen: any;
  onClose: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
}

export default function PharmacyForm({
  isOpen,
  onClose,
  id,
  handleUpdate,
}: Props) {
  const [form] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreatePharmacy();
  const [pharmacy, isLoading] = useGetPharmacyId(id);
  const initPharmacyProfile = useInitPharmacy(pharmacy, id);

  const [cityCode, setCityCode]: any = useState();
  const [districtCode, setDistrictCode]: any = useState();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      form.setFieldsValue(initPharmacyProfile);

      if (initPharmacyProfile) {
        const { address } = initPharmacyProfile;

        // if (address) {
        //   setSelectedCityCode(address.cityId);
        //   setSelectedDistrictCode(address.districtId);
        // }
      }
    }
  }, [initPharmacyProfile, id, form]);

  const onValuesChange = ({ address }: any) => {
    const shouldResetDistrictAndWards = address && address.cityId;
    if (shouldResetDistrictAndWards) {
      form.setFieldsValue({
        address: {
          districtId: null,
          wardId: null,
        },
      });
    }

    const shouldResetWards = address && address.districtId;
    if (shouldResetWards) {
      form.setFieldsValue({
        address: {
          wardId: null,
        },
      });
    }
  };

  const onFinish = useCallback(
    (values: any) => {
      if (id) {
        handleUpdate({ ...values, id: id });
      } else {
        handleCreate({ ...values });
      }
      onClose();
    },
    [handleCreate, handleUpdate, id]
  );
  return (
    <Modal
      open={isOpen}
      width={1100}
      footer={[]}
      onCancel={onClose}
      className="form-modal"
    >
      <div className="pharmacy-profile page-wraper form-page-content">
        <h4 style={{ margin: "20px 0 40px 20px" }}>
          {id ? " Cập nhật" : "Thêm mới"} nhà thuốc
        </h4>
        <div className="container-fluid">
          <Form
            form={form}
            autoComplete="off"
            onFinish={onFinish}
            scrollToFirstError
            requiredMark={false}
            onValuesChange={onValuesChange}
            labelCol={{ sm: 24, md: 24, lg: 6 }}
            wrapperCol={{ sm: 24, md: 24, lg: 18 }}
            labelAlign="left"
          >
            <FormItem
              label="Tên nhà thuốc"
              name="name"
              labelCol={{ sm: 24, md: 24, lg: 3 }}
              wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              rules={[
                { required: true, message: "Xin vui lòng nhập tên nhà thuốc" },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              label="Tên người đại diện"
              name="fullName"
              labelCol={{ sm: 24, md: 24, lg: 3 }}
              wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              rules={[
                { required: true, message: "Xin vui lòng nhập tên nhà thuốc" },
              ]}
            >
              <Input />
            </FormItem>
            <Row gutter={48} align="middle" justify="space-between">
              <Col span={12}>
                <FormItem
                  label="Số điện thoại"
                  name="phoneNumber"
                  // labelCol={{ sm: 24, md: 24, lg: 3 }}
                  wrapperCol={{ sm: 24, md: 24, lg: 21 }}
                  rules={[
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9]/),
                      message: "Xin vui lòng nhập đúng số điện thoại!",
                    },
                  ]}
                >
                  {isLoading ? (
                    <Skeleton.Input active />
                  ) : (
                    <Input maxLength={15} minLength={10} />
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Email"
                  name="email"
                  wrapperCol={{ sm: 24, md: 24, lg: 21 }}
                  rules={[{ type: "email" }]}
                >
                  <Input />
                </FormItem>
              </Col>
            </Row>
            <AddressFormSection
              form={form}
              cityCode={cityCode}
              setCityCode={setCityCode}
              districtCode={districtCode}
              setDistrictCode={setDistrictCode}
              allowPhoneNumber={false}
              allowEmail={false}
            />

            <Row className="form__submit-box">
              {isSubmitLoading ? (
                <Button disabled>Huỷ</Button>
              ) : (
                <Link to={PATH_APP.pharmacy.root}>
                  <Button onClick={onClose}>Huỷ</Button>
                </Link>
              )}

              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitLoading}
              >
                {id ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Row>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
