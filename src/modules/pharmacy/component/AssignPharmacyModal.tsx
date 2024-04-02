import { Button, Form } from 'antd';
import React, { useState } from 'react';
import ModalAnt from '~/components/Antd/ModalAnt';
import AssignPharmacyModalChildren from './AssignPharmacyModalChildren';
type propsType = {
    initDataSource : any[],
    setForm : (p:any) => void,
    id? : any
}
export default function AssignPharmacyModal({initDataSource,setForm,id}:propsType) : React.JSX.Element {
        const [open,setOpen] = useState(false);
        const onOpen = () => {
            setOpen(true);
        }
        const onClose = () => {
            setOpen(false);
        };
        
    return (
        <>
        <Form.Item name={'pharmacies'} hidden/>
        <Form.Item labelCol={{span : 10}} label="Nhà thuốc đảm nhiệm">
        <Button onClick={onOpen}>Xem danh sách nhà thuốc đảm nhiệm</Button>
        </Form.Item>
        <ModalAnt destroyOnClose width={1000} footer={null} open={open} onCancel={onClose}>
        <AssignPharmacyModalChildren id={id} setForm={setForm} initDataSource={initDataSource}/>
        </ModalAnt>
        </>
    )
}