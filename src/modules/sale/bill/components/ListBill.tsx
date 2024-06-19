import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  redirectRouterBillId,
  useBillPaging,
  useBillQueryParams,
  useGetBill,
  useGetBills,
  useUpdateBillParams,
  useUpdateStatusBill,
} from "../bill.hook";

import { Checkbox, Col, ConfigProvider, Row, Space, Spin, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import SearchAnt from "~/components/Antd/SearchAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import DateTimeTable from "~/components/common/DateTimeTable";
import Status from "~/components/common/Status/index";
import WithPermission from "~/components/common/WithPermission";
import { REF_COLLECTION } from "~/constants/defaultValue";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import SelectEmployee from "~/modules/employee/components/SelectSearch";
import ExportExcelButton from "~/modules/export/component";
import useCheckBoxExport from "~/modules/export/export.hook";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import RadioButtonWarehouseNotFetch from "~/modules/warehouse/components/RadioButtonWarehouseNotFetch";
import { warehouseActions } from "~/modules/warehouse/redux/reducer";
import { convertDataSentToWarehouse, convertProductsFromBill, useCheckWarehouse, useCreateBillToWarehouse, useGetWarehouse } from "~/modules/warehouse/warehouse.hook";
import { formatter, pagingTable, permissionConvert } from "~/utils/helpers";
import { useIsAdapterSystem } from "~/utils/hook";
import { CalculateBill } from "../bill.service";
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
import { billSliceAction } from "../redux/reducer";
import Action from "./Action";
import NoteWarehouse from "./NoteWarehouse";
import ProductItem from "./ProductItem";
import ToolTipBadge from "~/components/common/ToolTipBadge";
import ConfirmStatusBill from "./ConfirmStatusBill";
import { useResetBillAction } from "~/modules/sale/bill/bill.hook";
const CalculateBillMethod = new CalculateBill();
type propsType = {
  status?: string;
};
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function ListBill({ status }: propsType): React.JSX.Element {
  useResetBillAction();
  const [query] = useBillQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] = useUpdateBillParams(query);
  const [bills, isLoading] = useGetBills(query);
  const paging = useBillPaging();
  const isSystem = useIsAdapterSystem();
  const dispatch = useDispatch();
  //Download
  const onPermissionCovert = useCallback(permissionConvert(query),[query])
  const canDownload = useMatchPolicy(onPermissionCovert('DOWNLOAD', 'BILL'));
  const { pathname } = useLocation();
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();

  //Warehouse
  const [warehouseSelect, setWarehouseSelect] = useState<number | undefined>();
  const [isModalCheckWarehouse, setIsModalCheckWarehouse] = useState(false);
  const [warehouseDefault, isLoadingWarehouseDefault] = useGetWarehouse(); //Fetch warehouse default by area
  const [billItem, setBillItem] = useState<any>(null);
  const memoId = useMemo(() => get(billItem, '_id'), [billItem]);
  const [bill, loading] = useGetBill(memoId);
  const canCreateBillToWarehouse = useMatchPolicy(POLICIES.WRITE_WAREHOUSELINK);
  const [noteForWarehouse, setNoteForWarehouse] = useState<string>('');
  const [billItemIdCancel,setBillItemIdCancel] = useState<any>();
  const [openCancel, setOpenCancel] = useState(false);
  const [askAgain,setAskAgain] = useState(true);
  const [note, setNote] = useState(""); // CancelNote BillItem
  const [loadingUpdateStatus, onUpdateStatus] = useUpdateStatusBill(() => {
    dispatch(billSliceAction.resetAction());
  });
  const isHaveAdminBillPermission = useMatchPolicy(POLICIES.ADMIN_BILL);
  const onOpenCancel = useCallback((id:any) => {
    if(id){
      setBillItemIdCancel(id);
    }
    setOpenCancel(true)
  }, []);
  const isDisabledAll = (status: keyof typeof STATUS_BILL) => {
    return status === STATUS_BILL.CANCELLED
  };
  
  useEffect(() => {
    if (bill && bill?.warehouseId) {
      setWarehouseSelect(bill?.warehouseId);
    };
  }, [bill]);
  const openModalCheckWarehouse = (item: any) => {
    setIsModalCheckWarehouse(true);
    setBillItem(item);
  };
  const closeModalCheckWarehouse = () => {
    setIsModalCheckWarehouse(false);
    setBillItem(null);
  };
  const [isSubmitLoading, onCreateBillToWarehouse] = useCreateBillToWarehouse(
    () => {
      dispatch(warehouseActions.resetAction());
      dispatch(billSliceAction.resetAction());
      closeModalCheckWarehouse();
    }
  );

  const [isLoadingCheckWarehouse, onCheckWarehouse] = useCheckWarehouse(() => {
    dispatch(warehouseActions.resetAction());
  });

  const onCheck = () => {
    try {
      const newList =  convertProductsFromBill(get(bill, 'billItems', []))
      const warehouseBranchId = warehouseDefault?.find((item: any) => item?.warehouseId === warehouseSelect)?._id
      const submitData = {
        warehouseId: warehouseSelect,
        listProduct: newList,
        billId: get(bill, '_id'),
        warehouseBranchId
      };
       onCheckWarehouse(submitData);
    } catch (error) {
      console.log(error)
    }
  };
  const onRequestWarehouseExport = () => {
    const submitData = convertDataSentToWarehouse({ ...bill, notePharmacy: noteForWarehouse });
    try {
      onCreateBillToWarehouse(submitData);
    } catch (error) {
      console.log(error)
    }
  };

  const onChangeStatusBill = (status: keyof typeof STATUS_BILL, id?: string | null,billItem?: any) => {
    //Kiểm tra hàng tồn kho
    // const dataCheck = convertProductsFromBill(get(billItem, 'billItems', []));
    // const submitData = {
    //   warehouseId: billItem?.warehouseId,
    //   listProduct: dataCheck,
    //   billId: get(bill, '_id'),
    //   warehouseBranchId: billItem?.warehouseBranchId
    // };
    // onCheckWarehouse(submitData);

    // Tạo yêu cầu xuất kho
    // const submitDataExport = convertDataSentToWarehouse({...billItem, notePharmacy:noteForWarehouse});
    // onCreateBillToWarehouse(submitDataExport);
    const data = {
      billId: id,
      status
    };
    try {
        onUpdateStatus(data);
    } catch (error) {
      console.log(error)
    }
  };
  //
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: <p style={{ color: "#333", fontWeight: "bold" }}>Mã đơn hàng</p>,
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        width: 150,
        render(codeSequence, record, index) {
          return (
            <Link
              className="link_"
              to={redirectRouterBillId(pathname) + "/" + get(record, "_id")}
            >
              {codeSequence}
            </Link>
          );
        },
      },
      {
        title: "Ngày tạo đơn",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "left",
        width: 100,
        render(createdAt, record, index) {
          return (
            <DateTimeTable data={createdAt} />
          );
        },
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        width: 200,
        align: "left",
        render(pharmacy, record, index) {
          return <Typography.Text>{get(pharmacy, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Tình trạng",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 350,
        render(status, record, index) {
          return (
            !isHaveAdminBillPermission ? (
              <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
            ) :
              <div className="d-flex flex-column align-items-center">
                <ToolTipBadge title={status === STATUS_BILL.CANCELLED && get(record, 'note', '')}>
                  <Status
                    status={status}
                    statusVi={CLONE_STATUS_BILL_VI?.[status]}
                  />
                </ToolTipBadge>
                <ConfirmStatusBill
                  askAgain={askAgain}
                  setAskAgain={setAskAgain}
                  billItem={record}
                  onChangeStatusBill={onChangeStatusBill}
                  onOpenCancel={onOpenCancel}
                  isDisabledAll={isDisabledAll(status)}
                  isSubmitLoading={isSubmitLoading}
                  id={get(record, '_id')} />
              </div>
          )
        }
      },
      {
        title: "Lý do huỷ",
        dataIndex: "cancelNote",
        key: "cancelNote",
        width: 150,
        align: "left",
        render(cancelNote?: any) {
          return (
            <Typography.Paragraph
              ellipsis={{
                tooltip: cancelNote,
                rows: 2,
              }}
            >
              {cancelNote}
            </Typography.Paragraph>
          );
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        width: 100,
        align: "left",
        render(note?: any) {
          return (
            <Typography.Paragraph
              ellipsis={{
                tooltip: note,
                rows: 2,
              }}
            >
              {note}
            </Typography.Paragraph>
          );
        },
      },
      {
        title: "Khách đã trả",
        dataIndex: "pair",
        key: "pair",
        width: 100,
        align: "center",
        render(pair, record, index) {
          return (
            <Typography.Text>
              {formatter(pair + get(record, "totalReceiptVoucherCompleted"))}
            </Typography.Text>
          );
        },
      },
      {
        title: "Khách phải trả",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 100,
        align: "center",
        render(totalPrice, record, index) {
          const remainAmount = CalculateBillMethod.remainAmount(record);

          return <Typography.Text>{formatter(remainAmount)}</Typography.Text>;
        },
      },
      {
        title: "Kho xuất hàng",
        dataIndex: "warehouseName",
        key: "warehouseName",
        width: 200,
        align: "center",
      },
      ...(canCreateBillToWarehouse ? [{
        title: "Thao tác",
        width: 100,
        key: "action",
        align: "center" as any,
        render(value: any, record: any, index: number) {
          return <Action
            canUpdate={canCreateBillToWarehouse}
            branchId={record._id}
            onCheckWarehouse={onCheckWarehouse}
            onOpenModalSelectWarehouse={() => openModalCheckWarehouse(record)}
            statusBill={record?.status}
          />
        }
      }] : []),
      ...(canDownload
        ? [
          {
            title: "Lựa chọn",
            key: "_id",
            width: 80,
            align: "center" as any,
            render: (item: any, record: any) => {
              const id = record?._id;
              return (
                <Checkbox
                  checked={arrCheckBox?.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />
              );
            },
          },
        ]
        : []),
    ],
    [arrCheckBox, canDownload, canCreateBillToWarehouse]
  );
  return (
    <div className="bill-page">
      {/* <Space> */}
        <Row justify={"space-between"}>
          <Col span={12}>
            <Space style={{alignItems: 'normal'}}>
              <SelectSupplier
                value={query?.supplierIds ? query?.supplierIds?.split(',') : []}
                onChange={(value) => onParamChange({ supplierIds: value?.length ? value : null })}
                mode="multiple"
                style={{width : 250}}
              />
            {isSystem && query.refCollection !== REF_COLLECTION.PHARMA_PROFILE && query.refCollection && (query.refCollection === REF_COLLECTION.EMPLOYEE ? <SelectEmployee
              value={query?.employeeIds ? query?.employeeIds?.split(',') : []}
              onChange={(value) => onParamChange({ employeeIds: value?.length ? value : null })}
              mode="multiple"
              style={{ width: 200 }}
            />
              :
              <SelectCollaborator
                value={query?.partnerIds ? query?.partnerIds?.split(',') : []}
                onChange={(value) => onParamChange({ partnerIds: value?.length ? value : null })}
                mode="multiple"
                style={{ width: 200 }}
              />)
            }
            <SearchAnt style={{ alignSelf: 'center' }} value={keyword} onChange={(e) => setKeyword(e.target.value)} onParamChange={onParamChange} />
            </Space>
          </Col>
            <WithPermission permission={onPermissionCovert('DOWNLOAD', 'BILL')}>
              <Col>
                <ExportExcelButton
                  api='bill'
                  exportOption = 'bill'
                  query={query}
                  fileName='Danh sách đơn hàng'
                  ids={arrCheckBox}
                />
              </Col>
          </WithPermission>
        </Row>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#C4E4FF',
            },
          },
        }}
      >
        <TableAnt
        stickyTop
        className="table-striped-rows-custom"
        columns={columns}
        dataSource={bills}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
        size="small"
        bordered
        scroll={{ y: '60vh' ,x  : 'max-content'}}
      />
      </ConfigProvider>
      <ModalAnt
        destroyOnClose
        title=""
        open={isModalCheckWarehouse}
        onCancel={closeModalCheckWarehouse}
        onOk={closeModalCheckWarehouse}
        width={1200}
        footer={false}
      >
        {loading ? <Spin />
          : (
            <>
              <BaseBorderBox>
                <ProductItem data={bill?.billItems} />
                <NoteWarehouse noteForWarehouse={noteForWarehouse} setNoteForWarehouse={setNoteForWarehouse} placeholder={'Ghi chú gửi đến kho'} />
                <RadioButtonWarehouseNotFetch
                  setValue={setWarehouseSelect}
                  value={warehouseSelect}
                  onClick={onCheck}
                  title="Kiểm kho"
                  isLoadingWarehouse={isLoadingWarehouseDefault}
                  isShowButtonPackageExport
                  disabledButtonExport={bill?.status !== STATUS_BILL.READY}
                  isSubmitLoading={isSubmitLoading}
                  requestWarehouseExport={onRequestWarehouseExport}
                  warehouseDefault={warehouseDefault}
                />
                </BaseBorderBox>
              </>
          )}
      </ModalAnt>
    </div>
  );
}
