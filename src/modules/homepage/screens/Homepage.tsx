import { DropboxOutlined, InboxOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { Col, Modal, Row } from "antd";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import ShowStep from "~/modules/productsAll/components/ShowStep";
import { PATH_APP } from "~/routes/allPath";
import BtnAction from "../components/BtnAction";
type propsType = {};
export default function Homepage(props: propsType): React.JSX.Element {
  const navigate = useNavigate();

  const goLink = useCallback((path: string) => {
    navigate(path);
  }, []);
  const [step, setStep] = useState(0);
  const [isOpenCreateProduct,setIsOpenCreateProduct] = useState(false);

  const onOpenCreateProduct = useCallback(() => setIsOpenCreateProduct(true),[]);
  const onCloseCreateProduct = useCallback(() => setIsOpenCreateProduct(false),[]);
  const onChangeStep = (step: number) => {
    setStep(step);
  };
  return (
    <div className="homepage">
      <div className="homepage--overlay" />
      <Row gutter={16}>
        <WithPermission permission={POLICIES.WRITE_ORDERSUPPLIER}>
        <Col>
          <BtnAction
            onClick={() => goLink('/order-supplier/create')}
            value="Tạo đơn mua"
            icon={<InboxOutlined className="homepage--btnAction__icon" />}
          />
        </Col>
        </WithPermission>
        <WithPermission permission={POLICIES.WRITE_BILL}>
        <Col>
          <BtnAction
          onClick={() => goLink('/bill/create')}
            value="Tạo đơn bán"
            icon={<DropboxOutlined className="homepage--btnAction__icon" />}
          />
        </Col>
        </WithPermission>
        <WithPermission permission={POLICIES.UPDATE_SUPPLIER}>
        <Col>
          <BtnAction
          onClick={onOpenCreateProduct}
            value="Thêm mới thuốc"
            icon={<MedicineBoxOutlined className="homepage--btnAction__icon" />}
          />
        </Col>
        </WithPermission>
        <WithPermission permission={POLICIES.READ_SUPPLIER}>
        <Col>
          <BtnAction
          onClick={() => goLink(PATH_APP.productAll.root)}
            value="Danh sách sản phẩm"
            icon={<i className="fa-solid fa-capsules homepage--btnAction__icon"></i>}
          />
        </Col>
        </WithPermission>
      </Row>
      <Modal
        
          open={isOpenCreateProduct}
          onCancel={onCloseCreateProduct}
          footer={null}
          width={1500}
          destroyOnClose
        >
          <ShowStep onChangeStep={onChangeStep} onCloseModal={onCloseCreateProduct} step={step} />
        </Modal>
    </div>
  );
}
