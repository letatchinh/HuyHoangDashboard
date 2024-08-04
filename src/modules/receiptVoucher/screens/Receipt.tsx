import { Button, Checkbox, Modal, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useGetReceiptVouchers, useReceiptVoucherPaging, useReceiptVoucherQueryParams, useUpdateReceiptVoucherParams } from '~/modules/receiptVoucher/receiptVoucher.hook';
import ReceiptVoucherForm from '~/modules/receiptVoucher/components/ReceiptVoucherForm';
import StatusTag from '~/modules/vouchers/components/StatusTag';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import POLICIES from '~/modules/policy/policy.auth';
import useCheckBoxExport from '~/modules/export/export.hook';
import { useDispatch } from 'react-redux';
import { vouchersSliceAction } from '~/modules/vouchers/redux/reducer';
import TableAnt from '~/components/Antd/TableAnt';
import { PATH_APP } from '~/routes/allPath';
import { useLocation } from 'react-router-dom';
type propsType = {
  listOptionSearch?: any[];
  keyword?: string;
  searchBy?: string;
  setQueryReceipt?: any
};
interface Column {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  align?: string;
  width?: number;
};
export default function ReceiptVouchers(props: propsType): React.JSX.Element {
  const { listOptionSearch, keyword: keywordProps, searchBy,setQueryReceipt } = props;
  const { pathname } = useLocation();
  //HOOK
  const [query, onTableChange] = useReceiptVoucherQueryParams();
  
  const [keyword, {setkeyword, onParamChange}] = useUpdateReceiptVoucherParams(query, listOptionSearch);
  const paging = useReceiptVoucherPaging();
  const [vouchers, isLoading] = useGetReceiptVouchers(query);
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_UNIT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const dispatch = useDispatch();
  //STATE
  const [id, setId] = useState<string | null>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [refCollection, setRefCollection] = useState<string | undefined>();
  const [item, setItem] = useState<any>();

  useEffect(() => {
    setQueryReceipt(query);
  }, [query]);

  useEffect(() => {
    const newArrCheckBox: any = arrCheckBox;
    dispatch(vouchersSliceAction.updateArrCheckBox(newArrCheckBox))
  }, [arrCheckBox]);
  
  const onOpenForm = (id: string | null) => {
    setId(id);
    setIsOpenForm(true);
  };
  const onClose = () => {
    setId(null);
    setIsOpenForm(false);
  };

  const columns: Column[] = [
    {
      title: 'Mã phiếu thu',
      dataIndex: 'codeSequence',
      key: 'codeSequence',
      render: (text, record, index) => {
        return (
          <Button type='link' onClick={() => {
            onOpenForm(record?._id);
            setRefCollection(record?.refCollection?.toUpperCase());
            setItem(record);
          }}>
            {text}
          </Button>
        );
      },
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'issueNumber',
      key: 'issueNumber',
      render: text => text || "-",
    },
    {
      title: 'Nội dung',
      key: 'reason',
      dataIndex: 'reason',
    },
    {
      title: 'Số tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text, record, index) => text?.toLocaleString(),
    },
    // {
    //   title: 'Nhóm đối tượng',
    //   dataIndex: 'typeObj',
    //   key: 'typeObj',
    //   render: (text: any, record: any, index) => {
    //     if (record?.supplierReceive) {
    //       return 'Nhà cung cấp'
    //     };
    //     if (record?.pharmacyReceive) {
    //       return 'Nhà thuốc'
    //     };
    //     return '';
    //   },
    // },
    {
      title: 'Tên đơn vị',
      dataIndex: 'nameObj',
      key: 'nameObj',
      render: (text, record, index) => {
        if (record?.supplierReceive) {
          return record?.supplier?.name
        };
        if (record?.pharmacyReceive) {
          return record?.pharmaProfile?.name
        };
        return '';
      },
    },
    {
      title: 'Đơn hàng',
      dataIndex: 'bill',
      key: 'bill',
      align : 'center',
      render: (bill, record, index) => {
        const order = (get(record,'order'));
        if(bill){
          return <Typography.Link onClick={() => window.open(
            PATH_APP.bill.root + "?page=1&limit=10&keyword=" + get(bill, "codeSequence")
          )} strong>{get(bill,'codeSequence','')}</Typography.Link>
        };
        if(order){
          return <Typography.Link onClick={() => window.open(
            PATH_APP.orderSupplier.root + "?page=1&limit=10&keyword=" + get(order, "codeSequence")
          )} strong>{get(order,'codeSequence','')}</Typography.Link>
        }
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text, record, index) => dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'dateApproved',
      key: 'dateApproved',
      render: (text, record, index) => text && dayjs(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => <StatusTag status={text}/>
    },
    ...(
      canDownload ? [
        {
          title: 'Lựa chọn',
          key: '_id',
          width: 80,
          align: 'center' as any,
          render: (item: any, record: any) =>
          {
            const id = record._id;
            return (
              <Checkbox
                checked= {arrCheckBox?.includes(id)}
                onChange={(e)=>onChangeCheckBox(e.target.checked, id)}
          />)}
        },
      ]: []
    ) 
  ];
  // Add info Before Bill
  if(pathname === PATH_APP.vouchers.pharmacy){
    columns.splice(5,0,{
      title: 'Khách hàng B2B',
      dataIndex: 'pharmaProfile',
      key: 'pharmaProfile',
      render: (pharmaProfile, record, index) => get(pharmaProfile,'name',''),
    },)
  }else{
    columns.splice(5,0,{
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (supplier, record, index) => get(supplier,'name',''),
    },)
  }
  return (
    <>
    <TableAnt
      columns={columns as any}
        dataSource={vouchers}
        loading={isLoading}
        size='small'
        pagination={{
          ...paging,
          showTotal: (total)=> `Tổng cộng: ${total}`
        }}
        onChange={({current, pageSize}: any)=> onTableChange({current, pageSize})}
        scroll={{x : 1500}}
        stickyTop
    />
    <Modal
      footer={null}
      title={`Phiếu thu - ${item?.code}`}
      open={isOpenForm}
      onCancel={onClose}
      width={1366}
      destroyOnClose
    >
      <ReceiptVoucherForm
        id={id}
        onClose={onClose}
        refCollection = {refCollection}
      />
    </Modal>
  </>
  )
}