import { Button, Typography, DatePicker } from 'antd';
import { DatePickerType } from 'antd/es/date-picker';
import React, { useState } from 'react';
const { RangePicker } = DatePicker;

export type RangeValueType<DateType> = [
    start: DateType | null | undefined,
    end: DateType | null | undefined
];

interface FilterByDayProps {
  inputValue: any;
    setInputValue: any
    ;
}

const FilterByDay: React.FC<FilterByDayProps> = ({ inputValue, setInputValue }) => {
  return (
    <RangePicker
      value={inputValue}
      allowEmpty={[true, true]}
      style={{ marginTop: '8px', width: '98%' }}
      onChange={(dates) => {
        setInputValue(dates || [null, null]);
      }}
    />
  );
};

interface ButtonStatusProps {
  title: string;
  keyActive: string | null;
  handleClick: (key: string | null) => void;
  status: string | null;
}

const ButtonStatus: React.FC<ButtonStatusProps> = ({ title, keyActive, handleClick, status }) => (
  <Button onClick={() => handleClick(keyActive)} className={status === keyActive ? 'activeNotify' : ''} type='text'>
    <Typography.Text strong>{title}</Typography.Text>
  </Button>
);

interface GroupButtonNotifyProps {
    setStatus: any;
    status: string | null;
    inputValue: any;
    setInputValue: any;
}

const GroupButtonNotify: React.FC<GroupButtonNotifyProps> = ({ setStatus, status, inputValue, setInputValue }) => {
  const [filter, setFilter] = useState(false);

  const handleClick = (key: string | null) => {
    if (setStatus && typeof setStatus === 'function') {
      setStatus(key);
      setInputValue([null, null]);
      if (key === 'filterDay') setFilter(true);
      else setFilter(false);
    }
  };

  return (
    <div className='GroupButtonNotify'>
      <ButtonStatus handleClick={handleClick} status={status} keyActive={null} title='Tất cả' />
      <ButtonStatus handleClick={handleClick} status={status} keyActive={'unread'} title='Chưa đọc' />
      <ButtonStatus handleClick={handleClick} status={status} keyActive={'filterDay'} title='Lọc theo ngày' />
      {filter ? <FilterByDay inputValue={inputValue} setInputValue={setInputValue} /> : null}
    </div>
  );
};

export default GroupButtonNotify;
