import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, Row, Space, Switch, message } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react'

import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useManufacturerPaging,useManufacturerParams,useGetManufacturerList, useManufacturerQueryParams } from '../manufacturer.hook';
import TableAnt from '~/components/Antd/TableAnt';
export default function Manufacturer() {
  const [showForm, setShowForm] = useState(false);
  const paging = useManufacturerPaging();
  const [query] = useManufacturerQueryParams();
  const [keyword,{setKeyword,onParamChange}]=useManufacturerParams(query);
  const [listManufacturer, loading] = useGetManufacturerList(query);
  const [id, setId] = useState(null);
  const [form] = Form.useForm();
  const callBack = () => {
    form.resetFields();
    setShowForm(false);
    setId(null);
  };
  const { t }: any = useTranslate();

  interface DataType {
    code: string;
    key: string;
    name: string;
    isAction:String,
  }

  const handleOpenForm = (id: any) => {
    setShowForm(true);
    setId(id);
  };

  const handleDelete = (id: any) => {
    
    
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setId(null);
  }

  const columns:ColumnsType<DataType> = [
    {
      title: 'Mã danh mục sản phẩm',
      dataIndex: 'code',
      width: '200px',
      align: 'center',
      render: (text: string) => <a href='#' style={{textDecoration:'none'}}>{text}</a>,
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
      render: (_, record) => (
        // <WithPermission permission={POLICY.DELETE_WAREHOUSE}>
        <Switch
        checked={record?.isAction === 'ACTIVE'}
          onChange={(value: any) => {
            console.log(value);
            if (record?.isAction) {
              message.error(
                'Không thể thực hiện thao tác này '
              );
            } else {
              // updateProductConfig({ action: value ? 'ACTIVE' : 'INACTIVE', id });
            }
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
      isAction:'ACTIVE',
      name: 'John Brown',
    },
    {
      code: 'DMSP00002',
      key: '2',
      isAction:'ACTIVE',
      name: 'Jim Green',
    },
    {
      code: 'DMSP00003',
      key: '3',
      isAction:'ACTIVE',
      name: 'Joe Black',
    },
  ];

  const onSearch = (value: string) => {
    onParamChange({ keyword: value });
  };

  return (
    <>
      <div>
        <Breadcrumb title={t('manufacturer')} />
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
              ...paging,
              onChange(page, pageSize) {
                onParamChange({ page, limit: pageSize });
              },
            }}
          />
        </WhiteBox>
      </div>
      <Modal
        visible={showForm}
        title="Thêm danh mục sản phẩm"
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        
      >
        
      </Modal>
    </>
  );
}
