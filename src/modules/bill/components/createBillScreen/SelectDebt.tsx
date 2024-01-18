import { Form, Select } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import useCreateBillStore from '~/store/createBillContext';
import { DebtType } from '../../bill.modal';
type propsType = {

}
export default function SelectDebt(props:propsType) : React.JSX.Element {
    const {debt} = useCreateBillStore();

    const options = useMemo(() => debt?.map((d:DebtType) => ({
        label : get(d,'name'),
        value : get(d,'key'),
    })),[debt])
    return (
        <Form.Item
        name={"debtType"}
        label="hình thức công nợ"
        >
            <Select options={options} disabled/>
        </Form.Item>
    )
}