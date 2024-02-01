import { DeleteOutlined, InfoCircleTwoTone, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, SelectProps, Space, Switch, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useCallback, useState } from 'react';
import ModalAnt from '~/components/Antd/ModalAnt';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import WithPermission from '~/components/common/WithPermission';
import useTranslate from '~/lib/translation';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import {
  useDeleteProductConfig,
  useGetlistProductConfig,
  useProductConfigPaging,
  useProductConfigQueryParams,
  useUpdateProductConfig,
  useUpdateProductConfigParams
} from '../productGroup.hook';
import ProductGroupForm from './ProductGroupForm';

const { Search } = Input;

export default function ProductConfig() {
  const [showForm, setShowForm] = useState(false);
  const [query] = useProductConfigQueryParams();
  const [id, setId] = useState(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState(get(query, 'status') || '');
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    form.resetFields();
    setId(null);
  }, []);
  const paging = useProductConfigPaging();
  const [, deleteProductConfig] = useDeleteProductConfig(handleCloseForm);
  const [isSubmitUpdateLoading, updateProductConfig] = useUpdateProductConfig(handleCloseForm);
  const [listProductConfig, isLoading] = useGetlistProductConfig(query);
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductConfigParams(query);
  const { t }: any = useTranslate();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_PRODUCTGROUP);

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
      setId(id);
  };
  const handleOpenFormCreate = () => { 
    setId(null);
    setShowForm(true);
  };
  const handleDelete = (id: any) => {
    deleteProductConfig(id);

  };
  const handleCloseForm1 = () => {
    setShowForm(false);
    form.resetFields()
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
        <Switch
          checked={record?.status === 'ACTIVE'}
          onChange={(value: any) => {
            if (!canUpdate) return message.warning('Bạn không có quyền thay đổi');
            updateProductConfig({ status: value ? 'ACTIVE' : 'INACTIVE', id: record?._id });
          }}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          <WithPermission permission={POLICIES.UPDATE_PRODUCTGROUP}>
            <Button icon={<InfoCircleTwoTone />} type="primary" onClick={() => handleOpenUpdate(record?._id)}>
              Xem chi tiết
            </Button>
          </WithPermission>
          <WithPermission permission={POLICIES.DELETE_PRODUCTGROUP}>
            <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
              Xóa
            </Button>
          </WithPermission>
        </Space>
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
    <div className='product-config'>
      <Breadcrumb title={t('Quản lý danh mục nhóm sản phẩm')} />
      <div>
        <div className='product-config-content' style={{ marginBottom: 16, display: 'flex', gap: '30px' }}>
          {/* <div style={{ width: '20%',height: '100%' }}> */}
          <WhiteBox style={{ width: '20%' }}>
            <label>Trạng thái:</label>
            <Select
              style={{ height: '50px', padding: '5px 0px', width: '100%' }}
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
                    allowClear
                    onChange={(e) => (setKeyword(e.target.value))
                    }
                    onSearch={onSearch}
                    enterButton={<SearchOutlined />}
                  />
                </Col>
                <Col>
                  <WithPermission permission={POLICIES.WRITE_PRODUCTGROUP}>
                    <Button icon={<PlusCircleOutlined />} onClick={handleOpenFormCreate} type="primary">
                      Thêm mới
                    </Button>
                  </WithPermission>
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
                  pageSizeOptions: pageSizeOptions,
                  showSizeChanger: true, // Hiển thị dropdown chọn kích thước trang
                  defaultPageSize: 10, // Kích thước trang mặc định
                  showTotal: (total) => `Tổng cộng: ${total} `,
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
        title={id ? 'Cập nhật danh mục sản phẩm' : 'Tạo mới danh mục sản phẩm'}
        onCancel={handleCloseForm1}
        footer={null}
        // destroyOnClose
        width={800}
      >
        <ProductGroupForm id={id} setId={setId} callBack={handleCloseForm} updateProductConfig={updateProductConfig} />
      </ModalAnt>
    </div>
  );
}
