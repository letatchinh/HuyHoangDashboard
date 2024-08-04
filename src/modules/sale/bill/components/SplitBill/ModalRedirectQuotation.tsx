import { Button, Result, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
type propsType = {
  data: any[] | undefined;
  onCancel: () => void;
};
export default function ModalRedirectQuotation({
  data,
  onCancel,
}: propsType): React.JSX.Element {
  const {pathname} = useLocation();
  const checkPathCreate = useMemo(() => {
    if (pathname === PATH_APP.bill.collaborator) {
      return PATH_APP.quotation.collaborator
    };
    if (pathname === PATH_APP.bill.employee) {
      return PATH_APP.quotation.employee
    };
    if (pathname === PATH_APP.bill.pharmacy) { 
      return PATH_APP.quotation.pharmacy
    };
    return PATH_APP.bill.quotation
  }, [pathname]);

  
  const goDetail = useCallback(() => {
    if (data && data?.length >= 2) {
      const url1 = `${checkPathCreate}?page=1&limit=10&keyword=${get(data, '[0].codeSequence')}`;
      const url2 = `${checkPathCreate}?page=1&limit=10&keyword=${get(data, '[1].codeSequence')}`;
      
      window.open(url1);
      window.open(url2);
    } else {
      console.error('Data does not have enough elements');
    }
  }, [data, checkPathCreate]);

  return (
    <div>
      <Result
        status="success"
        title={'Bạn vừa tách thành công đơn hàng'}
        subTitle={
          <span>
            {'Mã đơn hàng tạm là '}{" "}
            <Typography.Text copyable strong>
              {get(data, "[0].codeSequence", "")}
            </Typography.Text>
            {" , "}
            <Typography.Text copyable strong>
              {get(data, "[1].codeSequence", "")}
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
