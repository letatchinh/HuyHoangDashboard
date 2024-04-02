import { DeleteOutlined, EditOutlined, InfoCircleTwoTone, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, SelectProps, Space, Switch, message } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useState } from 'react'

import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useManufacturerPaging, useManufacturerParams, useGetManufacturerList, useManufacturerQueryParams, useDeleteManufacturer, useUpdateManufacturer, useResetAction } from '../manufacturer.hook';
import TableAnt from '~/components/Antd/TableAnt';
import ModalAnt from '~/components/Antd/ModalAnt';
import ManufacturerForm from './ManufacturerForm';
import WithPermission from '~/components/common/WithPermission';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
export default function Manufacturer() {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState(null)
  const paging = useManufacturerPaging();
  const [query] = useManufacturerQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useManufacturerParams(query);
  const [listManufacturer, isLoading] = useGetManufacturerList(query);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_MANUFACTURER);
  const [id, setId] = useState(null);
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    form.resetFields();
    setId(null);
  }, []);
  const [, deleteManufacturer] = useDeleteManufacturer();
  const [form] = Form.useForm();
  const [isSubmitUpdateLoading, updateManufacturer] = useUpdateManufacturer(handleCloseForm);
  const { t }: any = useTranslate();
  useResetAction();
  interface DataType {
    code: string;
    key: string;
    name: string;
    description: string;
    _id: string;
    status: String,
    activity: any,
  };
  const handleOpenForm = useCallback((id?: any) => {
    if (id) { setId(id); }
    setShowForm(true);
  }, []);
  const handleDelete = (id: any) => {
    deleteManufacturer(id);

  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên hãng sản xuất',
      dataIndex: 'name',
      align: 'left',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      align: 'center',
      key: 'description',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'activity',
      align: 'center',
      width: '120px',
      key: 'activity',
      render: (_, record) => (
        <Switch
          checked={record?.status === 'ACTIVE'}
          onChange={(value: any) => {
            if (!canUpdate) return message.warning('Bạn không có quyền thay đổi');
            updateManufacturer({ status: value ? 'ACTIVE' : 'INACTIVE', id: record?._id });

          }}
          loading={isSubmitUpdateLoading}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '180px',
      render: (_, record) => (
        <>
          <Space size="middle">
            <WithPermission permission={POLICIES.UPDATE_MANUFACTURER}>
              <Button icon={<InfoCircleTwoTone />} type="primary" onClick={() => handleOpenForm(record?._id)}>
                Xem chi tiết
              </Button>
            </WithPermission>
            <WithPermission permission={POLICIES.DELETE_MANUFACTURER}>
              <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record?._id)}>
                Xóa
              </Button>
            </WithPermission>
          </Space>
        </>
      ),
    },
  ];
  const onSearch = (value: string) => {
    onParamChange({ ['keyword']: value });
  };
  const options: SelectProps['options'] = [
    {
      label: 'Hoạt động',
      value: 'ACTIVE',
    },
    {
      label: 'Không hoạt động',
      value: 'INACTIVE',
    },
  ];
  const pageSizeOptions = ['10', '20', '50', '100'];
  return (
    <>
      <div>
        <Breadcrumb title={t('Quản lý hãng sản xuất')} />
        <div>
          <div className='product-config-content' style={{ marginBottom: 16, display: 'flex', gap: '30px' }}>
            <WhiteBox style={{ width: '20%' }}>
              <label>Trạng thái:</label>
              <Select
                style={{ height: '50px', padding: '5px 0px', width: '100%' }}
                value={search}
                allowClear
                onChange={(e) => {
                  setSearch(e)
                  onParamChange({ ['status']: e });
                }}
                options={options}
              />
            </WhiteBox>
            <div style={{ width: '80%', height: '100%' }}>
              <div className="product-config-action" >
                <Row justify="space-between">
                  <Col span={8}>
                    <Search
                      style={{ height: '50px', padding: '5px 0px' }}
                      placeholder="Nhập bất kì để tìm..."
                      value={keyword}
                      onChange={(e) => (setKeyword(e.target.value))

                      }
                      allowClear
                      onSearch={onSearch}
                      enterButton={<SearchOutlined />}
                    />
                  </Col>
                  <Col>
                    <WithPermission permission={POLICIES.WRITE_MANUFACTURER}>
                      <Button icon={<PlusCircleOutlined />} onClick={() => handleOpenForm()} type="primary">
                        Thêm mới
                      </Button>
                    </WithPermission>
                  </Col>
                </Row>
              </div>
              <WhiteBox>
                <TableAnt
                  dataSource={listManufacturer}
                  loading={isLoading}
                  columns={columns}
                  size="small"
                  pagination={{
                    ...paging,
                    pageSizeOptions: pageSizeOptions,
                    showSizeChanger: true, // Hiển thị dropdown chọn kích thước trang
                    defaultPageSize: 10, // Kích thước trang mặc định
                    showTotal: (total) => `Tổng cộng: ${total} `,
                    onChange(page, pageSize) {
                      onParamChange({ page, limit: pageSize });
                    },
                  }}
                  stickyTop
                />
              </WhiteBox>
            </div>
          </div>
        </div>
        <ModalAnt
          open={showForm}
          title={id? 'Cập nhật hãng sản xuất':'Thêm hãng sản xuất'}
          onCancel={handleCloseForm}
          footer={null}
        // destroyOnClose
        >
          <ManufacturerForm id={id} setId={setId} callBack={handleCloseForm} updateManufacturer={updateManufacturer} />
        </ModalAnt>
      </div>
    </>
  );
}
