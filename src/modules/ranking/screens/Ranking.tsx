import { DeleteOutlined, InfoCircleTwoTone, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Space } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useState } from 'react';
import ModalAnt from '~/components/Antd/ModalAnt';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import WithPermission from '~/components/common/WithPermission';
import useTranslate from '~/lib/translation';
import POLICIES from '~/modules/policy/policy.auth';
import { useDeleteRanking, useGetlistRanking, useRankingPaging, useRankingQueryParams, useUpdateRankingParams } from '../ranking.hook';
import RankingForm from './RankingForm';
type propsType = {

}
export default function Ranking(props: propsType): React.JSX.Element {
  const [query] = useRankingQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateRankingParams(query)
  const [listRanking, isLoading] = useGetlistRanking(query);
  const [isSubmit, deleteRanking] = useDeleteRanking();
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState(null);
  const paging = useRankingPaging();
  const { t }: any = useTranslate();
  const [form] = Form.useForm();
  const [destroy,setDestroy] = useState(false);
  interface DataType {
    _id: string;
    name: string;
    level: string;
  }
  const columns: ColumnsType<DataType> = [

    {
      title: 'Tên ',
      dataIndex: 'name',
      align: 'left',
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
          <WithPermission permission={POLICIES.UPDATE_RANKING}>
            <Button icon={<InfoCircleTwoTone />} type="primary" onClick={() => handleOpenForm(record?._id)}>
              Xem chi tiết
            </Button>
          </WithPermission>
          <WithPermission permission={POLICIES.DELETE_RANKING}>
            <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
              Xóa
            </Button>
          </WithPermission>
        </Space>
      ),
    },
  ];
  const handleOpenForm = useCallback((id?: any) => {
    if (id) {
      setId(id);
      setDestroy(true);
    }
    setShowForm(true);
  }, []);
  const handleDelete = (id: any) => {
    deleteRanking(id);

  };
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setId(null);
  }, []);
  const onSearch = (value: string) => {
    onParamChange({ ['keyword']: value });
  };
  const pageSizeOptions = ['10', '20', '50', '100'];
  return (
    <div className='product-config'>
      <Breadcrumb title={t('Xếp hạng nhà cung cấp')} />

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
            <WithPermission permission={POLICIES.WRITE_RANKING}>
              <Button icon={<PlusCircleOutlined />} onClick={() => handleOpenForm()} type="primary">
                Thêm mới
              </Button>
            </WithPermission>

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
            ...paging,
            pageSizeOptions: pageSizeOptions,
                    showSizeChanger: true, // Hiển thị dropdown chọn kích thước trang
                    defaultPageSize: 10, 
            showTotal: (total) => `Tổng cộng: ${total} `,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
          }}
        />
      </WhiteBox>
      <ModalAnt
        open={showForm}
        title={id ? 'Cập nhật xếp hạng nhà cung cấp' : 'Tạo mới xếp hạng nhà cung cấp'}
        onCancel={handleCloseForm}
        footer={null}
        destroyOnClose={destroy}
        width={800}
        afterClose={() => {
          setDestroy(false);
        }}
      >
        <RankingForm setDestroy={setDestroy} id={id} setId={setId} handleCloseForm={handleCloseForm} />
      </ModalAnt>
    </div>
  )
}