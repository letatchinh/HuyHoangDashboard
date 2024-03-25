import { Button, Checkbox, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { get, toUpper } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useGetPaymentVouchers, usePaymentVoucherPaging, usePaymentVoucherQueryParams, useUpdatePaymentVoucherParams } from '~/modules/paymentVoucher/paymentVoucher.hook';
import PaymentVoucherForm from '~/modules/paymentVoucher/components/PaymentVoucherForm';
import StatusTag from '~/modules/vouchers/components/StatusTag';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import POLICIES from '~/modules/policy/policy.auth';
import useCheckBoxExport from '~/modules/export/export.hook';
import { useDispatch } from 'react-redux';
import { vouchersSliceAction } from '~/modules/vouchers/redux/reducer';
type propsType = {
  listOptionSearch?: any[];
  keyword?: string;
  searchBy?: string;
  setQueryPayment?: any;
};
interface Column {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  align?: string;
  width?: number;
};

export default function PaymentVouchers(props: propsType): React.JSX.Element {
  const { listOptionSearch, keyword: keywordProps, searchBy ,setQueryPayment} = props;
  
  //HOOK
  const [query, onTableChange] = usePaymentVoucherQueryParams();
  const [keyword, {setKeyword, onParamChange}] = useUpdatePaymentVoucherParams(query, listOptionSearch)
  const [vouchers, isLoading] = useGetPaymentVouchers(query);
  console.log(vouchers,'vouchers')
  const paging = usePaymentVoucherPaging();
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_UNIT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const dispatch = useDispatch();

  //STATE
  const [id, setId] = useState<string | null>();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [refCollection, setRefCollection] = useState<string | undefined>();
  const [item, setItem] = useState<any>();

  useEffect(() => {
    setQueryPayment(query);
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
      title: 'Mã phiếu chi',
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
  
  return (
    <>
      <Table
        columns={columns as any}
        dataSource={vouchers}
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
        title={`Phiếu chi - ${item?.code}`}
        open={isOpenForm}
        onCancel={onClose}
        width={1366}
        destroyOnClose
      >
        <PaymentVoucherForm
          id={id}
          onClose={onClose}
          refCollection={refCollection}
        />
      </Modal>
    </>
  );
};