import { Typography } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import Vnd from '~/components/common/Vnd/index';
import { formatter } from '~/utils/helpers';
import { getValueOfLk } from '../lk.service';
type propsType = {
    record:any,
}
export default function RewardCumulative({record}:propsType) : React.JSX.Element {
    const itemReward = useMemo(() => get(record,'itemReward'),[record]);
    const value = useMemo(() => {
        return getValueOfLk(record);
    },[record]);
    return (
        <span>
        <Typography.Text strong>
            🎁 {itemReward ? `${get(itemReward,'name','')} SL: ${get(itemReward,'quantity',0)}` : formatter(value)} {" "}
        </Typography.Text>
        </span>
        
    )
}