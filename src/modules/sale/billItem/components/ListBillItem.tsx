import { Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import BillModule from "~/modules/sale/bill";
import useUpdateBillStore from "~/modules/sale/bill/storeContext/UpdateBillContext";
import { formatter } from "~/utils/helpers";
import { STATUS_BILL } from "../../bill/constants";
import { PayloadSubmitUpdateBillItem, UpdateBillItem } from "../billItem.modal";
import {
  STATUS_BILLITEM,
  STATUS_BILLITEM_LEVEL,
  STATUS_BILLITEM_VI,
} from "../constants";
import ExpandRowBillItem from "./ExpandRowBillItem";
import FormLot from "./FormLot";
import UpdateQuantity from "./UpdateQuantity";
type propsType = {
  statusBill: any;
};

const CLONE_STATUS_BILLITEM_VI: any = STATUS_BILLITEM_VI;
const CLONE_STATUS_BILLITEM: any = STATUS_BILLITEM;
const CLONE_STATUS_BILLITEM_LEVEL: any = STATUS_BILLITEM_LEVEL;
export default function ListBillItem({
  statusBill,
}: propsType): React.JSX.Element {
  const isDisabledAll = useMemo(
    () => statusBill === STATUS_BILL.CANCELLED,
    [statusBill]
  );
  const [itemActive,setItemActive] = useState<any>();
  const [askAgain,setAskAgain] = useState(true);
  const { bill, mutateBill } = useUpdateBillStore();

  const { billItems } = bill || {};
  const [billItemIdCancel,setBillItemIdCancel] = useState<any>();
  const [openCancel, setOpenCancel] = useState(false);
  const [note, setNote] = useState(""); // CancelNote BillItem
  const onOpenCancel = useCallback((id:any) => {
    if(id){
      setBillItemIdCancel(id);
    }
    setOpenCancel(true)
  }, []);
  const onCloseCancel = useCallback(() => {
    setOpenCancel(false);
    setNote("");
    setBillItemIdCancel(null);
  }, []);
  const [isSubmitLoading, updateBillItem] =
  BillModule.hook.useUpdateBillItem(() => {
    mutateBill();
    onCloseCancel();
  });
  const onChangeStatusBillItem = useCallback((data: UpdateBillItem) => {
    const { id, ...params } = data;
    const payloadSubmit: PayloadSubmitUpdateBillItem = {
      [id]: {
        ...params,
      },
    };
    updateBillItem(payloadSubmit);
  },[updateBillItem])
  const onCancelBillItem = useCallback(() => {
    onChangeStatusBillItem({
      id: billItemIdCancel,
      status: STATUS_BILLITEM.CANCELLED,
      note,
    })
  },[note,billItemIdCancel])


  
  const columns: ColumnsType = [
    {
      title: "Mã sản phẩm",
      dataIndex: "variant",
      key: "variant.variantCode",
      align: "center",
      render(variant, record, index) {
        return (
          <Typography.Text>{get(variant, "variantCode", "")}</Typography.Text>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product.name",
      render(product, record, index) {
        const status: any = get(record, "status", "");
        const lotNumber = get(record, "lotNumber", "");
        const expirationDate = get(record, "expirationDate");
        const _id = get(record, "_id", "");
        // const {nextStatus,message} = getNextStatus({status,lotNumber,expirationDate});
        return (
          <div className="d-flex flex-column">
            <Typography.Text>
              {get(record, "codeBySupplier")} - {get(product, "name", "")}
            </Typography.Text>
            {/* {CLONE_STATUS_BILLITEM_LEVEL[status] >= 4 &&
              status !== STATUS_BILL.CANCELLED && (
                <FormLot
                  isDisabledAll={isDisabledAll}
                  id={_id}
                  onChangeStatusBillItem={onChangeStatusBillItem}
                  status={status}
                  lotNumber={lotNumber}
                  expirationDate={expirationDate}
                />
              )} */}
          </div>
        );
      },
    },
    // {
    //   title: "Tình trạng",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   render(status, record, index) {
    //     return (
    //       <div className="d-flex flex-column align-items-center">
    //         <ToolTipBadge title={status === STATUS_BILL.CANCELLED && get(record,'note','')}>
    //         <Status
    //           status={status}
    //           statusVi={CLONE_STATUS_BILLITEM_VI?.[status]}
    //         />
    //         </ToolTipBadge>
    //         <ConfirmStatusBillItem askAgain={askAgain} setAskAgain={setAskAgain} billItem={record} onChangeStatusBillItem={onChangeStatusBillItem} onOpenCancel={onOpenCancel} isDisabledAll={isDisabledAll} isSubmitLoading={isSubmitLoading} key={get(record,'_id')}/>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render(quantity, record, index) {
        return <UpdateQuantity value={quantity} onSave={() => {}} />;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "variant",
      key: "variant",
      align: "center",
      render(variant, record, index) {
        return (
          <Typography.Text>{formatter(get(variant, "price"))}</Typography.Text>
        );
      },
    },
    {
      title: "Chiết khấu",
      dataIndex: "totalDiscount",
      key: "totalDiscount",
      align: "center",
      render(totalDiscount, record, index) {
        return <Typography.Text>{formatter(totalDiscount)}</Typography.Text>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render(totalPrice, record, index) {
        return (
          <Typography.Text strong>{formatter(totalPrice)}</Typography.Text>
        );
      },
    },
  ];
  return (
    <>
    <TableAnt
      bordered={true}
      dataSource={billItems}
      pagination={false}
      columns={columns}
      rowKey={(rc) => rc?._id}
      size="small"
      expandable={{
        expandedRowRender: (record: any) => (
          <ExpandRowBillItem
            status={get(record, "status")}
            historyStatus={get(record, "historyStatus")}
            cumulativeDiscount={get(record,'cumulativeDiscount',[])}
          />
        ),
        expandedRowKeys : [itemActive],
      }}
      onExpand={(expanded, record) => {
        expanded ? setItemActive(record._id) : setItemActive(null);
      }}
    />
    <ModalAnt
        destroyOnClose
        onCancel={onCloseCancel}
        okText="Huỷ đơn"
        okType="danger"
        open={openCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={onCancelBillItem}
        confirmLoading={isSubmitLoading}
        afterClose={onCloseCancel}
      >
        <h6 className="text-center">Xác nhận huỷ đơn</h6>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Vui lòng nhập lý do huỷ đơn!"
        />
      </ModalAnt></>
  );
}
