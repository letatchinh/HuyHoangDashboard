import { Button, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useGetReceiptVouchers, useReceiptVoucherPaging, useReceiptVoucherQueryParams, useUpdateReceiptVoucherParams } from '~/modules/receiptVoucher/receiptVoucher.hook';
import StatusTag from '../components/StatusTag';
import ReceiptVoucherForm from '~/modules/receiptVoucher/components/ReceiptVoucherForm';
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
};
export default function ReceiptVouchers(props: propsType): React.JSX.Element {
  const { listOptionSearch, keyword: keywordProps, searchBy,setQueryReceipt } = props;
  
  //HOOK
  const [query, onTableChange] = useReceiptVoucherQueryParams();
  const [keyword, {setkeyword, onParamChange}] = useUpdateReceiptVoucherParams(query, listOptionSearch);
  const paging = useReceiptVoucherPaging();
  const [vouchers, isLoading] = useGetReceiptVouchers(query);

  //STATE
  const [id, setId] = useState<string | null>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [refCollection, setRefCollection] = useState<string | undefined>();
  const [item, setItem] = useState<any>();

  useEffect(() => {
    setQueryReceipt(query);
  }, query);
  
// console.log(onParamChange)
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
  ];
  return (
    <>
    <Table
      columns={columns as any}
        dataSource={vouchers}
        loading={isLoading}
        size='small'
        pagination={{
          ...paging,
          showTotal: (total)=> `Tổng cộng: ${total}`
        }}
        onChange={({current, pageSize}: any)=> onTableChange({current, pageSize})}
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