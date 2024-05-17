import React, { useState } from 'react';
import { Button, Typography, DatePicker } from 'antd';
import '../notification.style.scss'
import { zIndexHeader } from '../constants';
import { useLocation } from 'react-router-dom';
import { PATH_APP } from '~/routes/allPath';

const { RangePicker } = DatePicker;

export type RangeValueType<DateType> = [
    start: DateType | null | undefined,
    end: DateType | null | undefined
];

interface FilterByDayProps {
  inputValue?: any;
  setInputValue?: any;
  onChangeDate?: any;
};

const FilterByDay: React.FC<FilterByDayProps> = ({ inputValue, setInputValue ,onChangeDate}) => {
  return (
    <RangePicker
      popupStyle={{zIndex: zIndexHeader+1}}
      value={inputValue}
      allowEmpty={[true, true]}
      style={{ marginTop: '8px', width: '98%'}}
      onChange={(dates) => {
        onChangeDate && onChangeDate(dates)
        setInputValue(dates || [null, null]);
      }}
    />
  );
};

interface ButtonStatusProps {
  title?: string;
  keyActive: string | null;
  handleClick: (key: string | null) => void;
  status?: any;
}

const ButtonStatus: React.FC<ButtonStatusProps> = ({ title, keyActive, handleClick, status }) => (
  <Button onClick={() => handleClick(keyActive)} className={status === keyActive ? 'activeNotify' : ''} type='text'>
    <Typography.Text strong>{title}</Typography.Text>
  </Button>
);

interface GroupButtonNotifyProps {
    setStatus?: any;
    status?: any ;
    inputValue?: any;
    setInputValue?: any;
    onChangeDate?: any;
}

const GroupButtonNotify: React.FC<GroupButtonNotifyProps> = ({ setStatus, status, inputValue, setInputValue,onChangeDate }) => {
  const [filter, setFilter] = useState(false);
  const { pathname } = useLocation();
  const handleClick = (key: string | null) => {
    if (setStatus && typeof setStatus === 'function') {
      setStatus(key);
      if (typeof setInputValue === 'function') {
        setInputValue([null, null]);
      }
      if (key === 'filterDay') setFilter(true);
      else setFilter(false);
    }
  };

  return (
    <div className='GroupButtonNotify'>
      <div className='GroupButtonNotify__btn'>
        <ButtonStatus handleClick={handleClick} status={status} keyActive={null} title='Tất cả' />
        <ButtonStatus handleClick={handleClick} status={status} keyActive={'unread'} title='Chưa đọc' />
        <ButtonStatus handleClick={handleClick} status={status} keyActive={'filterDay'} title='Lọc theo ngày' />
      </div>
    
      {(filter && pathname !== PATH_APP.myNotification.root) ? <FilterByDay inputValue={inputValue} setInputValue={setInputValue} /> : null}
    </div>
  );
};

export default GroupButtonNotify;
