import { Button, DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';
import React, { useEffect } from 'react';
import { STATUS_BILLITEM } from '../constants';
type propsType = {
    lotNumber:any,
    expirationDate:any,
    status:any,
    onChangeStatusBillItem : (p:any) => void,
    id : string,
    isDisabledAll : boolean,
}

export default function FormLot({expirationDate,lotNumber,status,onChangeStatusBillItem,id,isDisabledAll}:propsType) : React.JSX.Element {
    const [form] = Form.useForm();
    const onFinish = (values:any) => {
        const submitData : any = {
                ...values,
                expirationDate : dayjs(get(values,'expirationDate')).format("YYYY-MM-DD"),
                id
        };
        onChangeStatusBillItem(submitData)
    };
    useEffect(() => {
        form.setFieldsValue({
            lotNumber,
            expirationDate : !!expirationDate ? dayjs(expirationDate) : null,
        })
    },[expirationDate,lotNumber]);
    return (
        <Form
        form={form}
        onFinish={onFinish}
        labelCol={{span : 8}}
        labelAlign="left"
        className='form-custom'
        >
            <Form.Item
            name={"lotNumber"}
            label="Lô"
            rules={[
                {
                    required : true,
                    message : "Vui lòng nhập lô!"
                }
            ]}
            >
                <Input placeholder='Vui lòng nhập lô'/>
            </Form.Item>

            <Form.Item
            name={"expirationDate"}
            label="Hạn sử dụng"
            rules={[
                {
                    required : true,
                    message : "Vui lòng chọn ngày hết hạn"
                }
            ]}
            >
                <DatePicker placeholder='Hạn sử dụng' format={"YYYY-MM-DD"}/>
            </Form.Item>
            <Button size='small' disabled={isDisabledAll || status !== STATUS_BILLITEM.PROCESSING} htmlType='submit' type='primary'>
                Cập nhật 
            </Button>
        </Form>
    )
}