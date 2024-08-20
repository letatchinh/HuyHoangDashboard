import { Button, Col, ConfigProvider, DatePicker, Flex, Modal, Row, Tooltip } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { map, toUpper, truncate } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import Action from '~/components/common/Action';
import Breadcrumb from '~/components/common/Breadcrumb';
import WithPermission from '~/components/common/WithPermission';
import { useGetProfile } from '~/modules/auth/auth.hook';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import { REF_TYPE_OBJECT } from '../../constants';
import { useDeleteProductBorrow, useGetProductsBorrow, usePagingBorrow, useProductBorrowQueryParams, useResetActionBorrow, useUpdateProductParams } from '../../product.hook';
import { ProductBorrowContextProvider } from './ProductBorrowContext';
import ProductBorrowForm from './ProductBorrowForm';
import StatusTag from './Status';
import { FileTextOutlined } from '@ant-design/icons';
type propsType = {

};
const { RangePicker } = DatePicker;
const dateFormat = 'DD-MM-YYYY';

export default function ProductBorrow(props: propsType): React.JSX.Element {
  useResetActionBorrow();
  const [query] = useProductBorrowQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductParams(query);
  const [list, isLoading] = useGetProductsBorrow(query);
  const paging = usePagingBorrow();
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState<string | null>();
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [,onDelete] = useDeleteProductBorrow();
  const [date, setDate] = useState<any>();
  const profile = useGetProfile();

  const isDelete = useMatchPolicy(POLICIES.DELETE_BORROWPRODUCT);
  const canDelete = useMemo(()=> profile?.role === 'staff'?  isDelete: false,[profile]);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_BORROWPRODUCT);
  useEffect(() => {
    if (query?.startDate && query?.endDate) {
      setDate({
        startDate: query?.startDate,
        endDate: query?.endDate
      })
    };
  }, [query]);
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
      dataIndex: 'codeSequence',
      key: 'codeSequence',
      align: 'center',
      width: 100,
      render: (item: any, record: any, index) => <Button type='link' onClick={()=> openFormVoucher(record?._id)}>{item}</Button>
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
    {
      title: "File đính kèm",
      dataIndex: "files",
      key: "files",
      width: 150,
      align: "left",
      render(record) {
        const render = map(record, (item) => (
          <Tooltip title={item?.fileName?.length > 16 ? item?.fileName : ""}>
            <a download href={item?.url} target="_blank" style={{ cursor: "pointer"}}>
              <FileTextOutlined style={{ marginRight: '5px'}} />
              {truncate(item?.fileName, { 'length': 16 })}
            </a>
          </Tooltip>
        ))
        return <Flex vertical >{render}</Flex>
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 100,
      render: (status: any, record: any, index) => <StatusTag status= {status}/>
    },
    
    ...((canDelete || canUpdate) ? [{
      title: 'Thao tác',
      key: 'key',
      align: 'center' as any,
      width: 100,
      render: (_: any, record: any, index: number) => (
        <Action
          _id={record._id}
          canDelete = {canDelete}
          canUpdate = {canUpdate}
          title='phiếu mượn sản phẩm'
          onDetailClick={() => openFormVoucher(record._id)}
          onDelete = {onDelete}
        />
      )
    }]: []),

  ], [list]);
  return (
    <ProductBorrowContextProvider>
      <Breadcrumb title={'Quản lý mượn sản phẩm mượn'}/>
      <Row justify={"space-between"} className='row__search'>
        <Col span={12}>
          <Row gutter={12}>
            <Col span={12}>
              <Search
                allowClear
              placeholder='Tìm bất kỳ'
              onSearch={(e) => onParamChange({ keyword: e })}
              />
            </Col>
            <Col span={12}>
              <RangePicker
                format={dateFormat}
                allowClear = {false}
                allowEmpty={[false, false]}
                value={date && [dayjs(date?.startDate), dayjs(date?.endDate)]}
                onChange={(value) => {
                  const data = {
                    startDate: dayjs(value?.[0]).format("YYYY-MM-DD"),
                    endDate: dayjs(value?.[1]).format("YYYY-MM-DD"),
                  };
                  onParamChange({ startDate: data?.startDate, endDate: data?.endDate });
                  setDate(data);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={12}></Col>
            <WithPermission permission={POLICIES.WRITE_BORROWPRODUCT}>
              <Col span={12}>
                <Button
                  type='primary'
                  onClick={()=> openFormVoucher && openFormVoucher(null)}
                >Tạo phiếu mượn sản phẩm</Button>
              </Col>
            </WithPermission>
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
              showSizeChanger: true,
              onChange: (page: any, pageSize: any) => onParamChange({ page, limit: pageSize }),
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