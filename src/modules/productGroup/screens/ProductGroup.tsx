import { DeleteOutlined, InfoCircleTwoTone, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Row, Select, SelectProps, Space, Switch, Table, message } from 'antd';
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
import useCheckBoxExport from '~/modules/export/export.hook';
import ExportExcelButton from '~/modules/export/component';

const { Search } = Input;

export default function ProductConfig() {
  const [showForm, setShowForm] = useState(false);
  const [query] = useProductConfigQueryParams();
  const [id, setId] = useState(null);
  const paging =useProductConfigPaging();
  const [form] = Form.useForm();
  const [search, setSearch] = useState(get(query, 'status') || null);
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    form.resetFields();
    setId(null);
  }, []);
  const [, deleteProductConfig] = useDeleteProductConfig(handleCloseForm);
  const [isSubmitUpdateLoading, updateProductConfig] = useUpdateProductConfig(handleCloseForm);
  const [listProductConfig, isLoading] = useGetlistProductConfig(query);
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductConfigParams(query);
  const { t }: any = useTranslate();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_PRODUCTGROUP);
  const canDelete = useMatchPolicy(POLICIES.DELETE_PRODUCTGROUP);

  //Download
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_UNIT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();

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
      render: (text: string,record: any) => (
        canUpdate ? (
          <Button  type="link" onClick={() => handleOpenUpdate(record?._id)}>
        {text}
        </Button>
        ): text
      )
    },
    {
      title: 'Tên danh mục thuốc',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'center',
      key: 'note',
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
    ...(canDelete ?[{
      title: 'Hành động',
      key: 'action',
      align: 'center' as any,
      width: '180px',
      render: (value: any, record: any) => (
            <Button icon={<DeleteOutlined />} style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
              Xóa
            </Button>
      ),
    }]: []),
    ...(
      canDownload ? [
        {
          title: 'Lựa chọn',
          key: '_id',
          width: 80,
          align: 'center' as any,
          render: (item: any, record: any) =>
          {
            const id = record._id;
            return (
              <Checkbox
                checked= {arrCheckBox?.includes(id)}
                onChange={(e)=>onChangeCheckBox(e.target.checked, id)}
          />)}
        },
      ]: []
    ) 
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
      <Row  gutter={16} style={{ marginBottom: '10px' }}>
        <Col span={12}>
          <Row gutter = {16}>
            <Col span={12}>
            <Search
              placeholder="Nhập bất kì để tìm..."
              value={keyword}
              onChange={(e) => (setKeyword(e.target.value))}
              allowClear
              onSearch={onSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col span={12}>
              <Select
                placeholder="Tìm theo trạng thái"
                style={{
                  width: "200px",
                }}
                value={search}
                allowClear
                onChange={(e) => {
                  setSearch(e)
                  onParamChange({ ['status']: e });
                }}
                options={options}
              />
            </Col>
          </Row>
        </Col>
        <Col span = {12}>
          <Row justify={'end'}>
            <Col>
            <WithPermission permission={POLICIES.WRITE_PRODUCTGROUP}>
              <Button icon={<PlusCircleOutlined />} onClick={handleOpenFormCreate} type="primary">
                Thêm mới
              </Button>
            </WithPermission>
            </Col>
            <WithPermission permission={POLICIES.DOWNLOAD_PRODUCTGROUP}>
              <Col>
                <ExportExcelButton
                  api='product-group'
                  exportOption = 'productGroup'
                  query={query}
                  fileName='Danh mục nhóm sản phẩm'
                  ids={arrCheckBox}
                />
              </Col>
            </WithPermission>
          </Row>
          
        </Col>
      </Row>
      <WhiteBox>
        <TableAnt
          dataSource={listProductConfig}
          loading={isLoading}
          columns={columns}
          size="small"
          pagination={{
            ...paging,
            pageSizeOptions: pageSizeOptions,
            showSizeChanger: true,
            defaultPageSize: 10, 
            showTotal: (total) => `Tổng cộng: ${total} `,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
          }}
          scroll={{ x: 'max-content' }}
          stickyTop
        />
      </WhiteBox>
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
