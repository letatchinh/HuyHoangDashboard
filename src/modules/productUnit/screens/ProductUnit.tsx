import {Button, Col, Form, Row, Select, SelectProps, Space, Switch } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useState } from 'react';
import ModalAnt from '~/components/Antd/ModalAnt';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import { SearchOutlined, DeleteOutlined, EditOutlined,InfoCircleTwoTone,PlusCircleOutlined } from '@ant-design/icons';
import useTranslate from '~/lib/translation';
import {useGetlistProductUnit,useDeleteProductUnit, useProductUnitQueryParams, useUpdateProductUnitParams, useProductUnitPaging} from '../productUnit.hook';
import ProductUnitForm from './ProductUnitForm';
type propsType = {

}
export default function ProductUnit(props:propsType) : React.JSX.Element {
      const [query] =useProductUnitQueryParams();
      const [keyword,{setKeyword,onParamChange}] = useUpdateProductUnitParams(query)
    const [showForm, setShowForm] = useState(false);
    const [id, setId] = useState(null);
    const [listProductUnit, isLoading] = useGetlistProductUnit(query);
    const [, deleteProductConfig] = useDeleteProductUnit();
    const { t }: any = useTranslate();
    const paging = useProductUnitPaging();
    const [form] = Form.useForm();
    interface DataType {
        _id: string;
        name: string;
        note: string,
        status: string,
      }
    
      const handleOpenForm = useCallback ((id?: any) => {
        if (id) setId(id);
         setShowForm(true);
      },[]);
      const handleDelete = (id: any) => {
        deleteProductConfig(id);
    
      };
      const handleCloseForm = useCallback(() => {
        setShowForm(false);
        setId(null);
      }, []);

      
      const columns: ColumnsType<DataType> = [
        {
          title: 'Tên đơn vị tính',
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
          title: 'Hành động',
          key: 'action',
          align: 'center',
          width: '180px',
          render: (_, record) => (
            <Space size="middle">
              <Button icon={<InfoCircleTwoTone />} type="primary" onClick={() => handleOpenForm(record?._id)}>
                Xem chi tiết
              </Button>
              <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
                Xóa
              </Button>
            </Space>
          ),
        },
      ];
    
      const onSearch = (value: string) => {
        onParamChange({ ['keyword']: value });
      };
      return (
        <div className='product-config'>
          <Breadcrumb title={t('unit')} />
        
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
                      <Button icon={<PlusCircleOutlined />} onClick={()=>handleOpenForm()} type="primary">
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
                      ...paging,
                      onChange(page, pageSize) {
                        onParamChange({ page, limit: pageSize });
                      },
                    }}
                  />
                </WhiteBox>
          <ModalAnt
            open={showForm}
            title={id?'Sửa đơn vị tính':'Tạo đơn vị tính'}
            onCancel={handleCloseForm}
            footer={null}
            destroyOnClose
            width={800}
    
          >
            <ProductUnitForm id={id} callBack={handleCloseForm} />
          </ModalAnt>
        </div>
      );
    }
    