import { Button, Col, ConfigProvider, Modal, Row } from 'antd';
import React, { useMemo, useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import ProductBorrowForm from './ProductBorrowForm';
import Breadcrumb from '~/components/common/Breadcrumb';
import { ColumnsType } from 'antd/es/table';
import {useGetProductsBorrow, usePagingBorrow, useProductBorrowQueryParams, useUpdateProductParams } from '../../product.hook';
type propsType = {

}
export default function ProductBorrow(props: propsType): React.JSX.Element {
  const [query] = useProductBorrowQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductParams(query);
  const [list, isLoading] = useGetProductsBorrow(query);
  const paging = usePagingBorrow();

  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>();
  const openForm = (id?: string | null) => {
    setIsOpen(true);
    setId(id);
  };

  const onClose = () => {
    setIsOpen(false);
    setId(null);
  };

  console.log(list,'list')
  
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
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdById',
      key: 'fullName',
      align: 'center',
      width: 100,
    },
    {
      title: 'Người mượn',
      dataIndex: 'receidverId',
      key: 'fullName',
      align: 'center',
      width: 100,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      key: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: 'Thao tác',
      key: 'key',
      align: 'center',
      width: 100,
    },

  ], [list]);
  return (
    <>
      <Breadcrumb title={'Quản lý mượn sản phẩm'}/>
      <Row justify={"space-between"} className='row__search'>
        <Col span={12}></Col>
        <Col span={12}>
          <Row>
            <Col span={12}></Col>
            <Col span={12}>
              <Button
                type='primary'
              onClick={() => openForm(null)}
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
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width= {1200}
        destroyOnClose
      >
        <ProductBorrowForm/>
      </Modal>
    </>
  )
}