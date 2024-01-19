import { Dropdown, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { MenuProps } from 'antd/lib/index';
import { get } from 'lodash';
import React from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import Status from '~/components/common/Status/index';
import { formatter } from '~/utils/helpers';
import { STATUS_BILLITEM_VI } from '../constants';
import useUpdateBillStore from '../storeContext/UpdateBillContext';
import UpdateQuantity from './UpdateQuantity';
type propsType = {

}

const items: MenuProps['items'] = [
  {
    label: 'Submit and continue',
    key: '1',
  },
];
const CLONE_STATUS_BILLITEM_VI : any = STATUS_BILLITEM_VI;
export default function ListBillItem(props:propsType) : React.JSX.Element {
    const {bill} = useUpdateBillStore();
    const {
      billItems
    } = bill || {};
    
    const columns : ColumnsType = [
        {
            title : "Mã sản phẩm",
            dataIndex : 'variant',
            key : 'variant.variantCode',
            align : 'center',
            render(variant, record, index) {
                return <Typography.Text>{get(variant,'variantCode','')}</Typography.Text>
            },
        },
        {
            title : "Tên sản phẩm",
            dataIndex : 'product',
            key : 'product.name',
            render(product, record, index) {
                return <Typography.Text>{get(record,'codeBySupplier')} - {get(product,'name','')}</Typography.Text>
            },
        },
        {
            title : "Tình trạng",
            dataIndex : 'status',
            key : 'status',
            align : 'center',
            render(status, record, index) {
                return <Status status={status} statusVi={CLONE_STATUS_BILLITEM_VI?.[status]}/>
            },
        },
        {
            title : "Số lượng",
            dataIndex : 'quantity',
            key : 'quantity',
            align : 'center',
            render(quantity, record, index) {
                return <UpdateQuantity value={quantity} onSave={() => {}}/>
            },
        },
        {
            title : "Giá bán",
            dataIndex : 'variant',
            key : 'variant',
            align : 'center',
            render(variant, record, index) {
                return <Typography.Text>{formatter(get(variant,'price'))}</Typography.Text>
            },
        },
        {
            title : "Chiết khấu",
            dataIndex : 'totalDiscount',
            key : 'totalDiscount',
            align : 'center',
            render(totalDiscount, record, index) {
                return <Typography.Text>{formatter(totalDiscount)}</Typography.Text>
            },
        },
        {
            title : "Số tiền còn lại",
            dataIndex : 'remainAmount',
            key : 'remainAmount',
            align : 'center',
            render(remainAmount, record, index) {
                return <Typography.Text strong>{formatter(remainAmount)}</Typography.Text>
            },
        },
        // {
        //     title : "Thao tác",
        //     dataIndex : '_id',
        //     key : 'action',
        //     align : 'center',
        //     render(_id, record, index) {
        //         return <Dropdown.Button
        //         type="primary"
        //         menu={{
        //           items,
        //         }}
        //       >
        //         Cập nhật
        //       </Dropdown.Button>
        //     },
        // },
        
    ]
    return (
        <TableAnt 
        bordered={true}
        dataSource={billItems}
        pagination={false}
        columns={columns}
        size='small'
        />
    )
}