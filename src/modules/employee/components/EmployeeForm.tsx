import { Button, Col, Form, Input, Row, Select, Skeleton } from 'antd'
import React, { useState } from 'react'
import UploadImage from '~/components/common/Upload/UploadImage';
import AddressFormSection from '~/modules/geo/components/AddressFormSection';
import { useCreateEmployee, useUpdateEmployee } from '../employee.hook';


const { Option } = Select;

const FormItem = Form.Item;

const verticalLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
interface IProps {
  id: string,
  handleCloseModal: () => void
};

export default function EmployeeForm(
  props: IProps,
) {
  const [form] = Form.useForm();
  const { id, handleCloseModal } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  //address
  const [cityCode, setCityCode] = useState();
  const [districtCode, setDistrictCode] = useState();

  const [isUpdateLoading, handleUpdate] = useUpdateEmployee();
  const [isCreateLoading, handleCreate] = useCreateEmployee(handleCloseModal);

  const onFinish = (values: any) => {
    console.log(values,'values');
    const employee = {
      ...values,
      avatar: imageUrl,
    };

    if (id) {
      handleUpdate({
        ...employee,
        _id: id,
        // employeeNumber: initEmployee.employeeNumber
      });
    } else {
      handleCreate(employee);
    }
  };

  const onValuesChange = ({ address }: any) => {
  };

  return (
    <div className='employee-form'>
        <h4 style={{ marginRight: 'auto', paddingLeft: 27 }}>
          {`${!id ? 'Tạo mới ' : 'Cập nhật'}`} nhân viên
        </h4>
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          scrollToFirstError
          requiredMark={false}
          // initialValues={initEmployee}
          labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
          wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        >
          <Row
            gutter={48}
            align="middle"
            justify="space-between"
            className="employee-form__logo-row"
          >
            <Col span={12}>
              <Row gutter={36}>
                {/* <Col span={24}>
                  <FormItem
                    label="Tên nhân viên"
                    name="firstName"
                    rules={[
                      { required: true, message: 'Xin mời nhập tên nhân viên!' }
                    ]}
                  >
                    {isLoading ? <Skeleton.Input active /> : <Input />}
                  </FormItem>
                </Col> */}

                <Col span={24}>
                  <FormItem
                    label="Họ và tên nhân viên"
                    name="fullName"
                    rules={[
                      { required: true, message: 'Xin mời nhập tên nhân viên!' }
                    ]}
                  >
                    {isLoading ? <Skeleton.Input active /> : <Input />}
                  </FormItem>
                </Col>
              </Row>

              <FormItem label="Giới tính" name="gender">
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select>
                    <Option value="male" key="male">
                      Nam
                    </Option>
                    <Option value="female" key="female">
                      Nữ
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12} className="employee-form__upload-logo">
            <UploadImage
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
            />
            </Col>
        </Row>
        <AddressFormSection
          isLoading={isLoading}
          form={form}
          setCityCode={setCityCode}
          setDistrictCode={setDistrictCode}
          cityCode={cityCode}
          districtCode={districtCode}
        />
        <Row
            gutter={48}
            align="middle"
            justify="space-between"
            className="employee-form__logo-row"
        >
          <Col span={12}>
            <Row gutter={36}>
              <Col span={24}>
                <FormItem
                  label="CMND/CCCD"
                  name="idNumber"
                  rules={[
                    {
                      required: false,
                      pattern: new RegExp(/^[0-9]{9,12}$/),
                      message: 'Xin vui lòng nhập đúng số CMND/CCCD!'
                    }
                  ]}
                >
                  {isLoading ? <Skeleton.Input active /> : <Input />}
                </FormItem>
              </Col>
            </Row>

          </Col>
          {/* <Col></Col> */}
        </Row>
        <Row gutter={10} align="middle" justify={'center'}>
          <Col span={2}>
            <Button>Huỷ</Button>
          </Col>
          <Col span={4}>
          <Button type='primary' htmlType='submit'>{id ? 'Cập nhật' : 'Tạo mới'}</Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
};
