import { CheckCircleOutlined, MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Flex, Popconfirm, Popover, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { compact, get, uniqBy } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import WhiteBox from '~/components/common/WhiteBox';
import { EMPLOYEE_LEVEL, EMPLOYEE_LEVEL_VI } from '~/modules/employee/constants';
import { formatter } from '~/utils/helpers';
import { STATUS_REPORT_EMPLOYEE } from '../../constants';
import useDetailReportStore from '../../DetailReportContext';
import { useResetAction, useUpdateReportEmployee, useUpdateStatusReportEmployee } from '../../reportEmployee.hook';
import { SubmitDataUpdatePreview } from '../../reportEmployee.modal';
// import data from './data.json';
import TableDetailSalary from './TableDetailSalary';
import TableTargetsSelf from './TableTargetsSelf';
import TableTargetsTeam from './TableTargetsTeam';
import WithPermission from '~/components/common/WithPermission';
import POLICIES from '~/modules/policy/policy.auth';
import ModalAnt from '~/components/Antd/ModalAnt';
import PaymentVoucherForm from '~/modules/paymentVoucher/components/PaymentVoucherForm';
import { REF_COLLECTION_UPPER } from '~/constants/defaultValue';
import { METHOD_TYPE } from '~/modules/vouchers/constants';
import VoucherList from '~/modules/reportSalaryPartner/components/VoucherList';
const BoxMoney = ({ title, total }: { title: any; total: any }) => (
  <Flex vertical>
    <span style={{ fontSize: 16, color: "#525667" }}>{title}</span>
    <span style={{ fontWeight: 700, fontSize: 16, color: "#525667" }}>
      {formatter(total)}
    </span>
  </Flex>
);
type propsType = {
};
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI
export default function DetailReport(props:propsType) : React.JSX.Element {
    const [open, setOpen] = useState(false);
    const onOpenPayment = useCallback(() => {
      setOpen(true);
    }, []);
    const onClosePayment = useCallback(() => {
      setOpen(false);
    //   mutate();
    }, []);
    const {dataSourceDetailSalary,dataSourceTargetsSelf,dataSourceTargetsTeam,employeeLevel,data,onCancel,id} = useDetailReportStore();
    const [isSubmitLoading,updateReport] = useUpdateReportEmployee(onCancel);
    const [,updateStatus] = useUpdateStatusReportEmployee(onCancel);
    
    useResetAction();
    const onSave = () => {
        const submitData : SubmitDataUpdatePreview = {
            employeeId : get(data,'employee.employeeId',''),
            targetsSelf : {
                targetSupplier : get(data,'targetsSelf.targetSupplier',[])
            },
            targetsTeam : {
                targetSupplier : get(data,'targetsTeam.targetSupplier',[])
            },
            baseAdmin : get(data,'salary.baseAdmin',0),
            bonusOther : get(data,'bonusOther',[])
        };
        updateReport({
            ...submitData,
            _id : id
        })
    }
    const onCompleted = () => {
        updateStatus({
            _id : id,
            status : STATUS_REPORT_EMPLOYEE.COMPLETED
        })
    }
    const onReturnNew= () => {
        updateStatus({
            _id : id,
            status : STATUS_REPORT_EMPLOYEE.NEW
        })
    };
    const total = useMemo(() => get(data,'totalRemaining'),[data]);
    return (
      <div className="detailContainer">
        <Divider>
          <h5 style={{ textAlign: "center" }}>Chi tiết lương</h5>
        </Divider>
        <WhiteBox>
          <Flex justify={"space-between"}>
            <div>
              <p>
                Họ và tên:{" "}
                <Typography.Text strong>
                  {get(data, "employee.fullName", "")}
                </Typography.Text>
              </p>
              <p>
                Vị trí:{" "}
                <Typography.Text strong>
                  {get(CLONE_EMPLOYEE_LEVEL_VI, employeeLevel, "")}
                </Typography.Text>
              </p>
              <p>
                Khu vực:{" "}
                <Typography.Text strong>
                  {compact(
                    uniqBy(
                      [
                        data?.targetsTeam?.salesGroupName,
                        data?.targetsSelf?.salesGroupName,
                      ],
                      (e) => get(e, "_id")
                    )
                  ).join(" , ")}
                </Typography.Text>
              </p>
              <p>
                Lương cơ bản vùng:{" "}
                <Typography.Text strong>
                  {formatter(get(data, "employee.baseSalaryValue", 0))}
                </Typography.Text>
              </p>
            </div>
            <h6 style={{ textAlign: "center" }}>
              Từ ngày: {dayjs(get(data, "startDate")).format("DD-MM-YYYY")} -
              đến ngày: {dayjs(get(data, "endDate")).format("DD-MM-YYYY")}
            </h6>
            {/* <div>
                    <p style={{textAlign : 'end'}}>Quản lý bán hàng: <Typography.Text strong>Nguyễn văn B</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Vị trí: <Typography.Text strong>ASM</Typography.Text></p>
                    <p style={{textAlign : 'end'}}>Số lượng nhân sự quản lý: <Typography.Text strong>3TDV</Typography.Text></p>
                </div> */}
          </Flex>
        </WhiteBox>

        <div className="scrollList detailContainer--detail">
          {[EMPLOYEE_LEVEL.ASM, EMPLOYEE_LEVEL.LEADER].includes(
            employeeLevel
          ) && <TableTargetsTeam dataSource={dataSourceTargetsTeam} />}
          {[
            EMPLOYEE_LEVEL.CTV,
            EMPLOYEE_LEVEL.LEADER,
            EMPLOYEE_LEVEL.TDV,
          ].includes(employeeLevel) && (
            <TableTargetsSelf dataSource={dataSourceTargetsSelf} />
          )}
          <TableDetailSalary dataSource={dataSourceDetailSalary} />
        </div>

        <Flex style={{ marginTop: 8 }} align={"center"} justify={"space-between"} gap={10}>
        <Flex gap={50} justify='space-around' align='center'>
          <BoxMoney title={'Tổng phải chi'} total={get(data,'salary.totalSalary',0)}/>
          <BoxMoney title={'Tổng đã chi'} total={get(data,'totalPayment',0)}/>
          <BoxMoney title={'Tổng còn lại'} total={get(data,'totalRemaining',0)}/>
        </Flex>
            <Flex gap={10}>
            <WithPermission permission={POLICIES.READ_VOUCHERSALARYEMPLOYEE}>
        <Popover
          trigger={["click"]}
          title="Danh sách phiếu"
          content={<VoucherList dataSource={get(data, "vouchers", [])} />}
        >
          <Badge count={get(data, "vouchers", []).length}>
            <Button icon={<MenuOutlined />} type="primary" ghost>
              Danh sách phiếu
            </Button>
          </Badge>
        </Popover>
        </WithPermission>
          <Tooltip title={(get(data,'status') === 'NEW' || get(data,'totalRemaining',0) <= 0) && "Báo cáo chưa hoàn thành hoặc Đã chi trả đủ"}>
          <Button disabled={get(data,'status') === 'NEW' || get(data,'totalRemaining',0) <= 0} type="primary" onClick={onOpenPayment}>
            Tạo phiếu chi
          </Button>
          </Tooltip>
          <WithPermission permission={POLICIES.UPDATE_REPORTSALARY}>
            <>
              {get(data, "status") === STATUS_REPORT_EMPLOYEE.NEW ? (
                <Popconfirm
                  onConfirm={onCompleted}
                  title="Xác nhận hoàn thành báo cáo sẽ không được chỉnh sửa thêm"
                >
                  <Button
                    icon={<CheckCircleOutlined />}
                  >
                    Hoàn thành báo cáo
                  </Button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  onConfirm={onReturnNew}
                  title="Xác nhận chuyển sang trạng thái 'Mới' sẽ được cập nhật "
                >
                  <Button
                    icon={<CheckCircleOutlined />}
                    
                  >
                    Chuyển về trạng thái mới
                  </Button>
                </Popconfirm>
              )}
              {get(data, "status") === STATUS_REPORT_EMPLOYEE.NEW && (
                <Button
                  loading={isSubmitLoading}
                  onClick={onSave}
                  icon={<SaveOutlined />}
                  type="primary"
                >
                  Lưu báo cáo
                </Button>
              )}
            </>
          </WithPermission>
            </Flex>
        </Flex>

        <ModalAnt
          title="Phiếu chi"
          open={open}
          onCancel={onClosePayment}
          width={1366}
          footer={null}
          destroyOnClose
        >
          <PaymentVoucherForm
            initData={{
              reason: "Chi Lương",
              paymentMethod: "COD",
            }}
            employeeId={get(data, "employee.employeeId")}
            onClose={() => onClosePayment()}
            refCollection={REF_COLLECTION_UPPER["EMPLOYEE"]}
              debt={total}
            method={{
              data: get(data, "_id"),
              type: METHOD_TYPE.VOUCHER_SALARY,
            }}
            dataAccountingDefault={[
              {
                creditAccount: 1111,
                amountOfMoney: total || 0,
              },
            ]}
          />
        </ModalAnt>
      </div>
    );
}