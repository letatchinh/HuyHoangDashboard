import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
type propsType = {
    onParamChange : (newParams:any) => void
}
export default function DateForm({onParamChange}:propsType) : React.JSX.Element {
    const [form] = Form.useForm();
    const onValueChange = (value:any,values : {startDate : string,endDate : string}) => {
        const newDate : any = Object.values(value)[0];
        const key = Object.keys(value)[0];
        onParamChange({
            [key] : dayjs(newDate).format('YYYY-MM-DD')
        })
        
    }
    return (
        <Form form={form} onValuesChange={onValueChange}>
            <Form.Item name={'startDate'}>
                <DatePicker />
            </Form.Item>
            <Form.Item name={'endDate'}>
                <DatePicker />
            </Form.Item>
        </Form>
    )
}