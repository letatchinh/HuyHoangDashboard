import React, { memo, useEffect, useState } from 'react';
import { Col, DatePicker, Input, Row, Select } from 'antd';
import { get, head, transform } from 'lodash';
import moment, { Moment } from 'moment';
import { useFormTaskContext } from './WorkList';
import { useUpdateWorkListParams } from '~/hooks/workList';
import { convertQueryToObject } from '~/utils/helper';

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
  const [inputValue, setInputValue] = useState<[Moment | null, Moment | null]>([null, null]);
  const { boardData } = useFormTaskContext();
  const listStatusMap = get(boardData, 'listStatusConfig', [])?.reduce((result, item) => {
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

  const [searchBy, setSearchBy] = useState<string | undefined>(headValue);

  const [keyword, { setKeyword, onParamChange }] = useUpdateWorkListParams();

  useEffect(() => {
    const searchValue = convertQueryToObject();
    const keySearch = head(Object.keys(searchValue));
    setSearchBy(keySearch ?? headValue);
    setKeyword(searchValue[keySearch]);
  }, [setKeyword]);

  const handleDateChange = (dates: [Moment | null, Moment | null], dateStrings: [string, string]) => {
    const [startDate, endDate] = dateStrings;
    onParamChange({
      startDate: startDate || null,
      endDate: endDate || null,
    });
    setKeyword('date');
    setInputValue(dates);
  };

  return (
    <div
      className="menu-filter"
      style={{
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#f4f4f4e0',
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
            style={{ width: '100%' }}
            value={searchBy}
            options={listOptionsSearch}
            onChange={(e) => {
              setSearchBy(e);
              setKeyword('');
            }}
            dropdownMatchSelectWidth={false}
            bordered={false}
            allowClear
          />
        </Col>
        {searchBy === 'startDate' ? (
          <Col span={8}>
            <RangePicker
              value={inputValue}
              allowEmpty={[true, true]}
              style={{ width: '98%' }}
              onChange={handleDateChange}
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
              bordered={false}
            >
              {transform(
                listStatusMap,
                (result, value, key) => result.push(value),
                []
              )?.map((e) => (
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
              onPressEnter={(e) => {
                onParamChange({ [searchBy]: e.target.value });
              }}
              allowClear
              onChange={(e) => {
                setKeyword(e.target.value);
                if (!(e.target.value)) {
                  onParamChange({ [searchBy]: "" });
                }
              }}
              bordered={false}
            />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default memo(MenuFilter);
