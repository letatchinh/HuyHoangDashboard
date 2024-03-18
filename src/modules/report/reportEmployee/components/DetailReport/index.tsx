import { Divider, Flex, Typography } from 'antd';
import React from 'react';
import WhiteBox from '~/components/common/WhiteBox';
type propsType = {

}
export default function DetailReport(props:propsType) : React.JSX.Element {
    return (
        <div className='detailContainer'>
            <Divider><h5 style={{textAlign : 'center'}}>Chi tiết lương</h5></Divider>
            <WhiteBox>
            <Flex justify={'space-between'}>
                <div>
                    <p>Họ và tên: <Typography.Text strong>Nguyễn văn A</Typography.Text></p>
                    <p>Vị trí: <Typography.Text strong>Teamleader</Typography.Text></p>
                    <p>Khu vực: <Typography.Text strong>Đà nẵng</Typography.Text></p>
                </div>
                <div>
                    <p style={{textAlign : 'end'}}>Quản lý bán hàng: <Typography.Text strong>Nguyễn văn B</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Vị trí: <Typography.Text strong>ASM</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Số lượng nhân sự quản lý: <Typography.Text strong>3TDV</Typography.Text></p>
                </div>
            </Flex>
            </WhiteBox>

            <div className='detailContainer--detail'>
                
            </div>
        </div>
    )
}