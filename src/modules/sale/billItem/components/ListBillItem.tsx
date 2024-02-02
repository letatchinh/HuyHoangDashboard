import { ArrowUpOutlined, EditTwoTone } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Space, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { forIn, get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import Status from "~/components/common/Status/index";
import { formatter } from "~/utils/helpers";
import {
  STATUS_BILLITEM,
  STATUS_BILLITEM_LEVEL,
  STATUS_BILLITEM_VI,
} from "../constants";
import UpdateQuantity from "./UpdateQuantity";
import useUpdateBillStore from "~/modules/sale/bill/storeContext/UpdateBillContext";
import BillModule from "~/modules/sale/bill";
import { PayloadSubmitUpdateBillItem, UpdateBillItem } from "../billItem.modal";
import FormLot from "./FormLot";
import ExpandRowBillItem from "./ExpandRowBillItem";
import { STATUS_BILL } from "../../bill/constants";
import WithPermission from "~/components/common/WithPermission";
import PolicyModule from '~/modules/policy';
import ModalAnt from "~/components/Antd/ModalAnt";
import TextArea from "antd/es/input/TextArea";
import ToolTipBadge from "~/components/common/ToolTipBadge";
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
  const getNextStatus = ({
    status,
    expirationDate,
    lotNumber,
  }: {
    status: string;
    lotNumber?: any;
    expirationDate: any;
  }) => {
    let nextStatus: any = null;
    let message;
    let isSame = false;
    forIn(STATUS_BILLITEM, (value, key) => {
      if (value === STATUS_BILLITEM.CANCELLED) return;
      if (isDisabledAll) {
        return;
      }
      if (nextStatus) return;
      if (isSame) {
        nextStatus = value;
        if (
          value === STATUS_BILLITEM.PACKAGED &&
          !expirationDate &&
          !lotNumber
        ) {
          message = "Chưa nhập lô và hạn sử dụng";
        }
        return;
      }
      if (status === key) {
        isSame = true;
      }
    });
    return {
      nextStatus,
      message,
    };
  };


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
            {CLONE_STATUS_BILLITEM_LEVEL[status] >= 4 &&
              status !== STATUS_BILL.CANCELLED && (
                <FormLot
                  isDisabledAll={isDisabledAll}
                  id={_id}
                  onChangeStatusBillItem={onChangeStatusBillItem}
                  status={status}
                  lotNumber={lotNumber}
                  expirationDate={expirationDate}
                />
              )}
          </div>
        );
      },
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      align: "center",
      render(status, record, index) {
        const { nextStatus, message } = getNextStatus({
          status,
          lotNumber: get(record, "lotNumber"),
          expirationDate: get(record, "expirationDate"),
        });
        return (
          <div className="d-flex flex-column align-items-center">
            <ToolTipBadge title={status === STATUS_BILL.CANCELLED && get(record,'note','')}>
            <Status
              status={status}
              statusVi={CLONE_STATUS_BILLITEM_VI?.[status]}
            />
            </ToolTipBadge>
            {nextStatus && (
             <WithPermission permission={PolicyModule.POLICIES.UPDATE_BILL}>
                 <Flex gap={'small'} align="center" justify={"center"}>
                <Popconfirm
                  title={
                    "Chuyển đổi sang trạng thái " +
                    CLONE_STATUS_BILLITEM_VI[nextStatus]
                  }
                  okText="Ok"
                  cancelText="Huỷ"
                  onConfirm={() =>
                    onChangeStatusBillItem({
                      id: get(record, "_id", ""),
                      status: nextStatus,
                    })
                  }
                >
                  <Tooltip title={message}>
                    <Button
                      icon={<ArrowUpOutlined />}
                      block
                      type="primary"
                      disabled={isDisabledAll || !!message}
                      loading={isSubmitLoading}
                    >
                      {CLONE_STATUS_BILLITEM_VI[nextStatus]}
                    </Button>
                  </Tooltip>
                </Popconfirm>
                {status === STATUS_BILLITEM.ORDERING && (
                  <WithPermission permission={PolicyModule.POLICIES.UPDATE_BILL}>
                    <Button type="primary" block danger loading={isSubmitLoading} onClick={() => onOpenCancel(get(record, "_id", ""))}>
                      Huỷ đơn
                    </Button>
                  </WithPermission>
                )}
              </Flex>
             </WithPermission>
            )}
          </div>
        );
      },
    },
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
      dataIndex: "remainAmount",
      key: "remainAmount",
      align: "center",
      render(remainAmount, record, index) {
        return (
          <Typography.Text strong>{formatter(remainAmount)}</Typography.Text>
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
      // onRow={(rc) => ({
      //   onClick : () => setItemActive(itemActive?.includes(rc._id) ? null : rc._id),
        
      // })}
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
