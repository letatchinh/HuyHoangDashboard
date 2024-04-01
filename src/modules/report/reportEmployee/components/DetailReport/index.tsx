import { CheckCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Popconfirm, Typography } from 'antd';
import dayjs from 'dayjs';
import { compact, get, uniqBy } from 'lodash';
import React from 'react';
import WhiteBox from '~/components/common/WhiteBox';
import { EMPLOYEE_LEVEL, EMPLOYEE_LEVEL_VI } from '~/modules/employee/constants';
import { formatter } from '~/utils/helpers';
import { STATUS_REPORT_EMPLOYEE } from '../../constants';
import useDetailReportStore from '../../DetailReportContext';
import { useResetAction, useUpdateReportEmployee, useUpdateStatusReportEmployee } from '../../reportEmployee.hook';
import { SubmitDataUpdatePreview } from '../../reportEmployee.modal';
// import data from './data.json';
import TableDetailSalary from './TableDetailSalary';
import TableTargetsSelf from './TableTargetsSelf';
import TableTargetsTeam from './TableTargetsTeam';
type propsType = {
};
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI
export default function DetailReport(props:propsType) : React.JSX.Element {
    
    const {dataSourceDetailSalary,dataSourceTargetsSelf,dataSourceTargetsTeam,employeeLevel,data,onCancel,id} = useDetailReportStore();
    const [isSubmitLoading,updateReport] = useUpdateReportEmployee(onCancel);
    const [,updateStatus] = useUpdateStatusReportEmployee(onCancel);
    useResetAction();
    const onSave = () => {
        const submitData : SubmitDataUpdatePreview = {
            employeeId : get(data,'employee.employeeId',''),
            targetsSelf : {
                targetSupplier : get(data,'targetsSelf.targetSupplier',[])
            },
            targetsTeam : {
                targetSupplier : get(data,'targetsTeam.targetSupplier',[])
            },
            baseAdmin : get(data,'salary.baseAdmin',0)
        };
        updateReport({
            ...submitData,
            _id : id
        })
    }
    const onCompleted = () => {
        updateStatus({
            _id : id,
            status : STATUS_REPORT_EMPLOYEE.COMPLETED
        })
    }
    const onReturnNew= () => {
        updateStatus({
            _id : id,
            status : STATUS_REPORT_EMPLOYEE.NEW
        })
    }
    return (
        <div className='detailContainer'>
            <Divider><h5 style={{textAlign : 'center'}}>Chi tiết lương</h5></Divider>
            <WhiteBox>
            <Flex justify={'space-between'}>
                <div>
                    <p>Họ và tên: <Typography.Text strong>{get(data,'employee.fullName','')}</Typography.Text></p>
                    <p>Vị trí: <Typography.Text strong>{get(CLONE_EMPLOYEE_LEVEL_VI,employeeLevel,'')}</Typography.Text></p>
                    <p>Khu vực: <Typography.Text strong>{compact(uniqBy([data?.targetsTeam?.salesGroupName,data?.targetsSelf?.salesGroupName],(e) => get(e,'_id'))).join(' , ')}</Typography.Text></p>
                    <p>Lương cơ bản vùng: <Typography.Text strong>{formatter(get(data,'employee.baseSalaryValue',0))}</Typography.Text></p>
                </div>
                <h6 style={{textAlign : 'center'}}>Từ ngày: {dayjs(get(data,'startDate')).format("DD-MM-YYYY")} - đến ngày: {dayjs(get(data,'endDate')).format("DD-MM-YYYY")}</h6>
                {/* <div>
                    <p style={{textAlign : 'end'}}>Quản lý bán hàng: <Typography.Text strong>Nguyễn văn B</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Vị trí: <Typography.Text strong>ASM</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Số lượng nhân sự quản lý: <Typography.Text strong>3TDV</Typography.Text></p>
                </div> */}
            </Flex>
            </WhiteBox>

            <div className='scrollList detailContainer--detail'>
                {[EMPLOYEE_LEVEL.ASM,EMPLOYEE_LEVEL.LEADER].includes(employeeLevel) && <TableTargetsTeam dataSource={dataSourceTargetsTeam}/>}
                {[EMPLOYEE_LEVEL.CTV,EMPLOYEE_LEVEL.LEADER,EMPLOYEE_LEVEL.TDV].includes(employeeLevel) && <TableTargetsSelf dataSource={dataSourceTargetsSelf}/>}
                <TableDetailSalary dataSource={dataSourceDetailSalary}/>
            </div>
            <Flex justify={'end'} gap={10}>
            {get(data,'status') === STATUS_REPORT_EMPLOYEE.NEW ? <Popconfirm
            onConfirm={onCompleted}
            title="Xác nhận hoàn thành báo cáo sẽ không được chỉnh sửa thêm"
            >
            <Button icon={<CheckCircleOutlined />} size='large' style={{marginTop : 8}}>
                Hoàn thành báo cáo
            </Button>
            </Popconfirm> : <Popconfirm
            onConfirm={onReturnNew}
            title="Xác nhận chuyển sang trạng thái 'Mới' sẽ được cập nhật "
            >
            <Button icon={<CheckCircleOutlined />} size='large' style={{marginTop : 8}}>
                Chuyển về trạng thái mới
            </Button>
            </Popconfirm>}
            {get(data,'status') === STATUS_REPORT_EMPLOYEE.NEW && <Button loading={isSubmitLoading} onClick={onSave} icon={<SaveOutlined />} size='large' type='primary' style={{marginTop : 8}}>
                Lưu báo cáo
            </Button>}
            </Flex>
        </div>
    )
}