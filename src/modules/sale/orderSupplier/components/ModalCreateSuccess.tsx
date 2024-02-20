import { Button, Result, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
import { DataResultType } from "~/pages/Dashboard/OrderSupplier/CreateOrderSupplier";
import { PATH_APP } from "~/routes/allPath";
type propsType = {
  data: DataResultType | null | undefined;
  onCancel: () => void;
};
export default function ModalCreateSuccess({
  data,
  onCancel,
}: propsType): React.JSX.Element {
  const { type } = data || {};
  const goDetail = useCallback(() => {
    let handle;
    switch (type) {
      case "createOrderSupplier":
        handle = () =>
          window.open(
            PATH_APP.orderSupplier.root +
              "?page=1&limit=10&keyword=" +
              get(data, "code")
          );
        break;
      default:
        handle = () => {};
        break;
    }
    handle();
  }, [data]);
  const message = useMemo(() => {
    let mess = "";
    switch (type) {
      case "createOrderSupplier":
        mess = "Bạn vừa tạo thành công đơn mua hàng";
        break;
      default:
        break;
    }
    return mess;
  }, [type]);

  const subTitle = useMemo(() => {
    let mess = "";
    switch (type) {
      case "createOrderSupplier":
        mess = "Mã đơn mua hàng là ";
        break;
      default:
        break;
    }
    return mess;
  }, [type]);
  return (
    <div>
      <Result
        status="success"
        title={message}
        subTitle={
          <span>
            {subTitle}{" "}
            <Typography.Text copyable strong>
              {get(data, "code", "")}
            </Typography.Text>
          </span>
        }
        extra={[
          <Button onClick={goDetail} type="primary" key="console">
            Đi đến đơn hàng
          </Button>,
          <Button onClick={onCancel} key="buy">
            Đóng
          </Button>,
        ]}
      />
    </div>
  );
}
