import { Col, Row, Space, Tag,Input, Button, Form,Modal } from 'antd';
import Search from 'antd/es/input/Search';
import Table, { ColumnsType } from 'antd/es/table';
import React,{ useEffect, useState } from 'react'
import Breadcrumb from '~/components/common/Breadcrumb'
import useTranslate from '~/lib/translation';
import { useGetlistProductConfig, useGetlistProductConfigById,useProductConfigQueryParams,useUpdateProductConfigParams,useDeleteProductConfig } from '../productConfig.hook';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProductConfigForm from './ProductConfigForm';
import WhiteBox from '~/components/common/WhiteBox';
import TableAnt from '~/components/Antd/TableAntd';
export default function ProductConfig() {
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState(null);
  const [form] = Form.useForm();  
  const callBack = ()=>{
    form.resetFields();
    setShowForm(false);
    setId(null);
  }
  const [query] =useProductConfigQueryParams();
  const [deleteProductConfig,] = useDeleteProductConfig(callBack);
  const [listProductConfig,isLoading] = useGetlistProductConfig();
  const [keyword, { setKeyword, onParamChange }] =useUpdateProductConfigParams(query);

  const {t}:any = useTranslate()
  const { Search } = Input;
  interface DataType {
    code:string;
    key: string;
    name: string;
  }

  const handleOpenForm = (id: any) => {
    setShowForm(true);
    setId(id);
  }
  const handleDelete = (id: any) => {
    // deleteProductConfig(id);
    console.log(id)
  }
  const columns: ColumnsType<DataType> = [
     
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
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '160px',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleOpenForm(record.key)}><EditOutlined /></a>
          <a style={{ color: 'red' }} onClick={() => handleDelete(record.key)}><DeleteOutlined /></a>
        </Space>
      ),
    },
    
  ];
  const data: DataType[] = [
    {
      code: 'DMSP00001',
      key:'1',
      name: 'John Brown',
    },
    {
      code: 'DMSP00002',
      key:'2',
      name: 'Jim Green',
    },
    {
      code: 'DMSP00003',
      key:'3',
      name: 'Joe Black',
    },
  ];
  const onSearch = (value: string) => {
    onParamChange({ keyword: value })

  };
  
  return (
    <>
       <div>
      <Breadcrumb title={t('product-config')} />
      <div className='product-config-action' style={{ marginBottom: 16 }}>
        <Row justify="space-between">
          <Col span={8}>
          <Search style={{height: '50px' }} value={keyword} onChange={e => setKeyword(e.target.value)}  onSearch={onSearch} enterButton />
          </Col>
          <Col>
            <Button onClick={()=>setShowForm(true)} type='primary'>Thêm mới</Button>
          </Col>
        </Row>
      </div>
      <WhiteBox>
        <TableAnt
          dataSource={data}
          // loading={isLoading}
          columns={columns}
          size='small'
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
    title="Thêm danh mục sản phẩm"
    onCancel={()=>setShowForm(false)}
    footer={null}
    width={1000}
    >
      <ProductConfigForm />
    </Modal>
    </>
 
 
  )
}
