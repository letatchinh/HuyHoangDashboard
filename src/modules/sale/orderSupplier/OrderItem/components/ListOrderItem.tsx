import { ArrowUpOutlined, EditTwoTone } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Space, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { forIn, get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import Status from "~/components/common/Status/index";
import { formatter } from "~/utils/helpers";
// import UpdateQuantity from "./UpdateQuantity";
// import BillModule from "~/modules/sale/bill";
import OrderSupplierModule from "~/modules/sale/orderSupplier";
import {
  PayloadSubmitUpdateOrderItem,
  UpdateOrderItem,
} from "../orderItem.modal";
import FormLot from "./FormLot";
import WithPermission from "~/components/common/WithPermission";
import PolicyModule from "~/modules/policy";
import ModalAnt from "~/components/Antd/ModalAnt";
import TextArea from "antd/es/input/TextArea";
import ToolTipBadge from "~/components/common/ToolTipBadge";
import {
  STATUS_ORDER_ITEM,
  STATUS_ORDER_ITEM_LEVEL,
  STATUS_ORDER_ITEM_VI,
  STATUS_ORDER_SUPPLIER,
} from "../../constants";
import useUpdateOrderSupplierStore from "../../storeContext/UpdateOrderSupplierContext";
import ExpandRowOrderItem from "./ExpandRowOrderItem";
type propsType = {
  statusBill: any;
};

const CLONE_STATUS_ORDER_ITEM_VI: any = STATUS_ORDER_ITEM_VI;
const CLONE_STATUS_ORDER_ITEM: any = STATUS_ORDER_ITEM;
const CLONE_STATUS_ORDER_ITEM_LEVEL: any = STATUS_ORDER_ITEM_LEVEL;
export default function ListOrderItem({
  statusBill,
}: propsType): React.JSX.Element {
  const isDisabledAll = useMemo(
    () => statusBill === STATUS_ORDER_SUPPLIER.CANCELLED,
    [statusBill]
  );
  const [itemActive, setItemActive] = useState<any>();
  const { orderSupplier, mutateOrderSupplier } = useUpdateOrderSupplierStore();

  const { orderSupplierItems } = orderSupplier || {};
  const [orderItemIdCancel, setOrderItemIdCancel] = useState<any>();
  const [openCancel, setOpenCancel] = useState(false);
  const [note, setNote] = useState("");

  const [orderItemId, setOrderItemId] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const onOpenCancel = useCallback((id: any) => {
    if (id) {
      setOrderItemIdCancel(id);
    }
    setOpenCancel(true);
  }, []);
  const onCloseCancel = useCallback(() => {
    setOpenCancel(false);
    setNote("");
    setOrderItemIdCancel(null);
  }, []);
  const [isSubmitLoading, updateOrderItem] =
    OrderSupplierModule.hook.useUpdateOrderItem(() => {
      mutateOrderSupplier();
      onCloseCancel();
    });
  const onChangeStatusOrderItem = useCallback(
    (data: UpdateOrderItem) => {
      const { id, ...params } = data;
      const payloadSubmit: PayloadSubmitUpdateOrderItem = {
        [id]: {
          ...params,
        },
      };
      updateOrderItem(payloadSubmit);
    },
    [updateOrderItem]
  );
  const onCancelOrderItem = useCallback(() => {
    onChangeStatusOrderItem({
      id: orderItemIdCancel,
      status: STATUS_ORDER_ITEM.CANCELLED,
      note,
    });
  }, [note, orderItemIdCancel]);
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
    forIn(STATUS_ORDER_ITEM, (value, key) => {
      if (value === STATUS_ORDER_ITEM.CANCELLED) return;
      if (isDisabledAll) {
        return;
      }
      if (nextStatus) return;
      if (isSame) {
        nextStatus = value;
        if (
          value === STATUS_ORDER_ITEM.PACKAGED &&
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

  const onOpenForm = useCallback(
    (id?: any) => {
      if (id) {
        setOrderItemId(id);
      }
      setIsOpenForm(true);
    },
    [setOrderItemId, setIsOpenForm]
  );

  const onCloseForm = useCallback(() => {
    setOrderItemId(null);
    setIsOpenForm(false);
  }, []);

  const columns: ColumnsType = [
    {
      title: "Mã sản phẩm",
      dataIndex: "product",
      key: "product",
      align: "center",
      render(product, record, index) {
        return (
          <Typography.Text>
            {get(product, "codeBySupplier", "")}
          </Typography.Text>
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
            <Typography.Text>{get(product, "name", "")}</Typography.Text>
            {CLONE_STATUS_ORDER_ITEM_LEVEL[status] >= 4 &&
              status !== STATUS_ORDER_SUPPLIER.CANCELLED && (
                <FormLot
                  isDisabledAll={isDisabledAll}
                  id={_id}
                  onChangeStatusOrderItem={onChangeStatusOrderItem}
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
            <ToolTipBadge
              title={
                status === STATUS_ORDER_SUPPLIER.CANCELLED &&
                get(record, "note", "")
              }
            >
              <Status
                status={status}
                statusVi={CLONE_STATUS_ORDER_ITEM_VI?.[status]}
              />
            </ToolTipBadge>
            {nextStatus && (
              <WithPermission permission={PolicyModule.POLICIES.UPDATE_ORDERSUPPLIER}>
                <Flex gap={"small"} align="center" justify={"center"}>
                  <Popconfirm
                    title={
                      "Chuyển đổi sang trạng thái " +
                      CLONE_STATUS_ORDER_ITEM_VI[nextStatus]
                    }
                    okText="Ok"
                    cancelText="Huỷ"
                    onConfirm={() =>
                      onChangeStatusOrderItem({
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
                        {CLONE_STATUS_ORDER_ITEM_VI[nextStatus]}
                      </Button>
                    </Tooltip>
                  </Popconfirm>
                  {status === STATUS_ORDER_ITEM.NEW && (
                    <WithPermission
                      permission={PolicyModule.POLICIES.UPDATE_ORDERSUPPLIER}
                    >
                      <Button
                        type="primary"
                        block
                        danger
                        loading={isSubmitLoading}
                        onClick={() => onOpenCancel(get(record, "_id", ""))}
                      >
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
      // render(quantity, record, index) {
      //   return <UpdateQuantity value={quantity} onSave={() => {}} />;
      // },
    },
    {
      title: "Giá bán",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "center",
      render(unitPrice, record, index) {
        return <Typography.Text>{formatter(unitPrice)}</Typography.Text>;
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
    {
      title: "Thao tác",
      key: "_id",
      dataIndex : '_id',
      render(_id,record:any) {
        return (
          <Space>
            <WithPermission permission={PolicyModule.POLICIES.UPDATE_ORDERSUPPLIER}>
            <Button
              type="primary"
              disabled={record.status !== STATUS_ORDER_ITEM.NEW}
              onClick={() => onOpenForm(_id)}
            >
              Cập nhật
            </Button>
            </WithPermission>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <TableAnt
        bordered={true}
        dataSource={orderSupplierItems}
        pagination={false}
        columns={columns}
        rowKey={(rc) => rc?._id}
        // onRow={(rc) => ({
        //   onClick : () => setItemActive(itemActive?.includes(rc._id) ? null : rc._id),

        // })}
        size="small"
        expandable={{
          expandedRowRender: (record: any) => (
            <ExpandRowOrderItem
              status={get(record, "status")}
              historyStatus={get(record, "historyStatus")}
              cumulativeDiscount={get(record, "cumulativeDiscount", [])}
              orderRef={get(record, "orderRef")}
              unitPrice={get(record, "unitPrice")}
              quantity={get(record, "quantity")}
            />
          ),
          expandedRowKeys: [itemActive],
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
        onOk={onCancelOrderItem}
        confirmLoading={isSubmitLoading}
        afterClose={onCloseCancel}
      >
        <h6 className="text-center">Xác nhận huỷ đơn</h6>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Vui lòng nhập lý do huỷ đơn!"
        />
      </ModalAnt>
      <ModalAnt
        width={1100}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        {/* <UpdateQuantity 
         quantity={}
        id={}
        /> */}
      </ModalAnt>
    </>
  );
}
