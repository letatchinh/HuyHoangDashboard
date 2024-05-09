import { Button, Result, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { REF_COLLECTION } from "~/constants/defaultValue";
import { useGetProfile } from "~/modules/auth/auth.hook";
import { DataResultType } from "~/pages/Dashboard/Bill/CreateBill";
import { PATH_APP } from "~/routes/allPath";
type propsType = {
  data: DataResultType | null | undefined;
  onCancel: () => void;
};
export default function ModalCreateQuotationSuccess({
  data,
  onCancel,
}: propsType): React.JSX.Element {
  const { type } = data || {};
  const profile = useGetProfile();
  const {pathname} = useLocation();
  const checkPathCreate = useMemo(() => {
    if (pathname === PATH_APP.bill.createCollaborator) {
      return PATH_APP.quotation.collaborator
    };
    if (pathname === PATH_APP.bill.createEmployee) {
      return PATH_APP.quotation.employee
    };
    if (pathname === PATH_APP.bill.createPharmacy) { 
      return PATH_APP.quotation.pharmacy
    };
    return PATH_APP.bill.quotation
  }, [pathname]);

  const checkPathConvert = useMemo(() => {
    if (pathname === PATH_APP.bill.createCollaborator) {
      return PATH_APP.bill.collaborator
    };
    if (pathname === PATH_APP.bill.createEmployee) {
      return PATH_APP.bill.employee
    };
    if (pathname === PATH_APP.bill.createPharmacy) { 
      return PATH_APP.bill.pharmacy
    };
    return PATH_APP.bill.root
  }, [pathname]);
  
  const goDetail = useCallback(() => {
    let handle;
    switch (type) {
      case "createQuotation":
        handle = () =>
          window.open(
            checkPathCreate +
              "?page=1&limit=10&keyword=" + 
              get(data, "codeSequence") 
          );
        break;
      case "updateQuotation":
        handle = () =>
          window.open(
            checkPathCreate +
              "?page=1&limit=10&keyword=" +
              get(data, "codeSequence")  
          );
        break;
      case "convertQuotation":
        handle = () =>
          window.open(
            checkPathConvert + "?page=1&limit=10&keyword=" + get(data, "codeSequence")  
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
      case "createQuotation":
        mess = "Bạn vừa tạo thành công đơn hàng tạm";
        break;
      case "updateQuotation":
        mess = "Bạn vừa cập nhật thành công đơn hàng tạm";
        break;
      case "convertQuotation":
        mess = "Bạn vừa chuyển đổi thành công đơn hàng tạm";
        break;
      default:
        break;
    }
    return mess;
  }, [type]);

  const subTitle = useMemo(() => {
    let mess = "";
    switch (type) {
      case "createQuotation":
        mess = "Mã đơn hàng tạm là ";
        break;
      case "updateQuotation":
        mess = "Mã đơn hàng tạm là ";
        break;
      case "convertQuotation":
        mess = "Mã đơn hàng là ";
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
              {get(data, "codeSequence", "")}
            </Typography.Text>
          </span>
        }
        extra={ data ? [
          <Button onClick={goDetail} type="primary" key="console">
            Đi đến đơn hàng
          </Button>,
          <Button onClick={onCancel} key="buy">
            Đóng
          </Button>,
        ]: [] }
      />
    </div>
  );
}
