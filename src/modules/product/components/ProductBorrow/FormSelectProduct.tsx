import { Button, Checkbox, Col, Flex, List, Row, Space, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import BaseBorderBox from '~/components/common/BaseBorderBox';
import SelectProductGroups from '~/modules/productGroup/screens/SelectProductGroup';
import {useConvertProductListCollaborator, useGetProducts, useProductQueryParams, useUpdateProductParams } from '../../product.hook';
import Search from 'antd/es/input/Search';
import { useFetchState } from '~/utils/helpers';
import apis from '../../product.api';
import { useGetCollaborator } from '~/modules/collaborator/collaborator.hook';
import SelectSupplier from '~/modules/supplier/components/SelectSupplier';
import supplierModule from '~/modules/supplier';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import TableAnt from '~/components/Antd/TableAnt';
import EmptyData from '~/components/Antd/EmptyData';
import { SyncOutlined } from '@ant-design/icons';
type propsType = {
  id?: string | null
};
export default function FormSelectProduct({id}: propsType): React.JSX.Element {
  const [keyword, setKeyword] = useState<string>('');
  const [supplierSelectId, setSupplierSelectId] = useState();
  const [supplierFilterId, setSupplierFilterId] = useState();
  const [suppliers,loadingSupplier] = useFetchState({api : supplierModule.api.getAllPublic,useDocs : false});
  const newQuery = useMemo(() => ({
    page: 1,
    limit: 200,
    isSupplierMaster: true,
    supplierId: supplierSelectId,
    keyword
  }), [keyword, supplierSelectId]);

  const [products, isLoadingProducts] = useFetchState({ api: apis.getAll, useDocs: false, query: newQuery });
  const [productIds, setProductIds] = useState<string[]>([]);

  const [collaborator, isLoading]: any = useGetCollaborator(id);
  const productsCollaborator = useConvertProductListCollaborator(collaborator);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<any[]>([]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onFilterDataSelected = (newSelectedRowKeys: React.Key[]) => {
    if (newSelectedRowKeys.length > 0) { 
      const newData = newSelectedRowKeys?.map((item: any) => ({
        ...item,
        variantCurrent: item?.variants[0],
      }));
      onSelectChange(newData)
    };
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columnsReady: ColumnsType = useMemo(() => [
    {
        title: "",
        dataIndex: "product",
        key: "name",
        width: 200,
        render(name, product, index) {
          return (
            <Typography.Text strong>
              {get(product, "codeBySupplier", "")} - {get(product, "name", "")}
            </Typography.Text>
          );
        },
    }
  ], []);
  
  const columns: ColumnsType = useMemo(() => [
      {
        title: "",
        dataIndex: "name",
        key: "name",
        width: 200,
        render(name, product, index) {
          return (
            <Typography.Text strong>
              {get(product, "codeBySupplier", "")} - {get(product, "name", "")}
            </Typography.Text>
          );
        },
      },
      {
        title: "Số lượng",
        dataIndex: "name",
        key: "name",
        width: 80,
        align: "center",
        render(name, product, index) {
          return (
            <Typography.Text strong>
              {1}
            </Typography.Text>
          );
        },
      },
      // {
      //   title: "Đơn vị",
      //   dataIndex: "variants",
      //   key: "unit",
      //   width: 80,
      //   align: "center",
      //   render(unit, variants, index) {
      //     return (
      //       <Typography.Text strong>
      //         {unit?.name  || variants[0]?.unit?.name}
      //       </Typography.Text>
      //     );
      //   },
      // },
  ],[]);
  return (
    <div style={{maxHeight: '90vh', overflow: 'hidden'}}>
      <BaseBorderBox title={''} styleContent={{ minHeight: '700px',height: '100%'}}>
        <Row gutter={36}>
          <Col span={12}>
            <BaseBorderBox title={'Danh sách sản phẩm sẵn sàng'} styleContent={{ minHeight: '600px',height: '70%', maxHeight: '600px'}}>
              <div className="d-flex align-items-center ml-1 gap-2 mb-1">
                <Typography.Text strong>Chọn nhà cung cấp:</Typography.Text>
                <SelectSupplier
                  style={{width: '350px'}}
                    value={supplierSelectId}
                    onChange={(value) => setSupplierSelectId(value)}
                    defaultSuppliers={suppliers}
                  />
              </div>
              <div>
                <Search
                  style={{
                    position: 'sticky',
                  }}
                  placeholder='Tìm sản phẩm'
                  onSearch={setKeyword}
                  allowClear
                  onChange={(e: any) => {
                    if(e === '') setKeyword(e.target.value)
                  }}
                />
              </div>
              <TableAnt
                  // locale={{
                  //   emptyText : <EmptyData mess={<Button type='primary' ghost icon={<SyncOutlined />} onClick={mutate}>Thử lại</Button>}/>
                  // }}
                  loading={isLoading}
                  rowSelection={rowSelection}
                  columns={columnsReady}
                  dataSource={productsCollaborator}
                  size='small'
                  pagination={false}
                  rowKey={rc=>rc?._id}
                  scroll={{y : 400}}
                  footer={() => <Flex justify={'end'}>
                    <Typography.Text style={{fontStyle : 'italic'}} strong>
                    Tổng sản phẩm: {selectedRowKeys?.length ? `${selectedRowKeys.length} / ${productsCollaborator?.length}` : productsCollaborator?.length}
                    </Typography.Text>
                  </Flex>}
                />
            </BaseBorderBox>
          </Col>
          <Col span={12}>
            <BaseBorderBox title={'Danh sách sản phẩm đã chọn'}  styleContent={{ minHeight: '600px', maxHeight: '70%' ,height: '600px'}}>
            <div className="d-flex align-items-center ml-1 gap-2 mb-1">
                <Typography.Text strong>Chọn nhà cung cấp:</Typography.Text>
                  <SelectSupplier
                    value={supplierFilterId}
                    onChange={(value) => setSupplierFilterId(value)}
                    defaultSuppliers={suppliers}
                  />
              </div>
              <TableAnt
                  loading={isLoading}
                  columns={columns}
                  dataSource={selectedRowKeys}
                  size='small'
                  pagination={false}
                  rowKey={rc=>rc?._id}
                  scroll={{y : 400}}
                  footer={() => <Flex justify={'end'}>
                    <Typography.Text style={{fontStyle : 'italic'}} strong>
                    Tổng sản phẩm: {selectedRowKeys?.length ? `${selectedRowKeys.length} / ${productsCollaborator?.length}` : productsCollaborator?.length}
                    </Typography.Text>
                  </Flex>}
                />
            </BaseBorderBox>
          </Col>
        </Row>
      </BaseBorderBox>
    </div>
  )
}