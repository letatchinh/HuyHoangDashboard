import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
type propsType = {
    onParamChange : (newParams:any) => void,
    value? : any
}
export default function DateForm({onParamChange,value}:propsType) : React.JSX.Element {
    const [form] = Form.useForm();
    const onValueChange = (value:any,values : {startDate : string,endDate : string}) => {
        
        const newDate : any = Object.values(value)[0];
        const key = Object.keys(value)[0];
        onParamChange({
            [key] : newDate ? dayjs(newDate).format('YYYY-MM-DD') : null
        })
        
    };
    useEffect(() => {
        const {startDate,endDate} = value || {};
        form.setFieldsValue({
            startDate : startDate && dayjs(startDate),
            endDate : endDate && dayjs(endDate),
        })
    },[value,form])
    return (
        <Form form={form} onValuesChange={onValueChange} layout='inline'>
            <Form.Item name={'startDate'} >
                <DatePicker placeholder='Ngày bắt đầu'/>
            </Form.Item>
            <Form.Item name={'endDate'}>
                <DatePicker placeholder='Ngày kết thúc'/>
            </Form.Item>
        </Form>
    )
}