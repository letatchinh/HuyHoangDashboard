import { Button, Col, Form, Row, Space, Switch } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useGetlistRanking, useGetlistRankingById, useCreateRanking, useRankingQueryParams, useUpdateRankingParams,useDeleteRanking } from '../ranking.hook';
import { ColumnsType } from 'antd/es/table';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ModalAnt from '~/components/Antd/ModalAnt';
import RankingForm from './RankingForm';
type propsType = {

}
export default function Ranking(props:propsType) : React.JSX.Element {
    const callBack = () => {
        setShowForm(false);
      };
      const [query] = useRankingQueryParams();
      const [keyword,{setKeyword,onParamChange}] = useUpdateRankingParams(query)
      const [listRanking,isLoading] = useGetlistRanking(query);
      const [,deleteRanking] = useDeleteRanking(callBack);
    const [showForm, setShowForm] = useState(false);
    const [id, setId] = useState(null);
   const { t }: any = useTranslate();
    const [form] = Form.useForm();
    interface DataType {
        _id: string;
        name: string;
        level: string;
      }
      const columns: ColumnsType<DataType> = [

        {
          title: 'Tên ',
          dataIndex: 'name',
          align: 'center',
          key: 'name',
          render: (text: string) => <a>{text}</a>,
        },
        {
          title: 'Cấp độ',
          dataIndex: 'level',
          align: 'center',
          key: 'level',
          render: (text: string) => <a>{text}</a>,
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
         deleteRanking(id);
    
      };
      const handleCloseForm = () => {
        setShowForm(false);
        setId(null);
      }
      const onSearch = (value: string) => {
        onParamChange({ ['keyword']: value });
      };
    return (
        <div className='product-config'>
        <Breadcrumb title={t('ranking')} />
      
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
                  dataSource={listRanking}
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
          title={id?'Cap nhap ranking':'Tao moi ranking'}
          onCancel={handleCloseForm}
          footer={null}
          destroyOnClose
          width={800}
  
        >
          <RankingForm id={id} callBack={callBack} />
        </ModalAnt>
      </div>
    )
}