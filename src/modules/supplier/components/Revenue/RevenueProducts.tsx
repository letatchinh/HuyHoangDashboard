import React, { useEffect, useMemo, useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import { formatNumberThreeComma } from '~/utils/helpers';
import { useGetRevenueSupplierById, useResetAction, useResetActionInRevenue, useResetInRevenueActionUpdate, useRevenueProductQueryParams, useRevenueSupplierPaging, useUpdateRevenueSupplier } from '../../supplier.hook';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import POLICIES from '~/modules/policy/policy.auth';
import { ColumnsType } from 'antd/es/table';
import { Button, Modal } from 'antd';
import { PROVIDER_COLLECTION_CONTRACT_MINERAL, STATUS_SUPPLIER_TYPE_VI } from '../../supplier.modal';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supplierSliceAction } from '../../redux/reducer';
import { get } from 'lodash';
import RevenueProductForm from './RevenueProductForm';
import apis from '../../supplier.api';
type propsType = {
  totalRevenueId: any;
}
export default function RevenueProducts({ totalRevenueId }: propsType): React.JSX.Element {
  const { id } = useParams();
  
  const [data, setData] = useState<any>([]);
  const [productId, setProductId] = useState<any>(null);
  const [productName, setProductName] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [revenue, setRevenue] = useState(null);

  const [query,onTableChange] = useRevenueProductQueryParams();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_REVENUESUPPLIER);
  const resetAction = useResetInRevenueActionUpdate();
  const [productGroupId, setProductGroupId] = useState(null);
  const [refetch, setReFetch] = useState(false);

  const newQuery = useMemo(() => ({
    ...query,
    supplierMineralId: totalRevenueId,
  }), [totalRevenueId, query]);

  const [revenues, isLoading] = useGetRevenueSupplierById(totalRevenueId && newQuery);
  const paging = useRevenueSupplierPaging();

  const [isSubmitLoading, updateRevenue] = useUpdateRevenueSupplier(() => {
    closeFormUpdateRevenue();
    resetAction();
    setReFetch(!refetch);
  });

  const openFormUpdateRevenue = (item: any) => {
    setIsOpen(true);
    setRevenue((item?.revenue) ?? 0);
    setProductId(item?._id);
    setProductName(item?.name);
  };

  const closeFormUpdateRevenue = () => {
    setIsOpen(false);
    setRevenue(null);
    setProductId(null);
    setProductName(null);
  };

  const onUpdateRevenue = (value: any, productId: any) => {
    const data = {
      revenue: Number(value),
      supplierId: id,
      productId: productId,
      supplierMineralId: totalRevenueId,
      providerCollection:  PROVIDER_COLLECTION_CONTRACT_MINERAL.supplier //is default data table
    };
    updateRevenue(data)
  };

  useEffect(() => {
    if(revenues) {
      setData(revenues?.docs);
    };
  }, [revenues]);

  const columns: ColumnsType  = useMemo(
    () => [
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        render(value: any) {
          return value;
        }
      },
      {
        title: "Doanh số khoán",
        dataIndex: "revenue",
        key: "revenue",
        render(value, rc: any) {
          return formatNumberThreeComma(value);
        }
      },
      {
        title: "Nhóm sản phẩm",
        dataIndex: "productGroup",
        key: "name",
        render(value, rc: any) {
          return value?.name;
        }
      },
      {
        title: "Trạng thái sản phẩm",
        dataIndex: "productGroup",
        key: "status",
        render(value, rc: any) {
          return (STATUS_SUPPLIER_TYPE_VI[value?.status]);
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
              openFormUpdateRevenue(rc);
              setProductGroupId(rc?.productGroup?._id);
            }}
          >Cập nhật</Button>)
        }
      }] : []),
    ],
    [data,canUpdate]
  );
  return (
    <>
    <TableAnt
        title={() => <h6>{`Tổng doanh số khoán theo sản phẩm: ${formatNumberThreeComma(get(revenues, 'totalRevenueAllProduct',0))}đ`}</h6>}
        loading={isLoading || isSubmitLoading}
        dataSource={data ?? []}
        columns={columns}
        onChange={onTableChange}
        size='small'
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng: ${total} `,
          showSizeChanger : true
        }}
      />
      <Modal
        title= {`Cập nhật doanh số khoán cho sản phẩm ${productName}`}
        open={isOpen}
        onCancel={closeFormUpdateRevenue}
        footer={null}
        width={600}
        // destroyOnClose
      >
        <RevenueProductForm
          revenue={revenue}
          id={productId}
          closeFormUpdateRevenue={closeFormUpdateRevenue}
          onUpdateRevenue={onUpdateRevenue}
          productName={productName}
          totalRevenueId = {totalRevenueId}
          productGroupId = {productGroupId}
          refetch = {refetch}
        />
      </Modal>
    </>
)
};