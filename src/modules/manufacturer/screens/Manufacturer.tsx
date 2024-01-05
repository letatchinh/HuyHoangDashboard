import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select, SelectProps, Space, Switch, message } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react'

import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useManufacturerPaging,useManufacturerParams,useGetManufacturerList, useManufacturerQueryParams,useDeleteManufacturer } from '../manufacturer.hook';
import TableAnt from '~/components/Antd/TableAnt';
import ModalAnt from '~/components/Antd/ModalAnt';
import ManufacturerForm from './ManufacturerForm';
export default function Manufacturer() {
  const [showForm, setShowForm] = useState(false);
  const [search,setSearch]= useState(null) 
  const callBack = () => {
    form.resetFields();
    setShowForm(false);
    setId(null);
  };
  const paging = useManufacturerPaging();
  const [query] = useManufacturerQueryParams();
  const [keyword,{setKeyword,onParamChange}]=useManufacturerParams(query);
  const [listManufacturer, isLoading] = useGetManufacturerList(query);
  const [id, setId] = useState(null);
  const [,deleteManufacturer] = useDeleteManufacturer(callBack);
  const [form] = Form.useForm();
 
  const { t }: any = useTranslate();

  interface DataType {
    code: string;
    key: string;
    name: string;
    description:string;
    isAction:String,
  }

  const handleOpenForm = (id: any) => {
    setShowForm(true);
    setId(id);
  };

  const handleDelete = (id: any) => {
    deleteManufacturer({id})
    
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
      title: 'Tên nhà sản xuất',
      dataIndex: 'name',
      align: 'center',
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
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleOpenForm(record.key)}>
            Xem chi tiết
          </Button>
          <Button style={{ color: 'red' }} onClick={() => handleDelete(record.key)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      code: 'DMSP00001',
      key: '1',
      isAction:'ACTIVE',
      description:'Danh mục sản phẩm',
      name: 'John Brown',
    },
    {
      code: 'DMSP00002',
      key: '2',
      isAction:'ACTIVE',
      description:'Danh mục sản phẩm',
      name: 'Jim Green',
    },
    {
      code: 'DMSP00003',
      key: '3',
      isAction:'ACTIVE',
      description:'Danh mục sản phẩm',
      name: 'Joe Black',
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
    <>
      <div>
        <Breadcrumb title={t('manufacturer')} />
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
                  <Button onClick={() => setShowForm(true)} type="primary">
                    Thêm mới
                  </Button>
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
                  // ...paging,
                  onChange(page, pageSize) {
                    // onParamChange({ page, limit: pageSize });
                  },
                }}
              />
            </WhiteBox>
          </div>

        </div>
      </div>
      <ModalAnt
        visible={showForm}
        title="Thêm nhà sản xuất"
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose
        
      >
        <ManufacturerForm id={id} callBack={callBack}/>
      </ModalAnt>
      </div>
    </>
  );
}
