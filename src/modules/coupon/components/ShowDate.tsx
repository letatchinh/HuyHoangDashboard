import { Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
type propsType = {
    startDate?:any,
    endDate?:any,
}
export default function ShowDate({startDate,endDate}:propsType) : React.JSX.Element {
    if(endDate) return <Typography.Text type='secondary' className='coupon--middle__time'>HSD: {dayjs(endDate).format("DD.MM.YYYY HH:mm:ss")}</Typography.Text>;
    return <></>

}