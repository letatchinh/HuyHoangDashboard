import { ArrowUpOutlined, EditTwoTone } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { forIn, get } from 'lodash';
import React, { useMemo } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import Status from '~/components/common/Status/index';
import { formatter } from '~/utils/helpers';
import { STATUS_BILLITEM, STATUS_BILLITEM_LEVEL, STATUS_BILLITEM_VI } from '../constants';
import UpdateQuantity from './UpdateQuantity';
import useUpdateBillStore from '~/modules/sale/bill/storeContext/UpdateBillContext';
import BillModule from '~/modules/sale/bill';
import { PayloadSubmitUpdateBillItem, UpdateBillItem } from '../billItem.modal';
import FormLot from './FormLot';
import ExpandRowBillItem from './ExpandRowBillItem';
import { STATUS_BILL } from '../../bill/constants';
type propsType = {
    statusBill : any,
}

const CLONE_STATUS_BILLITEM_VI : any = STATUS_BILLITEM_VI;
const CLONE_STATUS_BILLITEM : any = STATUS_BILLITEM;
const CLONE_STATUS_BILLITEM_LEVEL : any = STATUS_BILLITEM_LEVEL;
export default function ListBillItem({statusBill}:propsType) : React.JSX.Element {
    const isDisabledAll = useMemo(() => statusBill === STATUS_BILL.CANCELLED, [statusBill]);
    const {bill,mutate} = useUpdateBillStore();
    const [isSubmitLoading,updateBillItem] = BillModule.hook.useUpdateBillItem(mutate);
    const {
      billItems
    } = bill || {};
    const getNextStatus = ({status,expirationDate,lotNumber}:{status:string,lotNumber?:any,expirationDate:any}) => {
        let nextStatus : any = null;
        let message;
        let typeError;
        let isSame = false;
        forIn(STATUS_BILLITEM,(value,key) => {
            
            if(value === STATUS_BILLITEM.CANCELLED) return;
            if(isDisabledAll){
                return;
            }
            if(nextStatus) return;
            if(isSame){
                nextStatus = value;
                if(value === STATUS_BILLITEM.PACKAGED && !expirationDate && !lotNumber){
                    message = "Chưa nhập lô và hạn sử dụng";
                    typeError = 'notLotNumber';
                }
                return
            }
            if(status === key){
                isSame = true;
            }
        });
        return {
            nextStatus,
            message,
            typeError,
        };
    };

    const onChangeStatusBillItem = (data : UpdateBillItem) => {
        const {id,...params} = data;
        const payloadSubmit : PayloadSubmitUpdateBillItem = {
            [id] : {
                ...params
            }
        };
        updateBillItem(payloadSubmit);
        
    }
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
                const status = get(record,'status','');
                const lotNumber = get(record,'lotNumber');
                const expirationDate = get(record,'expirationDate');
                const _id = get(record,'_id','');
                // const {nextStatus,message} = getNextStatus({status,lotNumber,expirationDate});
                return <div className="d-flex flex-column">
                    <Typography.Text>{get(record,'codeBySupplier')} - {get(product,'name','')}</Typography.Text>
                    {CLONE_STATUS_BILLITEM_LEVEL[status] >= 4 && <FormLot isDisabledAll={isDisabledAll} id={_id} onChangeStatusBillItem={onChangeStatusBillItem} status={status} lotNumber={lotNumber} expirationDate={expirationDate}/>}
                </div>
            },
        },
        {
            title : "Tình trạng",
            dataIndex : 'status',
            key : 'status',
            align : 'center',
            render(status, record, index) {
                const {nextStatus,message} = getNextStatus({status,lotNumber:get(record,'lotNumber'),expirationDate:get(record,'expirationDate')});
                return <div className='d-flex flex-column'>
                    <Status status={status} statusVi={CLONE_STATUS_BILLITEM_VI?.[status]}/>
                    {nextStatus && <Popconfirm
                    title={"Chuyển đổi sang trạng thái " + CLONE_STATUS_BILLITEM_VI[nextStatus]}
                    okText="Ok"
                    cancelText="Huỷ"
                    onConfirm={() => onChangeStatusBillItem({id : get(record,'_id',''),status : nextStatus})}
                    >
                        <Tooltip title={message}>
                        <Button icon={<ArrowUpOutlined />} block type='primary' disabled={isDisabledAll || !!message}>
                        {CLONE_STATUS_BILLITEM_VI[nextStatus]}
                    </Button>
                        </Tooltip>
                        </Popconfirm>}
                </div>
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
        //         // return <Button type='primary'>Cập nhật</Button>
        //         return <EditTwoTone />
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
        expandable={{
            expandedRowRender: (record: any) => (
              <ExpandRowBillItem status={get(record,'status')} historyStatus={get(record, "historyStatus")} />
            ),
            defaultExpandAllRows: true,
          }}
        />
    )
}