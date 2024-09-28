import { Form, Input, Select } from 'antd';
import React from 'react';
import BtnSubmit from '~/components/common/BtnSubmit';
import { useCreateScheduleItem, useUpdateScheduleItem } from '../scheduleItem.hook';
import { ScheduleItemBase } from '../scheduleItem.modal';
type propsType = {
    id? : any;
    scheduleId : string;
    onCancel : () => void;
}
export default function ScheduleItemForm({id,onCancel,scheduleId}:propsType) : React.JSX.Element {
    const [form] = Form.useForm();
    const [isSubmitLoading,onCreate] = useCreateScheduleItem(onCancel);
    const [,onUpdate] = useUpdateScheduleItem(onCancel);
    const onFinish = (values : ScheduleItemBase) => {
        const submitData = {
            ...values,
            scheduleId,
        }
        if(id){
            onUpdate({
                id,
                ...submitData
            })
        }else{
            onCreate({...submitData})
        }
    };

    return (
        <Form form={form} onFinish={onFinish} labelCol={{span : 4}} labelAlign="left">
            <Form.Item name={'name'} label="Tiêu đề">
                <Input />
            </Form.Item>    
            <Form.Item name={'contentType'} label="Loại tài liệu">
                <Select options={[
                    {label : "Văn bản",value : 'document'},
                    {label : "Video",value : 'video'},
                ]}/>
            </Form.Item>   
            <Form.Item name={'contentSrc'} label="Tài liệu">
                <Input />
            </Form.Item> 
            <BtnSubmit loading={isSubmitLoading} id={id}/>  
        </Form>
    )
}