import { Button, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';
import React, { useMemo, useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import { formatNumberThreeComma } from '~/utils/helpers';
import { useGetProductsGroupRevenue, useProductGroupsRevenueQueryParams, useProductsGroupRevenuePaging, useUpdateRevenueProductGroups } from '../../supplier.hook';
import { get } from 'lodash';
import RevenueProductGroupForm from './RevenueProductGroupForm';
import { useParams } from 'react-router-dom';
import { PROVIDER_COLLECTION_CONTRACT_MINERAL } from '../../supplier.modal';
type propsType = {
  totalRevenueId: any
}
export default function RevenueProductsGroup({totalRevenueId}: propsType): React.JSX.Element {
  const { id } = useParams();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_REVENUESUPPLIER);
  const [query, onTableChange] = useProductGroupsRevenueQueryParams(totalRevenueId &&totalRevenueId);  
  const [data, isLoading] = useGetProductsGroupRevenue(query);
  const paging = useProductsGroupRevenuePaging();
  const [isOpen, setIsOpen] = useState(false);
  const [revenue, setRevenue] = useState(null);
  const [productGroupId, setProductGroupId] = useState<any>(null);
  const [productGroupName, setProductGroupName] = useState<any>(null);
  const [isLoadingSubmit,onUpdate] = useUpdateRevenueProductGroups();

  const onOpen = (item: any) => {
    setIsOpen(true);
    setProductGroupId(item?.productGroup?._id);
    setProductGroupName(item?.productGroup?.name);
    setRevenue(get(item,'totalAccumulate',0));
  };
  const onClose = () => {
    setIsOpen(false);
    setProductGroupId(null);
    setProductGroupName(null);
  };

  const onUpdateRevenue = (value: any, productId: any) => {
    const data = {
      revenue: Number(value),
      supplierId: id,
      productGroupId: productId,
      supplierMineralId: totalRevenueId,
      providerCollection:  PROVIDER_COLLECTION_CONTRACT_MINERAL.supplier //is default data table
    };
    onUpdate(data)
  };


  const columns: ColumnsType = useMemo(
  () => [
    {
      title: "Nhóm sản phẩm",
      dataIndex: "productGroup",
      key: "name",
      render(value: any) {
        return value?.name;
      }
    },
    {
      title: "Doanh số khoán",
      dataIndex: "totalAccumulate",
      key: "totalAccumulate",
      render(value, rc: any) {
        return formatNumberThreeComma(value);
      }
    },
  ...(canUpdate ? [ {
      title: "Cập nhật doanh số khoán",
      key: "updateRevenue",
      align: "center" as any,
      render(value: any, rc: any) {
        return (<Button
         type='primary'
          onClick={() => {
            onOpen(rc);
          }}
        >Cập nhật</Button>)
      }
    }] : []),
  ],
  []
);
  return (
    <>
      <TableAnt
        title={() => <h6>{`Tổng doanh số khoán theo sản phẩm: ${formatNumberThreeComma(get(data, 'totalRevenueAllProduct',0))}đ`}</h6>}
        columns={columns}
        dataSource={get(data, 'docs', [])}
        onChange={onTableChange}
        size='small'
        loading = {isLoading}
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng: ${total} `,
          showSizeChanger : true
        }}
      />
      <Modal
          title= {`Cập nhật doanh số khoán cho sản phẩm ${productGroupName}`}
          open={isOpen}
          onCancel={onClose}
          footer={null}
          width={600}
      >
        <RevenueProductGroupForm
          revenue={revenue}
          id={productGroupId}
          onClose={onClose}
          onUpdate={onUpdateRevenue}
          isLoadingSubmit = {isLoadingSubmit}
        />
      </Modal>
    </>
  )
}