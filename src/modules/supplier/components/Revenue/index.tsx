import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import { formatNumberThreeComma } from '~/utils/helpers';
import { useGetRevenueSupplierById, useGetSupplier, useResetAction, useResetActionInRevenue, useRevenueSupplierPaging, useRevenueProductQueryParams, useUpdateRevenueSupplier } from '../../supplier.hook';
import { get } from 'lodash';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import POLICIES from '~/modules/policy/policy.auth';
import { Button, Col, DatePicker, Form, InputNumber, Modal, Row } from 'antd';
import WhiteBox from '~/components/common/WhiteBox';
import UpdateRevenueForm from './UpdateRevenueForm';
import { useDispatch } from 'react-redux';
import { supplierSliceAction } from '../../redux/reducer';
import RenderTotalRevenue from './TotalRevenue';
import HistoryLogs from './HistoryLogs';
import WithPermission from '~/components/common/WithPermission';
import { useSelector } from 'react-redux';
type propsType = {

};

export default function RevenueSupplier(props: propsType): React.JSX.Element {
  const { id } = useParams();
  const [totalRevenueId, setTotalRevenueId] = useState<any>(null);
  const [supplier, loading] = useGetSupplier(id);
  const [query,onTableChange] = useRevenueProductQueryParams();
  const newQuery = useMemo(() => ({
    ...query,
    supplierMineralId: totalRevenueId,
  }), [totalRevenueId, query]);
  const [revenues, isLoading] = useGetRevenueSupplierById(totalRevenueId && newQuery);
  const [data, setData] = useState<any>([]);
  const [revenue, setRevenue] = useState(null);
  const [productId, setProductId] = useState<any>(null);
  const [productName, setProductName] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);

  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(supplierSliceAction.resetActionInTotalRevenue());
  };

  const [isSubmitLoading, updateRevenue] = useUpdateRevenueSupplier(() => {
    closeFormUpdateRevenue();
    resetAction();
  });
  const paging = useRevenueSupplierPaging();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_REVENUESUPPLIER);

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

  useResetActionInRevenue();

  useEffect(() => {
    if(revenues) {
      setData(revenues?.docs);
    };
  }, [revenues]);

  const onUpdateRevenue = (value: any, productId: any) => {
    const data = {
      revenue: Number(value),
      supplierId: id,
      productId: productId,
      supplierMineralId : totalRevenueId
    };
    updateRevenue(data)
  };

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
    ...(canUpdate ? [ {
        title: "Cập nhật doanh số khoán",
        key: "updateRevenue",
        align: "center" as any,
        render(value: any, rc: any) {
          return (<Button
           type='primary'
            onClick={() => {
              openFormUpdateRevenue(rc);
            }}
          >Cập nhật</Button>)
        }
      }] : []),
    ],
    [data]
  );
console.log(data,'data')
  return (
    <div>
      <h4>{loading ? "Đang tải..." :  `Doanh số khoán của nhà cung cấp ${get(supplier,'name','')}`}</h4>
      <RenderTotalRevenue
        setTotalRevenueId = {setTotalRevenueId}
        totalRevenueId = {totalRevenueId}
        setHistoryLogs = {setHistoryLogs}
      />
      <TableAnt
        title={() => <h6>{`Tổng doanh số khoán theo sản phẩm: ${formatNumberThreeComma(revenues?.totalRevenueAllProduct)}đ`}</h6>}
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
      {
        <WithPermission permission={POLICIES.READ_HISTORYSUPPLIERMINERRAL}>
          <HistoryLogs historyLogs={historyLogs} />
        </WithPermission>
      }
      <Modal
        title= {`Cập nhật doanh số khoán cho sản phẩm ${productName}`}
        open={isOpen}
        onCancel={closeFormUpdateRevenue}
        footer={null}
        // destroyOnClose
      >
        <UpdateRevenueForm
          revenue={revenue}
          id={productId}
          closeFormUpdateRevenue={closeFormUpdateRevenue}
          onUpdateRevenue={onUpdateRevenue}
          productName={productName}
        />
      </Modal>
    </div>
  )
};
