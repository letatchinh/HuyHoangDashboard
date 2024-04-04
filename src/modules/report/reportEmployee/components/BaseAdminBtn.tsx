import { Button, Form, InputNumber, Popover } from 'antd';
import React, { memo, useCallback, useState } from 'react';
import InputNumberAnt from '~/components/Antd/InputNumberAnt';
import { useUpdatePreviewReportEmployee } from '../reportEmployee.hook';
import { SubmitDataUpdatePreview } from '../reportEmployee.modal';
type propsType = {
 _id ? : string;
 employeeId : string,
}
 function BaseAdminBtn({_id,employeeId}:propsType) : React.JSX.Element {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const hide = useCallback(() => {
        setOpen(false);
      },[])
    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
    };
    const [isSubmitLoading,onPreviewUpdate] = useUpdatePreviewReportEmployee(hide);
    const onFinish = ({baseAdmin}:{baseAdmin : number}) => {
        const submitData : SubmitDataUpdatePreview = {
            _id,
            baseAdmin,
            employeeId,
        };
        onPreviewUpdate(submitData)
    }
    return (
        <Popover 
        trigger={['click']}
        open={open}
        onOpenChange={handleOpenChange}
        content={
            <Form
            form={form}
            onFinish={onFinish}
            >
                <Form.Item label="Nhập số lương muốn bổ sung" name={'baseAdmin'}>
                <InputNumberAnt addonAfter={<div>VND</div>}/>
                </Form.Item>
                <Button loading={isSubmitLoading} size='small' type='primary' htmlType='submit'>
                    Thêm
                </Button>
            </Form>
        }>
            <Button >
            Bổ sung lương thẩm quyền
        </Button>
        </Popover>
    )
}
export default memo(BaseAdminBtn)