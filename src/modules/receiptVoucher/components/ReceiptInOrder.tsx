import React from 'react';
import { ColumnsType } from "antd/es/table/InternalTable";
import { Button, Modal, Table } from 'antd';
import StatusTag from '~/modules/vouchers/components/StatusTag';
import dayjs from 'dayjs';
import ReceiptVoucherForm from './ReceiptVoucherForm';
import { useGetReceiptVoucherByBillId, usePagingByBillId, useReceiptVoucherByBillIdQueryParams } from '../receiptVoucher.hook';
import { useVoucherInOrderStore } from '~/modules/vouchers/components/VoucherInOrder';

type propsType = {

}
export default function ReceiptInOrder(props: propsType): React.JSX.Element {
  const { billId } = useVoucherInOrderStore();
  const [query, onTableChange] = useReceiptVoucherByBillIdQueryParams(billId);
  const [data, isLoading] = useGetReceiptVoucherByBillId(query);
  const paging = usePagingByBillId();
  console.log(data,'data')
  const columns: ColumnsType = [
    {
      title: 'Mã phiếu thu',
      dataIndex: 'codeSequence',
      key: 'codeSequence',
      render: (text, record, index) => {
        return (
          <Button type='link' onClick={() => {
            // onOpenForm(record?._id);
            // setRefCollection(record?.refCollection?.toUpperCase());
            // setItem(record);
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
        dataSource={data || []}
        loading={isLoading}
        size='small'
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng: ${total}`
        }}
        onChange={({ current, pageSize }: any) => onTableChange({ current, pageSize })}
      />
      <Modal
        footer={null}
        // title={`Phiếu chi - ${item?.code}`}
        // open={isOpenForm}
        // onCancel={onClose}
        width={1366}
        destroyOnClose
      >
        <ReceiptVoucherForm
          // id={id}
          // onClose={onClose}
          // refCollection={refCollection}
        />
      </Modal>
    </>
  )
};