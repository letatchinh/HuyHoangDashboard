import { SyncOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import { get } from "lodash";
import { useCallback, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import supplierModule from "~/modules/supplier";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { useFetchState } from "~/utils/helpers";
import ControlProduct from "./ControlProduct";
import SelectProduct from "./SelectProduct";

import { useGetRole } from "~/modules/auth/auth.hook";
import { CollaboratorProductProvider } from "../CollaboratorProductProvider";
export type ConfigType = {
  discount? : {
    discountType: "PERCENT" | "VALUE",
    value: number,
  },
}
const defaultConfig = {
  discount: {
    discountType: "PERCENT",
    value: 10,
  },
} as ConfigType
type propsType = {
  id?: any;
  useGetUser: any;
  useRemoveProduct: any;
  useUpdateProduct: any;
  useAddProduct: any;
  apiSearchProduct: any;
  config? : ConfigType
  target : 'employee' | 'partner'
};
export default function CollaboratorProduct({
  id,
  useGetUser,
  useRemoveProduct,
  useUpdateProduct,
  useAddProduct,
  apiSearchProduct,
  config = defaultConfig,
  target,
}: propsType): React.JSX.Element {
  const role = useGetRole();
  const [reFetch, setReFetch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [supplierSelectId, setSupplierSelectId] = useState();
  const [supplierFilterId, setSupplierFilterId] = useState();
  const [collaborator, isLoading]: any = useGetUser(id);
  const mutate = useCallback(() => setReFetch(!reFetch), [reFetch]);
  const [suppliers, loadingSupplier] = useFetchState({
    api: supplierModule.api.getAllPublic,
    useDocs: false,
  });

  const canUpdate = useMemo(() => role === 'staff',[role]);
  

  const query = useMemo(
    () => ({
      supplierId: supplierSelectId,
      partnerId: id,
      keyword,
    }),
    [id, supplierSelectId, keyword]
  );
  const [products, loading, totalDocs] = useFetchState({
    api: apiSearchProduct,
    query,
    reFetch,
  });

  const productsSearch = useMemo(
    () =>
      products?.filter(
        (product: any) =>
          !get(collaborator, "products", [])?.some(
            (i: any) => get(i, "productId") === get(product, "_id")
          )
      ),
    [products, collaborator]
  );
  return (
    <CollaboratorProductProvider
    id={id}
    target={target}
    >
    <div className="SelectSupplier m-0" style={{ minHeight: 520 }}>
      <Row
        gutter={16}
        wrap={false}
        style={{ boxSizing: "border-box", marginLeft: 0, marginRight: 0 }}
      >
        <Col span={12}>
          <div className="d-flex align-items-center ml-1 gap-2">
            <Typography.Text strong>Chọn nhà cung cấp:</Typography.Text>
            <SelectSupplier
              value={supplierSelectId}
              onChange={(value) => setSupplierSelectId(value)}
              defaultSuppliers={suppliers}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="d-flex align-items-center ml-1 gap-2">
            <Typography.Text strong>Chọn nhà cung cấp:</Typography.Text>
            <SelectSupplier
              value={supplierFilterId}
              onChange={(value) => setSupplierFilterId(value)}
              defaultSuppliers={suppliers}
            />
          </div>
        </Col>
      </Row>

      <Row
        gutter={16}
        wrap={false}
        style={{ boxSizing: "border-box", marginLeft: 0, marginRight: 0 }}
      >
        <Col span={12}>
          <BaseBorderBox
            styleContent={{ paddingLeft: 0, paddingRight: 0 }}
            title={
              <span>
                Sản phẩm chưa chọn{" "}
                <Button
                  size="small"
                  type="primary"
                  ghost
                  onClick={mutate}
                  icon={<SyncOutlined />}
                />
              </span>
            }
          >
            <div className="ServiceGroup">
              <SelectProduct
                mutate={mutate}
                id={id}
                dataSource={productsSearch || []}
                totalDocs={totalDocs}
                setKeyword={setKeyword}
                loading={loading}
                useAddProduct={useAddProduct}
                config={config}
              />
            </div>
          </BaseBorderBox>
        </Col>
        <Col style={{ marginTop: 2 }} span={12}>
          <BaseBorderBox
            styleContent={{ paddingLeft: 0, paddingRight: 0, marginTop: 3 }}
            title={"Sản phẩm đã chọn"}
          >
            <ControlProduct
              useRemoveProduct={useRemoveProduct}
              useUpdateProduct={useUpdateProduct}
              dataSource={
                supplierFilterId
                  ? get(collaborator, "products", [])?.filter(
                      (product: any) =>
                        get(product, "product.supplierId") === supplierFilterId
                    )
                  : get(collaborator, "products", [])
              }
              isLoading={isLoading}
              id={id}
            />
          </BaseBorderBox>
        </Col>
      </Row>
    </div>
    </CollaboratorProductProvider>
  );
}
