import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  redirectRouterBillId,
  useBillPaging,
  useBillQueryParams,
  useGetBill,
  useGetBills,
  useUpdateBillParams,
} from "../bill.hook";

import { Checkbox, Col, ConfigProvider, Input, Row, Space, Spin, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import SearchAnt from "~/components/Antd/SearchAnt";
import DateTimeTable from "~/components/common/DateTimeTable";
import Status from "~/components/common/Status/index";
import WithPermission from "~/components/common/WithPermission";
import { REF_COLLECTION } from "~/constants/defaultValue";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import SelectEmployee from "~/modules/employee/components/SelectSearch";
import ExportExcelButton from "~/modules/export/component";
import useCheckBoxExport from "~/modules/export/export.hook";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import RadioButtonWarehouseNotFetch from "~/modules/warehouse/components/RadioButtonWarehouseNotFetch";
import { warehouseActions } from "~/modules/warehouse/redux/reducer";
import { convertDataSentToWarehouse, convertProductsFromBill, useCheckWarehouse, useCreateBillToWarehouse, useGetWarehouse, useGetWarehouseByBranchLinked } from "~/modules/warehouse/warehouse.hook";
import { formatter, pagingTable, permissionConvert } from "~/utils/helpers";
import { useIsAdapterSystem } from "~/utils/hook";
import { CalculateBill } from "../bill.service";
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
import Action from "./Action";
import ProductItem from "./ProductItem";
import { billSliceAction } from "../redux/reducer";
import POLICIES from "~/modules/policy/policy.auth";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import NoteWarehouse from "./NoteWarehouse";
const CalculateBillMethod = new CalculateBill();
type propsType = {
  status?: string;
};
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function ListBill({ status }: propsType): React.JSX.Element {
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
  const [listWarehouse, isLoadingWarehouse] = useGetWarehouseByBranchLinked();
  const [warehouseDefault, isLoadingWarehouseDefault] = useGetWarehouse(); //Fetch warehouse default by area
  const [billItem, setBillItem] = useState<any>(null);
  const memoId = useMemo(() => get(billItem, '_id'), [billItem]);
  const [bill, loading] = useGetBill(memoId);
  const canCreateBillToWarehouse = useMatchPolicy(POLICIES.WRITE_WAREHOUSELINK);
  const [noteForWarehouse, setNoteForWarehouse] = useState<string>('');

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
    const newList = convertProductsFromBill(get(bill, 'billItems', []))
    
    const submitData = {
      warehouseId: warehouseSelect,
      listProduct: newList,
      billId: get(bill, '_id'),
    };
    try {
       onCheckWarehouse(submitData);
    } catch (error) {
      console.log(error)
    }
  };
  const onRequestWarehouseExport = () => {
    const submitData = convertDataSentToWarehouse({...bill, notePharmacy:noteForWarehouse});
    try {
      onCreateBillToWarehouse(submitData);
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
        render(createdAt, record, index) {
          return (
            // <Typography.Text strong>
            //   {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            // </Typography.Text>
            <DateTimeTable data={createdAt} />
          );
        },
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        align: "left",
        render(pharmacy, record, index) {
          return <Typography.Text>{get(pharmacy, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 200,
        render(status, record, index) {
          return (
            <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
          );
        },
      },
      {
        title: "Lý do huỷ",
        dataIndex: "cancelNote",
        key: "cancelNote",
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
        align: "center",
      },
      ...(canCreateBillToWarehouse ? [{
        title: "Thao tác",
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
        scroll={{ y: '60vh' ,x  : 800}}
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
                  listWarehouse={warehouseDefault}
                  isLoadingWarehouse={isLoadingWarehouseDefault}
                  isShowButtonPackageExport
                  disabledButtonExport={bill?.status !== STATUS_BILL.READY}
                  isSubmitLoading={isSubmitLoading}
                  requestWarehouseExport={onRequestWarehouseExport}
                />
                </BaseBorderBox>
              </>
          )}
      </ModalAnt>
    </div>
  );
}
