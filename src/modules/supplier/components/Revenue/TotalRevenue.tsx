import { Button, Col, DatePicker, Form, Modal, Popconfirm, Row, Space } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCreateTotalRevenue, useGetRevenueId, useGetTotalRevenueSupplierById, useResetActionInRevenue, useRevenueSupplierQueryParams, useUpdateTotalRevenueSupplier } from "../../supplier.hook";
import TotalRevenueForm from "./TotalRevenueForm";
import { formatNumberThreeComma } from "~/utils/helpers";
import { useDispatch } from "react-redux";
import { supplierSliceAction } from "../../redux/reducer";
import { PATH_APP } from "~/routes/allPath";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
interface propsType {
  setTotalRevenueId: any;
  totalRevenueId: any
  setHistoryLogs: any
};

const { RangePicker } = DatePicker;
const dateFormat = 'DD-MM-YYYY';

function RenderTotalRevenue({ setTotalRevenueId, totalRevenueId, setHistoryLogs }: propsType) {
  const { revenueId } = useParams();
  const [query] = useRevenueSupplierQueryParams(revenueId);
  const [data, isLoading] = useGetTotalRevenueSupplierById(query);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSalesAchieved, setTotalSalesAchieved] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitLoading, resetRevenue] = useCreateTotalRevenue();
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_REVENUESUPPLIER);
  const canWrite = useMatchPolicy(POLICIES.WRITE_REVENUESUPPLIER);

  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(supplierSliceAction.resetActionInTotalRevenue());
  };
  const [date, setDate] = useState<any>();
  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };
  const [loading, updateTotalRevenue] = useUpdateTotalRevenueSupplier(() => {
    onClose();
    resetAction();
  });

  useEffect(() => {
    if (data) {
      setTotalRevenue(data?.mineralOfSupplier?.totalRevenue);
      setTotalSalesAchieved(data?.totalSalesAchieved);
      setDate({
        startDate: dayjs(data?.mineralOfSupplier?.startDate).format("DD-MM-YYYY"),
        endDate: dayjs(data?.mineralOfSupplier?.endDate).format("DD-MM-YYYY"),
      });
      setTotalRevenueId(data?.mineralOfSupplier?._id);
      setHistoryLogs(data?.mineralOfSupplier?.historyLogs);
    };
  }, [data]);
  
  return (
    <div style={{ backgroundColor: "#fff", padding: 10, marginBottom: 10 }}>
      <Row gutter={36} align="middle" justify="space-between" style={{ marginTop: 10 }}>
        <Col span={10}>
          <h5>Tổng doanh số khoán: {formatNumberThreeComma(totalRevenue)}đ</h5>
        </Col>
        <Col flex={8}>
          <h5>Tổng doanh số đã đạt: {formatNumberThreeComma(totalSalesAchieved)}đ</h5>
        </Col>
        <Col flex={1}>
           { (canUpdate || canWrite) && <Space>
            {
            (canWrite && !!data?.mineralOfSupplier?.isUpdate && (
                <Popconfirm
                  title="Bạn có chắc chắn muốn tạo lại doanh thu khoán cho nhà cung cấp này?"
                  onConfirm={() => {
                    resetRevenue({
                      supplierId: query?.id
                    })
                  }}
                  onCancel={() => {
                    console.log("cancel");
                  }}
                >
                  <Button loading={isSubmitLoading || loading} type="primary">Tạo mới</Button>
                </Popconfirm>)
              )
            }
            {canUpdate && <Button loading={isSubmitLoading || loading} type="primary" onClick={onOpen}>Cập nhật</Button>}
          </Space>}
        </Col>
      </Row>
      <Row style={{ margin: 10}}>
        <h6
          style={{ marginTop: 10, marginRight: 10, marginBottom: 10}}
        >Thời gian:</h6>
        <RangePicker
          format={dateFormat}
          disabled
          allowEmpty={[true, true]}
          value={[dayjs(date?.startDate,'DD-MM-YYYY'), dayjs(date?.endDate, 'DD-MM-YYYY')]}
        />
      </Row>
      <Space>
        <Link target={'_blank'} to={PATH_APP.revenueSupplier.root + "-all/" + query?.id}>Xem thêm các doanh số khoán khác theo thời gian</Link>
      </Space>
      <Modal
        title="Cập nhật doanh số khoán cho nhà cung cấp"
        open={isOpen}
        footer={null}
        onCancel={onClose}
        width={600}
        destroyOnClose
      >
        <TotalRevenueForm
          totalRevenue={totalRevenue}
          updateTotalRevenue={updateTotalRevenue}
          data = {data?.mineralOfSupplier}
          onClose = {onClose}
        />
      </Modal>
    </div>
  );
};
export default RenderTotalRevenue;
