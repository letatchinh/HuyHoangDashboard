import React, { useState } from 'react';
import { Col, Row, Space, Input, Button, Form, Modal, Table, Tag, Switch } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Breadcrumb from '~/components/common/Breadcrumb';
import useTranslate from '~/lib/translation';
import type { ColumnsType } from 'antd/es/table';
import {
  useGetlistProductConfig,
  useGetlistProductConfigById,
  useProductConfigQueryParams,
  useUpdateProductConfigParams,
  useUpdateProductConfig,
  useDeleteProductConfig,
} from '../productConfig.hook';
import ProductConfigForm from './ProductConfigForm';
import WhiteBox from '~/components/common/WhiteBox';
import TableAnt from '~/components/Antd/TableAntd';
import ColumnGroup from 'antd/es/table/ColumnGroup';

const { Search } = Input;

export default function ProductConfig() {
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState(null);
  const [form] = Form.useForm();
  const callBack = () => {
    form.resetFields();
    setShowForm(false);
    setId(null);
  };

  const [query] = useProductConfigQueryParams();
  const [,deleteProductConfig] = useDeleteProductConfig(callBack);
  const [isSubmitUpdateLoading,updateProductConfig] = useUpdateProductConfig(callBack);
  const [listProductConfig, isLoading] = useGetlistProductConfig();
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductConfigParams(query);

  const { t }: any = useTranslate();

  interface DataType {
    code: string;
    key: string;
    name: string;
  }

  const handleOpenForm = (id: any) => {
    setShowForm(true);
    setId(id);
  };

  const handleDelete = (id: any) => {
    deleteProductConfig(id);
    
  };

  const columns:ColumnsType<DataType> = [
    {
      title: 'Mã danh mục sản phẩm',
      dataIndex: 'code',
      width: '200px',
      align: 'center',
      key: 'code',
    },
    {
      title: 'Tên danh mục sản phẩm',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'activity',
      align: 'center',
      width: '120px',
      key: 'activity',
      render: (text: string) => (
        // <WithPermission permission={POLICY.DELETE_WAREHOUSE}>
        <Switch
          // checked={action === 'ACTIVE'}
          onChange={(value: any) => {
            console.log(value);
            // if (isAction) {
            //   toastr.error(
            //     'Không thể thực hiện thao tác này '
            //   );
            // } else {
              // updateProductConfig({ action: value ? 'ACTIVE' : 'INACTIVE', id });
            // }
          }}
          // loading={isSubmitUpdateLoading}
        />
      // </WithPermission>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '160px',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleOpenForm(record.key)}>
            <EditOutlined />
          </a>
          <a style={{ color: 'red' }} onClick={() => handleDelete(record.key)}>
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      code: 'DMSP00001',
      key: '1',
      name: 'John Brown',
    },
    {
      code: 'DMSP00002',
      key: '2',
      name: 'Jim Green',
    },
    {
      code: 'DMSP00003',
      key: '3',
      name: 'Joe Black',
    },
  ];

  const onSearch = (value: string) => {
    onParamChange({ keyword: value });
  };

  return (
    <>
      <div>
        <Breadcrumb title={t('product-config')} />
        <div className="product-config-action" style={{ marginBottom: 16 }}>
          <Row justify="space-between">
            <Col span={8}>
              <Search
                style={{ height: '50px', padding: '5px 11px' }}
                placeholder="Nhập bất kì để tìm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={onSearch}
                enterButton={<SearchOutlined />}
              />
            </Col>
            <Col>
              <Button onClick={() => setShowForm(true)} type="primary">
                Thêm mới
              </Button>
            </Col>
          </Row>
        </div>
        <WhiteBox>
          <TableAnt
            dataSource={data}
            // loading={isLoading}
            columns={columns}
            size="small"
            pagination={{
              // ...paging,
              onChange(page, pageSize) {
                // onParamChange({ page, limit: pageSize });
              },
            }}
          />
        </WhiteBox>
      </div>
      <Modal
        visible={showForm}
        title="Thêm danh mục sản phẩm"
        onCancel={() => setShowForm(false)}
        footer={null}
        
      >
        <ProductConfigForm id={id} callBack={callBack} />
      </Modal>
    </>
  );
}
