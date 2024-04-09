import { Space, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
type propsType = {
  data? : any
}
export default function DateTimeTable({data}:propsType) : React.JSX.Element {
  return (
    <>
      <Typography.Text style={{display : 'block'}} strong>{dayjs(data).format('DD/MM/YYYY')}</Typography.Text>
      <Typography.Text style={{display : 'block'}} strong>{dayjs(data).format('HH:mm')}</Typography.Text>
    </>
  );
};