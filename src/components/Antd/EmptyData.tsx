import React from 'react';
import noData from "~/assets/images/noData.svg";

type propsType = {
    mess? : string,
}
export default function EmptyData({mess}:propsType) : React.JSX.Element {
    return (
        <div className='d-flex align-items-center justify-content-center flex-column gap-2'>
            <img src={noData} alt="no Data" style={{width : '50%',height : '50%',maxWidth : 150,maxHeight : 180}}/>
            {mess ?? "Danh sách trống"}
        </div>
    )
}