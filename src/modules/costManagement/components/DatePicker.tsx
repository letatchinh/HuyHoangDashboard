import React, { useEffect, useState } from 'react';
import type { DatePickerProps, TimePickerProps } from 'antd';
import { DatePicker, Select, Space, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useQueryParams } from '~/utils/hook';
import { useCostManagementContext } from '../screens/CostManagement';

const { Option } = Select;

type PickerType = 'month' | 'quarter' | 'year';

interface Props{
  handleChange?: any;
  disabled?: boolean
};

interface PickerWithTypeProps {
  type: PickerType;
  onChange: TimePickerProps['onChange'] | DatePickerProps['onChange'];
  value: any;
  disabled?: boolean
};

const PickerWithType = ({
  type,
  onChange,
  value,
  disabled,
}: PickerWithTypeProps) => {

  return <DatePicker disabled = {disabled}  allowClear = {false} value={value} picker={type} onChange={onChange} style = {{width: '150px'}} />;

};

const DatePickerAnt = ({handleChange, disabled = false}:Props) => {

  const { date, setDate, setTypeDate, typeDate } = useCostManagementContext();

  const query = useQueryParams();
  const [value, setValue] = useState(query.get("startDate") ?? new Date());

  useEffect(() => {
    setValue(query.get("startDate") ?? new Date());
  }, [query]);
  useEffect(() => {
    setDate({
      startDate: dayjs(value).startOf(typeDate as any).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(value).endOf(typeDate  as any).format("YYYY-MM-DD HH:mm:ss"),
    });
  }, [value]);

  return (
    <Space>
      <Select disabled = {disabled}   style={{ width: 120 }} value={typeDate} onChange={(e) => {
        setTypeDate(e);
        handleChange({
          startDate: dayjs(value).startOf(typeDate  as any).format("YYYY-MM-DD HH:mm:ss"),
          endDate: dayjs(value).endOf(typeDate  as any).format("YYYY-MM-DD HH:mm:ss"),
        });
      }}>
        <Option value="month">Tháng</Option>
        {/* <Option value="quarter">Quý</Option> */}
        {/* <Option value="year">Năm</Option> */}
      </Select>
      <PickerWithType disabled = {disabled} value={dayjs(value)} type={typeDate as any} onChange={(value) => {
        setValue(value as any);
        handleChange({
          startDate: dayjs(value).startOf(typeDate  as any).format("YYYY-MM-DD HH:mm:ss"),
          endDate: dayjs(value).endOf(typeDate  as any).format("YYYY-MM-DD HH:mm:ss"),
        });
        }} />
    </Space>
  );
};

export default DatePickerAnt;