import { Divider, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';
import React from 'react';
import WhiteBox from '~/components/common/WhiteBox';
import { EMPLOYEE_LEVEL, EMPLOYEE_LEVEL_VI } from '~/modules/employee/constants';
import { formatter } from '~/utils/helpers';
import useDetailReportStore from '../../DetailReportContext';
// import data from './data.json';
import TableDetailSalary from './TableDetailSalary';
import TableTargetsSelf from './TableTargetsSelf';
import TableTargetsTeam from './TableTargetsTeam';
type propsType = {
};
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI
export default function DetailReport(props:propsType) : React.JSX.Element {
    
    const {dataSourceDetailSalary,dataSourceTargetsSelf,dataSourceTargetsTeam,employeeLevel,data} = useDetailReportStore();
    return (
        <div className='detailContainer'>
            <Divider><h5 style={{textAlign : 'center'}}>Chi tiết lương</h5></Divider>
            <WhiteBox>
            <Flex justify={'space-between'}>
                <div>
                    <p>Họ và tên: <Typography.Text strong>{get(data,'employee.fullName','')}</Typography.Text></p>
                    <p>Vị trí: <Typography.Text strong>{get(CLONE_EMPLOYEE_LEVEL_VI,employeeLevel,'')}</Typography.Text></p>
                    <p>Khu vực: <Typography.Text strong>Đà nẵng</Typography.Text></p>
                    <p>Lương cơ bản vùng: <Typography.Text strong>{formatter(get(data,'salary.base',0))}</Typography.Text></p>
                </div>
                <h6 style={{textAlign : 'center'}}>Từ ngày: {dayjs(get(data,'startDate')).format("DD-MM-YYYY")} - đến ngày: {dayjs(get(data,'endDate')).format("DD-MM-YYYY")}</h6>
                <div>
                    <p style={{textAlign : 'end'}}>Quản lý bán hàng: <Typography.Text strong>Nguyễn văn B</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Vị trí: <Typography.Text strong>ASM</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Số lượng nhân sự quản lý: <Typography.Text strong>3TDV</Typography.Text></p>
                </div>
            </Flex>
            </WhiteBox>

            <div className='scrollList detailContainer--detail'>
                {[EMPLOYEE_LEVEL.ASM,EMPLOYEE_LEVEL.LEADER].includes(employeeLevel) && <TableTargetsTeam dataSource={dataSourceTargetsTeam}/>}
                {[EMPLOYEE_LEVEL.CTV,EMPLOYEE_LEVEL.LEADER,EMPLOYEE_LEVEL.TDV].includes(employeeLevel) && <TableTargetsSelf dataSource={dataSourceTargetsSelf}/>}
                <TableDetailSalary dataSource={dataSourceDetailSalary}/>
            </div>
            
        </div>
    )
}