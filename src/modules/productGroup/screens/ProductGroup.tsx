import React, { useState } from 'react';
import { Col, Row, Space, Input, Button, Form, Modal, Table, Tag, Switch, message, Select, SelectProps } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Breadcrumb from '~/components/common/Breadcrumb';
import useTranslate from '~/lib/translation';
import type { ColumnsType } from 'antd/es/table';
import permissions from '../productGroup.auth';
import {
  useGetlistProductConfig,
  useGetlistProductConfigById,
  useProductConfigQueryParams,
  useUpdateProductConfigParams,
  useUpdateProductConfig,
  useDeleteProductConfig,
  useProductConfigPaging,
  useResetAction,
} from '../productGroup.hook';
import ProductGroupForm from './ProductGroupForm';
import WhiteBox from '~/components/common/WhiteBox';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import TableAnt from '~/components/Antd/TableAnt';
import ModalAnt from '~/components/Antd/ModalAnt';
import { get } from 'lodash';
import { useProductUnitQueryParams } from '~/modules/productUnit/productUnit.hook';
import WithOrPermission from '~/components/common/WithOrPermission';
import POLICIES from '~/modules/policy/policy.auth';

const { Search } = Input;

export default function ProductConfig() {
  const [showForm, setShowForm] = useState(false);
   const [query] = useProductConfigQueryParams();
  const [id, setId] = useState(null);
  const paging =useProductConfigPaging();
  const [form] = Form.useForm();
  const [search,setSearch]= useState(get(query,'status')||'');
  const callBack = () => {
    setShowForm(false);
  };
  const [, deleteProductConfig] = useDeleteProductConfig(callBack);
  const [isSubmitUpdateLoading, updateProductConfig] = useUpdateProductConfig(callBack);
  const [listProductConfig, isLoading] = useGetlistProductConfig(query);
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductConfigParams(query);
  const { t }: any = useTranslate();

  interface DataType {
    code: string;
    _id: string;
    name: string;
    isAction: boolean,
    note: string,
    status: string,
  }

  const handleOpenUpdate = (id: any) => {
    setShowForm(true);
    if (id) {
      setId(id);
    }
  };
  const handleOpenFormCreate = () => {
    setShowForm(true);
    // setId(null);
  };

  const handleDelete = (id: any) => {
    deleteProductConfig(id);

  };
  const handleCloseForm = () => {
    setShowForm(false);
    setId(null);
  }
  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã danh mục thuốc',
      dataIndex: 'code',
      width: '200px',
      align: 'center',
      render: (text: string) => <a href='#' style={{ textDecoration: 'none' }}>{text}</a>,
    },
    {
      title: 'Tên danh mục thuốc',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'center',
      key: 'note',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'status',
      align: 'center',
      width: '120px',
      key: 'status',
      render: (_, record) => (
        // <WithPermission permission={POLICY.DELETE_WAREHOUSE}>
        <Switch
          checked={record?.status === 'ACTIVE'}
          onChange={(value: any) => {
              updateProductConfig({ status: value ? 'ACTIVE' : 'INACTIVE',id:record?._id });
          }}
        loading={isSubmitUpdateLoading}
        />
        // </WithPermission>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleOpenUpdate(record?._id)}>
            Xem chi tiết
          </Button>
          <Button style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const onSearch = (value: string) => {
    onParamChange({ ['keyword']: value });
  };
  const options: SelectProps['options'] = [
    {
      label: 'Active',
      value: 'ACTIVE',
    },
    {
      label: 'InActive',
      value: 'INACTIVE',
    },
  ];

  return (
    <div className='product-config'>
      <Breadcrumb title={t('product-config')} />
      <div>
        <div className='product-config-content' style={{ marginBottom: 16, display: 'flex', gap: '30px' }}>
          {/* <div style={{ width: '20%',height: '100%' }}> */}
            <WhiteBox style={{width:'20%'}}>
              <label>Trang thái:</label>
              <Select
                style={{ height: '50px', padding: '5px 0px',width:'100%' }}
                value={search}
                // onChange={(e) => setKeyword(e.target.value)}
                // value={keyword}
                allowClear
                onChange={(e) => {
                  setSearch(e)
                  onParamChange({ ['status']: e });
                }}
                options={options}
              />
            </WhiteBox>
          {/* </div> */}
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
                    onSearch={onSearch}
                    enterButton={<SearchOutlined />}
                  />
                </Col>
                <Col>
                {/* <WithOrPermission permission={POLICIES.permissions[WRITE]}> */}
                      <Button icon={<PlusCircleOutlined />} onClick={handleOpenFormCreate} type="primary">
                    Thêm mới
                  </Button>
                {/* </WithOrPermission> */}
              
                </Col>
              </Row>
            </div>
            <WhiteBox>
              <TableAnt
                dataSource={listProductConfig}
                loading={isLoading}
                columns={columns}
                size="small"
                pagination={{
                  ...paging,
                  onChange(page, pageSize) {
                    onParamChange({ page, limit: pageSize });
                  },
                }}
              />
            </WhiteBox>
          </div>

        </div>
      </div>

      <ModalAnt
        open={showForm}
        title="Thêm danh mục sản phẩm"
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        width={800}

      >
        <ProductGroupForm id={id} callBack={callBack} />
      </ModalAnt>
    </div>
  );
}
