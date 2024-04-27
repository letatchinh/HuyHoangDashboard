import { Col, Form, FormItemProps, Input, Row, Select, Skeleton } from 'antd';
import { get } from 'lodash';
import { useMemo, useState } from 'react';
import { filterAcrossAccents } from '~/utils/helpers';
import subvn from '~/core/subvn';

const FormItem = Form.Item;
const { Option } = Select;
interface AddressFormSectionProps {
  isLoading?: boolean;
  form: any; // Replace 'any' with the actual type of your form
  addressType?: any;
  cityCode?: string | null;
  setCityCode?: any;
  districtCode?: string | null;
  setDistrictCode?: any;
  span?: number;
}
const FormItemProp : FormItemProps = {
  labelAlign : 'left',
}

const AddressCommonForm = (props: AddressFormSectionProps) => {
  const {
    isLoading,
    form,
    addressType = 'address',
    cityCode,
    setCityCode,
    districtCode,
    setDistrictCode,
  } = props;
  const cityId = Form.useWatch([addressType,"cityId"], form);
  const districtId = Form.useWatch([addressType,"districtId"], form);

  const cities = subvn.getProvinces();
  const [_cityCode, _setCityCode] = useState(cityCode); 
  const newCityCode = useMemo(() => cityCode ?? cityId, [cityCode, _cityCode,cityId]);
  
  const districts = subvn.getDistrictsByProvinceCode(newCityCode as string);
  
  const wards = subvn.getWardsByDistrictCode(districtCode ?? districtId as string);
  return (
    <>
      <Row gutter={48} align="middle" justify="space-between">
        <Col span={props?.span ?? 12}>
          <FormItem
          {...FormItemProp}
            label="Thành Phố/Tỉnh"
            name={[addressType, "cityId"]}
            // rules={[
            //   {
            //     required: true,
            //     message: "Xin vui lòng chọn Thành Phố/Tỉnh!",
            //   },
            // ]}
          >
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Select
                  onChange={(e) => {
                    setCityCode && setCityCode(e);
                    form && form.setFieldsValue && form.setFieldsValue({
                      addressType : {
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
              get(pre, addressType, "cityId") !== get(next, addressType, "cityId")
            }
            noStyle
          >
            {() => (
              <FormItem
              {...FormItemProp}
                label="Quận/Huyện"
                name={[addressType, "districtId"]}
                // rules={[
                //   {
                //     required: true,
                //     message: "Xin vui lòng chọn Quận/Huyện!",
                //   },
                // ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    disabled={!form.getFieldValue([addressType, "cityId"])}
                    onChange={(value) => {
                      setDistrictCode && setDistrictCode(value);
                      form && form.setFieldsValue && form.setFieldsValue({
                        addressType : {
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
              get(pre, addressType, "cityId") !== get(next, addressType, "cityId") ||
              get(pre, addressType, "districtId") !== get(next, addressType, "districtId")
            }
            noStyle
          >
            {() => (
              <FormItem
              {...FormItemProp}
                label="Phường/Xã"
                name={[addressType, "wardId"]}
                // rules={[
                //   {
                //     required: true,
                //     message: "Xin vui lòng chọn Phường/Xã!",
                //   },
                // ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    disabled={!form.getFieldValue([addressType, "districtId"])}
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
            name={[addressType, "street"]}
            // rules={[
            //   {
            //     required: true,
            //     message: "Xin vui lòng nhập tên đường",
            //   },
            // ]}
          >
            {isLoading ? <Skeleton.Input active /> : <Input />}
          </FormItem>
        </Col>
      </Row>
    </>
  );
};

export default AddressCommonForm;
