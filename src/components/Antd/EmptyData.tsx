import { Typography } from 'antd';
import React from 'react';
import noData from "~/assets/images/noData.svg";
import { TextProps } from 'antd/es/typography/Text';
interface propsType extends TextProps{
    mess? : string,
}
export default function EmptyData({mess,...props}:propsType) : React.JSX.Element {
    return (
        <div className='d-flex align-items-center justify-content-center flex-column gap-2'>
            <img src={noData} alt="no Data" style={{width : '50%',height : '50%',maxWidth : 150,maxHeight : 180}}/>
            <Typography.Text {...props}>{mess ?? "Danh sách trống"}</Typography.Text>
            <p style={{fontSize : 12}}>(hoặc kiểm tra lại bộ tìm kiếm)</p>
        </div>
    )
}