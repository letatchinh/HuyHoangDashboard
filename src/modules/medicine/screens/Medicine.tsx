import { SearchOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import { useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import WhiteBox from '~/components/common/WhiteBox';
import useTranslate from '~/lib/translation';
import { useGetListMeddicine, useMedicineQueryParams, useUpdateMedicineParams, useMedicinePaging } from '../medicine.hook';
import { DataType } from '../medicine.modal';

const { Search } = Input;

export default function Medicine() {
  const [query] = useMedicineQueryParams();
  const [listMedicine, isLoading] = useGetListMeddicine(query);
  const paging = useMedicinePaging();
  const [keyword, { setKeyword, onParamChange }] = useUpdateMedicineParams(query);
  const { t }: any = useTranslate();

  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã thuốc',
      dataIndex: 'code',
      width: '200px',
      align: 'center',
      render: (text: string) => <a href='#' style={{ textDecoration: 'none' }}>{text}</a>,
    },
    {
      title: 'Tên thuốc',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Tên hãng sản xuất',
      dataIndex: 'manufacturer',
      align: 'center',
      key: 'manufacturer',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      align: 'center',
      key: 'unit',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      align: 'center',
      key: 'note',
      render: (text: string) => <a>{text}</a>,
    },
  ];

  const onSearch = (value: string) => {
    onParamChange({ ['keyword']: value });
  };

  const pageSizeOptions = ['10', '20', '50', '100'];

  return (
    <div className='product-config'>
      <Breadcrumb title={t('Quản lý thuốc')} />
      <div>
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
                allowClear
                enterButton={<SearchOutlined />}
              />
            </Col>
          </Row>
        </div>
        <WhiteBox>
          <TableAnt
            dataSource={listMedicine}
            loading={isLoading}
            columns={columns}
            size="small"
            pagination={{
              ...paging,
              pageSizeOptions: pageSizeOptions,
              showSizeChanger: true, // Hiển thị dropdown chọn kích thước trang
              defaultPageSize: 10,
              onChange(page, pageSize) {
                onParamChange({ page, limit: pageSize });
              },
            }}
          />
        </WhiteBox>
      </div>
    </div>
  );
}
