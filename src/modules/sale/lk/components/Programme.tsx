import { ClockCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { DiscountFactory } from '~/modules/cumulativeDiscount/cumulativeDiscount.service';
type propsType = {
    sequence?: string,
    discount?:any
}
export default function Programme({sequence,discount}:propsType) : React.JSX.Element {
    const session = useMemo(() => {
        const [typeTime,time,year] : any = sequence?.split('_');
        switch (typeTime) {
            case 'T':
                return `Tháng ${time} năm ${year}`
            case 'Q':
                return `Quý ${time} năm ${year}`
            case 'ANY':
                return `Năm ${year}`
        
            default:
                return ''
        }
    },[sequence]);

    const dateApply = useMemo(() => {
        const DiscountMethod = new DiscountFactory();
        const applyTimeSheet = get(discount,'applyTimeSheet');
        const typeRepeat = get(discount,'typeRepeat');
        const applyTime = DiscountMethod.handleGetTimeApplyTimeSheet(applyTimeSheet,typeRepeat);
        return applyTime;
    },[discount])
    return (
        <div>
            <Typography.Text type='secondary'>
                Chu kì: {session}
            </Typography.Text>
            <br />
            <Typography.Text style={{fontSize : 12}}>
            <ClockCircleOutlined style={{color : 'gray'}}/> Nhận thưởng vào: {dayjs(get(dateApply,'gte')).format("DD-MM-YYYY")} - {dayjs(get(dateApply,'lte')).format("DD-MM-YYYY")}
            </Typography.Text>
            </div>
    )
}