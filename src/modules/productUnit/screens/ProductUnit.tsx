import {Button, Col, Form, Row, Select, SelectProps, Space, Switch } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import ModalAnt from '~/components/Antd/ModalAnt';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useTranslate from '~/lib/translation';
import {useGetlistproductUnit,useDeleteproductUnit, useproductUnitQueryParams, useUpdateproductUnitParams} from '../productUnit.hook';
type propsType = {

}
export default function ProductUnit(props:propsType) : React.JSX.Element {
    const callBack = () => {
        setShowForm(false);
      };
      const [query] =useproductUnitQueryParams();
      const [keyword,{setKeyword,onParamChange}] = useUpdateproductUnitParams(query)
    const [showForm, setShowForm] = useState(false);
    const [id, setId] = useState(null);
    const [listProductUnit, isLoading] = useGetlistproductUnit(query);
    const [, deleteProductConfig] = useDeleteproductUnit(callBack);
    const { t }: any = useTranslate();
    const [form] = Form.useForm();
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
    
                //   updateProductConfig({ status: value ? 'ACTIVE' : 'INACTIVE',id:record?._id });
                
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
                      <Button onClick={handleOpenFormCreate} type="primary">
                        Thêm mới
                      </Button>
                    </Col>
                  </Row>
                </div>
                <WhiteBox>
                  <TableAnt
                    dataSource={listProductUnit}
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
          <ModalAnt
            visible={showForm}
            title="Thêm danh mục sản phẩm"
            onCancel={handleCloseForm}
            footer={null}
            destroyOnClose
            width={800}
    
          >
            {/* <ProductConfigForm id={id} callBack={callBack} /> */}
          </ModalAnt>
        </div>
      );
    }
    