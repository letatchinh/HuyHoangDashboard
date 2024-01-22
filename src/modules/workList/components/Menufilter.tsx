import { Col, DatePicker, Input, Row, Select } from 'antd';
import { Dayjs } from 'dayjs';
import { get, head, transform } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { convertQueryToObject } from '~/utils/helpers';
import { useFormTaskContext } from '../screens/WorkList';
import { useUpdateWorkListParams } from '../workList.hook';
const { RangePicker } = DatePicker;
const listOptionsSearch = [
  { value: 'assignUser', label: 'Tên người tạo' },
  { value: 'name', label: 'Tên công việc' },
  { value: 'statusId', label: 'Trạng thái công việc' },
  { value: 'startDate', label: 'Ngày tạo' },
  { value: 'code', label: 'Mã công việc' },
];
const headValue = head(listOptionsSearch)?.value;
const MenuFilter = () => {
//   const [inputValue, setInputValue] = useState<[Moment | null, Moment | null]>([null, null]);
  const { boardData } = useFormTaskContext();
  const listStatusMap = get(boardData, 'listStatusConfig', [])?.reduce((result:any, item:any) => {
    result[item._id] = {
      _id: item._id,
      value: item?.value,
      backgroundColor: item.backgroundColor,
      color: item.color,
      name: item.value,
      justAdmin: item.justAdmin,
    };
    return result;
  }, {});
  const [searchBy, setSearchBy] = useState<any>(headValue);
  const [keyword, { setKeyword, onParamChange }] = useUpdateWorkListParams();
  useEffect(() => {
    const searchValue = convertQueryToObject();
    const keySearch:any = head(Object.keys(searchValue));
    setSearchBy(keySearch ?? headValue);
    setKeyword(searchValue[keySearch]);
  }, [setKeyword]);
  const [inputValue, setInputValue] = React.useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const onRangeChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: string[]) => {
    if (dates) {
      const [startDate, endDate] = dateStrings;
      onParamChange({
        startDate: startDate || null,
        endDate: endDate || null,
      });
      setKeyword('date');
      setInputValue(dates);
    }
    else {
      onParamChange({
        startDate: null,
        endDate: null,
      });
      setInputValue([null, null]);
    }
  };

  return (
    <div
      className="menu-filter"
      style={{
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        margin: '10px 5px',
        padding: '10px',
        alignItems: 'center',
        height: 'auto',
        border: '1px solid #d9d9d9',
      }}
    >
      <span
        style={{
          color: '#000000',
          display: 'flex',
          justifyContent: 'flex-end',
          fontSize: '20px',
        }}
      ></span>
      <Row gutter={8} style={{ width: '100%' }}>
        <Col span={4}>
          <Select
            style={{ width: '100%',outline:'black' }}
            value={searchBy}
            options={listOptionsSearch}
            onChange={(e) => {
              setSearchBy(e);
              setKeyword('');
            }}
            dropdownMatchSelectWidth={false}
            // bordered={false}
            allowClear
          />
        </Col>
        {searchBy === 'startDate' ? (
          <Col span={8}>
            <RangePicker
              value={inputValue}
              allowEmpty={[true, true]}
              style={{ width: '98%' }}
              allowClear
              onChange={onRangeChange}
            />
          </Col>
        ) : searchBy === 'statusId' ? (
          <Col span={8}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn trạng thái"
              optionLabelProp="label"
              allowClear
              value={keyword ? keyword.split(',') : []}
              onChange={(e) => {
                onParamChange({ [searchBy]: e?.join(',') });
                setKeyword(e?.join(','));
              }}
              dropdownMatchSelectWidth={false}
              // bordered={false}
            >
              {transform(
                listStatusMap,
                (result:any, value, key) => result.push(value),
                []
              )?.map((e:any) => (
                <Select.Option key={get(e, '_id', '')} value={get(e, '_id', '')} label={get(e, 'value', '')}>
                  <p style={{ color: `${e.backgroundColor}` }}>{get(e, 'value')}</p>
                </Select.Option>
              ))}
            </Select>
          </Col>
        ) : (
          <Col span={20}>
            <Input.Search
              value={keyword}
              placeholder={`Nhập để ${listOptionsSearch
                ?.find((item) => item?.value === searchBy)
                ?.label.toLowerCase()} tìm...`}
              style={{ maxWidth: '500px' }}
              onPaste={(e) => {
                if (!!e.clipboardData.getData('text/plain')) onParamChange({ [searchBy]: keyword + e.clipboardData.getData('text/plain') });
              }}
              enterButton
              onSearch={(e) => {
                onParamChange({ [searchBy]: e });
              }}
              onPressEnter={(e:any) => {
                onParamChange({ [searchBy]: e.target.value });
              }}
              allowClear
              onChange={(e) => {
                setKeyword(e.target.value);
                if (!(e.target.value)) {
                  onParamChange({ [searchBy]: "" });
                }
              }}
              // bordered={false}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default memo(MenuFilter);
