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

import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
  TreeSelect,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import SearchAnt from "~/components/Antd/SearchAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import { PATH_APP } from "~/routes/allPath";
import {
  concatAddress,
  formatter,
  getExistProp,
  pagingTable,
  permissionConvert,
} from "~/utils/helpers";
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
import { convertDataSentToWarehouse, convertProductsFromBill, useCheckWarehouse, useCreateBillToWarehouse, useGetWarehouse, useGetWarehouseByBranchLinked } from "~/modules/warehouse/warehouse.hook";
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
import SelectPharmacy from "./SelectPharmacy";
import { FormFieldSearch } from "../bill.modal";
import dayjs from "dayjs";
import { FilterOutlined } from "@ant-design/icons";
import GeoTreeSelect from "~/modules/geo/components/GeoTreeSelect";
import { RELATIVE_POSITION } from "~/modules/geo/constants";
import SelectEmployeeV2 from "~/modules/employee/components/SelectEmployeeV2";
import TagBillItem from "./TagBillItem";
const CalculateBillMethod = new CalculateBill();
type propsType = {
  status?: string;
};
const defaultDate = {
  startDate: dayjs().startOf("month"),
  endDate: dayjs().endOf("month"),
};
const { Option } = Select;
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
  const onPermissionCovert = useCallback(permissionConvert(query), [query]);
  const canDownload = useMatchPolicy(onPermissionCovert("DOWNLOAD", "BILL"));
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
  const [,setBillItemIdCancel] = useState<any>();
  const [askAgain,setAskAgain] = useState(true);
  const [note, setNote] = useState(""); // CancelNote BillItem
  const [listWarehouse] = useGetWarehouseByBranchLinked(); // Get all warehouse linked with branch
  const [, onUpdateStatus] = useUpdateStatusBill(() => {
    dispatch(billSliceAction.resetAction());
  });
  const isHaveAdminBillPermission = useMatchPolicy(POLICIES.UPDATE_BILLSTATUS);
  const onOpenCancel = useCallback((id:any) => {
    if(id){
      setBillItemIdCancel(id);
    }
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

  const [, onCheckWarehouse] = useCheckWarehouse(() => {
    dispatch(warehouseActions.resetAction());
  });

  const onCheck = () => {
    try {
      const newList =  convertProductsFromBill(get(bill, 'billItems', []))
      const submitData = {
        warehouseId: warehouseSelect,
        listProduct: newList,
        billId: get(bill, '_id'),
      };
       onCheckWarehouse(submitData);
    } catch (error) {
      console.log(error)
    }
  };
  const onRequestWarehouseExport = () => {
    const submitData = convertDataSentToWarehouse({ ...bill, notePharmacy: noteForWarehouse });
    try {
      onCreateBillToWarehouse({...submitData});
    } catch (error) {
      console.log(error)
    }
  };

  const handleCreateBillToWarehouse = (status: keyof typeof STATUS_BILL,bill: any) => {
    try {
      const submitData = convertDataSentToWarehouse({ ...bill, notePharmacy: noteForWarehouse });
      setTimeout(() => {
          onCreateBillToWarehouse({...submitData, callback: onUpdateStatus, status});
      },700)
    } catch (error) {
      console.log(error)
    }
  };

  const onChangeStatusBill = (status: keyof typeof STATUS_BILL, id?: string | null,bill?: any, note?: string) => {
    // Phải kiểm tra hàng tồn kho trước khi đổi trạng thái từ NEW qua PACKAGE_EXPORT
    const dataCheck = convertProductsFromBill(get(bill, 'billItems', []));
    const submitData = {
      warehouseId: bill?.warehouseId,
      listProduct: dataCheck,
      billId: get(bill, '_id'),
      note
    };
    try {
      if (bill?.status === STATUS_BILL.NEW && status !== STATUS_BILL.CANCELLED) {
        return onCheckWarehouse({...submitData, callback: handleCreateBillToWarehouse, status, bill}); //
      };
      const data = {
        billId: id,
        status
      };
      onUpdateStatus(data); //can update if bill have in warehouse
    } catch (error) {
      console.log(error)
    }
  };
  //
  const [form] = Form.useForm();
  const initValue = useMemo(() => {
    const root = {
      ...query,
      startDate: query?.startDate ? dayjs(query?.startDate) : null,
      endDate: query?.endDate ? dayjs(query?.endDate) : null,
      managementArea: query?.managementArea?.split(","),
      pharmacyId: query?.pharmacyIds,
    };
    return getExistProp(root);
  }, [query]);

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: <p style={{ color: "#333", fontWeight: "bold" }}>Mã đơn hàng</p>,
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        width: 150,
        fixed: "left",
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
      // {
      //   title: "Ngày tạo đơn",
      //   dataIndex: "createdAt",
      //   key: "createdAt",
      //   align: "left",
      //   width: 150,
      //   render(createdAt, record, index) {
      //     return (<DateTimeTable data={createdAt} />);
      //   },
      // },
      {
        title: "Ngày cập nhật",
        dataIndex: "dateToStatus",
        key: "dateToStatus",
        align: "left",
        width: 150,
        render(dateToStatus, record, index) {
          return ( <DateTimeTable data={dateToStatus} />
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
                <WithPermission permission={POLICIES.UPDATE_BILLSTATUS}>
                  <ConfirmStatusBill
                    askAgain={askAgain}
                    setAskAgain={setAskAgain}
                    bill={record}
                    onChangeStatusBill={onChangeStatusBill}
                    onOpenCancel={onOpenCancel}
                    isDisabledAll={isDisabledAll(status)}
                    isSubmitLoading={isSubmitLoading}
                    id={get(record, '_id')} />
                </WithPermission>
              </div>
          )
        }
      },
      {
        title: "Giá trị đơn hàng",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "center",
        width: 150,
        render(totalPrice, record, index) {
          return <Typography.Text>{formatter(totalPrice)}</Typography.Text>;
        },
      },
      {
        title: "Khách đã trả",
        dataIndex: "pair",
        key: "pair",
        width: 150,
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
        width: 150,
        align: "center",
        render(totalPrice, record, index) {
          const remainAmount = CalculateBillMethod.remainAmount(record);
          return <Typography.Text>{formatter(remainAmount)}</Typography.Text>;
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "deliveryAddressId",
        key: "deliveryAddressId",
        width: 350,
        render(value, record, index) {
          return concatAddress(value);
        },
      },
      {
        title: "Kho xuất hàng",
        dataIndex: "warehouseName",
        key: "warehouseName",
        width: 200,
        align: "center",
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
      ...(canCreateBillToWarehouse ? [{
        title: "Thao tác",
        width: 100,
        key: "action",
        align: "center" as any,
        fixed: "right" as any,
        render(value: any, record: any, index: number) {
          return <Action
            branchId={record._id}
            onCheckWarehouse={onCheckWarehouse}
            onOpenModalSelectWarehouse={() => openModalCheckWarehouse(record)}
            statusBill={record?.status}
            canCreateBillToWarehouse={canCreateBillToWarehouse}
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
              fixed: "right" as any,
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

  useEffect(() => {
    const root = {
      ...query,
      startDate: query?.startDate ? dayjs(query?.startDate) : null,
      endDate: query?.endDate ? dayjs(query?.endDate) : null,
      managementArea: query?.managementArea?.split(","),
    };
    form.setFieldsValue(root);
  }, [pathname]);

  const onValuesChange = (valueChange: any) => {
    const key = Object.keys(valueChange)[0];

    switch (key) {
      case "startDate":
        onParamChange({
          startDate: valueChange?.startDate
            ? dayjs(valueChange?.startDate).format("YYYY-MM-DD")
            : null,
        });
        break;
      case "endDate":
        onParamChange({
          endDate: valueChange?.endDate
            ? dayjs(valueChange?.endDate).format("YYYY-MM-DD")
            : null,
        });
        break;

      default:
        onParamChange({ ...valueChange });
        break;
    }
  };

  const addColumn = {
    title: "Trạng thái",
    dataIndex: "statusCheckWarehouse",
    key: "statusCheckWarehouse",
    width: 100,
    align: "center" as any,
    render: (value: any, record: any, index: number) => {
      return <TagBillItem status={record?.statusCheckWarehouse}/>
    }
  };
  return (
    // <div className="bill-page">
    <>
      <Row justify={"space-between"}>
        <Col span={12}>
          <Space style={{ alignItems: "normal" }}>
            <SelectSupplier
              value={query?.supplierIds ? query?.supplierIds?.split(",") : []}
              onChange={(value) =>
                onParamChange({ supplierIds: value?.length ? value : null })
              }
              mode="multiple"
              style={{ width: 250 }}
            />
            {isSystem &&
            query.refCollection !== REF_COLLECTION.PHARMA_PROFILE &&
            query.refCollection ? (
              query.refCollection === REF_COLLECTION.EMPLOYEE ? (
                <Form
                  form={form}
                  initialValues={{ employeeId: query?.employeeIds }}
                >
                  <SelectEmployeeV2
                    validateFirst={false}
                    form={form}
                    style={{ width: 200 }}
                    showIcon={false}
                    size={"middle"}
                    defaultValue={query?.employeeIds || null}
                    onChange={(value) => onParamChange({ employeeIds: value })}
                    mode="multiple"
                  />
                </Form>
              ) : (
                <SelectCollaborator
                  value={query?.partnerIds ? query?.partnerIds?.split(",") : []}
                  onChange={(value) =>
                    onParamChange({ partnerIds: value?.length ? value : null })
                  }
                  mode="multiple"
                  style={{ width: 200 }}
                />
              )
            ) : (
              <Form form={form} initialValues={initValue}>
                <SelectPharmacy
                  validateFirst={false}
                  form={form}
                  style={{ width: 200 }}
                  showIcon={false}
                  required={false}
                  size={"middle"}
                  defaultValue={query?.pharmacyIds || null}
                  onChange={(value) =>
                    onParamChange({ pharmacyIds: value?.length ? value : null })
                  }
                  mode="multiple"
                />
              </Form>
            )}
            <SearchAnt
              style={{ alignSelf: "center" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onParamChange={onParamChange}
            />
          </Space>
        </Col>
        <WithPermission permission={onPermissionCovert("DOWNLOAD", "BILL")}>
          <Col>
            <ExportExcelButton
              api="bill"
              exportOption="bill"
              query={query}
              fileName="Danh sách đơn hàng"
              ids={arrCheckBox}
            />
          </Col>
        </WithPermission>
      </Row>
      <Row justify={"space-between"}>
        <Form
          form={form}
          style={{ width: "100%" }}
          initialValues={{
            ...query,
            managementArea: query?.managementArea?.split(","),
            startDate: dayjs.isDayjs(query?.startDate) && dayjs(query?.startDate),
            endDate: dayjs.isDayjs(query?.endDate) && dayjs(query?.endDate),
          }}
          onValuesChange={onValuesChange}
        >
          <Row gutter={16} align="middle" justify="space-between">
            <Col span={8}>
              <Form.Item<FormFieldSearch>
                name={"startDate"}
                label="Ngày bắt đầu"
              >
                <DatePicker format={"YYYY-MM-DD"} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item<FormFieldSearch>
                name={"endDate"}
                label="Ngày kết thúc"
              >
                <DatePicker format={"YYYY-MM-DD"} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Khu vực" name={["managementArea"]}>
                <GeoTreeSelect
                  autoClearSearchValue
                  labelInValue={true}
                  listItemHeight={150}
                  multiple={true}
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  showEnabledValuesOnly={true}
                  showSearch={true}
                  size="middle"
                  treeCheckStrictly={true}
                  treeCheckable={true}
                  treeDefaultExpandedKeys={["1", "2", "3"]}
                  checkablePositions={[
                    RELATIVE_POSITION.IS_CHILD,
                    RELATIVE_POSITION.IS_EQUAL,
                  ]}
                  onChange={(value: any) => {
                    onParamChange({
                      managementArea: value
                        ?.map((item: any) => get(item, "value"))
                        ?.join(","),
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Row>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#C4E4FF",
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
                <ProductItem data={bill?.billItems} column={addColumn} />
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
                  listWarehouseLinked={listWarehouse}
                />
                </BaseBorderBox>
              </>
          )}
      </ModalAnt>
    </>
    // </div> 
  );
}
