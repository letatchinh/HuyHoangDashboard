import { Col, Form, FormItemProps, Input, Row, Select, Skeleton } from 'antd';
import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { filterAcrossAccents } from '~/utils/helpers';
import subvn from '~/core/subvn';
import { validatePhoneNumberAntd } from '~/utils/validate';

const FormItem = Form.Item;
const { Option } = Select;
interface AddressFormSectionProps {
  isLoading?: boolean;
  form: any; // Replace 'any' with the actual type of your form
  span?: number;
  allowPhoneNumber?: boolean;
  allowEmail?: boolean;
  required?: boolean;
}
const FormItemProp : FormItemProps = {
  labelAlign : 'left',
}

const AddressFormSection = (props: AddressFormSectionProps) => {
  const {
    isLoading,
    form,
    allowPhoneNumber = true,
    allowEmail = true,
    required = true
  } = props;
  const cityId = Form.useWatch(["address","cityId"], form);
  const districtId = Form.useWatch(["address","districtId"], form);

  const cities = subvn.getProvinces();
  const newCityCode = useMemo(() => cityId, [cityId]);
  
  const districts = subvn.getDistrictsByProvinceCode(newCityCode as string);
  
  const wards = subvn.getWardsByDistrictCode( districtId as string);
  return (
    <>
      <Row gutter={48} align="middle" justify="space-between">
        <Col span={props?.span ?? 12}>
          <FormItem
          {...FormItemProp}
            label="Thành Phố/Tỉnh"
            name={["address", "cityId"]}
            rules={[
              {
                required: required,
                message: "Xin vui lòng chọn Thành Phố/Tỉnh!",
              },
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Select
                  onChange={(e) => {
                    form && form.setFieldsValue && form.setFieldsValue({
                      address : {
                        districtId : null,
                        wardId : null
                      }
                    });
                  }}
                // disabled={isCitiesLoading}
                // loading={isCitiesLoading}
                showSearch
                filterOption={filterAcrossAccents}
              >
                {cities.map(({ code, name }: any) => (
                  <Option key={code} value={code}>
                    {name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>

        <Col span={props?.span ?? 12}>
          <FormItem
            shouldUpdate={(pre, next) =>
              get(pre, "address.cityId") !== get(next, "address.cityId")
            }
            noStyle
          >
            {() => (
              <FormItem
              {...FormItemProp}
                label="Quận/Huyện"
                name={["address", "districtId"]}
                rules={[
                  {
                    required: required,
                    message: "Xin vui lòng chọn Quận/Huyện!",
                  },
                ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    disabled={!form.getFieldValue(["address", "cityId"])}
                    onChange={(value) => {
                      form && form.setFieldsValue && form.setFieldsValue({
                        address : {
                          wardId : null
                        }
                      });
                    }}
                    showSearch
                    filterOption={filterAcrossAccents}
                  >
                    {districts.map(({ code, name }: any) => (
                      <Option key={code} value={code}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
          </FormItem>
        </Col>
      </Row>

      <Row gutter={48} align="middle" justify="space-between">
        <Col span={props?.span ?? 12}>
          <FormItem
            shouldUpdate={(pre, next) =>
              get(pre, "address.cityId") !== get(next, "address.cityId") ||
              get(pre, "address.districtId") !== get(next, "address.districtId")
            }
            noStyle
          >
            {() => (
              <FormItem
              {...FormItemProp}
                label="Phường/Xã"
                name={["address", "wardId"]}
                rules={[
                  {
                    required: required,
                    message: "Xin vui lòng chọn Phường/Xã!",
                  },
                ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    disabled={!form.getFieldValue(["address", "districtId"])}
                    showSearch
                    filterOption={filterAcrossAccents}
                  >
                    {wards.map(({ code, name }: any) => (
                      <Option key={code} value={code}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
          </FormItem>
        </Col>
        <Col span={props?.span ?? 12}>
          <FormItem
          {...FormItemProp}
            label="Đường phố"
            name={["address", "street"]}
            rules={[
              {
                required: required,
                message: "Xin vui lòng nhập tên đường",
              },
            ]}
          >
            {isLoading ? <Skeleton.Input active /> : <Input />}
          </FormItem>
        </Col>
      </Row>

      <Row gutter={48} align="middle" justify="space-between">
        {allowEmail && (
          <Col span={props?.span ?? 12}>
            <FormItem
            {...FormItemProp}
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Email bạn nhập không đúng định dạng!",
                },
              ]}
            >
              {isLoading ? <Skeleton.Input active /> : <Input />}
            </FormItem>
          </Col>
        )}
        {allowPhoneNumber && (
          <Col span={props?.span ?? 12}>
            <FormItem
            {...FormItemProp}
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
              ...validatePhoneNumberAntd
              ]}
            >
              {isLoading ? <Skeleton.Input active /> : <Input />}
            </FormItem>
          </Col>
        )}
      </Row>
    </>
  );
};

export default AddressFormSection;
