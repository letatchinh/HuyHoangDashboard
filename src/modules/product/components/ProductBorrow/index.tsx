import { Button, Col, ConfigProvider, Modal, Row } from 'antd';
import React, { useMemo, useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import ProductBorrowForm from './ProductBorrowForm';
import Breadcrumb from '~/components/common/Breadcrumb';
import { ColumnsType } from 'antd/es/table';
import {useGetProductsBorrow, usePagingBorrow, useProductBorrowQueryParams, useUpdateProductParams } from '../../product.hook';
import dayjs from 'dayjs';
import { REF_TYPE_OBJECT } from '../../constants';
import { toUpper } from 'lodash';
import StatusTag from './Status';
import Action from '~/components/common/Action';
import { ProductBorrowContextProvider } from './ProductBorrowContext';
type propsType = {

}
export default function ProductBorrow(props: propsType): React.JSX.Element {
  const [query] = useProductBorrowQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductParams(query);
  const [list, isLoading] = useGetProductsBorrow(query);
  const paging = usePagingBorrow();
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>();
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);

  const openFormVoucher = (id?: any) => {
    setIsOpenForm(true);
    setId(id);
  };

  const onCloseVoucher = () => {
    setIsOpenForm(false);
    setId(null);
  };
  
  const columns  : ColumnsType = useMemo(() => [
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      key: 'key',
      align: 'center',
      width: 100,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      width: 100,
      render: (item: any, record: any, index) => dayjs(item)?.format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdById',
      key: 'fullName',
      align: 'center',
      width: 100,
      render:(fullName : any)=>{
        return fullName?.fullName
      }
    },
    {
      title: 'Nhóm đối tượng',
      dataIndex: 'refColReceidverId',
      key: 'refColReceidverId',
      align: 'center',
      width: 100,
      render:(fullName : any)=>{
        return REF_TYPE_OBJECT[toUpper(fullName)]
      }
    },
    {
      title: 'Người mượn',
      dataIndex: 'receidverId',
      key: 'fullName',
      align: 'center',
      width: 100,
      render:(fullName : any)=>{
        return fullName?.fullName
      }
    },
    // {
    //   title: 'Sản phẩm',
    //   dataIndex: 'items',
    //   key: 'name',
    //   align: 'center',
    //   width: 100,
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      render: (status: any, record: any, index) => <StatusTag status= {status}/>
    },
    {
      title: 'Thao tác',
      key: 'key',
      align: 'center',
      width: 100,
      render: (_, record, index) => (
        <Action
          _id={record._id}
          canDelete
          canUpdate
          title='phiếu mượn sản phẩm'
          onDetailClick={() => openFormVoucher(record._id)}
          // onDelete
        />
      )
    },

  ], [list]);

  return (
    <ProductBorrowContextProvider>
      <Breadcrumb title={'Quản lý mượn sản phẩm'}/>
      <Row justify={"space-between"} className='row__search'>
        <Col span={12}></Col>
        <Col span={12}>
          <Row>
            <Col span={12}></Col>
            <Col span={12}>
              <Button
                type='primary'
                onClick={()=> openFormVoucher && openFormVoucher(null)}
              >Tạo phiếu mượn sản phẩm</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#C4E4FF',
            },
          },
        }}
      >
        <TableAnt
            stickyTop
            className="table-striped-rows-custom"
            columns={columns}
            dataSource={list}
            loading = {isLoading}
            size="small"
            bordered
            scroll={{ y: '60vh' }}
            pagination={{
            ...paging,
              showTotal: (total) => `Tổng cộng: ${total} `,
            showSizeChanger: true
            }}
          />
        </ConfigProvider>
        <Modal
          title= {`${id ? 'Cập nhật': 'Tạo mới'} phiếu mượn sản phẩm`}
          open={isOpenForm}
          onCancel={onCloseVoucher}
          footer={null}
          width= {1200}
          destroyOnClose
        >
        <ProductBorrowForm id={id} onCloseVoucher={onCloseVoucher} />
        </Modal>
    </ProductBorrowContextProvider>
  )
}