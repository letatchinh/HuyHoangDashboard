import { Col, Form, Input, Row, Select, Skeleton } from 'antd';
import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { filterAcrossAccents } from '~/utils/helpers';
import subvn from '~/core/subvn';

const FormItem = Form.Item;
const { Option } = Select;
interface AddressFormSectionProps {
  isLoading?: boolean;
  form: any; // Replace 'any' with the actual type of your form
  cityCode?: string | null;
  setCityCode?: any;
  districtCode?: string | null;
  setDistrictCode?: any;
  span?: number;
  allowPhoneNumber?: boolean;
  allowEmail?: boolean;
}
const AddressFormSection = (props: AddressFormSectionProps) => {
  const {
    isLoading,
    form,
    cityCode,
    setCityCode,
    districtCode,
    setDistrictCode,
    allowPhoneNumber = true,
    allowEmail = true,
  } = props;
  const cities = subvn.getProvinces();
  const [_cityCode, _setCityCode] = useState(cityCode);
  const newCityCode = useMemo(() => cityCode, [cityCode, _cityCode]);
  const districts = subvn.getDistrictsByProvinceCode(newCityCode as string);
  const wards = subvn.getWardsByDistrictCode(districtCode as string);
  return (
    <>
      <Row gutter={48} align="middle" justify="space-between">
        <Col span={props?.span ?? 12}>
          <FormItem
            label="Thành Phố/Tỉnh"
            name={["address", "cityId"]}
            rules={[
              {
                required: true,
                message: "Xin vui lòng chọn Thành Phố/Tỉnh!",
              },
            ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Select
                  onChange={(e) => {
                    setCityCode(e)
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
                label="Quận/Huyện"
                name={["address", "districtId"]}
                rules={[
                  {
                    required: true,
                    message: "Xin vui lòng chọn Quận/Huyện!",
                  },
                ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    disabled={!form.getFieldValue(["address", "cityId"])}
                    onChange={setDistrictCode}
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
                label="Phường/Xã"
                name={["address", "wardId"]}
                rules={[
                  {
                    required: true,
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
            label="Đường phố"
            name={["address", "street"]}
            rules={[
              {
                required: true,
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
              label="Email"
              name="email"
              rules={[
                {
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
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^[0-9]{10,10}$/),
                  message: "Xin vui lòng nhập đúng số điện thoại!",
                },
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
