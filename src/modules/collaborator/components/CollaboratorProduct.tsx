import { SyncOutlined } from "@ant-design/icons";
import { Button, Col, Row, Spin, Typography } from "antd";
import { get } from "lodash";
import { useCallback, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { useFetchState } from "~/utils/helpers";
import apis from "../collaborator.api";
import supplierModule from '~/modules/supplier';
import {
    useGetCollaborator
} from "../collaborator.hook";
import ControlProduct from "./ControlProduct";
import SelectProduct from "./SelectProduct";

type propsType = {
  id?: any;
};
export default function CollaboratorProduct({
  id,
}: propsType): React.JSX.Element {
  const [reFetch, setReFetch] = useState(false);
  const [keyword,setKeyword] = useState('');
  const [supplierSelectId, setSupplierSelectId] = useState();
  const [supplierFilterId, setSupplierFilterId] = useState();
  const [collaborator, isLoading]: any = useGetCollaborator(id);
  const mutate = useCallback(() => setReFetch(!reFetch), [reFetch]);
  const [suppliers,loadingSupplier] = useFetchState({api : supplierModule.api.getAllPublic,useDocs : false});

  const query = useMemo(
    () => ({
      supplierId: supplierSelectId,
      partnerId: id,
      keyword,
    }),
    [id, supplierSelectId,keyword]
  );
  const [products, loading,totalDocs] = useFetchState({
    api: apis.searchProduct,
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
    <div className="SelectSupplier m-0" style={{minHeight : 520}}>
        <Row gutter={16} wrap={false} style={{boxSizing:'border-box',marginLeft:0,marginRight:0}}>
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
     
      <Row gutter={16} wrap={false} style={{boxSizing:'border-box',marginLeft:0,marginRight:0}}>
        <Col span={12}>
          <BaseBorderBox
         styleContent={{paddingLeft : 0,paddingRight : 0}}
            title={
              <span>
                Sản phẩm chưa chọn{" "}
                <Button size="small" type="primary" ghost onClick={mutate} icon={<SyncOutlined />} />
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
                />
            </div>
          </BaseBorderBox>
        </Col>
        <Col style={{marginTop : 2}}  span={12}>
          <BaseBorderBox styleContent={{paddingLeft : 0,paddingRight : 0,marginTop : 3}}  title={"Sản phẩm đã chọn"}>
            <ControlProduct dataSource={supplierFilterId ? get(collaborator, "products",[])?.filter((product:any) => get(product,'product.supplierId') === supplierFilterId) :  get(collaborator, "products",[])} isLoading={isLoading} id={id}/>
          </BaseBorderBox>
        </Col>
      </Row>
    </div>
  );
}
