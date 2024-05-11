import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
type propsType = {
    onParamChange : (newParams:any) => void,
    initData ? : any
}
export default function MonthForm({onParamChange,initData}:propsType) : React.JSX.Element {
    
    const [form] = Form.useForm();
    const onValueChange = (value:any) => {
        const newDate : any = Object.values(value)[0];
        onParamChange({
            startDate : dayjs(newDate).startOf('month').format("YYYY-MM-DD"),
            endDate : dayjs(newDate).endOf('month').format("YYYY-MM-DD"),
        })
        
    };
    useEffect(() => {
        if(initData){
            form.setFieldsValue({...initData})
        }
    },[])
    return (
        <Form form={form} onValuesChange={onValueChange}>
            <Form.Item name={'month'} label="Chọn tháng">
                <DatePicker picker='month'/>
            </Form.Item>
        </Form>
    )
}