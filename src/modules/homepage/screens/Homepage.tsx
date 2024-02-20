import { DropboxOutlined, InboxOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import BtnAction from "../components/BtnAction";
type propsType = {};
export default function Homepage(props: propsType): React.JSX.Element {
  const navigate = useNavigate();

  const goLink = useCallback((path: string) => {
    navigate(path);
  }, []);

  return (
    <div className="homepage">
      <div className="homepage--overlay" />
      <Row gutter={16}>
        <Col>
          <BtnAction
            onClick={() => goLink('/order-supplier/create')}
            value="Tạo đơn mua"
            icon={<InboxOutlined className="homepage--btnAction__icon" />}
          />
        </Col>
        <Col>
          <BtnAction
          onClick={() => goLink('/bill/create')}
            value="Tạo đơn bán"
            icon={<DropboxOutlined className="homepage--btnAction__icon" />}
          />
        </Col>
        <Col>
          <BtnAction
          onClick={() => goLink('/bill/create')}
            value="Thêm mới thuốc"
            icon={<MedicineBoxOutlined className="homepage--btnAction__icon" />}
          />
        </Col>
      </Row>
    </div>
  );
}
